# NoDrama Production Persistence Migration Plan

## Purpose and Scope

This document defines how NoDrama should migrate from current MVP local/file-backed state to production-safe persistence, without changing runtime behavior in this bundle.

## 1) Current MVP Storage

NoDrama currently uses a local-first MVP model:

- **Memory Lane in browser localStorage** for local user context/history controls.
- **Cookies and local free-tier limits** for client-side gating/usage checks.
- **JSON-file credit snapshots (where present in local/dev workflows)** as lightweight state.
- **Runtime smoke outputs are ephemeral and ignored** for long-term persistence and analytics quality.

Implication: this is suitable for rapid iteration, but not a source of truth for subscriptions, billing, entitlement audits, abuse controls, or durable cross-device continuity.

## 2) Future Production Entities

Production persistence should introduce explicit entities with clear ownership and retention boundaries:

- `users`
  - Account identity, auth linkage, and account lifecycle metadata.
- `subscriptions`
  - Current plan state, status transitions, renewal windows, and provider references.
- `credit_ledger`
  - Append-only ledger entries for grants, debits, reversals, and adjustments.
- `billing_events`
  - Idempotent normalized webhook/checkout lifecycle events.
- `generation_events` (**metadata-only**)
  - Timestamped operational metadata for generation calls (latency, route, model key, safety flags, credit impact), excluding full prompt text by default.
- `memory_lane_records` (optional, user-controlled)
  - Persisted only with explicit user opt-in; disabled in private mode.
- `feedback_events`
  - User rating and structured feedback metadata.
- `regression_candidates`
  - Curated anonymized/filtered candidate records for evaluation pipelines.
- `audit_log`
  - Security- and operations-relevant immutable audit events.

## 3) Privacy Model

Privacy defaults must remain strict and user-comprehensible:

- **Default metadata-only logging** for runtime and analytics events.
- **No full user input by default** (no full prompt storage by default).
- **Private mode means no persistence** beyond immediate in-memory request handling.
- **Retention policy** must be explicit per entity class (operational, billing, audit, optional product telemetry).
- **User rights**: support export/delete flows for user data (export/delete supported with policy-governed scope and auditability).

Recommended principle: store the minimum data needed to operate safely, bill correctly, prevent abuse, and improve quality without retaining sensitive interpersonal text unless explicitly opted-in for a bounded feature.

## 4) Billing Model

Production billing should follow accounting-safe patterns:

- **Stripe webhook source of truth** for billing lifecycle state.
- **Idempotent billing events** keyed by provider event IDs and dedupe strategy.
- **Credit ledger over mutable balance-only state**:
  - balance is computed/derived,
  - ledger is append-only,
  - corrections are compensating entries.

This prevents hidden drift from race conditions, retries, duplicate deliveries, and partial failures.

## 5) Migration Phases

### Phase 1 — Local-first hardening

- Keep existing local-first product behavior.
- Add architecture docs and persistence contracts/interfaces.
- Introduce safe boundaries for future adapters without DB rollout.

### Phase 2 — Database foundations

- Add DB schema/tables for target entities.
- Add repository/adapters and idempotency primitives.
- Keep feature flags/local fallback where needed.

### Phase 3 — Account and identity wiring

- Wire authentication, user accounts, and account dashboard.
- Expose user-visible data controls and persisted-state awareness.

### Phase 4 — Production billing cutover

- Activate Stripe-driven billing flows.
- Reconcile ledger/subscription state from webhook/event history.
- Add support-runbook paths for failed/replayed events.

### Phase 5 — Analytics and regression pipeline

- Enable metadata-only analytics and quality loops.
- Feed regression candidate pipeline with privacy-safe records.
- Operationalize retention enforcement and audit reporting.

## 6) Failure Modes and Handling

- **Duplicate webhook**
  - Use idempotency keys and unique constraints on provider event IDs.
- **Failed checkout**
  - Persist event outcome and keep user on non-entitled path until confirmed success.
- **Stale subscription**
  - Reconcile on webhook plus periodic consistency checks.
- **User clears localStorage**
  - Treat local state as cache; server-side entitlements remain authoritative.
- **Abuse / bot traffic**
  - Add rate limits, anomaly flags, and audit events tied to governance controls.

## 7) NO-GO Guardrails

The following are explicitly disallowed:

- Storing full sensitive prompts by default.
- Client-side credit grants as authoritative accounting.
- Silent cloud history sync without clear user consent.
- Unlimited free generation in production economics.

## Implementation Notes (This Bundle)

- This plan is documentation-only.
- No DB implementation is included here.
- No Stripe implementation is included here.
- No runtime app behavior is changed here.
