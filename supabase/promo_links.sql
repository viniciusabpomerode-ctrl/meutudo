-- Execute uma vez no SQL Editor do Supabase antes de publicar o site.
-- Links promocionais com teste temporario e protecao por conta/IP.

create extension if not exists pgcrypto;

create table if not exists public.promo_links (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code ~ '^[A-Z0-9_-]{3,40}$'),
  label text not null check (char_length(label) between 1 and 100),
  trial_days integer not null default 3 check (trial_days between 1 and 30),
  max_redemptions integer check (max_redemptions is null or max_redemptions between 1 and 1000000),
  ip_limit integer not null default 2 check (ip_limit between 1 and 20),
  expires_at timestamptz,
  active boolean not null default true,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.promo_redemptions (
  id uuid primary key default gen_random_uuid(),
  promo_id uuid not null references public.promo_links(id) on delete restrict,
  user_id uuid not null references auth.users(id) on delete cascade,
  email text not null,
  ip_hash text not null check (char_length(ip_hash) = 64),
  trial_ends_at timestamptz not null,
  created_at timestamptz not null default now(),
  constraint one_promotional_trial_per_account unique (user_id)
);

create index if not exists promo_redemptions_promo_idx
  on public.promo_redemptions(promo_id, created_at desc);
create index if not exists promo_redemptions_ip_idx
  on public.promo_redemptions(ip_hash);

alter table public.promo_links enable row level security;
alter table public.promo_redemptions enable row level security;

-- Sem policies publicas: somente as funcoes do servidor, usando a service role,
-- e administradores autenticados atraves da Netlify Function podem acessar.

create or replace function public.redeem_promo_link(
  p_code text,
  p_user_id uuid,
  p_email text,
  p_ip_hash text
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_promo public.promo_links%rowtype;
  v_existing public.user_premium%rowtype;
  v_trial_ends timestamptz;
  v_count integer;
begin
  select * into v_promo
    from public.promo_links
   where code = upper(trim(p_code))
   for update;

  if not found or not v_promo.active or
     (v_promo.expires_at is not null and v_promo.expires_at <= now()) then
    return jsonb_build_object('ok', false, 'reason', 'invalid_or_expired');
  end if;

  -- Serializa resgates da mesma rede para que dois pedidos simultaneos
  -- nao consigam ultrapassar o limite de IP.
  perform pg_advisory_xact_lock(hashtextextended(p_ip_hash, 0));

  if exists(select 1 from public.promo_redemptions where user_id = p_user_id) then
    return jsonb_build_object('ok', false, 'reason', 'account_already_used_trial');
  end if;

  select * into v_existing
    from public.user_premium
   where lower(email) = lower(p_email)
   limit 1;

  if found and v_existing.active and
     (v_existing.expires_at is null or v_existing.expires_at > now()) then
    return jsonb_build_object('ok', false, 'reason', 'already_has_access');
  end if;

  if v_promo.max_redemptions is not null then
    select count(*) into v_count
      from public.promo_redemptions
     where promo_id = v_promo.id;
    if v_count >= v_promo.max_redemptions then
      return jsonb_build_object('ok', false, 'reason', 'link_limit_reached');
    end if;
  end if;

  -- O limite e global entre campanhas. Assim a mesma rede nao acumula
  -- varios testes usando links promocionais diferentes.
  select count(*) into v_count
    from public.promo_redemptions
   where ip_hash = p_ip_hash;
  if v_count >= v_promo.ip_limit then
    return jsonb_build_object('ok', false, 'reason', 'ip_limit_reached');
  end if;

  v_trial_ends := now() + make_interval(days => v_promo.trial_days);

  insert into public.promo_redemptions
    (promo_id, user_id, email, ip_hash, trial_ends_at)
  values
    (v_promo.id, p_user_id, lower(p_email), p_ip_hash, v_trial_ends);

  insert into public.user_premium(email, plan, active, expires_at, updated_at)
  values(lower(p_email), 'promocional', true, v_trial_ends, now())
  on conflict(email) do update set
    plan = 'promocional',
    active = true,
    expires_at = excluded.expires_at,
    updated_at = now();

  return jsonb_build_object(
    'ok', true,
    'trial_days', v_promo.trial_days,
    'expires_at', v_trial_ends
  );
exception
  when unique_violation then
    return jsonb_build_object('ok', false, 'reason', 'account_already_used_trial');
end;
$$;

revoke all on function public.redeem_promo_link(text, uuid, text, text) from public;
revoke all on function public.redeem_promo_link(text, uuid, text, text) from anon;
revoke all on function public.redeem_promo_link(text, uuid, text, text) from authenticated;
grant execute on function public.redeem_promo_link(text, uuid, text, text) to service_role;
