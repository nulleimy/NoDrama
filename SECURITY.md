# NoDrama Security Policy

## Supported scope

Security-sensitive areas include authentication, authorization, billing and entitlement fulfillment, webhook verification, rate limiting, AI-provider integration, database access, email delivery, operational tooling, and handling of user-submitted content.

## Reporting

Do not disclose suspected vulnerabilities, credentials, tokens, webhook secrets, private URLs, or personal data in public issues, pull requests, discussions, or screenshots.

Until a dedicated security contact is published, repository maintainers should handle security reports through a private communication channel available to authorized project participants.

**Launch gate:** `PUBLIC SECURITY CONTACT / PROCESS — NEEDS COMPLETION`.

## Secret handling

Production credentials, API keys, service-role credentials, webhook secrets, signing keys, private tokens, and database passwords must not be committed to source control, embedded in client bundles, or written into generated reports.

Example environment files may contain variable names and clearly non-secret placeholders only.

If a real credential is suspected to have entered Git history, treat rotation/revocation as the primary containment step; deleting the current file alone is not sufficient.

## Product security principles

- enforce authorization server-side;
- verify Stripe/webhook events server-side before granting entitlements;
- fail closed on unverifiable billing or privileged state changes;
- apply least privilege to Supabase/service roles and infrastructure tokens;
- keep privileged credentials out of browser/client code;
- validate and rate-limit generation endpoints;
- minimize sensitive user text in logs and diagnostic artifacts;
- keep full generated user content out of routine smoke-test reports where not required;
- maintain dependencies and investigate security advisories before release;
- preserve auditable evidence for security-sensitive operations without exposing secrets.

## Release security gate

Before public commercial production:

1. scan the current tree and Git history with an approved secret scanner;
2. verify no production secret is present in client-exposed environment variables;
3. verify webhook signature validation and replay/idempotency behavior;
4. review authorization and entitlement boundaries;
5. run dependency/security checks for the exact lockfile;
6. document incident-response and credential-rotation procedures;
7. publish an appropriate private vulnerability-reporting channel.
