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

const examples = [
  {
    name: "work delay",
    input: {
      situation:
        "I am late with a work deadline and need to send a clear delay update.",
      tone: "Formální",
      relationship: "Práce",
      channel: "E-mail",
      toneId: "formal",
      relationshipId: "authority",
      channelId: "email",
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
      channel: "email",
      strategy: "delay",
      scenarioCategory: "work_commitments",
    },
  },
  {
    name: "friend soft decline",
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
    },
  },
  {
    name: "partner boundary",
    input: {
      situation:
        "I need to set a clear boundary with my partner without making it a fight.",
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
    if (selector === "scenarioCategory") continue;

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

  if (!context.matchedMicroSituation?.id) {
    fail(`${example.name} did not match a micro-situation.`);
  }

  if (context.compatibility.score <= 0) {
    fail(`${example.name} did not receive a positive compatibility score.`);
  }

  if (!context.riskLayer.safetyPolicyIds.includes("fake_alibi")) {
    fail(`${example.name} missing fake_alibi safety policy.`);
  }
}

const requiredSources = {
  "lib/language/phraseEngine.ts": ["selectorMixing", "contentDepth"],
  "lib/language/replyComposer.ts": ["mapSelectorStrategyToIntent"],
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
