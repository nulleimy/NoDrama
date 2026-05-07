# Incident Runbook

Use this runbook for production or preview incidents. Prefer feature flag
disablement before deployment rollback when the incident is isolated to a gated
feature.

## Broken Deploy

1. Confirm the failing deployment id and the last known good deployment.
2. Check build logs, runtime logs, and recent environment variable changes.
3. Disable recently enabled feature flags.
4. If the app remains broken, roll back to the last known good deployment.
5. Run the post-deploy smoke test after rollback.
6. Open a follow-up issue with root cause and prevention work.

## Generate Endpoint Failing

1. Check `/api/generate` status, error rate, and response envelope.
2. Confirm the request contract was not changed without client updates.
3. Confirm free-limit and credit dependencies are reachable.
4. Disable experimental generation flags such as
   `NODRAMA_ENABLE_PHRASE_REALIZER`.
5. Roll back the deployment if the endpoint still returns server errors.
6. Verify logs do not contain full situation text or generated output.

## Free Limit Or Billing Issue

1. Confirm whether users are blocked incorrectly or receiving excess access.
2. Set `NODRAMA_DISABLE_FREE_LIMIT=false` in production if it was enabled.
3. Check credit balance reads and purchase reconciliation.
4. Pause promotional or test flags until the issue is understood.
5. Avoid manual credit mutation until the affected users and source of truth are
   confirmed.
6. Reconcile affected accounts after the fix.

## Data Or History Issue

1. Disable `NODRAMA_ENABLE_HISTORY` or `NODRAMA_ENABLE_CLOUD_HISTORY`.
2. Stop writes to the affected storage if corruption is suspected.
3. Identify impacted users and time range.
4. Validate backup availability before attempting repair.
5. Restore in staging first, then production only with approval.
6. Confirm users can delete affected history after service is stable.

## Leaked Secret Suspicion

1. Treat the secret as exposed until proven otherwise.
2. Rotate the suspected secret in the provider and deployment platform.
3. Redeploy with the new secret.
4. Revoke old tokens and sessions where applicable.
5. Search git history and deployment logs for accidental exposure.
6. Document scope, rotation time, and residual risk.

## Rollback

1. Prefer disabling the responsible feature flag when it fully mitigates impact.
2. If rollback is required, select the last known good deployment.
3. Confirm whether storage changes require restore or compatibility handling.
4. Roll back deployment.
5. Run the post-deploy smoke test.
6. Keep the incident open until root cause and prevention tasks are captured.

## Disabling Feature Flags

Set the relevant variable to `false` in the deployment environment and redeploy
or restart if required by the platform:

- `NODRAMA_TEST_MODE`
- `NODRAMA_DISABLE_FREE_LIMIT`
- `NODRAMA_ENABLE_HISTORY`
- `NODRAMA_ENABLE_EVENT_LOGGING`
- `NODRAMA_ENABLE_CLOUD_HISTORY`
- `NODRAMA_ENABLE_PHRASE_REALIZER`
