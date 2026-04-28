# NoDrama — User Credits Foundation

## Purpose

Bundle 14 adds the first local credit system.

## What it does

- Stores credits locally in `data/credits/credits.json`
- Supports authenticated users via session user id
- Falls back to anonymous cookie identity
- Adds `/api/credits/status`
- Adds `/api/credits/add`
- Shows credits on `/account`
- Allows `/api/generate` to consume credits before using the free weekly limit

## Why

Credits are the bridge between auth and Stripe.

## Production note

Local JSON storage is MVP-only. Production should move credits to a database.
