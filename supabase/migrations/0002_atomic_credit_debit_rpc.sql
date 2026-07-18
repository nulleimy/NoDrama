create or replace function public.nodrama_debit_credits(
  p_account_key text,
  p_user_id_hash text,
  p_amount integer,
  p_reference_id text,
  p_idempotency_key text,
  p_metadata jsonb default '{}'::jsonb
)
returns table (
  debited boolean,
  balance integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_balance integer;
  v_existing_delta integer;
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

  perform pg_advisory_xact_lock(hashtext(p_account_key));

  select delta
    into v_existing_delta
  from public.credit_ledger
  where idempotency_key = p_idempotency_key
  limit 1;

  if found then
    select coalesce(sum(delta), 0)::integer
      into v_balance
    from public.credit_ledger
    where account_key = p_account_key;

    return query select (v_existing_delta < 0), v_balance;
    return;
  end if;

  select coalesce(sum(delta), 0)::integer
    into v_balance
  from public.credit_ledger
  where account_key = p_account_key;

  if v_balance < p_amount then
    return query select false, v_balance;
    return;
  end if;

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
    -p_amount,
    'generation_debit',
    'generate',
    p_reference_id,
    coalesce(p_metadata, '{}'::jsonb),
    p_idempotency_key
  );

  return query select true, (v_balance - p_amount);
end;
$$;

revoke all on function public.nodrama_debit_credits(text, text, integer, text, text, jsonb) from public;
revoke all on function public.nodrama_debit_credits(text, text, integer, text, text, jsonb) from anon;
revoke all on function public.nodrama_debit_credits(text, text, integer, text, text, jsonb) from authenticated;

comment on function public.nodrama_debit_credits(text, text, integer, text, text, jsonb)
is 'Atomically debits NoDrama credits per account_key using transaction-scoped advisory lock and idempotency key.';
