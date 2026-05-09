# Data Retention

NoDrama handles sensitive communication situations. Retention defaults should be
minimal, user-controlled, and easy to explain.

## Current Policy

- User history is user-controlled.
- Sensitive situations are saved only when the user chooses to save them.
- Users can delete saved history when history storage is available.
- Technical logs store metadata-only records.
- Technical logs must not store full situation text, generated outputs, secrets,
  payment data, or hidden telemetry.
- Event logging should support operational safety without creating a shadow copy
  of user conversations.

## Saved History

Saved generation history may include situation text and generated output only
when the user explicitly saves it. Do not infer consent from generating a reply,
opening the app, or starting a session.

## Event Logs

Safe event logs may include metadata such as route name, response status,
feature flag state, timing, coarse error code, and anonymous/session-safe ids.
Do not include full user-entered situations or generated replies.

The current local-first Memory Lane implementation uses localStorage keys
`nodrama.memory-lane.v1` and `nodrama.technical-event-log.v1`. These local
records may include short situation previews, hashes, selector ids, detected
context metadata, QA summaries, feedback reasons, regression candidate flags,
and privacy metadata. They must remain metadata-only unless a separate
user-controlled saved-history feature explicitly stores full content.

## Deletion

Users must be able to delete saved history once history storage exists. Deletion
should remove saved content from primary storage and make it unavailable in the
product UI.

## Future Support

Future account and privacy operations should include:

- Export saved history and favorites.
- Delete account and associated user-controlled history.
- Billing/credit reconciliation during account deletion.
- Retention windows for metadata-only event logs.
- Operator audit records for backup restore and manual support actions.
