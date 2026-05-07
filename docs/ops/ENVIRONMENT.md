# Environment

NoDrama uses explicit environment variables for auth, local test bypasses, and
feature rollout. Do not commit real secrets. Keep `.env.example` as a shape
reference only.

## Required Variables

| Variable | Local | Dev/Staging | Production | Default | Notes |
| --- | --- | --- | --- | --- | --- |
| `NEXTAUTH_URL` | `http://localhost:3000` | Deployed preview URL | Production URL | none | Must match the public app origin for auth callbacks. |
| `NEXTAUTH_SECRET` | Required, local random value | Required secret | Required secret | none | Generate per environment. Never reuse or commit the value. |
| `NODRAMA_TEST_MODE` | Optional | Optional only for controlled QA | `false` | `false` | Enables local/test bypass behavior. Keep off in production. |
| `NODRAMA_DISABLE_FREE_LIMIT` | Optional | Optional only for controlled QA | `false` | `false` | Bypasses the free generation limit. Keep off in production. |
| `NODRAMA_ENABLE_HISTORY` | Optional | Optional | Explicit rollout only | `false` | Enables saved generation history surfaces when implemented. |
| `NODRAMA_ENABLE_EVENT_LOGGING` | Optional | Optional | Explicit rollout only | `false` | Enables safe metadata-only event logging. |
| `NODRAMA_ENABLE_CLOUD_HISTORY` | Optional | Optional | Explicit rollout only | `false` | Enables cloud-backed history only after privacy and backup checks. |
| `NODRAMA_ENABLE_PHRASE_REALIZER` | Optional | Optional | Explicit rollout only | `false` | Enables phrase realizer behavior when ready for rollout. |

## Local Setup

1. Copy `.env.example` to `.env.local`.
2. Set `NEXTAUTH_URL=http://localhost:3000`.
3. Generate a local-only `NEXTAUTH_SECRET`.
4. Leave production-sensitive flags as `false` unless the current test requires
   them.

## Staging And Preview Setup

Preview and staging environments should mirror production as closely as possible.
Use real secrets managed by the deployment platform, not committed files. Enable
test flags only for a short, documented QA window.

Before promoting a preview build, confirm:

- `NEXTAUTH_URL` matches the preview origin.
- `NEXTAUTH_SECRET` is present.
- `NODRAMA_TEST_MODE=false`.
- `NODRAMA_DISABLE_FREE_LIMIT=false`.
- Cloud history and event logging flags match the release checklist.

## Production Setup

Production defaults must be privacy-safe and billing-safe:

- `NODRAMA_TEST_MODE=false`
- `NODRAMA_DISABLE_FREE_LIMIT=false`
- `NODRAMA_ENABLE_CLOUD_HISTORY=false` unless the history storage contract,
  backup process, and delete flow are ready.
- `NODRAMA_ENABLE_EVENT_LOGGING=true` only if logs store metadata and never full
  situation text or generated outputs.

Secrets must be rotated after suspected exposure, staff departure, or deployment
platform access changes.
