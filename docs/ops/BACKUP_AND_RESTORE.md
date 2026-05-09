# Backup And Restore

NoDrama backups must preserve account and entitlement integrity without storing
unnecessary sensitive communication content.

## Backup Scope

Back up these data classes when storage exists for them:

- User accounts: user id, auth provider id, email or verified contact fields,
  creation time, and account status.
- Credits and billing status: current credit balance, entitlement source,
  purchase identifiers, billing status, and reconciliation timestamps.
- Saved generation history: only entries the user explicitly saved.
- Favorites: user-selected favorite responses or templates.
- Safe event logs: metadata-only operational events used for debugging and
  abuse prevention.
- Local Memory Lane records: browser localStorage metadata-only history when
  exported by the user.

## Data That Must Not Be Stored In Technical Logs

Technical logs must not store:

- Full situation text.
- Generated outputs.
- Secrets, tokens, API keys, session cookies, or provider credentials.
- Payment card data.
- Hidden telemetry payloads.
- Personal private paths from local development machines.

If debugging requires a content sample, use a synthetic non-sensitive example.

## Backup Strategy

- Keep automated backups for production storage once persistent user data exists.
- Keep backups encrypted at rest.
- Restrict restore permissions to trusted operators.
- Test restore against a non-production environment before relying on it.
- Track backup creation time, data source, storage target, and retention window.
- Keep billing and credit snapshots consistent with payment-provider records.

## Restore Strategy

1. Identify the affected data class and time window.
2. Pause writes or disable the affected feature flag if ongoing writes may
   corrupt restored data.
3. Restore to a staging environment first.
4. Validate account count, credit balances, billing statuses, history rows,
   favorite rows, and event-log shape.
5. Restore production only after validation and approval.
6. Reconcile credits and billing status with the payment provider after restore.
7. Record the restore reason, backup id, operator, validation result, and user
   impact.

## Manual Pre-Release Backup Checklist

Use this before releases that touch accounts, credits, billing, saved history,
favorites, event logs, or storage adapters:

- Confirm the latest automated backup completed successfully.
- Confirm the backup contains the affected tables or storage collections.
- Confirm restore credentials are available to the release operator.
- Confirm no schema migration blocks restoring the backup.
- Export a metadata-only snapshot of row counts or collection counts.
- Confirm billing and credit reconciliation plan.
- Confirm rollback owner and decision deadline.
