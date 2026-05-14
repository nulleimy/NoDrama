# NoDrama Persistence Adapters

## Why this adapter layer exists

NoDrama needs production-safe persistence for user/account/credit/billing data, but we do not want to force a hard migration before the production database adapter is fully validated. The adapter layer provides a stable internal contract while allowing a local file fallback for MVP continuity.

## Modes

- `local_file` (default): reads/writes on-disk JSON files under `data/persistence/`.
- `database`: reserved for production database persistence; currently a placeholder that fails closed with explicit errors.
- `disabled`: no-op persistence mode for constrained/private runs.

## Configuration safety

- `NODRAMA_PERSISTENCE_MODE` controls mode selection.
- `database` mode requires `DATABASE_URL` or `NODRAMA_DATABASE_URL`.
- Missing database URL fails safely (throws) rather than silently pretending production persistence is active.
- No production persistence claim should be made unless database mode is explicitly enabled and configured.

## Privacy model

- Metadata-only logging is the baseline.
- Private mode support remains compatible via `disabled` mode and existing runtime flags.
- Raw IP addresses should not be persisted in this layer.
- No full prompt storage by default.
- No generated reply storage by default.

## Credits and billing

- Credit ledger is append-only by design to support auditability and future reconciliation.
- Billing events are tracked with idempotency semantics (duplicate events are marked and not re-applied).

## Future Supabase/Postgres migration

The `database` adapter is intentionally a placeholder. A future migration can implement:

1. durable Postgres/Supabase tables,
2. transactional credit ledger writes,
3. webhook-driven billing idempotency tables,
4. admin/audit query surfaces.

Because the repository contract already exists, migration can happen behind the adapter without breaking route contracts.

## Failure modes

- `database` mode without DB URL: hard error on repository selection.
- `database` mode with placeholder adapter: explicit not-implemented errors on read/write.
- `disabled` mode: persistence no-ops; callers must tolerate null/default reads.
- `local_file` mode: resilient fallback for missing files by initializing empty/default records.
