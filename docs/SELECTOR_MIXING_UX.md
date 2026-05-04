# Selector Mixing UX

This bundle keeps the public generator simple: the user writes a situation and answers four compact questions under the text area.

1. How should it sound?
2. Who is it for?
3. Where will I send or say it?
4. What am I trying to do?

Each selector group keeps exactly 8 public options. The UI still sends the existing legacy `tone`, `relationship` and `channel` values for backward compatibility, plus the newer selector IDs.

## Runtime Flow

Selector mixing follows the NoDrama generation flow:

```text
Scenario Intake
-> Context Normalization
-> Safety Check
-> Tone/Intent Selection
-> Output Generator
-> Review/Audit
```

The normalization layer combines:

- situation text
- selected tone
- selected relationship
- selected channel
- selected strategy
- matched micro-situation
- safety/risk layer

The implementation lives in `lib/nodrama/selectorMixing.mjs`. It is deterministic and local-only. It does not call an LLM, make network requests, change billing/auth/credits, write to storage or change database behavior.

## Defaults

Older API clients may omit the newer selector IDs. In that case, the mixer derives stable defaults from the existing legacy request values and matched situation category.

- Strategy defaults from the matched intent: delay/reschedule -> `delay`, apology -> `repair`, boundary/refusal -> `hard_boundary`, clarify/follow-up -> `clarify`, otherwise `soft_decline`.
- Relationship defaults from the category domain: work -> `authority`, business/money -> `client`, digital -> `partner`, otherwise `friend`.
- Channel defaults from relationship: authority/peer -> `work_chat`, client -> `email`, otherwise `messenger_1to1`.
- Tone defaults from strategy first, then professional context: repair -> `apologetic`, hard boundary -> `assertive`, soft decline -> `soft`, delay -> `concise`, email/client/authority -> `formal`, otherwise `neutral`.

## Micro-Situation Match

The mixer scores the local `microSituationSeed.v2.json` dataset against the normalized context. It rewards matching locale, scenario category, intent, relationship, channel, strategy and input text overlap. Legacy taxonomy IDs in the seed remain compatible with the final 8-option selector IDs.

The selected micro-situation contributes risk level, pressure level, safety notes and blocked safety policy IDs. These values are exposed only under the existing optional response `meta.contentDepth.selectorMixing` metadata.

## Public Contract Impact

No public API contract changes.

The generator request still accepts the existing `situation`, `tone`, `relationship` and `channel` fields. The newer selector ID fields remain optional. The response keeps the same top-level shape and four output variants. Selector-mixing details are added only inside existing optional `meta` / debug metadata.

## Verification

Run:

```bash
npm run lint
npm run build
npm run verify
node scripts/verify-selector-mixing-ux.mjs
```

The targeted selector-mixing check covers:

- work delay
- friend soft decline
- partner boundary
