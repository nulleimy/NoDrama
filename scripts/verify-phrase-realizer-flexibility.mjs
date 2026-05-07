import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);
const { realizeReplyVariants } = await jiti.import(
  "../lib/language/phraseRealizer.ts"
);

function fail(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

const baseCategory = {
  id: "verify",
  label: "Verify",
  domain: "social",
  intent: "decline",
  riskLevel: "low",
  defaultStyle: "neutral",
  allowedStyles: ["neutral"],
  recommendedChannels: ["whatsapp"],
  keywordsCs: [],
  keywordsEn: [],
  avoid: [],
};

const fallback = {
  shortReply: "fallback short",
  naturalReply: "fallback natural",
  strongReply: "fallback strong",
  followUpReply: "fallback follow",
};

function makeInput(overrides = {}) {
  const request = {
    situation: "Need a clear reply without pressure.",
    tone: "Milý",
    relationship: "Kamarádi",
    channel: "WhatsApp",
    appLocale: "en",
    toneId: "neutral",
    relationshipId: "friend",
    channelId: "messenger_1to1",
    strategyId: "soft_decline",
    ...overrides.request,
  };

  return {
    request,
    category: { ...baseCategory, ...overrides.category },
    language: overrides.language || request.appLocale || "en",
    style: overrides.style || "neutral",
    channel: overrides.channel || "whatsapp",
    composed: fallback,
    contentDepth: {
      scenarioCategory: "social_plans",
      tonePresetId: "kind",
      selectorMixing: {
        inferredDomain: "social",
        selectors: {
          tone: { id: request.toneId },
          relationship: { id: request.relationshipId },
          channel: { id: request.channelId },
          strategy: { id: request.strategyId },
        },
      },
    },
  };
}

function allText(output) {
  return Object.values(output).join("\n");
}

function assertDifferentVariants(output, label) {
  const values = Object.values(output);
  if (new Set(values).size !== values.length) {
    fail(`${label}: reply variants should differ.`);
  }

  if (output.naturalReply.length <= output.shortReply.length) {
    fail(`${label}: naturalReply should be richer than shortReply.`);
  }

  if (!/(jasn|respekt|clear|respect|boundary|neměním|not changing|firm|answer is no)/i.test(output.strongReply)) {
    fail(`${label}: strongReply should be firmer than naturalReply.`);
  }

  if (output.followUpReply === output.naturalReply || output.followUpReply === output.shortReply) {
    fail(`${label}: followUpReply should answer pressure, not duplicate main reply.`);
  }
}

const czFormal = realizeReplyVariants(
  makeInput({
    request: {
      situation: "Potřebuji odmítnout požadavek od vedoucího e-mailem.",
      appLocale: "cs",
      toneId: "formal",
      relationshipId: "authority",
      channelId: "email",
      strategyId: "soft_decline",
    },
    language: "cs",
    style: "formal",
    channel: "email",
  })
);

if (!/(Dobrý den|Děkuji|prosím vás|respektujte|Děkuji za pochopení)/.test(allText(czFormal))) {
  fail("CZ formal authority email should use formal address.");
}

const czFriend = realizeReplyVariants(
  makeInput({
    request: {
      situation: "Kamarád mě tlačí do akce a já chci přirozeně odmítnout.",
      appLocale: "cs",
      toneId: "warm",
      relationshipId: "friend",
      channelId: "messenger_1to1",
      strategyId: "soft_decline",
    },
    language: "cs",
  })
);

if (!/(Díky|Hele|Chápu|ty|tě|respektuj|ozval)/i.test(allText(czFriend))) {
  fail("CZ friend messenger should sound informal and natural.");
}

if (/[A-Za-zÁ-ž]+\/[a-zá-ž]+/.test(allText(czFriend))) {
  fail("CZ unknown gender should avoid slash forms.");
}

const enDecline = realizeReplyVariants(makeInput());

if (/[áčďéěíňóřšťúůýž]|\b(prosím|děkuji|nechci|potřebuji|můžeš|můžete)\b/i.test(allText(enDecline))) {
  fail("EN outputs must remain English.");
}

const enRepairPartner = realizeReplyVariants(
  makeInput({
    request: {
      situation: "I replied too sharply to my partner and need to repair it.",
      appLocale: "en",
      toneId: "apologetic",
      relationshipId: "partner",
      channelId: "messenger_1to1",
      strategyId: "repair",
    },
    category: { intent: "apology" },
    language: "en",
  })
);

if (!/\b(sorry|repair|responsibility|tone|fix|impact)\b/i.test(allText(enRepairPartner))) {
  fail("EN repair/partner case should use idiomatic English repair wording.");
}

const playful = realizeReplyVariants(
  makeInput({
    request: {
      situation: "Friend wants more than I can do.",
      appLocale: "en",
      toneId: "playful",
      relationshipId: "friend",
      channelId: "messenger_1to1",
      strategyId: "negotiate",
    },
    category: { intent: "negotiate" },
    language: "en",
  })
);

if (!/(reality check|tapping the brakes|No drama)/i.test(allText(playful))) {
  fail("Playful tone should be light.");
}

if (/(lol|haha|silly|goofy|oopsie)/i.test(allText(playful))) {
  fail("Playful tone should not be silly.");
}

assertDifferentVariants(czFormal, "CZ formal");
assertDifferentVariants(czFriend, "CZ friend");
assertDifferentVariants(enDecline, "EN decline");
assertDifferentVariants(playful, "EN playful");

if (czFriend.shortReply === enDecline.shortReply || /Tentokrát do toho nepůjdu/.test(enDecline.shortReply)) {
  fail("CZ and EN variants should not be literal translations or cross-locale fallbacks.");
}

console.log("✅ Phrase realizer flexibility verified");
