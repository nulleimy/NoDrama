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

Each locked taxonomy must stay at exactly 8 IDs once exposed in the public
generator controls. IDs are stable, lowercase and machine-facing. Public control
labels are localized in Czech and English without changing the ID.

### Channel

The channel IDs align with the existing generator/content-depth contract:

- `whatsapp`
- `sms`
- `email`
- `slack`
- `messenger`
- `instagram_dm`
- `signal`
- `teams`

### Relationship

The first four IDs align with the current public generator relationship choices
through the content-depth normalization layer:

- `friend`
- `work`
- `family`
- `dating`
- `service`
- `group`
- `partner`
- `acquaintance`

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
- `defaultStrategyId`: Default locked strategy ID for this situation. It must
  match `strategyId` in seed v1.
- `riskLevel`: Compact risk enum.
- `pressureLevel`: Compact pressure enum.
- `scenarioCategory`: Existing content-depth scenario category.
- `intent`: Generation intent.
- `userNeed`: The practical need behind the message.
- `microSituationText`: Localized high-frequency user situation text.
- `inputPattern`: Representative user input pattern, not private user data.
- `safetyNotes`: Required product safety constraints.
- `recommendedTaxonomies`: Locked channel, relationship and strategy IDs that
  fit the situation.
- `blockedTaxonomies`: Strategy IDs or safety policy IDs that must not be used
  for the situation.
- `examples`: Concise localized `bad`, `good` and `top` examples for QA and
  future editorial review.
- `expectedOutputContract`: Currently `four_reply_variants`.
- `tags`: Small search/filter tags for QA and future tooling.

The seed v1 dataset lives in `lib/nodrama/microSituationSeed.v2.json`.
Validation lives in `lib/nodrama/taxonomySchemaV2.mjs` and is exercised by
`scripts/verify-taxonomy-schema-v2.mjs` and
`scripts/verify-micro-situation-seed-v1.mjs`.

## Seed Dataset V1

Seed v1 is a controlled 100-150 record dataset, not a production-scale corpus.
It provides bilingual (`cs`, `en`) coverage for high-frequency communication
situations across the existing content-depth categories:

- `social_plans`
- `work_commitments`
- `family_boundaries`
- `dating_clarity`
- `service_request`

Each localized record must include truthful situation text, a default strategy,
risk and pressure levels, recommended locked taxonomy references, blocked safety
policy references, and concise bad/good/top examples. Bad examples are included
only as QA contrast cases. They must not be promoted as usable generation
outputs.

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

Recommended expansion checkpoints:

- 300 situations: Add breadth inside the five existing scenario categories.
  Require category, locale, channel, relationship, strategy, risk and pressure
  coverage reports before accepting the dataset.
- 500 situations: Add editorial review batches by cluster, such as canceling,
  declining, delaying, repair and boundaries. Keep each batch separately
  reviewable and require bad/good/top examples for every localized record.
- 9,000 situations: Treat as a production data program, not a code bundle.
  Generate and review outside this repository bundle, sample for safety and
  quality, validate all taxonomy references, and import only after human review.
  Do not generate 9,000 production situations directly in this repo task.

## Verification

Run:

```bash
node scripts/verify-taxonomy-schema-v2.mjs
node scripts/verify-micro-situation-seed-v1.mjs
```

The verifier checks taxonomy size, duplicate IDs, generator-aligned IDs, compact
enums, seed dataset schema validity, controlled seed size, bilingual balance,
scenario coverage, taxonomy references and required documentation guidance.
