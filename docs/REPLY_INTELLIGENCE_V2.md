# Reply Intelligence v2

Reply Intelligence v2 keeps NoDrama deterministic and local-first while adding
context detection before generation and a QA pass after generation.

## Runtime Flow

```txt
Situation text
-> deterministic context detector
-> selector suggestions and source tracking
-> scenario routing guards
-> deterministic phrase generation
-> context-fit QA gate
-> local Memory Lane feedback record
```

No runtime LLM calls, network calls, database migrations, payment changes or
public API breaking changes are part of this layer.

## Context Detection

`lib/nodrama/replyIntelligence.mjs` infers:

- `language`
- `domain`
- `scenarioFamily`
- relationship, strategy, channel and tone suggestions
- confidence, matched reasons and warnings

The detector distinguishes work-social invitations from work deadline delays.
For example, `Šéf mě pozval na narozeninovou oslavu ale nechci jít` is routed
as `work_social_invitation`, not `work_deadline_delay`.

## Selector Sources

The generator accepts optional `selectorSources` metadata:

- `auto`
- `manual`
- `default`

The UI applies auto-detected suggestions only while a selector has not been
manually changed. Manual selector changes remain user-controlled.

## QA Gate

The QA gate returns a deterministic `ReplyQaResult` with:

- `verdict`
- context, strategy, relationship, channel, tone and sendability scores
- reasons
- forbidden scenario terms
- mismatch type

Social invitation scenarios reject deadline and deliverable wording unless the
input has real task or deadline signals.

## Memory Lane MVP

The UI stores a small local-only event record in `localStorage` under
`nodrama.replyMemory.v1`. It includes input preview, selected context, inferred
context, QA metadata, output preview and optional feedback chip rating. The UI
also exposes a clear action for this local memory.

## Regression Verification

`scripts/verify-reply-intelligence-v2.mjs` covers the known bad case and the
main routing families from issue #61. It is wired into `npm run verify` through
`scripts/verify.sh`.
