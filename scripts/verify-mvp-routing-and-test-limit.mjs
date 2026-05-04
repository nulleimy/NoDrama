import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  isLocalGenerationLimitBypassed,
  shouldBlockFreeGeneration,
} from "../lib/generationLimit.ts";
import { createNormalizedGenerationContext } from "../lib/nodrama/selectorMixing.mjs";

const source = {
  route: readFileSync("app/api/generate/route.ts", "utf8"),
  composer: readFileSync("lib/language/replyComposer.ts", "utf8"),
  engine: readFileSync("lib/language/phraseEngine.ts", "utf8"),
  contract: readFileSync("lib/generateContract.ts", "utf8"),
  selectorMixing: readFileSync("lib/nodrama/selectorMixing.mjs", "utf8"),
};

assert.equal(
  shouldBlockFreeGeneration({
    currentUsage: 2,
    creditConsumed: false,
    freeLimit: 2,
    limitBypassed: false,
  }),
  true,
  "default free limit should still block after two attempts"
);
assert.equal(
  shouldBlockFreeGeneration({
    currentUsage: 2,
    creditConsumed: false,
    freeLimit: 2,
    limitBypassed: true,
  }),
  false,
  "local bypass should allow generation after the free limit"
);
assert.equal(
  isLocalGenerationLimitBypassed({ NODRAMA_TEST_MODE: "true" }),
  true,
  "NODRAMA_TEST_MODE=true should enable bypass"
);
assert.equal(
  isLocalGenerationLimitBypassed({ NODRAMA_DISABLE_FREE_LIMIT: "true" }),
  true,
  "NODRAMA_DISABLE_FREE_LIMIT=true should enable bypass"
);
assert.equal(
  isLocalGenerationLimitBypassed({ NODRAMA_TEST_MODE: "false" }),
  false,
  "bypass flags should be opt-in"
);

for (const required of [
  "isLocalGenerationLimitBypassed",
  "shouldBlockFreeGeneration",
  "limitBypassed",
]) {
  assert.ok(source.route.includes(required), `generate route missing ${required}`);
}

for (const required of [
  "selectorMixing",
  "selected",
  "toneId",
  "relationshipId",
  "channelId",
  "strategyId",
]) {
  assert.ok(source.contract.includes(required), `contract missing ${required}`);
}

const familyResolver = source.composer.slice(
  source.composer.indexOf("function resolveReplyFamily"),
  source.composer.indexOf("function isFormalContext")
);
assert.ok(
  familyResolver.indexOf('strategyId === "repair"') <
    familyResolver.indexOf('domain === "work"'),
  "strategy routing must run before domain fallback"
);

for (const required of [
  'strategyId === "repair"',
  'strategyId === "soft_decline"',
  'strategyId === "hard_boundary"',
  'strategyId === "delay"',
  'strategyId === "negotiate"',
  'strategyId === "clarify"',
  'strategyId === "redirect"',
  'strategyId === "exit"',
  "composeCzechRedirect",
  "composeEnglishRedirect",
  "composeCzechExit",
  "composeEnglishExit",
  "isMoneyContext",
  "composeSafetyDegradedReply",
]) {
  assert.ok(source.composer.includes(required), `composer missing ${required}`);
}

for (const required of [
  "mapStrategyToPhraseIntent",
  "mapSelectorStrategyToIntent",
]) {
  assert.ok(source.engine.includes(required), `phrase engine missing ${required}`);
}

for (const required of [
  "selectExplicitId",
  "selectorMixing?.selected",
  "fake_alibi_request_blocked",
  "coercive_request_degraded",
  "blame_shifting_request_degraded",
]) {
  assert.ok(source.selectorMixing.includes(required), `selector mixing missing ${required}`);
}

const repairWorkCategory = {
  id: "work_repair",
  label: "Work repair",
  domain: "work",
  intent: "decline",
  riskLevel: "low",
  defaultStyle: "formal",
  allowedStyles: ["formal", "firm"],
  recommendedChannels: ["email", "slack"],
  keywordsCs: [],
  keywordsEn: [],
  avoid: [],
};

