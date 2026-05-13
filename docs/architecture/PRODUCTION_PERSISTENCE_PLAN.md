# NoDrama Production Persistence Migration Plan

## Purpose

This document defines a safe migration path from NoDrama's MVP local/file storage patterns to production-grade persistence, without changing current user-facing behavior prematurely.

## 1) Current MVP storage

NoDrama today is intentionally local-first and MVP-oriented:

- **Memory Lane is localStorage-based** and user-controlled in-browser.
- **Private mode is browser-local**, designed for minimal/no persistence behavior when enabled.
- **Feedback instrumentation currently captures lightweight events**, including `feedbackEvents` and `regressionCandidate` flows for quality tuning/export.
- **Free-limit tracking may be local-only**, via browser state such as cookies or localStorage where implemented.
- **Credits may include JSON/file-based fallback state** in development/MVP paths where present.
- **Runtime/smoke artifacts are generated locally and git-ignored**, including data/runtime smoke outputs used for validation and regression confidence.

## 2) Future production entities

The production persistence layer should model the following entities with clear ownership and lifecycle:

- `users`
- `accounts` / auth identities
- `subscriptions`
- `plans`
- `credit_ledger`
- `billing_events`
- `stripe_events`
- `generation_events` (metadata-only)
- `memory_lane_records` (optional and user-controlled)
- `feedback_events`
- `regression_candidates`
- `admin_analytics_events`
- `audit_log`

## 3) Privacy model

Privacy is a product requirement, not an afterthought:

- **metadata-only logging by default** for generation and operational traces.
- **no full prompt storage by default**.
- **no full generated reply storage by default**, unless the user explicitly saves content.
- **private mode means no persistence** beyond immediate runtime requirements.
- **local-first Memory Lane remains browser-controlled** and user-owned.
- Users must be able to **export/delete** their data.
- A documented **retention policy** must define per-entity time windows and deletion behavior.
- Product analytics must stay clearly separated from sensitive user content, with explicit safeguards to prevent accidental mixing.

## 4) Billing model

Billing correctness must be deterministic and auditable:

- **Stripe webhook is source of truth** for billing state transitions.
- Checkout success URL/client redirect is **not** source of truth.
- **No client-side credit grants** under production billing.
- Billing handlers must be **idempotent** to withstand retries/duplicates.
- Credits should be represented by a **credit ledger**, not only a mutable balance field.
- Every credit mutation must include an audit trail in **audit log** + billing correlation metadata.

## 5) Migration phases

### Phase 1 — Keep MVP behavior, define safety contracts

- Preserve local-first user experience.
- Add architecture docs, boundaries, and persistence interfaces.
- Establish event schemas and privacy defaults.

### Phase 2 — Introduce DB schema + adapters behind stable interfaces

- Add database schema and adapter layer.
- Keep existing app behavior stable.
- Preserve public API contracts while moving storage concerns behind interfaces.

### Phase 3 — Wire auth/account domain + user-level credits

- Add users/accounts identity linkage.
- Connect account dashboard to persisted user state.
- Introduce user-level credit ledger reads/writes through governed services.

### Phase 4 — Production billing via Stripe webhooks

- Enable verified webhook ingestion and reconciliation.
- Enforce webhook-driven entitlement updates.
- Add billing observability and replay-safe idempotency controls.

### Phase 5 — Admin analytics + regression pipeline hardening

- Add admin analytics event processing with privacy constraints.
- Persist regression candidate metadata for QA pipeline triage.
- Add operations dashboards/audits for production reliability.

## 6) Failure modes and handling

- **Duplicate webhook**: ignore duplicates with event-id idempotency keys.
- **Checkout paid but webhook delayed**: show pending/processing state until verified.
- **Failed checkout**: do not grant entitlements.
- **Stale subscription**: derive entitlements from latest verified billing timeline.
- **User clears localStorage**: local Memory Lane/state may reset; account-backed data must remain consistent server-side.
- **Credit double-grant**: prevented by idempotent ledger inserts + unique external references.
- **Bot/free-plan abuse**: enforce rate limits, anti-automation checks, and quota controls.
- **Database outage**: degrade gracefully; avoid unsafe fallback grants.
- **Analytics over-collection**: schema and review gates block sensitive payloads.
- **Privacy mode accidentally bypassed**: add explicit test coverage and runtime safeguards.

## 7) NO-GO rules

The following are prohibited in production architecture:

- no full sensitive prompt storage by default
- no silent cloud history sync
- no client-side credit grant
- no unlimited free generation
- no analytics that stores raw user situations
- no fake subscription state
- no production billing without webhook verification

## 8) Recommended DB tables (sketch only)

> Table-level shape only; no implementation in this bundle.

- **users**: primary identity, lifecycle, consent, timestamps.
- **subscriptions**: current + historical subscription state linked to billing provider IDs.
- **credit_ledger**: immutable credit/debit entries with reason codes and references.
- **billing_events**: normalized internal billing timeline.
- **generation_events**: metadata-only generation traces (no raw sensitive content by default).
- **feedback_events**: user feedback metadata and outcome links.
- **regression_candidates**: quality/regression candidate pointers and status.
- **admin_analytics_events**: operational/product analytics with strict redaction policy.
- **audit_log**: security-relevant and finance-relevant action trail.

## 9) Open decisions

- Which DB provider best matches reliability + operational constraints.
- Final retention window per table/domain.
- Whether explicitly saved replies sync across devices.
- Paid plan entitlement model details (credits, limits, rollover, grace).
- Anonymization/hash strategy for analytics and diagnostics.
- Admin access control model and least-privilege boundaries.

## Implementation guardrails for this bundle

- Documentation-focused change only.
- No database implementation added.
- No Stripe implementation added.
- No runtime behavior changes.
- No public API changes.
- No weakening of local-first privacy posture.
