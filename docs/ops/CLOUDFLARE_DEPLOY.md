# Cloudflare Workers deploy runbook

NoDrama is a Next.js app with API routes, cookies, auth, and server-side credit/billing foundations. For this codebase, deploy to **Cloudflare Workers through OpenNext**, not to static Cloudflare Pages export.

## Reality check

- `next build` is not enough for Cloudflare Workers.
- Static export is not valid because the app uses server routes under `app/api/**`.
- File-backed runtime state under `data/**` is MVP/local-only. Cloudflare Workers do not provide durable writable project files. Production persistence must move to a real adapter before billing/credits are treated as durable production data.
- Keep production flags conservative: do not enable dev credit grants in Cloudflare.

## Cloudflare dashboard settings

When using the GitHub import flow:

- Framework preset: `None` / custom build
- Build command: `npm run cf:build`
- Deploy command: `npx wrangler@latest deploy`
- Output directory: leave empty when deploying with Wrangler / Workers
- Root directory: repository root
- Node.js version: `20` or newer

If the UI asks for a variable during deploy, use only non-secret safe runtime config there. Put secrets into encrypted Cloudflare variables/secrets.

## Required variables

Set these as encrypted Cloudflare secrets or protected variables:

```txt
NEXT_PUBLIC_APP_URL=https://<your-cloudflare-domain>
NEXTAUTH_URL=https://<your-cloudflare-domain>
NEXTAUTH_SECRET=<strong random secret>
NODRAMA_TEST_MODE=false
NODRAMA_DISABLE_FREE_LIMIT=false
NODRAMA_ENABLE_HISTORY=false
NODRAMA_ENABLE_EVENT_LOGGING=false
NODRAMA_ENABLE_CLOUD_HISTORY=false
NODRAMA_ENABLE_DEV_CREDIT_GRANTS=false
NODRAMA_ALLOW_DEV_CREDIT_GRANTS=false
```

Optional integrations stay empty until actually configured:

```txt
OPENAI_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
RESEND_API_KEY=
```

## Local commands

```bash
cd "$HOME/Documents/0_DEV/NoDrama"
npm run verify
npm run cf:build
npm run cf:preview
```

## Production deploy

```bash
cd "$HOME/Documents/0_DEV/NoDrama"
npm run cf:deploy
```

## Rollback

Cloudflare Workers rollback should be done from the Cloudflare dashboard deployment history, or by redeploying the previous Git commit:

```bash
cd "$HOME/Documents/0_DEV/NoDrama"
git checkout <previous-good-sha>
npm run cf:deploy
```

## Hard stop before real billing

Before enabling real paid production usage, replace local file-backed persistence with a durable production adapter. The current append-only ledger foundation is good architecture for migration, but local JSON files are not a distributed production database.
