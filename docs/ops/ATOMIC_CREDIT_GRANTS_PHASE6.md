# NoDrama — Atomic Credit Grants Phase 6

## Status

Supabase credit grants now have an atomic RPC foundation.

## Why

Stripe webhooks can be retried. Without idempotent credit grants, one purchase or subscription event can credit the same account more than once.

## Implemented

- public.nodrama_grant_credits(...)
- transaction-scoped pg_advisory_xact_lock(hashtext(account_key))
- idempotency key handling
- server-side Stripe entitlement resolver
- Supabase runtime route from grantCredits(...)

## Required Stripe env keys

STRIPE_PRICE_CREDITS_25=
STRIPE_PRICE_CREDITS_100=
STRIPE_PRICE_PRO_MONTHLY=

## Security

SUPABASE_SERVICE_ROLE_KEY remains server-only.
Do not expose Stripe entitlement logic to the browser as a source of authority.

## Next phase

Phase 7 should wire webhook fulfillment: Stripe event -> resolve entitlement -> record billing event -> atomic grant -> audit result.
