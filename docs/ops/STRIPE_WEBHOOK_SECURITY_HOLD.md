# Stripe webhook security hold

## Status

Stripe credit fulfillment is intentionally **fail closed**.

`POST /api/billing/webhook` returns HTTP `503` and never records billing events or grants credits.

## Why the hold exists

The previous foundation endpoint accepted parsed JSON without validating the Stripe `Stripe-Signature` header against the exact raw request body. It also granted placeholder credits to `anon:local` and relied on non-transactional local JSON files for billing idempotency and credit state.

That combination is not safe for production because a forged request, concurrent delivery, storage reset, or partial failure could create unauthorized or inconsistent credit balances.

## Conditions required before re-enabling

All conditions are mandatory:

1. Verify the Stripe signature against the exact raw request body and `STRIPE_WEBHOOK_SECRET`.
2. Reject missing, malformed, expired, or invalid signatures before parsing business fields.
3. Store Stripe event IDs in durable transactional persistence with a unique constraint.
4. Apply billing-event acceptance and credit-ledger mutation in one database transaction.
5. Bind the purchased Stripe customer/session to an authenticated NoDrama account.
6. Derive credit amount from an allowlisted server-side price mapping, never request metadata alone.
7. Implement replay, duplicate-delivery, unknown-price, unknown-user, and partial-failure tests.
8. Add structured metadata-only audit logs without secrets, raw payment payloads, or full user prompts.
9. Pass `npm run verify`, a production build, and a signed Stripe CLI smoke test.

## Deployment rule

Do not configure a production Stripe webhook destination to this endpoint while the security hold is active. A non-2xx response is intentional and may cause Stripe retries.

## Rollback

Reverting this hold is prohibited unless every condition above is implemented and verified in the same reviewed change.
