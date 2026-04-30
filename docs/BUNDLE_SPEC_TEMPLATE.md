# Bundle Spec Template

Use this template for every Codex-assisted implementation bundle.

## Bundle name

`[short-name]`

## Goal

Describe the concrete outcome in 2-5 sentences.

## Operating model

Codex is the implementation engine.

Planning, architecture, diff audit and merge control remain human-led.

This keeps the workflow fast while preventing uncontrolled architecture drift.

## Scope

In scope:

- ...

Out of scope:

- ...

## Target files / directories

Expected areas:

- `docs/...`
- `lib/...`
- `components/...`
- `app/...`
- `scripts/...`

## Public contract impact

Choose one:

- No public contract changes
- API response contract changes
- API request contract changes
- UI-only changes
- Data model changes

If contracts change, document migration and compatibility.

## Safety / product rules

The bundle must preserve NoDrama's product guardrails:

- Truthful communication support
- Conflict reduction
- Boundary setting
- Socially safe phrasing
- No manipulative or deceptive behavior patterns
- No hidden credentials, telemetry or network calls

Core product rule:

> NoDrama does not generate fake alibis. It helps phrase the truth more safely, clearly and with less social damage.

## Verification commands

Required by default:

```bash
npm run lint
npm run build
npm run verify
```

Add targeted verification when the bundle touches:

- Generation behavior
- Prompt registry
- Safety layers
- Scenario templates
- API contracts
- Billing / entitlements
- User profiles

## Expected Codex output

Codex must return:

1. Summary of changes
2. Files changed
3. Verification commands and results
4. Risks / follow-up
5. Suggested commit message

## Rollback plan

Describe how to revert this bundle safely:

- Revert PR
- Restore previous config
- Remove feature flag
- Roll back data migration when relevant

## Suggested commit message

`type(scope): short summary`

Example:

`docs(codex): add self-build workflow standard`
