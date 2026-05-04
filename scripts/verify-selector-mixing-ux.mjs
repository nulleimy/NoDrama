import { existsSync, readFileSync } from "node:fs";

import { createNormalizedGenerationContext } from "../lib/nodrama/selectorMixing.mjs";
import { publicGeneratorTaxonomyControls } from "../lib/nodrama/uiTaxonomyControls.mjs";

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

const selectorGroups = ["tone", "relationship", "channel", "strategy"];

for (const group of selectorGroups) {
  const options = publicGeneratorTaxonomyControls[group];

  if (!Array.isArray(options) || options.length !== 8) {
    fail(`${group} must expose exactly 8 options.`);
  }
}

const expectedIdsByGroup = {
  tone: [
    "neutral",
    "soft",
    "assertive",
    "formal",
    "apologetic",
    "warm",
    "concise",
    "playful",
  ],
  relationship: [
    "authority",
    "peer",
    "client",
    "friend",
    "close_friend",
    "partner",
    "family",
    "stranger_public",
  ],
  channel: [
    "messenger_1to1",
    "group_chat",
    "email",
    "work_chat",
    "professional_dm",
    "social_dm",
    "voice_call",
    "face_to_face",
  ],
  strategy: [
    "delay",
    "soft_decline",
    "hard_boundary",
    "repair",
    "clarify",
    "redirect",
    "negotiate",
    "exit",
  ],
};

for (const [group, expectedIds] of Object.entries(expectedIdsByGroup)) {
  const actualIds = publicGeneratorTaxonomyControls[group].map((option) => option.id);

  if (actualIds.join(",") !== expectedIds.join(",")) {
    fail(`${group} selector order does not match the final public order.`);
  }
}

const examples = [
  {
    name: "work deadline authority work_chat delay",
    input: {
      situation:
        "I am late with a work deadline and need to send a clear delay update in chat.",
      tone: "Formální",
      relationship: "Práce",
      channel: "Slack",
      toneId: "concise",
      relationshipId: "authority",
      channelId: "work_chat",
      strategyId: "delay",
    },
    category: {
      id: "work_task_delay",
      label: "Work task delay",
      domain: "work",
      intent: "delay",
      riskLevel: "low",
      defaultStyle: "formal",
      allowedStyles: ["formal", "firm"],
      recommendedChannels: ["email", "slack"],
      keywordsCs: [],
      keywordsEn: ["work", "deadline", "delay"],
      avoid: [],
    },
    expected: {
      relationship: "authority",
      channel: "work_chat",
      strategy: "delay",
      scenarioCategory: "work_commitments",
      domain: "work",
    },
  },
  {
    name: "friend invitation friend messenger_1to1 soft_decline",
    input: {
      situation: "A friend invited me out and I want to decline softly.",
      tone: "Milý",
      relationship: "Kamarádi",
      channel: "WhatsApp",
      toneId: "soft",
      relationshipId: "friend",
      channelId: "messenger_1to1",
      strategyId: "soft_decline",
    },
    category: {
      id: "social_cancel_party",
      label: "Decline a party",
      domain: "social",
      intent: "decline",
      riskLevel: "low",
      defaultStyle: "casual",
      allowedStyles: ["casual", "firm"],
      recommendedChannels: ["whatsapp"],
      keywordsCs: [],
      keywordsEn: ["friend", "decline", "invited"],
      avoid: [],
    },
    expected: {
      relationship: "friend",
      channel: "messenger_1to1",
      strategy: "soft_decline",
      scenarioCategory: "social_plans",
      domain: "social",
    },
  },
  {
    name: "partner pressure partner messenger_1to1 hard_boundary",
    input: {
      situation:
        "My partner keeps pushing and I need to set a clear boundary without making it a fight.",
      tone: "Asertivní",
      relationship: "Randění",
      channel: "SMS",
      toneId: "assertive",
      relationshipId: "partner",
      channelId: "messenger_1to1",
      strategyId: "hard_boundary",
    },
    category: {
      id: "dating_boundary_physical",
      label: "Dating boundary",
      domain: "digital",
      intent: "boundary",
      riskLevel: "medium",
      defaultStyle: "firm",
      allowedStyles: ["firm", "formal"],
      recommendedChannels: ["whatsapp"],
      keywordsCs: [],
      keywordsEn: ["partner", "boundary"],
      avoid: [],
    },
    expected: {
      relationship: "partner",
      channel: "messenger_1to1",
      strategy: "hard_boundary",
      scenarioCategory: "dating_clarity",
      domain: "dating",
      pressure: "high",
    },
  },
  {
    name: "client scope creep client email negotiate",
    input: {
      situation:
        "A client is asking for scope creep beyond the budget and I need to negotiate terms.",
      tone: "Formální",
      relationship: "Práce",
      channel: "E-mail",
      toneId: "formal",
      relationshipId: "client",
      channelId: "email",
      strategyId: "negotiate",
    },
    category: {
      id: "business_scope_creep",
      label: "Client scope creep",
      domain: "business",
      intent: "refuse_scope",
      riskLevel: "low",
      defaultStyle: "formal",
      allowedStyles: ["formal", "firm"],
      recommendedChannels: ["email"],
      keywordsCs: [],
      keywordsEn: ["client", "scope", "budget"],
      avoid: [],
    },
    expected: {
      relationship: "client",
      channel: "email",
      strategy: "negotiate",
      scenarioCategory: "service_request",
      domain: "business",
    },
  },
  {
    name: "family guilt pressure family face_to_face clarify",
    input: {
      situation:
        "My family is using guilt pressure and I want to clarify what they expect before I decline.",
      tone: "Milý",
      relationship: "Rodina",
      channel: "SMS",
      toneId: "soft",
      relationshipId: "family",
      channelId: "face_to_face",
      strategyId: "clarify",
    },
    category: {
      id: "family_guilt_pressure",
      label: "Family guilt pressure",
      domain: "social",
      intent: "boundary",
      riskLevel: "medium",
      defaultStyle: "casual",
      allowedStyles: ["casual", "firm"],
      recommendedChannels: ["whatsapp"],
      keywordsCs: [],
      keywordsEn: ["family", "guilt", "pressure"],
      avoid: [],
    },
    expected: {
      relationship: "family",
      channel: "face_to_face",
      strategy: "clarify",
      scenarioCategory: "family_boundaries",
      domain: "family",
      pressure: "high",
    },
  },
];

