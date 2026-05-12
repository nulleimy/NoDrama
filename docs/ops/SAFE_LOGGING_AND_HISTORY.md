# Safe Logging And History

NoDrama generation history is local-first and metadata-first. Bundle 2 adds a safe foundation for generation event records without adding cloud history, database storage, external telemetry, or hidden network calls.

## What Is Stored

The technical generation event shape is `GenerationEvent` in `lib/nodrama/generationEvents.ts`. A local event may store:

- `id` and `createdAt`.
- Source (`ui`, `api`, `cli`, or `test`) and locale (`cs` or `en`).
- `situationPreview`, capped to a short whitespace-normalized preview.
- `situationHash`, used only as a local fingerprint.
- `situationLength`.
- Selected tone, relationship, channel, and strategy ids.
- Detected context metadata such as domain, scenario family, suggestions, confidence, and warnings.
- QA summary metadata: worst verdict, minimum context fit, minimum sendability, and forbidden term hits.
- Feedback reason metadata and `regressionCandidate` flag.
- Privacy metadata showing whether full situation text or generated output is stored.

## What Is Not Stored

Technical event logs are metadata-only. They must not store:

- Full situation text.
- Full generated replies.
- Generated output previews.
- Secrets, credentials, tokens, API keys, session cookies, or payment data.
- Hidden telemetry payloads.
- Private local filesystem paths.

If user-visible saved replies are added later, they must remain separate from the technical event log. A future `userSavedHistory` store may include outputs only after a clear user action.

## localStorage Memory Lane

The current Memory Lane MVP stores local records in `localStorage` under `nodrama.memory-lane.v1`. It mirrors safe generation metadata for product-local review and feedback workflows.

The UI also keeps a technical event log under `nodrama.technical-event-log.v1`. Both stores are local-only browser storage. They are not sent to the server by the Memory Lane controls.

Each Memory Lane record includes privacy metadata:

- `storesFullSituation: false`
- `storesGeneratedOutput: false`
- `storage: "localStorage"`

## Feedback Reasons

Supported local feedback reasons are:

- `good`
- `bad`
- `wrong_context`
- `too_formal`
- `too_harsh`
- `not_sendable`

Feedback is stored as metadata on the local Memory Lane record and matching technical event log record. It does not add full user text or generated replies.

## Regression Candidates

Feedback marked `wrong_context` or `bad` is flagged as `regressionCandidate: true`. This is a local metadata marker for future QA review. It is not a cloud upload, not telemetry, and not a regression test by itself.

The UI includes a local-only control for clearing regression candidate flags without deleting the rest of local history.

The Memory Lane UI also includes a local-only regression candidate export for problematic feedback cases. It exports records where a feedback event is explicitly marked `regressionCandidate: true`, or where the saved rating is `wrong_context`, `bad`, or `not_sendable`.

The export is metadata/minimized JSON named `nodrama-regression-candidates-YYYY-MM-DD.json`. It keeps identifiers, creation time, locale, minimized situation preview, situation hash when available, selected context, inferred context, QA summary, feedback events, ratings, variant key, and the reason the record was selected. It avoids full raw user content and does not include full generated replies.

No server upload happens during this export. The browser reads localStorage, creates a local JSON `Blob`, and triggers a download without adding a backend endpoint, DB persistence, cloud sync, or telemetry call.

## Runtime Smoke Report

`npm run smoke:generate -- --write-report` writes a local report to:

```text
data/runtime/smoke-results/latest.json
```

The report includes:

- Run id and creation time.
- API base URL.
- Total, pass, and fail counts.
- Per-scenario id, input preview, input hash, HTTP status, response `ok`, detected scenario family, detected domain, detected confidence, forbidden hits, and pass/fail status.

The runtime smoke matrix is manual and requires a running local app server. It is not part of `npm run verify`, so deterministic verification does not depend on a live server. The report does not store full situation text or full generated outputs. The runtime report directory is gitignored and should not be committed by default.

## Delete/export Expectations

Delete/export controls are local-only:

- Clear history removes `nodrama.memory-lane.v1` and `nodrama.technical-event-log.v1`.
- Clear feedback removes feedback metadata from local records.
- Clear regression candidates removes only regression candidate flags.
- Export JSON creates a local browser download containing local records and privacy metadata.

Delete/export actions do not call an API and do not create cloud history.

## Future DB/cloud history Requirements

Future DB/cloud history must preserve the same privacy boundary:

- Keep technical event logs metadata-only.
- Store full situation text or generated replies only in a separate user-controlled saved-history model.
- Require explicit user action before saving full content.
- Add retention windows and deletion paths before enabling cloud storage.
- Add export behavior for user-controlled saved history.
- Keep audit records about storage operations separate from sensitive message content.
- Do not introduce external telemetry as part of history persistence.
