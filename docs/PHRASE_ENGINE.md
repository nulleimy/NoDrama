# NoDrama — Mini Phrase Engine

## Purpose

The mini phrase engine is the first deterministic language engine for NoDrama.

It avoids live AI cost by matching user input to a situation category, mapping UI tone to a reply style, selecting phrases from the curated phrase bank, applying style restrictions, filtering cringe patterns, and composing deterministic reply variants.

## Current flow

input -> category matcher -> UI tone mapper -> channel mapper -> content-depth context -> phrase selector -> anti-cringe -> response composer

## Generator quality v1

The response composer now uses the content-depth context to shape the four existing reply variants without changing the public API.

It keeps the same output keys:

- `shortReply`
- `naturalReply`
- `strongReply`
- `followUpReply`

The composer chooses a deterministic family from the matched situation:

- apology / repair
- delay / reschedule
- soft decline
- boundary
- client / work message

It also detects whether the situation is likely Czech or English and keeps the generated replies in that language. Tone, channel, relationship and content-depth scenario category influence whether the wording is more informal, formal, warm or firm.

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

That means the product can test the value moment, daily limit, paywall trigger, and phrase engine quality without OpenAI cost.
