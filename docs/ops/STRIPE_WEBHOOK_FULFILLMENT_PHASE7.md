# NoDrama — Stripe Webhook Fulfillment Phase 7

## Status

Stripe webhook fulfillment pipeline foundation is wired.

## Implemented

- raw body webhook route
- Stripe-Signature verification
- timestamp tolerance guard
- billing event idempotency
- entitlement resolution
- atomic credit grant call
- duplicate event protection

## Fulfillable events

- checkout.session.completed
- invoice.paid

## Required metadata

A fulfillable Stripe object should carry either:

- metadata.nodrama_account_key
- client_reference_id

Accepted account key prefixes:

- user:
- anon:

Entitlement can be resolved by:

- metadata.nodrama_entitlement_key
- metadata.nodrama_price_id
- metadata.price_id
- first nested line/item price id when available

## Required env

- STRIPE_WEBHOOK_SECRET
- STRIPE_PRICE_CREDITS_25
- STRIPE_PRICE_CREDITS_100
- STRIPE_PRICE_PRO_MONTHLY

## Security

The webhook route uses req.text() and verifies the Stripe-Signature header before fulfillment.

Do not switch this route back to req.json() before verification.
