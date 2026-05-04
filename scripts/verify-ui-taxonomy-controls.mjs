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
    "repair",
    "clarify",
    "redirect",
    "negotiate",
    "exit",
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
    neutral: { cs: "Neutrální", en: "Neutral" },
    soft: { cs: "Jemný", en: "Soft" },
    assertive: { cs: "Asertivní", en: "Assertive" },
    formal: { cs: "Formální", en: "Formal" },
    apologetic: { cs: "Omluvný", en: "Apologetic" },
    warm: { cs: "Vřelý", en: "Warm" },
    concise: { cs: "Stručný", en: "Concise" },
    playful: { cs: "Vtipný / odlehčený", en: "Light / playful" },
  },
  relationship: {
    authority: { cs: "Autorita", en: "Authority" },
    peer: { cs: "Kolega / spolužák", en: "Peer" },
    client: { cs: "Klient / zákazník", en: "Client / customer" },
    friend: { cs: "Kamarád / známý", en: "Friend / acquaintance" },
    close_friend: { cs: "Blízký kamarád", en: "Close friend" },
    partner: { cs: "Partner / dating", en: "Partner / dating" },
    family: { cs: "Rodina", en: "Family" },
    stranger_public: {
      cs: "Cizí člověk / veřejnost",
      en: "Stranger / public",
    },
  },
  channel: {
    messenger_1to1: { cs: "Soukromá zpráva", en: "Private message" },
    group_chat: { cs: "Skupinový chat", en: "Group chat" },
    email: { cs: "E-mail", en: "Email" },
    work_chat: { cs: "Pracovní appka", en: "Work chat" },
    professional_dm: { cs: "Profesní DM", en: "Professional DM" },
    social_dm: { cs: "Sociální DM", en: "Social DM" },
    voice_call: { cs: "Telefon", en: "Phone / voice" },
    face_to_face: { cs: "Osobně", en: "Face to face" },
  },
  strategy: {
    delay: { cs: "Získat čas", en: "Buy time" },
    soft_decline: { cs: "Odmítnout hezky", en: "Decline kindly" },
    hard_boundary: { cs: "Nastavit hranici", en: "Set a boundary" },
    repair: { cs: "Omluvit se / napravit", en: "Apologize / repair" },
    clarify: { cs: "Vyjasnit situaci", en: "Clarify" },
    redirect: { cs: "Přesměrovat", en: "Redirect" },
    negotiate: { cs: "Vyjednat podmínky", en: "Negotiate terms" },
    exit: { cs: "Ukončit to", en: "Exit conversation" },
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
