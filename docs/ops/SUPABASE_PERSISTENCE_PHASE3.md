# NoDrama — Supabase Persistence Foundation

## Status

Phase 3 adds the persistence foundation only.

This phase does not switch production traffic to Supabase yet.

## Added

- Supabase/Postgres schema
- server-only Supabase REST client
- credit ledger adapter foundation
- analytics adapter foundation
- billing event adapter foundation
- verification script

## Security model

The application must use SUPABASE_SERVICE_ROLE_KEY only on the server.

The browser must never receive SUPABASE_SERVICE_ROLE_KEY.

RLS is enabled on persistence tables.

No public table policies are created in this phase.

## Privacy model

No full prompt storage by default.

Generation history table is metadata-only.

## Next phase

Phase 4 wires the adapters behind NODRAMA_PERSISTENCE_BACKEND=supabase and adds smoke tests.