const scenarios = [
  {
    name: "CZ repair peer work_chat",
    input: {
      situation:
        "Zapomněla jsem kolegovi poslat podklady a on kvůli tomu čekal. Potřebuju se omluvit a napravit to.",
      toneId: "apologetic",
      relationshipId: "peer",
      channelId: "work_chat",
      strategyId: "repair",
    },
    category: repairWorkCategory,
    language: "cs",
    expected: {
      strategy: "repair",
      relationship: "peer",
      channel: "work_chat",
      domain: "work",
    },
  },
  {
    name: "EN repair client email",
    input: {
      situation:
        "I sent the wrong version of a file to a client and need to apologize, correct it, and sound professional.",
      toneId: "formal",
      relationshipId: "client",
      channelId: "email",
      strategyId: "repair",
    },
    category: repairWorkCategory,
    language: "en",
    expected: {
      strategy: "repair",
      relationship: "client",
      channel: "email",
      domain: "business",
    },
  },
  {
    name: "EN soft decline friend messenger",
    input: {
      situation:
        "A friend invited me out tonight but I am exhausted. I want to decline kindly without making up a fake excuse.",
      toneId: "soft",
      relationshipId: "friend",
      channelId: "messenger_1to1",
      strategyId: "soft_decline",
    },
    category: {
      ...repairWorkCategory,
      id: "social_decline",
      domain: "social",
      intent: "delay",
    },
    language: "en",
    expected: {
      strategy: "soft_decline",
      relationship: "friend",
      channel: "messenger_1to1",
      domain: "social",
      warning: "fake_alibi_request_blocked",
    },
  },
  {
    name: "CZ hard boundary friend money",
    input: {
      situation:
        "Známý po mně chce půjčit peníze, ale nechci do toho jít. Potřebuju odmítnout bez dlouhého vysvětlování.",
      toneId: "assertive",
      relationshipId: "friend",
      channelId: "messenger_1to1",
      strategyId: "hard_boundary",
    },
    category: {
      ...repairWorkCategory,
      id: "money_boundary",
      domain: "social",
      intent: "decline",
    },
    language: "cs",
    expected: {
      strategy: "hard_boundary",
      relationship: "friend",
      channel: "messenger_1to1",
      domain: "money",
    },
  },
  {
    name: "EN exit group chat",
    input: {
      situation:
        "This group chat is getting heated and I want to leave without escalating.",
      toneId: "concise",
      relationshipId: "peer",
      channelId: "group_chat",
      strategyId: "exit",
    },
    category: {
      ...repairWorkCategory,
      id: "group_exit",
      domain: "social",
      intent: "decline",
    },
    language: "en",
    expected: {
      strategy: "exit",
      relationship: "peer",
      channel: "group_chat",
      domain: "work",
    },
  },
  {
    name: "EN redirect stranger public social dm",
    input: {
      situation:
        "A stranger is pushing an argument in social DMs and I want to redirect them somewhere appropriate.",
      toneId: "neutral",
      relationshipId: "stranger_public",
      channelId: "social_dm",
      strategyId: "redirect",
    },
    category: {
      ...repairWorkCategory,
      id: "public_redirect",
      domain: "digital",
      intent: "clarify",
    },
    language: "en",
    expected: {
      strategy: "redirect",
      relationship: "stranger_public",
      channel: "social_dm",
      domain: "digital",
    },
  },
  {
    name: "selectorMixing.selected explicit strategy",
    input: {
      situation:
        "I need to apologize to a client for a wrong file but only selected IDs are nested.",
      toneId: "formal",
      relationshipId: "client",
      channelId: "email",
      selectorMixing: {
        selected: {
          strategyId: "repair",
        },
      },
    },
    category: repairWorkCategory,
    language: "en",
    expected: {
      strategy: "repair",
      relationship: "client",
      channel: "email",
      domain: "business",
    },
  },
];

for (const scenario of scenarios) {
  const context = createNormalizedGenerationContext(
    scenario.input,
    scenario.category,
    scenario.language
  );

  assert.equal(
    context.selectors.strategy.id,
    scenario.expected.strategy,
    `${scenario.name}: wrong strategy`
  );
  assert.equal(
    context.selectors.relationship.id,
    scenario.expected.relationship,
    `${scenario.name}: wrong relationship`
  );
  assert.equal(
    context.selectors.channel.id,
    scenario.expected.channel,
    `${scenario.name}: wrong channel`
  );
  assert.equal(
    context.inferredDomain,
    scenario.expected.domain,
    `${scenario.name}: wrong inferred domain`
  );

  if (scenario.expected.warning) {
    assert.ok(
      context.safetyWarnings.includes(scenario.expected.warning),
      `${scenario.name}: missing ${scenario.expected.warning}`
    );
  }
}

console.log("OK: MVP routing and local test limit verified");
