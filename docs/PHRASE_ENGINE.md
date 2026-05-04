# NoDrama — Mini Phrase Engine

## Purpose

The mini phrase engine is the first deterministic language engine for NoDrama.

It avoids live AI cost by matching user input to a situation category, mapping UI tone to a reply style, selecting phrases from the curated phrase bank, applying style restrictions, filtering cringe patterns, and composing deterministic reply variants.

## Current flow

User text -> Fast Context Router -> Suggested selectors -> Micro-situation candidate -> Phrase composer -> Safety gate -> Output

Explicit selector IDs from the request, including nested `selectorMixing.selected`, are treated as user intent and win over inferred suggestions. Inferred micro-situations can add confidence, domain, risk and safety metadata, but they do not override an incompatible explicit strategy.

## Generator quality v1

The response composer now uses the content-depth context to shape the four existing reply variants without changing the public API.

It keeps the same output keys:

- `shortReply`
- `naturalReply`
- `strongReply`
- `followUpReply`

The composer chooses a deterministic family from the final strategy ID first:

- `repair`
- `soft_decline`
- `hard_boundary`
- `delay`
- `negotiate`
- `clarify`
- `redirect`
- `exit`

Domain and legacy category matching remain fallback context for wording, not the primary family selector.

It also detects whether the situation is likely Czech or English and keeps the generated replies in that language. Tone, channel, relationship and content-depth scenario category influence whether the wording is more informal, formal, warm or firm.

The safety gate degrades fake alibis, coercion, manipulation and blame shifting into truthful, non-coercive wording.

Representative behavior:

- CZ repair: "Omlouvám se..." with ownership and a concrete next step.
- EN delay: "I need more time..." with realistic timing instead of fake excuses.
- CZ decline: warm refusal that stays short and copy-paste ready.
- EN boundary: clear boundary without pressure, diagnosis or manipulation.
- Client/work: scope, timing and capacity language that avoids unrealistic promises.

## Current limits

The seed phrase bank is intentionally small, but now includes richer CZ/EN phrase patterns for repair, delay, reschedule, decline and boundary families.

Bundle 6 should expand it toward roughly 3000 phrase candidates:

100 categories x 6 styles x 5 phrases.

## Monetization hook

The API still enforces the free daily server-side limit.

For local and development verification only, `NODRAMA_TEST_MODE=true` or `NODRAMA_DISABLE_FREE_LIMIT=true` lets `/api/generate` skip the free daily attempt block. The bypass is opt-in and does not change billing, checkout, credits or production monetization behavior.

That means the product can test the value moment, daily limit, paywall trigger, and phrase engine quality without OpenAI cost.
