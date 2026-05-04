import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { createNormalizedGenerationContext } from "../lib/nodrama/selectorMixing.mjs";

const composer = readFileSync("lib/language/replyComposer.ts", "utf8");

const baseCategory = {
  id: "targeted_regression",
  label: "Targeted regression",
  domain: "social",
  intent: "decline",
  riskLevel: "low",
  defaultStyle: "casual",
  allowedStyles: ["casual", "firm", "formal"],
  recommendedChannels: ["whatsapp", "email"],
  keywordsCs: [],
  keywordsEn: [],
  avoid: [],
};

const antiDeceptionCases = [
  {
    name: "CZ nechci lhat",
    language: "cs",
    situation: "Kamarád mě zve ven. Nechci lhát ani ho urazit.",
  },
  {
    name: "CZ bez lzi",
    language: "cs",
    situation: "Potřebuji odmítnout pozvání bez lži a pravdivě.",
  },
  {
    name: "EN without fake excuse",
    language: "en",
    situation:
      "A friend invited me out, and I want to decline kindly without making up a fake excuse.",
  },
  {
    name: "EN truthful",
    language: "en",
    situation: "I need a truthful decline. I don't want to lie.",
  },
];

const safeExcuseCases = [
  "I need a polite excuse for leaving the group chat early.",
  "Can you write a low-detail reason to decline dinner politely?",
  "Potřebuji slušnou výmluvu, proč dnes nepřijdu.",
  "Napiš mi měkké odmítnutí bez detailů.",
];

for (const scenario of antiDeceptionCases) {
  const context = createNormalizedGenerationContext(
    {
      situation: scenario.situation,
      toneId: "soft",
      relationshipId: "friend",
      channelId: "messenger_1to1",
      strategyId: "soft_decline",
    },
    baseCategory,
    scenario.language
  );

  assert.ok(
    context.signalKeywords.includes("anti_deception"),
    `${scenario.name}: missing anti_deception signal`
  );
  assert.ok(
    context.safetyWarnings.includes("anti_deception_truthful_reply_preferred"),
    `${scenario.name}: missing truthful reply guidance warning`
  );
  assert.ok(
    !context.safetyWarnings.includes("fake_alibi_request_blocked"),
    `${scenario.name}: anti-deception phrasing must not be blocked as fake alibi`
  );
}

for (const situation of safeExcuseCases) {
  const context = createNormalizedGenerationContext(
    {
      situation,
      toneId: "soft",
      relationshipId: "friend",
      channelId: "messenger_1to1",
      strategyId: "soft_decline",
    },
    baseCategory,
    /[áčďéěíňóřšťúůýž]/i.test(situation) ? "cs" : "en"
  );

  assert.ok(
    !context.safetyWarnings.includes("fake_alibi_request_blocked"),
    `${situation}: safe excuse wording must not be blocked`
  );
  assert.ok(
    !context.safetyWarnings.some((warning) => warning.includes("blocked")),
    `${situation}: safe excuse wording must not trigger a safety refusal`
  );
}

const explicitFakeContext = createNormalizedGenerationContext(
  {
    situation: "I need you to make up a fake excuse so I can skip dinner.",
    toneId: "soft",
    relationshipId: "friend",
    channelId: "messenger_1to1",
    strategyId: "soft_decline",
  },
  baseCategory,
  "en"
);

assert.ok(
  explicitFakeContext.safetyWarnings.includes("fake_alibi_request_blocked"),
  "explicit fake excuse request should still be blocked"
);

for (const requiredPhrase of [
  "Dneska to nakonec nedám. Nechci si vymýšlet důvody ani to zbytečně natahovat, tak říkám rovnou, že tentokrát vynechám. Díky za pozvání.",
  "I’m going to sit this one out tonight. I don’t want to make up a story or drag it out, so I’m saying it directly. Thanks for inviting me.",
  "Chápu, že tě to mrzí, ale tento víkend nepřijedu. Nechci se kvůli tomu hádat, jen ti to říkám rovnou.",
  "I understand you’re disappointed, but I’m not visiting this weekend. I don’t want this to turn into an argument, so I’m saying it clearly.",
  "Už jsem říkala, že nepřijdu, a nechci to dál řešit dokola. Prosím respektuj to.",
  "I already said I can’t come, and I need you to respect that.",
  "I can take this on if we adjust the scope, timing, or budget.",
  "I’m sorry, this is on my side.",
]) {
  assert.ok(
    composer.includes(requiredPhrase),
    `composer missing targeted phrase: ${requiredPhrase}`
  );
}

for (const requiredHook of [
  "isFamilyDeclineContext",
  "isSocialBoundaryContext",
  "composeCzechNegotiate",
  "composeEnglishNegotiate",
  "composeCzechRepair",
  "composeEnglishRepair",
]) {
  assert.ok(composer.includes(requiredHook), `composer missing ${requiredHook}`);
}

console.log("OK: safety polarity and domain-specific phrases verified");
