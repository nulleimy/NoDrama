# NoDrama Commercial Release Legal Gate

A commercial production launch is **NO-GO** until all mandatory items below are resolved with evidence.

## Operator and consumer terms

- [ ] operator/controller legal identity completed
- [ ] legal and privacy contact completed
- [ ] governing law and dispute terms reviewed
- [ ] consumer cancellation/withdrawal/refund rules reviewed for target markets
- [ ] pricing, renewal, cancellation, and credit expiry match the live checkout

## Privacy

- [ ] production data-flow map verified
- [ ] production subprocessors verified from deployed configuration
- [ ] lawful bases documented where required
- [ ] retention/deletion schedule approved
- [ ] data-subject request process defined
- [ ] international-transfer safeguards documented where applicable
- [ ] AI-provider retention/training/data-use configuration verified

## Intellectual property

- [ ] contributor/contractor chain of title verified
- [ ] third-party package licenses inventoried
- [ ] SBOM/dependency inventory generated
- [ ] fonts, icons, images, copy, generated assets, and brand provenance verified
- [ ] no unapproved copied/vendor code present

## Security and billing

- [ ] current tree secret scan clean or findings remediated
- [ ] Git history secret scan clean or exposed credentials rotated/revoked
- [ ] server-side authorization verified
- [ ] Stripe webhook signature/idempotency/fulfillment verified
- [ ] privileged Supabase/service credentials remain server-only
- [ ] rate limiting and abuse controls verified
- [ ] security reporting/contact process published

## Product truth

- [ ] README and product claims match current implementation
- [ ] live pricing matches documentation and billing configuration
- [ ] deterministic verification passes
- [ ] production smoke suite passes
- [ ] no client-side success state can grant server-side entitlement without authoritative verification

## Decision

If any mandatory item is unresolved, record `NO-GO / NEEDS VERIFICATION` rather than assuming readiness.
