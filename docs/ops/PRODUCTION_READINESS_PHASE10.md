# NoDrama — Production Readiness Phase 10

## Status

Production readiness gate added.

## Purpose

This phase does not add product features.

It verifies that the project has the minimum production wiring for:

- durable persistence
- Supabase migrations
- atomic credit debit
- atomic credit grants
- Stripe webhook fulfillment
- Stripe Checkout Session creation
- required environment keys

## Production rule

Production must use:

NODRAMA_PERSISTENCE_BACKEND=supabase

Local JSON persistence is development-only.

## Required Supabase steps

Apply migrations in order:

1. supabase/migrations/0001_nodrama_persistence.sql
2. supabase/migrations/0002_atomic_credit_debit_rpc.sql
3. supabase/migrations/0003_atomic_credit_grant_rpc.sql

## Required Stripe setup

Create price IDs for:

- STRIPE_PRICE_SOS_PACK
- STRIPE_PRICE_MINI_PACK
- STRIPE_PRICE_KLID_PACK
- STRIPE_PRICE_STARTER_MONTHLY
- STRIPE_PRICE_PRO_MONTHLY
- STRIPE_PRICE_POWER_MONTHLY

Configure webhook endpoint:

/api/billing/webhook

Required events:

- checkout.session.completed
- invoice.paid

## Critical rule

Credits are granted only by verified Stripe webhook fulfillment.

Checkout success redirect is not proof of payment.
