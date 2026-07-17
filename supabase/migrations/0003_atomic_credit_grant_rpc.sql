create or replace function public.nodrama_grant_credits(
  p_account_key text,
  p_user_id_hash text,
  p_amount integer,
  p_reason text,
  p_source text,
  p_reference_id text,
  p_idempotency_key text,
  p_metadata jsonb default '{}'::jsonb
)
returns table (
  id uuid,
  account_key text,
  user_id_hash text,
  delta integer,
  reason text,
  source text,
  reference_id text,
  created_at timestamptz,
  metadata jsonb,
  idempotency_key text
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_account_key is null or length(trim(p_account_key)) = 0 then
    raise exception 'p_account_key is required';
  end if;

  if p_amount is null or p_amount <= 0 then
    raise exception 'p_amount must be positive';
  end if;

  if p_idempotency_key is null or length(trim(p_idempotency_key)) = 0 then
    raise exception 'p_idempotency_key is required';
  end if;

  if p_reason not in (
    'free_initial',
    'free_weekly',
    'manual_dev_grant',
    'stripe_pack_purchase',
    'stripe_subscription_grant',
    'adjustment',
    'refund',
    'reversal'
  ) then
    raise exception 'unsupported grant reason: %', p_reason;
  end if;

  if p_source not in ('api', 'stripe_webhook', 'system') then
    raise exception 'unsupported grant source: %', p_source;
  end if;

  perform pg_advisory_xact_lock(hashtext(p_account_key));

  return query
  select
    cl.id,
    cl.account_key,
    cl.user_id_hash,
    cl.delta,
    cl.reason,
    cl.source,
    cl.reference_id,
    cl.created_at,
    cl.metadata,
    cl.idempotency_key
  from public.credit_ledger cl
  where cl.idempotency_key = p_idempotency_key
  limit 1;

  if found then
    return;
  end if;

  return query
  insert into public.credit_ledger (
    account_key,
    user_id_hash,
    delta,
    reason,
    source,
    reference_id,
    metadata,
    idempotency_key
  )
  values (
    p_account_key,
    p_user_id_hash,
    p_amount,
    p_reason,
    p_source,
    p_reference_id,
    coalesce(p_metadata, '{}'::jsonb),
    p_idempotency_key
  )
  returning
    credit_ledger.id,
    credit_ledger.account_key,
    credit_ledger.user_id_hash,
    credit_ledger.delta,
    credit_ledger.reason,
    credit_ledger.source,
    credit_ledger.reference_id,
    credit_ledger.created_at,
    credit_ledger.metadata,
    credit_ledger.idempotency_key;
end;
$$;

revoke all on function public.nodrama_grant_credits(text, text, integer, text, text, text, text, jsonb) from public;
revoke all on function public.nodrama_grant_credits(text, text, integer, text, text, text, text, jsonb) from anon;
revoke all on function public.nodrama_grant_credits(text, text, integer, text, text, text, text, jsonb) from authenticated;

comment on function public.nodrama_grant_credits(text, text, integer, text, text, text, text, jsonb)
is 'Atomically grants NoDrama credits per account_key using transaction-scoped advisory lock and idempotency key.';
