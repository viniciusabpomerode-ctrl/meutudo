-- Migracao aditiva: modalidades de recompensa por indicacao.
create extension if not exists pgcrypto;
create table if not exists public.referral_reward_config (
 singleton boolean primary key default true check(singleton), mode text not null default 'credit' check(mode in ('credit','days')),
 referrer_days integer not null default 10 check(referrer_days between 1 and 365), referred_days integer not null default 10 check(referred_days between 1 and 365),
 campaign_ends_at timestamptz, updated_at timestamptz not null default now(), updated_by uuid references auth.users(id));
insert into public.referral_reward_config(singleton) values(true) on conflict(singleton) do nothing;
alter table public.referral_reward_config enable row level security;
alter table public.referrals add column if not exists reward_mode text;
alter table public.referrals add column if not exists referrer_days_awarded integer not null default 0;
alter table public.referrals add column if not exists referred_days_awarded integer not null default 0;
alter table public.referrals add column if not exists rewarded_at timestamptz;
alter table public.referrals add column if not exists reward_reference_id text;
alter table public.referrals add column if not exists attribution_ip_hash text;
do $$ begin if not exists(select 1 from pg_constraint where conname='referrals_reward_mode_check') then alter table public.referrals add constraint referrals_reward_mode_check check(reward_mode in ('credit','days')) not valid; end if; end $$;
create unique index if not exists referrals_reward_reference_uidx on public.referrals(reward_reference_id) where reward_reference_id is not null;
create index if not exists referrals_attribution_ip_idx on public.referrals(attribution_ip_hash,created_at);
create or replace function public.register_referral_and_reward(p_code text,p_referred_user_id uuid,p_referred_email text,p_ip_hash text)
returns jsonb language plpgsql security definer set search_path=public,auth as $$
declare v_owner uuid;v_owner_email text;v_config public.referral_reward_config%rowtype;v_ref public.referrals%rowtype;v_mode text;v_reward_id text;v_existing public.user_premium%rowtype;v_base timestamptz;
begin
 if p_referred_user_id is null or p_referred_email is null or char_length(p_ip_hash)<>64 then return jsonb_build_object('ok',false,'reason','invalid_request');end if;
 select user_id into v_owner from public.referral_profiles where code=upper(trim(p_code));
 if v_owner is null or v_owner=p_referred_user_id then return jsonb_build_object('ok',false,'reason','invalid_referral');end if;
 perform pg_advisory_xact_lock(hashtextextended(p_referred_user_id::text,0));
 select * into v_ref from public.referrals where referred_user_id=p_referred_user_id;
 if found then return jsonb_build_object('ok',true,'existing',true,'reward_mode',coalesce(v_ref.reward_mode,'credit'));end if;
 if(select count(*) from public.referrals where attribution_ip_hash=p_ip_hash and created_at>now()-interval '24 hours')>=5 then return jsonb_build_object('ok',false,'reason','attribution_limit_reached');end if;
 select * into v_config from public.referral_reward_config where singleton=true;v_mode:=coalesce(v_config.mode,'credit');v_reward_id:='referral:'||p_referred_user_id::text||':'||v_mode;
 insert into public.referrals(referred_user_id,referrer_user_id,code,reward_mode,reward_reference_id,attribution_ip_hash) values(p_referred_user_id,v_owner,upper(trim(p_code)),v_mode,v_reward_id,p_ip_hash) returning * into v_ref;
 if v_mode='days' and v_config.campaign_ends_at is not null and v_config.campaign_ends_at>now() then
  select email into v_owner_email from auth.users where id=v_owner;
  select * into v_existing from public.user_premium where lower(email)=lower(v_owner_email) limit 1;
  if not(found and v_existing.active and v_existing.expires_at is null) then
   v_base:=greatest(now(),coalesce(v_existing.expires_at,now()));
   insert into public.user_premium(email,plan,active,expires_at,updated_at) values(lower(v_owner_email),'referral_days',true,v_base+make_interval(days=>v_config.referrer_days),now())
   on conflict(email) do update set active=true,expires_at=greatest(now(),coalesce(public.user_premium.expires_at,now()))+make_interval(days=>v_config.referrer_days),updated_at=now(),plan=case when public.user_premium.active and public.user_premium.expires_at is null then public.user_premium.plan else 'referral_days' end
   where not(public.user_premium.active and public.user_premium.expires_at is null);
  end if;
  select * into v_existing from public.user_premium where lower(email)=lower(p_referred_email) limit 1;
  if not(found and v_existing.active and v_existing.expires_at is null) then
   v_base:=greatest(now(),coalesce(v_existing.expires_at,now()));
   insert into public.user_premium(email,plan,active,expires_at,updated_at) values(lower(p_referred_email),'referral_days',true,v_base+make_interval(days=>v_config.referred_days),now())
   on conflict(email) do update set active=true,expires_at=greatest(now(),coalesce(public.user_premium.expires_at,now()))+make_interval(days=>v_config.referred_days),updated_at=now(),plan=case when public.user_premium.active and public.user_premium.expires_at is null then public.user_premium.plan else 'referral_days' end
   where not(public.user_premium.active and public.user_premium.expires_at is null);
  end if;
  update public.referrals set status='paid',referrer_days_awarded=v_config.referrer_days,referred_days_awarded=v_config.referred_days,rewarded_at=now() where referred_user_id=p_referred_user_id and rewarded_at is null;
  return jsonb_build_object('ok',true,'reward_mode','days','referrer_days',v_config.referrer_days,'referred_days',v_config.referred_days);
 end if;
 return jsonb_build_object('ok',true,'reward_mode',v_mode,'rewarded',false);
exception when unique_violation then return jsonb_build_object('ok',true,'existing',true);end $$;
revoke all on function public.register_referral_and_reward(text,uuid,text,text) from public,anon,authenticated;
grant execute on function public.register_referral_and_reward(text,uuid,text,text) to service_role;
