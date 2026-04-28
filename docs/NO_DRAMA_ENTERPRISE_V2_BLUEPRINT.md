# NoDrama Enterprise v2.0 Blueprint

## Locked enums (max 8)

- tone: kind, friendly, assertive, formal, apologetic, funny, absurd, minimal
- relationship: authority, peer, client, friend, close_friend, partner, family, stranger_public
- channel: messenger_1to1, group_chat, email, work_chat, professional_dm, social_dm, voice_call, face_to_face
- strategy: delay, soft_decline, hard_boundary, redirect, repair, exit, negotiate, clarify
- language: cs, en

## Runtime formula

`CATEGORY × MICRO-SITUATION × STRATEGY × TONE × RELATIONSHIP × CHANNEL × LANGUAGE`

The app stores micro-situations + taxonomies + constraints, and generates output dynamically at runtime.

## Ethical hard rules

NoDrama does not generate fake alibis.

Forbidden:

- fake illness/accident/death
- gaslighting
- impersonation
- legal or financial manipulation

## Current implementation in this repo

- `lib/enterprise/situations.ts` stores typed bilingual micro-situations with constraints and bad/good/top examples.
- `lib/enterprise/multiApplicator.ts` picks the best matching micro-situation and creates runtime variants.
- `lib/language/phraseEngine.ts` exposes enterprise output through `/api/generate`.
- `lib/generateContract.ts` contains stable enums + backward compatibility for legacy payloads.

## Next scale step

To reach full Enterprise v2.0 target (9,000 situations), expand `microSituations` by category packs generated from controlled templates and pass every new pack through QA checks.