for (const example of examples) {
  const context = createNormalizedGenerationContext(
    example.input,
    example.category,
    "en"
  );

  for (const [selector, expectedId] of Object.entries(example.expected)) {
    if (["scenarioCategory", "domain", "pressure"].includes(selector)) continue;

    if (context.selectors[selector].id !== expectedId) {
      fail(
        `${example.name} expected ${selector}=${expectedId}, got ${context.selectors[selector].id}.`
      );
    }
  }

  if (context.situation.scenarioCategory !== example.expected.scenarioCategory) {
    fail(
      `${example.name} expected scenarioCategory=${example.expected.scenarioCategory}, got ${context.situation.scenarioCategory}.`
    );
  }

  if (context.inferredScenarioFamily !== example.expected.scenarioCategory) {
    fail(
      `${example.name} expected inferredScenarioFamily=${example.expected.scenarioCategory}, got ${context.inferredScenarioFamily}.`
    );
  }

  if (context.inferredDomain !== example.expected.domain) {
    fail(
      `${example.name} expected inferredDomain=${example.expected.domain}, got ${context.inferredDomain}.`
    );
  }

  if (example.expected.pressure && context.inferredPressure !== example.expected.pressure) {
    fail(
      `${example.name} expected inferredPressure=${example.expected.pressure}, got ${context.inferredPressure}.`
    );
  }

  for (const field of [
    "userText",
    "selected",
    "inferredLanguage",
    "inferredDomain",
    "inferredScenarioFamily",
    "inferredRisk",
    "inferredPressure",
    "matchedMicroSituation",
    "safetyNotes",
    "safetyWarnings",
    "confidence",
  ]) {
    if (!(field in context)) {
      fail(`${example.name} missing GenerationContext field: ${field}`);
    }
  }

  if (!context.matchedMicroSituation?.id) {
    fail(`${example.name} did not match a micro-situation.`);
  }

  if (!["high", "medium", "low"].includes(context.confidence)) {
    fail(`${example.name} returned invalid confidence: ${context.confidence}`);
  }

  if (context.compatibility.score <= 0) {
    fail(`${example.name} did not receive a positive compatibility score.`);
  }

  if (!context.riskLayer.safetyPolicyIds.includes("fake_alibi")) {
    fail(`${example.name} missing fake_alibi safety policy.`);
  }
}

const playfulContext = createNormalizedGenerationContext(
  {
    situation: "I need to apologize to my boss for a serious deadline problem.",
    tone: "Vtipný",
    relationship: "Práce",
    channel: "Slack",
    toneId: "playful",
    relationshipId: "authority",
    channelId: "work_chat",
    strategyId: "repair",
  },
  {
    id: "work_apology",
    label: "Work apology",
    domain: "work",
    intent: "apology",
    riskLevel: "medium",
    defaultStyle: "formal",
    allowedStyles: ["formal"],
    recommendedChannels: ["slack"],
    keywordsCs: [],
    keywordsEn: ["boss", "deadline"],
    avoid: [],
  },
  "en"
);

if (playfulContext.selectors.tone.id === "playful") {
  fail("Playful tone must be downgraded for serious authority repair.");
}

if (
  !playfulContext.safetyWarnings.includes("playful_tone_downgraded_for_safety")
) {
  fail("Playful downgrade warning is missing.");
}

const requiredSources = {
  "lib/language/phraseEngine.ts": ["selectorMixing", "contentDepth"],
  "lib/language/replyComposer.ts": [
    "mapSelectorStrategyToIntent",
    "composeEnglishNegotiate",
    "composeEnglishClarify",
  ],
  "lib/nodrama/contentDepthRuntime.ts": [
    "createNormalizedGenerationContext",
    "selectorMixing",
  ],
  "components/InteractiveGenerator.tsx": [
    "How should it sound?",
    "Who is it for?",
    "Where will you send or say it?",
    "What are you trying to do?",
  ],
  "docs/SELECTOR_MIXING_UX.md": ["No public API contract changes"],
};

for (const [file, needles] of Object.entries(requiredSources)) {
  if (!existsSync(file)) {
    fail(`Missing required file: ${file}`);
  }

  const source = readFileSync(file, "utf8");

  for (const needle of needles) {
    if (!source.includes(needle)) {
      fail(`${file} is missing required text: ${needle}`);
    }
  }
}

console.log("OK: Selector mixing UX verified");
