# NoDrama — Persistence Boundary

## Status

Phase 2 baseline: enforced boundary, not full DB migration yet.

## Rule

Local JSON persistence is development-only.

Production must not use local JSON files for:

- credit ledger
- billing events
- analytics events
- generation history metadata
- user profiles
- plans

## Production target

Use durable DB persistence:

NODRAMA_PERSISTENCE_BACKEND=supabase

Required environment:

NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

## Privacy rule

No full prompt storage by default.
Store metadata-only records unless history/export mode is explicitly enabled.
