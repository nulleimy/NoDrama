# Abuse Guard Foundation

NoDrama includes an optional, in-memory abuse guard for `POST /api/generate`.

## Goals

- Apply a cheap server-side rate gate before expensive generation work.
- Keep the privacy model metadata-only.
- Avoid persistent storage and third-party infrastructure.

## Environment variables

- `NODRAMA_ABUSE_GUARD_ENABLED`
  - Enable guard when set to `"1"`.
- `NODRAMA_GENERATE_LIMIT_WINDOW_SECONDS`
  - Sliding window size in seconds.
  - Defaults to `60`.
- `NODRAMA_GENERATE_LIMIT_MAX`
  - Maximum requests per client signal in one window.
  - Defaults to `10`.
- `NODRAMA_ABUSE_GUARD_HASH_SALT`
  - Salt used when hashing client signal metadata.

## Privacy model

- Client signal is hashed from request metadata (`x-forwarded-for`, `user-agent`, `accept-language`, HTTP method).
- No raw IP addresses are stored.
- No prompt text is stored.
- Guard state is in-memory only.

## Client behavior on limit

When limited, endpoint returns:

- HTTP status: `429`
- Body fields:
  - `ok: false`
  - `error.code: "RATE_LIMITED"`
  - `retryAfterSeconds`
