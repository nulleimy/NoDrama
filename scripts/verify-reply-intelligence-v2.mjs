import assert from "node:assert/strict";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createJiti } from "jiti";

import {
  detectReplyContext,
  qaReplyOutput,
} from "../lib/nodrama/replyIntelligence.mjs";
import { createNormalizedGenerationContext } from "../lib/nodrama/selectorMixing.mjs";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const jiti = createJiti(import.meta.url, {
  alias: {
    "@": repoRoot,
    "@/*": `${repoRoot}/*`,
  },
});
const { generateRequestSchema } = await jiti.import("../lib/generateContract.ts");
const { generatePhraseEngineReply } = await jiti.import(
  "../lib/language/phraseEngine.ts"
);

const deadlineTerms =
  /\b(term[ií]n|deadline|dodat|v[ýy]stup|posunout|deliverable|realistick[ýy] dal[šs][ií] term[ií]n|realistic next date)\b/i;

function generate(overrides) {
  const request = generateRequestSchema.parse({
    situation: overrides.situation,
    toneId: overrides.toneId || "soft",
    relationshipId: overrides.relationshipId || "friend",
    channelId: overrides.channelId || "messenger_1to1",
    strategyId: overrides.strategyId || "soft_decline",
    selectorSources: overrides.selectorSources || {
      tone: "manual",
      relationship: "manual",
      channel: "manual",
      strategy: "manual",
    },
    appLocale: overrides.appLocale || "cs",
  });

  return generatePhraseEngineReply(request, 2, 2);
}

function allOutputText(response) {
  return Object.values(response.output).join(" ");
}

const authorityInvite = generate({
  situation: "Šéf mě pozval na narozeninovou oslavu ale nechci jít",
  relationshipId: "authority",
  channelId: "work_chat",
  strategyId: "delay",
  toneId: "formal",
});
const authorityInviteText = allOutputText(authorityInvite);
assert.equal(
  authorityInvite.meta.contentDepth.selectorMixing.replyIntelligence.detectedContext
    .scenarioFamily,
  "work_social_invitation"
);
assert.equal(
  deadlineTerms.test(authorityInviteText),
  false,
  "authority social invitation must not use deadline or deliverable wording"
);

const workDeadline = generate({
  situation: "Šéf chce výstup z projektu zítra, ale nestíhám termín.",
  relationshipId: "authority",
  channelId: "work_chat",
  strategyId: "delay",
  toneId: "concise",
});
assert.equal(
  workDeadline.meta.contentDepth.selectorMixing.replyIntelligence.detectedContext
    .scenarioFamily,
  "work_deadline_delay"
);
assert.match(
  allOutputText(workDeadline),
  /\b(term[ií]n|v[ýy]stup|realistick|čas|hotov|deadline|timing)\b/i,
  "work deadline delay should use accountable timing language"
);

const friendDecline = generate({
  situation: "Kamarád mě zve na oslavu, ale nechci jít.",
  relationshipId: "friend",
  channelId: "messenger_1to1",
  strategyId: "soft_decline",
  toneId: "soft",
});
assert.equal(
  friendDecline.meta.contentDepth.selectorMixing.replyIntelligence.detectedContext
    .scenarioFamily,
  "social_invitation_decline"
);
assert.equal(
  deadlineTerms.test(allOutputText(friendDecline)),
  false,
  "friend soft decline must not become work deadline delay"
);

const moneyLoan = generate({
  situation: "Kamarád chce půjčit peníze, ale já mu půjčit nechci.",
  relationshipId: "friend",
  channelId: "messenger_1to1",
  strategyId: "hard_boundary",
  toneId: "assertive",
});
assert.equal(
  moneyLoan.meta.contentDepth.selectorMixing.replyIntelligence.detectedContext
    .scenarioFamily,
  "money_refuse_loan"
);
assert.doesNotMatch(
  allOutputText(moneyLoan),
  /\b(rozsah|scope|zad[aá]n[ií]|brief)\b/i,
  "money refusal must not become generic scope wording"
);

const familyBoundary = generate({
  situation: "Máma mě pořád tlačí a vyčítá mi, že nepřijedu na celý víkend.",
  relationshipId: "family",
  channelId: "face_to_face",
  strategyId: "hard_boundary",
  toneId: "assertive",
});
assert.equal(
  familyBoundary.meta.contentDepth.selectorMixing.replyIntelligence.detectedContext
    .scenarioFamily,
  "family_pressure_boundary"
);
assert.doesNotMatch(
  allOutputText(familyBoundary),
  /\b(moc se omlouv[aá]m|cel[eé] je to moje vina|ud[eě]l[aá]m cokoli)\b/i,
  "family pressure boundary must not over-apologize"
);

const clientScope = generate({
  situation:
    "Klient chce přidat další práci mimo rozsah a rozpočet, potřebuji vyjednat cenu a termín.",
  relationshipId: "client",
  channelId: "email",
  strategyId: "negotiate",
  toneId: "formal",
});
assert.equal(
  clientScope.meta.contentDepth.selectorMixing.replyIntelligence.detectedContext
    .scenarioFamily,
  "client_scope_negotiation"
);
assert.match(
  allOutputText(clientScope),
  /\b(rozsah|term[ií]n|rozpočet|cena|zad[aá]n[ií])\b/i,
  "client scope negotiation should use scope, time or price framing"
);

const obviousContext = detectReplyContext(
  "Šéf chce výstup z projektu zítra, nestíhám termín.",
  {
    relationshipId: "authority",
    strategyId: "delay",
    channelId: "work_chat",
  }
);
assert.ok(
  ["medium", "high"].includes(obviousContext.confidence),
  "obvious context should have medium or high confidence"
);
assert.ok(obviousContext.reasons.length > 0, "obvious context should include reasons");

const badQa = qaReplyOutput({
  input: "Šéf mě pozval na narozeninovou oslavu ale nechci jít",
  output: {
    shortReply: "Potřebuji posunout termín.",
    naturalReply: "Dodám výstup později.",
  },
  detected: detectReplyContext("Šéf mě pozval na narozeninovou oslavu ale nechci jít", {
    relationshipId: "authority",
    strategyId: "delay",
    channelId: "work_chat",
  }),
  selected: {
    relationshipId: "authority",
    strategyId: "delay",
    channelId: "work_chat",
    toneId: "formal",
  },
});
assert.equal(badQa.verdict, "rewrite");
assert.ok(
  badQa.forbiddenTermsHit.length > 0,
  "forbidden phrase guards should trigger on mismatched scenario terms"
);

const normalized = createNormalizedGenerationContext(
  generateRequestSchema.parse({
    situation: "Šéf mě pozval na narozeninovou oslavu ale nechci jít",
    toneId: "formal",
    relationshipId: "authority",
    channelId: "work_chat",
    strategyId: "delay",
  }),
  {
    id: "verify",
    label: "Verify",
    domain: "work",
    intent: "delay",
    riskLevel: "low",
    defaultStyle: "neutral",
    allowedStyles: ["neutral"],
    recommendedChannels: ["slack"],
    keywordsCs: [],
    keywordsEn: [],
    avoid: [],
  },
  "cs"
);
assert.equal(normalized.selectors.strategy.id, "soft_decline");
assert.ok(
  normalized.replyIntelligence.routingWarnings.includes(
    "delay_strategy_adapted_to_invitation_decline"
  ),
  "scenario routing guard should adapt invitation delay to soft decline"
);

console.log("✅ Reply Intelligence v2 regression checks passed");
