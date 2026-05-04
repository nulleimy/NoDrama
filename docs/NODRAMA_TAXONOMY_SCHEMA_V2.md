# NoDrama Taxonomy And Dataset Schema V2

## Scope

This bundle locks the NoDrama Enterprise v2 taxonomy surface for channels,
relationships and response strategies. It also defines the canonical
micro-situation dataset record shape used to scale from broad categories to
specific generation fixtures.

Public contract impact: No public API contract changes.

Out of scope:

- Billing, auth, credits, checkout and database persistence
- UI redesign
- Runtime LLM calls or hidden network calls
- Bulk production data generation

Do not generate 9,000 production situations in this repository bundle. The seed
dataset is intentionally small and representative.

## Locked Taxonomies

Each locked taxonomy must stay at max 8 IDs. IDs are stable, lowercase and
machine-facing. Labels may be localized later without changing the ID.

### Channel

The channel IDs align with the existing generator/content-depth contract:

- `whatsapp`
- `sms`
- `email`
- `slack`

### Relationship

The first four IDs align with the current public generator relationship choices
through the content-depth normalization layer:

- `friend`
- `work`
- `family`
- `dating`
- `service`
- `group`

### Strategy

Strategy IDs describe generation behavior without adding new output contracts:

- `truthful_boundary`
- `direct_boundary`
- `repair_accountability`
- `delay_update`
- `decline_capacity`
- `clarify_intent`
- `reschedule_option`
- `brief_exit`

Every strategy maps to an existing prompt profile. This keeps the dataset
structured while preserving the current deterministic generator behavior.

## Compact Enums

Risk and pressure use the same compact enum:

- `low`
- `medium`
- `high`

`riskLevel` represents safety/product risk. `pressureLevel` represents social
or time pressure. A high pressure record is not automatically unsafe, but it
should prefer short, de-escalating outputs and stricter safety notes.

## Canonical Micro-Situation Schema

The canonical record fields are:

- `id`: Stable dataset ID, prefixed with `msv2-`.
- `title`: Human-readable label for editors and QA.
- `locale`: `cs` or `en`.
- `sourceCategoryId`: Optional existing phrase category ID when available.
- `channelId`: Locked channel ID.
- `relationshipId`: Locked relationship ID.
- `strategyId`: Locked strategy ID.
- `riskLevel`: Compact risk enum.
- `pressureLevel`: Compact pressure enum.
- `scenarioCategory`: Existing content-depth scenario category.
- `intent`: Generation intent.
- `userNeed`: The practical need behind the message.
- `inputPattern`: Representative user input pattern, not private user data.
- `safetyNotes`: Required product safety constraints.
- `expectedOutputContract`: Currently `four_reply_variants`.
- `tags`: Small search/filter tags for QA and future tooling.

The seed sample lives in `lib/nodrama/microSituationSeed.v2.json`. Validation
lives in `lib/nodrama/taxonomySchemaV2.mjs` and is exercised by
`scripts/verify-taxonomy-schema-v2.mjs`.

## Scaling Without UI Chaos

Use this expansion path:

`category -> cluster -> micro-situation`

Categories are broad navigation and matching buckets, such as social plans or
work commitments. Clusters group repeated user needs inside a category, such as
canceling, delaying, declining scope or setting a boundary. Micro-situations are
specific fixtures that combine channel, relationship, pressure, risk, strategy
and safety notes.

Do not expose every micro-situation as a UI option. The UI should stay anchored
to a small number of understandable categories, tones, relationships and
channels. Micro-situations should power matching, QA, dataset coverage and
future editor tooling behind the scenes.

The goal is dataset depth without UI chaos.

To scale safely:

- Keep the visible UI taxonomy small and stable.
- Add micro-situations as backend/editor data, not as new buttons.
- Reuse locked IDs instead of adding one-off labels.
- Validate every record before use.
- Track coverage by category, relationship, channel, risk and pressure.
- Add production-sized datasets outside this bundle and review them separately.

## Verification

Run:

```bash
node scripts/verify-taxonomy-schema-v2.mjs
```

The verifier checks taxonomy size, duplicate IDs, generator-aligned IDs, compact
enums, seed dataset schema validity and required documentation guidance.
