# NoDrama — Production Promotion Phase 19

## Status

Production promotion checklist added.

## Rule

Do not run production deployment until preview smoke and real Stripe/Supabase test-mode flow are green.

## Required before production

1. Supabase migrations applied.
2. Preview deploy created.
3. Preview smoke script passes.
4. Stripe test checkout completes.
5. Stripe webhook returns 2xx.
6. billing_events contains accepted event.
7. credit_ledger contains positive stripe_webhook grant.
8. Duplicate webhook does not double-grant.
9. Generation creates negative generation_debit entry.
10. Production env variables are configured separately from preview.

## Hard rule

Credits are granted only by verified webhook.

Checkout success redirect is not proof of payment.

## Production command

Use only after all checks are green:

vercel deploy --prod

or promote a verified preview deployment in Vercel Dashboard.

## Post-production verification

After production deployment:

1. Open production URL.
2. Run checkout test with Stripe test mode only if production is still test-mode.
3. Confirm webhook delivery in Stripe.
4. Confirm Supabase ledger rows.
5. Confirm logs have no secrets.
