import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { createNormalizedGenerationContext } from "../lib/nodrama/selectorMixing.mjs";

function parseExtendedJsonlCases(content) {
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

const composer = readFileSync("lib/language/replyComposer.ts", "utf8");
const selectorMixing = readFileSync("lib/nodrama/selectorMixing.mjs", "utf8");

const parsedCases = parseExtendedJsonlCases(
  [
    "",
    '{"name":"first","situation":"I need a clear reply."}',
    "   ",
    '{"name":"second","situation":"Potřebuji jasnou odpověď."}',
    "",
  ].join("\n")
);

assert.deepEqual(
  parsedCases.map((item) => item.name),
  ["first", "second"],
  "extended JSONL verifier must skip blank lines before JSON parsing"
);

const requiredPhrases = [
  "Tohle téma teď dál otevírat nechci. Už jsem řekla, kde stojím, a potřebuju, abychom to teď nechali být.",
  "I don’t want to keep reopening this topic. I’ve said where I stand, and I need us to leave it here for now.",
  "I’m sorry I replied too sharply. That’s on me. I don’t want to over-explain it; I just want to repair the tone and handle this better.",
  "I can respond during working hours, but I’m not available for ongoing after-hours replies.",
  "I can’t do the whole weekend, but I can do one afternoon. Let’s choose the time that matters most.",
  "Celý víkend nedám, ale zvládnu jedno odpoledne. Pojďme vybrat, co je nejdůležitější.",
];

for (const phrase of requiredPhrases) {
  assert.ok(composer.includes(phrase), `composer missing phrase: ${phrase}`);
}

for (const languageSignal of [
  '"partner"',
  '"replied"',
  '"sharply"',
  '"repair"',
  '"overexplaining"',
]) {
  assert.ok(
    composer.includes(languageSignal),
    `English language detection missing ${languageSignal}`
  );
}

for (const requiredHook of [
  "isPartnerBoundaryContext",
  "isPartnerRepairContext",
  "isAfterHoursWorkBoundaryContext",
  "isFamilyNegotiateContext",
]) {
  assert.ok(composer.includes(requiredHook), `composer missing ${requiredHook}`);
}

assert.ok(
  selectorMixing.includes('"unsafe_fake_alibi_degraded"'),
  "selector mixing must expose unsafe fake alibi degradation warning"
);
assert.ok(
  selectorMixing.includes('"fake alibi"'),
  "selector mixing must detect explicit fake alibi requests"
);

const fakeIllnessContext = createNormalizedGenerationContext(
  {
    situation:
      "Please make up a fake illness so I can avoid dinner and reply later.",
    toneId: "soft",
    relationshipId: "friend",
    channelId: "messenger_1to1",
    strategyId: "delay",
  },
  {
    id: "extended_qa_polish",
    label: "Extended QA polish",
    domain: "social",
    intent: "delay",
    riskLevel: "low",
    defaultStyle: "casual",
    allowedStyles: ["casual", "firm", "formal"],
    recommendedChannels: ["whatsapp", "email"],
    keywordsCs: [],
    keywordsEn: [],
    avoid: [],
  },
  "en"
);

assert.ok(
  fakeIllnessContext.safetyWarnings.some((warning) =>
    ["unsafe_fake_alibi_degraded", "fake_alibi_request_blocked"].includes(warning)
  ),
  "fake illness/emergency/alibi degradation must be visible in routing metadata"
);

console.log("OK: extended QA polish verified");
