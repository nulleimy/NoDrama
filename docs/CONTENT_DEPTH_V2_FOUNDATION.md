# NoDrama Content Depth v2 Foundation

This bundle adds an internal foundation for generation structure without changing the public generate API.

The foundation is intentionally small and deterministic. It does not call an LLM, make network requests, change billing or auth, write to storage, or alter user-facing UI.

## Architecture

Content-depth v2 follows the product flow:

```text
Scenario Intake
-> Context Normalization
-> Safety Check
-> Tone/Intent Selection
-> Output Generator
-> Review/Audit
```

The new files in `lib/nodrama/` prepare the middle of that flow:

- `promptRegistry.ts` defines typed prompt profiles and the output contract each profile is expected to support.
- `scenarioTemplates.ts` defines representative scenario templates with category, intent, relationship, tone, channel and safety notes.
- `safetyLayers.ts` defines declarative safety rules for truthfulness, boundary-setting, conflict reduction, anti-manipulation and non-clinical support.
- `tonePresets.ts` defines metadata for the locked internal 8-tone model.
- `auditDebug.ts` defines a deterministic internal debug shape for selected scenario, tone, relationship, channel, strategy and safety decisions.

## Public contract impact

No public API contract changes.

The existing `app/api/generate` request and response shapes remain unchanged. The new content-depth registry is internal and can be wired into future generator or QA work after review.

## Safety model

The safety layer is declarative so future generator and QA code can apply the same rules consistently.

Current configured layers:

- Truthfulness: avoid fake alibis and fabricated emergencies.
- Boundary setting: support clear limits without unnecessary negotiation loops.
- Conflict reduction: remove blame, threats, insults and escalation.
- Anti-manipulation: block coercion, stalking, blackmail and pressure tactics.
- Non-clinical support: avoid presenting psychological guesses as facts.

## Tone model

The internal locked 8-tone model is:

- Kind
- Direct
- Formal
- Light
- Warm
- Firm
- Calm
- Brief

Each tone has CZ/EN labels, usage guidance, risk notes and blocked contexts. This is metadata only; the current public 4-tone UI contract is unchanged.

## Verification

`scripts/verify-nodrama-content-depth.mjs` checks that:

- Required foundation files exist.
- The internal tone model has exactly 8 unique tones.
- Scenario templates reference existing prompt profiles and tones.
- Prompt profiles reference existing safety layers.
- The internal audit shape remains marked internal-only.

It is wired into `npm run verify` through `scripts/verify.sh`.
