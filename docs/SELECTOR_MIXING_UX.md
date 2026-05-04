# Selector Mixing UX

This bundle keeps the public generator simple: the user writes a situation and answers four compact questions under the text area.

1. How should it sound?
2. Who is it for?
3. Where will I send or say it?
4. What am I trying to do?

Each selector group keeps exactly 8 public options. The UI still sends the existing legacy `tone`, `relationship` and `channel` values for backward compatibility, plus the newer selector IDs.

## Runtime Flow

Selector mixing feeds the MVP generation flow:

```text
User text
-> Fast Context Router
-> Suggested selectors
-> Micro-situation candidate
-> Phrase composer
-> Safety gate
-> Output
```

The normalization layer combines:

- `userText`
- selected tone, relationship, channel and strategy
- inferred language
- inferred domain
- inferred scenario family
- inferred risk
- inferred pressure
- matched micro-situation candidate when available
- safety notes and warnings

The implementation lives in `lib/nodrama/selectorMixing.mjs`. It is deterministic and local-only. It does not call an LLM, make network requests, change billing/auth/credits, write to storage or change database behavior.

## Public Selector Mapping

The public selector controls expose exactly four groups with exactly 8 options each.

Tone:

- `neutral`: Neutrální / Neutral
- `soft`: Jemný / Soft
- `assertive`: Asertivní / Assertive
- `formal`: Formální / Formal
- `apologetic`: Omluvný / Apologetic
- `warm`: Vřelý / Warm
- `concise`: Stručný / Concise
- `playful`: Vtipný / odlehčený / Light / playful

Relationship:

- `authority`: Autorita / Authority
- `peer`: Kolega / spolužák / Peer
- `client`: Klient / zákazník / Client / customer
- `friend`: Kamarád / známý / Friend / acquaintance
- `close_friend`: Blízký kamarád / Close friend
- `partner`: Partner / dating / Partner / dating
- `family`: Rodina / Family
- `stranger_public`: Cizí člověk / veřejnost / Stranger / public

Channel:

- `messenger_1to1`: Soukromá zpráva / Private message
- `group_chat`: Skupinový chat / Group chat
- `email`: E-mail / Email
- `work_chat`: Pracovní appka / Work chat
- `professional_dm`: Profesní DM / Professional DM
- `social_dm`: Sociální DM / Social DM
- `voice_call`: Telefon / Phone / voice
- `face_to_face`: Osobně / Face to face

Strategy:

- `delay`: Získat čas / Buy time
- `soft_decline`: Odmítnout hezky / Decline kindly
- `hard_boundary`: Nastavit hranici / Set a boundary
- `repair`: Omluvit se / napravit / Apologize / repair
- `clarify`: Vyjasnit situaci / Clarify
- `redirect`: Přesměrovat / Redirect
- `negotiate`: Vyjednat podmínky / Negotiate terms
- `exit`: Ukončit to / Exit conversation

## Defaults

Older API clients may omit the newer selector IDs. In that case, the mixer derives stable defaults from the existing legacy request values and matched situation category.

- Strategy defaults from the matched intent: delay/reschedule -> `delay`, apology -> `repair`, boundary/refusal -> `hard_boundary`, clarify/follow-up -> `clarify`, otherwise `soft_decline`.
- Relationship defaults from the category domain: work -> `authority`, business/money -> `client`, digital -> `partner`, otherwise `friend`.
- Channel defaults from relationship: authority/peer -> `work_chat`, client -> `email`, otherwise `messenger_1to1`.
- Tone defaults from strategy first, then professional context: repair -> `apologetic`, hard boundary -> `assertive`, soft decline -> `soft`, delay -> `concise`, email/client/authority -> `formal`, otherwise `neutral`.

Explicit selector IDs override legacy request values and bias inference. The API also accepts nested `selectorMixing.selected` IDs as explicit selections for compatibility with selector-first clients. For example, a text that looks social but has `relationshipId: "client"` is treated as a business/service context.

## Heuristic Routing

Routing is intentionally fast and heuristic, not a full ML scorer.

- Signal keywords identify likely work, business/client, social, family, dating and money contexts.
- Relationship selectors can override domain inference because they express direct user intent.
- Strategy selectors steer the scenario intent used by the composer.
- Micro-situation candidates are chosen by simple overlap across locale, scenario family, strategy, relationship, channel and input text.
- A matched micro-situation can enrich metadata when confidence is medium or high, but it does not override an incompatible explicit strategy.
- Confidence is compact: `high`, `medium` or `low`.

Playful tone is treated as safe lightness, not comedy. It is downgraded to a soft tone for authority, client, money, family pressure, serious repair, hard boundary and high-risk conflict contexts. The downgrade is recorded under `safetyWarnings`.

## Micro-Situation Match

The mixer uses the local `microSituationSeed.v2.json` dataset against the normalized context. Legacy taxonomy IDs in the seed remain compatible with the final 8-option selector IDs.

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

- work deadline + authority + work chat + delay
- friend invitation + friend + private message + soft decline
- partner pressure + partner + private message + hard boundary
- client scope creep + client + email + negotiate
- family guilt pressure + family + face to face + clarify
- playful downgrade for serious authority repair
