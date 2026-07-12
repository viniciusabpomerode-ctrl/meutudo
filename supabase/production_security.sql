-- Execute uma vez no SQL Editor do Supabase.
create extension if not exists pgcrypto;

create table if not exists public.app_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('super_admin','admin')),
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);

insert into public.app_admins(user_id,role)
select id,'super_admin' from auth.users where lower(email)=lower('viniciusabpomerode@gmail.com')
on conflict(user_id) do update set role='super_admin';

create table if not exists public.referral_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  code text unique not null,
  created_at timestamptz not null default now()
);
create table if not exists public.referrals (
  referred_user_id uuid primary key references auth.users(id) on delete cascade,
  referrer_user_id uuid not null references auth.users(id) on delete cascade,
  code text not null,
  status text not null default 'registered' check(status in ('registered','paid','reversed')),
  created_at timestamptz not null default now(),
  paid_at timestamptz,
  check(referrer_user_id<>referred_user_id)
);
create table if not exists public.credit_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount_cents integer not null,
  kind text not null,
  description text not null,
  reference_id text unique,
  available_at timestamptz not null default now(),
  reversed_at timestamptz,
  created_at timestamptz not null default now()
);
create table if not exists public.admin_audit_log (
  id bigint generated always as identity primary key,
  admin_user_id uuid not null references auth.users(id),
  action text not null,
  target_user_id uuid,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create table if not exists public.active_sessions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  session_id uuid not null,
  device_label text,
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.app_admins enable row level security;
alter table public.referral_profiles enable row level security;
alter table public.referrals enable row level security;
alter table public.credit_ledger enable row level security;
alter table public.admin_audit_log enable row level security;
alter table public.active_sessions enable row level security;

create policy "own referral profile" on public.referral_profiles for select to authenticated using(user_id=auth.uid());
create policy "own referrals" on public.referrals for select to authenticated using(referrer_user_id=auth.uid() or referred_user_id=auth.uid());
create policy "own credits" on public.credit_ledger for select to authenticated using(user_id=auth.uid());
create policy "own active session" on public.active_sessions for select to authenticated using(user_id=auth.uid());

create index if not exists referrals_referrer_idx on public.referrals(referrer_user_id);
create index if not exists credit_ledger_user_idx on public.credit_ledger(user_id,available_at);
create index if not exists audit_created_idx on public.admin_audit_log(created_at desc);

