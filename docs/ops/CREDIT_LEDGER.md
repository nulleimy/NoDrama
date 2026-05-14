# Credit Ledger (MVP foundation)

NoDrama bills by **situation** (not by internal generation count). This credit model uses an append-only ledger.

## Core model
- Ledger entries are append-only (`delta`, `reason`, `source`, `referenceId`, `idempotencyKey`).
- Balance is derived by summing deltas.
- No mutable single balance field is treated as source-of-truth.

## Account modes
- **Authenticated mode**: account key uses `user:<session.user.id>` from NextAuth session.
- **Anonymous mode**: account key falls back to `anon:<cookie-id>` for local/dev compatibility.

## Storage in MVP
- File-backed JSON storage under `data/credits/ledger.json`.
- This is intentionally MVP-only and not distributed-production safe.
- Runtime files must stay gitignored.

## Billing source of truth
- Stripe webhook is the only trusted billing grant source in production-like flows.
- Checkout success URL is not used to grant credits.
- Idempotency key must be stable per event and account mapping.

## Security model
- Client-side arbitrary credit grants are blocked by default.
- Manual/dev grants require explicit env flag(s).

## Privacy model
- Ledger does not store raw email, raw auth tokens, user prompts, or generated replies.
- Ledger may store hashed user id for linkage in server context.

## Future migration
- Replace file-backed ledger with DB-backed append-only table.
- Preserve idempotency semantics and reasons/source taxonomy during migration.
