# NoDrama — Atomic Credit Ledger Phase 5

## Status

Supabase credit debit now has an atomic RPC foundation.

## Why

Production credit debit must not use:

read balance -> decide -> insert debit

That pattern is unsafe under parallel requests.

## Implemented

- `public.nodrama_debit_credits(...)`
- transaction-scoped `pg_advisory_xact_lock(hashtext(account_key))`
- idempotency key handling
- balance check and debit insert inside one database function
- Supabase runtime route from `debitCredits(...)`

## Still local-only

`local_json` remains for development only.

## Important

Grant operations are still simple inserts.

Phase 6 should add:
- atomic grant RPC
- Stripe entitlement mapping
- subscription monthly grant idempotency
- migration smoke script against real Supabase
