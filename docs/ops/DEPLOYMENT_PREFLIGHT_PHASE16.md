# NoDrama — Deployment Preflight Phase 16

## Status

Deployment preflight added.

## Purpose

This phase does not deploy the app.

It verifies that production-critical billing and persistence wiring is present before deployment.

## Checks

- `.env.local` ignored
- Supabase migrations present
- Stripe webhook route uses raw body
- Stripe checkout carries internal account metadata
- Stripe webhook grants credits only through trusted server fulfillment
- production readiness script exists
- git working tree status is visible

## Production rule

Do not deploy customer-facing billing until real test-mode smoke test passes:

- Supabase migrations applied
- Stripe checkout completed
- Stripe webhook received
- billing event recorded
- credit grant recorded
- duplicate webhook does not double grant
- generation debit works
