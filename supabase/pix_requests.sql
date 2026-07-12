-- Execute uma vez no SQL Editor do Supabase.
-- Tabela pra guardar avisos de "paguei via Pix" enquanto o Stripe nao
-- processa Pix automaticamente. Aparece no painel admin pra voce conceder
-- o plano manualmente depois de conferir o pagamento no seu banco.

create table if not exists public.pix_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  email text not null,
  name text,
  plan text not null check (plan in ('mensal','anual','fundador')),
  message text,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

alter table public.pix_requests add column if not exists name text;

alter table public.pix_requests enable row level security;

create policy "own pix requests select" on public.pix_requests
  for select to authenticated using (user_id = auth.uid());

create policy "own pix requests insert" on public.pix_requests
  for insert to authenticated with check (user_id = auth.uid());

create index if not exists pix_requests_status_idx on public.pix_requests(status, created_at desc);
