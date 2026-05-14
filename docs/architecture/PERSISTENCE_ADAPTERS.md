# Persistence Adapters

## Why this adapter layer exists
NoDrama currently ships with local-first persistence. This adapter layer creates a stable repository boundary so we can move to production-safe Postgres/Supabase later without forcing a hard migration today.

## Modes
- `local_file`: default mode, uses JSON files in `data/` for MVP continuity.
- `database`: requires `DATABASE_URL` or `NODRAMA_DATABASE_URL`; currently a placeholder that fails safely.
- `disabled`: blocks persistence operations for explicit private/offline environments.

## Privacy model
- Metadata-only logging by default.
- Private mode is supported through `disabled` mode and safe fallbacks.
- No full prompt storage by default.
- No generated reply storage by default.
- No raw IP storage in persistence records.

## Credit ledger and billing
- Credit ledger is designed as append-only for auditability and reconciliation.
- Billing events must be idempotent by `eventId` to avoid double-crediting.
- Duplicate billing events are recorded as duplicate status, not re-applied.

## Future database migration
- Planned target: Supabase/Postgres repository implementation behind the same interface.
- This foundation intentionally avoids introducing Prisma, Supabase table wiring, or DB migrations yet.

## Failure modes
- If mode is `database` and DB URL is missing, startup/runtime checks throw a clear configuration error.
- If mode is `database`, repository methods throw `not implemented/configured` until DB adapter is built.
- If mode is `local_file`, current file-based behavior remains active.
