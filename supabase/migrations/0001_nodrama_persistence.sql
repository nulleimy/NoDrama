create extension if not exists pgcrypto;

create table if not exists public.credit_ledger (
  id uuid primary key default gen_random_uuid(),
  account_key text not null,
  user_id_hash text,
  delta integer not null,
  reason text not null check (
    reason in (
      'free_initial',
      'free_weekly',
      'manual_dev_grant',
      'stripe_pack_purchase',
      'stripe_subscription_grant',
      'generation_debit',
      'adjustment',
      'refund',
      'reversal'
    )
  ),
  source text not null check (
    source in ('api', 'generate', 'stripe_webhook', 'system')
  ),
  reference_id text not null,
  metadata jsonb not null default '{}'::jsonb,
  idempotency_key text not null unique,
  created_at timestamptz not null default now()
);

create index if not exists credit_ledger_account_created_idx
  on public.credit_ledger (account_key, created_at);

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  timestamp timestamptz not null default now(),
  session_id text,
  path text,
  properties jsonb not null default '{}'::jsonb,
  stored_at timestamptz not null default now()
);

create index if not exists analytics_events_name_stored_idx
  on public.analytics_events (name, stored_at);

create table if not exists public.billing_events (
  id uuid primary key default gen_random_uuid(),
  event_id text not null,
  event_type text not null,
  received_at timestamptz not null default now(),
  status text not null check (status in ('accepted', 'duplicate', 'ignored')),
  metadata jsonb not null default '{}'::jsonb
);

create unique index if not exists billing_events_unique_accepted_event_idx
  on public.billing_events (event_id)
  where status = 'accepted';

create index if not exists billing_events_received_idx
  on public.billing_events (received_at);

create table if not exists public.generation_history_metadata (
  id uuid primary key default gen_random_uuid(),
  account_key text not null,
  user_id_hash text,
  reply_language text,
  reply_tone text,
  scenario_key text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists generation_history_account_created_idx
  on public.generation_history_metadata (account_key, created_at);

create table if not exists public.user_profiles (
  id uuid primary key default gen_random_uuid(),
  account_key text not null unique,
  user_id_hash text,
  email_hash text,
  plan_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.plans (
  id text primary key,
  name text not null,
  monthly_credits integer not null default 0,
  price_cents integer not null default 0,
  currency text not null default 'usd',
  is_active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.credit_ledger enable row level security;
alter table public.analytics_events enable row level security;
alter table public.billing_events enable row level security;
alter table public.generation_history_metadata enable row level security;
alter table public.user_profiles enable row level security;
alter table public.plans enable row level security;

comment on table public.credit_ledger is 'NoDrama durable credit ledger. Server-side service role only.';
comment on table public.analytics_events is 'NoDrama metadata-only analytics events. No full prompt storage by default.';
comment on table public.billing_events is 'NoDrama Stripe/billing event idempotency ledger.';
comment on table public.generation_history_metadata is 'NoDrama metadata-only generation history. Full prompt storage disabled by default.';
