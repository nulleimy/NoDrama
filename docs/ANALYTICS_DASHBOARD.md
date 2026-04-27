# NoDrama — Analytics Storage + Mini Dashboard

## Purpose

Bundle 12 persists analytics events locally and exposes a minimal admin dashboard.

## Storage

Events are appended to `data/analytics/events.jsonl`.

Each line is one JSON event.

## Dashboard

Admin page: `/admin/analytics`

API summary endpoint: `/api/admin/analytics/summary`

## Metrics

- total events
- generate clicks
- copy events
- pack clicks
- generate to success rate
- success to copy rate
- paywall to pack click rate
- recent events

## Notes

This is local-first MVP analytics. Production should move storage to a DB such as Supabase or Postgres.
