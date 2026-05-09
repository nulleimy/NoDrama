# Reply Intelligence v2

This bundle adds deterministic context intelligence around the existing NoDrama generator without changing public API contracts.

## What is added

- Deterministic context auto-detection (`lib/nodrama/replyIntelligence.ts`):
  - language (`cs`/`en`)
  - domain
  - scenario family
  - selector suggestions (relationship, strategy, channel, tone)
  - confidence and reasons
  - ambiguity warnings
- Intent conflict detection between selected strategy and inferred scenario.
- Scenario routing guard that prevents invitation contexts from being rendered as deadline-delay language.
- Deterministic second-pass QA with verdicts (`pass` / `rewrite` / `reject`) and forbidden scenario-term checks.
- Negative phrase guards for invitation, boundary, money, and family-pressure contexts.
- Local-first Memory Lane MVP in UI localStorage (`nodrama.memory-lane.v1`).
- Feedback chips on result cards that persist local-only feedback metadata into Memory Lane records.
  - Supported reasons: `good`, `bad`, `wrong_context`, `too_formal`, `too_harsh`, `not_sendable`.
  - `wrong_context` is marked as a future regression candidate for QA review.
- Regression verifier: `scripts/verify-reply-intelligence-v2.mjs` wired into `npm run verify`.

## Safety constraints preserved

- No runtime LLM calls.
- No hidden network calls.
- No Stripe/payment changes.
- No DB schema migration.
- No public API breaking changes.

## Notes

- Selector auto-suggestions do not override manual user choices.
- QA results and detected context are exposed via generation metadata for internal UI/runtime use.
