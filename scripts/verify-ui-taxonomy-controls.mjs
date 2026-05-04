import {
  publicGeneratorTaxonomyControls,
  publicGeneratorTaxonomySourceIds,
} from "../lib/nodrama/uiTaxonomyControls.mjs";
import {
  lockedChannelTaxonomyV2,
  lockedRelationshipTaxonomyV2,
  lockedStrategyTaxonomyV2,
} from "../lib/nodrama/taxonomySchemaV2.mjs";

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function uniqueIds(items) {
  return new Set(items.map((item) => item.id));
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
    "redirect",
    "repair",
    "exit",
    "negotiate",
    "clarify",
  ],
};

const lockedIdsByGroup = {
  tone: new Set(expectedIdsByGroup.tone),
  relationship: uniqueIds(lockedRelationshipTaxonomyV2),
  channel: uniqueIds(lockedChannelTaxonomyV2),
  strategy: uniqueIds(lockedStrategyTaxonomyV2),
};

const allowedLegacyValuesByGroup = {
  tone: new Set(["Milý", "Asertivní", "Formální", "Vtipný"]),
  relationship: new Set(["Kamarádi", "Práce", "Rodina", "Randění"]),
  channel: new Set(["WhatsApp", "SMS", "E-mail", "Slack"]),
  strategy: lockedIdsByGroup.strategy,
};

const requiredLabels = {
  tone: {
    playful: { cs: "Vtipný / odlehčený", en: "Light / playful" },
  },
};

for (const group of ["tone", "relationship", "channel", "strategy"]) {
  const options = publicGeneratorTaxonomyControls[group];

  if (!Array.isArray(options) || options.length !== 8) {
    fail(`${group} selector must expose exactly 8 options.`);
  }

  const optionIds = uniqueIds(options);
  const expectedIds = expectedIdsByGroup[group];

  if (optionIds.size !== 8) {
    fail(`${group} selector contains duplicate IDs.`);
  }

  if (options.map((option) => option.id).join(",") !== expectedIds.join(",")) {
    fail(`${group} selector IDs do not match the final taxonomy order.`);
  }

  const sourceIds = new Set(publicGeneratorTaxonomySourceIds[group]);

  if (sourceIds.size !== 8) {
    fail(`${group} source taxonomy must expose exactly 8 IDs.`);
  }

  for (const option of options) {
    if (!lockedIdsByGroup[group].has(option.id)) {
      fail(`${group} option is not a locked taxonomy ID: ${option.id}`);
    }

    if (!sourceIds.has(option.id)) {
      fail(`${group} option is missing from source IDs: ${option.id}`);
    }

    if (!option.label?.cs || !option.label?.en) {
      fail(`${group} option must include CZ/EN labels: ${option.id}`);
    }

    const requiredLabel = requiredLabels[group]?.[option.id];

    if (
      requiredLabel &&
      (option.label.cs !== requiredLabel.cs || option.label.en !== requiredLabel.en)
    ) {
      fail(`${group} option has an incorrect final label: ${option.id}`);
    }

    if (!allowedLegacyValuesByGroup[group].has(option.legacyValue)) {
      fail(`${group} option has invalid legacy mapping: ${option.id}`);
    }
  }
}

console.log("OK: Public generator UI taxonomy controls verified");
