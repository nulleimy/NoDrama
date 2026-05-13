# Abuse Guard Foundation (Server-side)

## What is protected

- `POST /api/generate` is protected by a server-side in-memory rate limiter.
- The guard runs before expensive generation work.
- Blocked requests return `429` with a safe `RATE_LIMITED` error envelope.

## What is not protected

- This is not a distributed/global limiter.
- This does not cover multi-region, multi-instance coordination.
- This does not replace bot mitigation, WAF, or full fraud detection.

## Privacy model

- Stores metadata-only limiter keys in memory.
- Uses hashed client signal (`sha256` + salt), never raw IP persistence.
- Does not store full prompt text.
- Does not store full generated response text.

## Local development behavior

- Enabled by default for deterministic behavior.
- Can be disabled with `NODRAMA_ABUSE_GUARD_ENABLED=false`.
- No external dependency (no Redis/DB); local dev remains simple.

## Environment configuration

- `NODRAMA_ABUSE_GUARD_ENABLED` (`true`/`false`, default: enabled)
- `NODRAMA_GENERATE_LIMIT_WINDOW_SECONDS` (default: `600`)
- `NODRAMA_GENERATE_LIMIT_MAX` (default: `20`)
- `NODRAMA_ABUSE_GUARD_HASH_SALT` (optional salt; defaults to local constant)

Guard fallback when client signal is missing: `8` requests / `10` minutes.

## Production limitations

- In-memory window state resets on restart/redeploy.
- Per-process only; limits do not synchronize across instances.
- Use this as MVP abuse guard foundation only.

## Future migration path (DB/Redis)

1. Keep `AbuseDecision` and helper interfaces stable.
2. Replace in-memory map with Redis/DB window backend.
3. Preserve privacy-safe hashed identifiers.
4. Add distributed counters + expiry and metrics.
5. Roll out with shadow mode before strict enforcement.
