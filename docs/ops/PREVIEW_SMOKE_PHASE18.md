# NoDrama — Preview Smoke Phase 18

## Status

Preview smoke test added.

## Purpose

This verifies that a Vercel preview deployment is alive and can create a Stripe Checkout Session before production promotion.

## Command

PREVIEW_URL=https://your-preview-url.vercel.app node scripts/smoke-preview-billing.mjs

## Checks

- preview homepage responds
- credits status endpoint responds or fails visibly
- checkout API creates a real Stripe Checkout URL
- checkout env is not disabled or missing

## What it does not prove

This script does not complete payment.

Full billing proof still requires:

- completing Stripe test checkout
- receiving checkout.session.completed webhook
- writing billing_events
- writing credit_ledger grant
- confirming duplicate webhook does not double-grant
- confirming generation debit works

## Production lock

Do not run production promotion until preview smoke and real Stripe/Supabase test-mode flow are green.
