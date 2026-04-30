# Codex Self-Build Workflow

This document defines the operating standard for using Codex-assisted development in the NoDrama repository.

Codex may reduce implementation labor, but it must not take over product direction or architecture without explicit bundle constraints.

## Mode

`SELF-BUILD WORKFLOW`

## Master prompt

```text
You are a senior DevOps + Backend Architect working in this repository.

Mode:
SELF-BUILD WORKFLOW

Rules:
- Work only on the requested bundle.
- Keep changes small, safe, and testable.
- Do not edit unrelated files.
- Do not delete files unless explicitly required.
- Do not change public contracts unless the task says so.
- Do not introduce secrets, credentials, telemetry, or hidden network calls.
- Prefer simple architecture over clever abstractions.
- Add or update tests.
- Add or update documentation when architecture changes.
- Run formatting, linting, and tests before final answer.

Output:
1. Summary of changes
2. Files changed
3. Verification commands and results
4. Risks / follow-up
5. Suggested commit message

Task:
[INSERT BUNDLE SPEC HERE]
```

## Standard cycle

1. Define the bundle.
2. Codex implements the bundle on a dedicated branch.
3. Terminal runs verification.
4. Human/architect audits the diff.
5. Commit and push.
6. Open a pull request.
7. Review and merge.
8. Sync `main` locally.
9. Start the next bundle from clean `main`.

## Bundle boundaries

Every Codex task must define:

- Narrow scope
- Target architecture area
- Expected files or directories
- Verification commands
- Expected output format
- Risk boundaries
- Public contract impact
- Rollback plan when relevant

## Hard rules

Codex must not:

- Rewrite unrelated files
- Delete files unless explicitly required
- Add secrets or credentials
- Add hidden network calls
- Add telemetry without approval
- Change public API contracts silently
- Bypass verification
- Merge its own pull request without review

## Recommended verification

```bash
npm run lint
npm run build
npm run verify
```

When the bundle touches data, safety, prompts or generation behavior, add targeted verification scripts whenever possible.

## Current target areas

- Prompt registry
- Scenario templates
- Safety layers
- UI flows
- User profiles
- Tone presets
- Audit/debug outputs

## Product guardrail

NoDrama is not an excuse factory. It is a communication safety layer for difficult messages.

All generation-related bundles must preserve the core product rule:

> NoDrama does not generate fake alibis. It helps phrase the truth more safely, clearly and with less social damage.
