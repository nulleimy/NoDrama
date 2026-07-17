# NoDrama — Persistence Runtime Wiring Phase 4

Status: backend routing added.

Default backend:
NODRAMA_PERSISTENCE_BACKEND=local_json

Production target backend:
NODRAMA_PERSISTENCE_BACKEND=supabase

Wired areas:
- credit ledger
- analytics event store
- billing event store

Safety:
- local_json stays development-only
- production local_json writes hard-stop
- Supabase requires server-side service role config
- SUPABASE_SERVICE_ROLE_KEY must never be exposed to the browser

Known limitation:
Credit debit is still not fully transactional across balance read and debit insert.
Phase 5 should move credit debit/grant into Postgres RPC for atomicity.
