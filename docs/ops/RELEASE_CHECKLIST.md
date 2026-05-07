# Release Checklist

Use this checklist for every NoDrama preview or production release.

## Pre-Release

- Confirm the branch contains only the intended bundle.
- Review `.env.example` and deployed environment variables for new requirements.
- Confirm no real secrets, private user data, or local paths are included.
- Run `npm run verify`.
- Run `npm run lint`.
- Run `npm run build`.
- Run `git diff --check`.
- If database, billing, account, history, favorite, or event-log storage changed,
  complete the backup checklist in `docs/ops/BACKUP_AND_RESTORE.md`.
- If migrations exist, confirm forward migration, rollback path, and backup
  restore procedure before deploy.

## Preview Deploy Check

- Deploy to preview from the release branch.
- Confirm `NEXTAUTH_URL` matches the preview origin.
- Confirm production-only flags are not accidentally enabled.
- Run the optional local/API smoke check against the preview URL only if the
  environment is configured for safe test traffic.
- Manually test `/api/generate` with a non-sensitive sample situation.
- Confirm auth entry points still render.
- Confirm free-limit and credit status UI does not regress.

## Production Deploy Check

- Confirm approval to promote the preview build.
- Confirm deployed secrets are present and not expired.
- Confirm `NODRAMA_TEST_MODE=false`.
- Confirm `NODRAMA_DISABLE_FREE_LIMIT=false`.
- Confirm billing/free-limit flags match the release decision.
- Deploy using the standard hosting platform flow.

## Post-Deploy Smoke Test

- Open the production app.
- Submit one small, non-sensitive generate request.
- Confirm response envelope is valid.
- Confirm free-limit/credit state behaves as expected.
- Confirm server logs contain metadata only, not full situation text or generated
  output.
- Check error rate, latency, and deployment health.

## Rollback Plan

- Identify the last known good deployment before release.
- Confirm rollback can be performed without data migration conflicts.
- If the release included a storage change, confirm whether rollback requires a
  restore or a compatibility shim.
- Roll back feature flags first when possible.
- Roll back deployment if flags do not resolve the incident.
- Document incident timing, affected users, and follow-up tasks.
