import { readFileSync } from "node:fs";

const microSituationSeed = JSON.parse(
  readFileSync(new URL("./microSituationSeed.v2.json", import.meta.url), "utf8")
);

const finalToneIds = new Set([
  "neutral",
  "soft",
  "assertive",
  "formal",
  "apologetic",
  "warm",
  "concise",
  "playful",
]);

const finalRelationshipIds = new Set([
  "authority",
  "peer",
  "client",
  "friend",
  "close_friend",
  "partner",
  "family",
  "stranger_public",
]);

const finalChannelIds = new Set([
  "messenger_1to1",
  "group_chat",
  "email",
  "work_chat",
  "professional_dm",
  "social_dm",
  "voice_call",
  "face_to_face",
]);

const finalStrategyIds = new Set([
  "delay",
  "soft_decline",
  "hard_boundary",
  "repair",
  "clarify",
  "redirect",
  "negotiate",
  "exit",
]);

const legacyToneToFinal = {
  Milý: "soft",
  Asertivní: "assertive",
  Formální: "formal",
  Vtipný: "playful",
};

const legacyRelationshipToFinal = {
  Kamarádi: "friend",
  Práce: "authority",
  Rodina: "family",
  Randění: "partner",
  work: "authority",
  dating: "partner",
  service: "client",
  group: "peer",
  acquaintance: "friend",
};

const legacyChannelToFinal = {
  WhatsApp: "messenger_1to1",
  SMS: "messenger_1to1",
  "E-mail": "email",
  Slack: "work_chat",
  whatsapp: "messenger_1to1",
  sms: "messenger_1to1",
  slack: "work_chat",
  messenger: "messenger_1to1",
  instagram_dm: "social_dm",
  signal: "messenger_1to1",
  teams: "work_chat",
};

const legacyStrategyToFinal = {
  truthful_boundary: "hard_boundary",
  direct_boundary: "hard_boundary",
  repair_accountability: "repair",
  delay_update: "delay",
  decline_capacity: "soft_decline",
  clarify_intent: "clarify",
  reschedule_option: "delay",
  brief_exit: "exit",
};

const compatibleLegacyByFinal = {
  messenger_1to1: new Set(["whatsapp", "messenger", "sms", "signal"]),
  work_chat: new Set(["slack", "teams"]),
  social_dm: new Set(["instagram_dm"]),
  authority: new Set(["work"]),
  peer: new Set(["group"]),
  client: new Set(["service"]),
  friend: new Set(["acquaintance"]),
  partner: new Set(["dating"]),
  delay: new Set(["delay_update", "reschedule_option"]),
  soft_decline: new Set(["decline_capacity"]),
  hard_boundary: new Set(["truthful_boundary", "direct_boundary"]),
  repair: new Set(["repair_accountability"]),
  exit: new Set(["brief_exit"]),
  clarify: new Set(["clarify_intent"]),
};

const strategyIntentById = {
  delay: "delay",
  soft_decline: "decline",
  hard_boundary: "boundary",
  repair: "repair",
  clarify: "clarify",
  redirect: "clarify",
  negotiate: "negotiate",
  exit: "soft_exit",
};

const domainSignals = {
  work: [
    "deadline",
    "boss",
    "manager",
    "colleague",
    "work",
    "task",
    "meeting",
    "projekt",
    "sef",
    "kolega",
    "prace",
    "termin",
  ],
  business: [
    "client",
    "customer",
    "scope",
    "invoice",
    "budget",
    "zákazník",
    "zakaznik",
    "klient",
    "rozsah",
    "faktura",
  ],
  social: [
    "friend",
    "invite",
    "invitation",
    "party",
    "dinner",
    "kamarád",
    "kamarad",
    "pozvani",
    "oslava",
  ],
  family: ["family", "parent", "mom", "dad", "guilt", "rodina", "mama", "tata"],
  dating: ["partner", "dating", "date", "pressure", "vztah", "rande", "tlak"],
  money: [
    "money",
    "payment",
    "pay",
    "price",
    "loan",
    "lend",
    "borrow",
    "penize",
    "pujcit",
    "pujcka",
    "platba",
    "cena",
  ],
};

const scenarioSignals = {
  work_commitments: ["deadline", "task", "meeting", "work", "termin", "prace"],
  service_request: ["client", "customer", "scope", "budget", "klient", "rozsah"],
  social_plans: ["friend", "invite", "party", "dinner", "pozvani", "oslava"],
  family_boundaries: ["family", "guilt", "parent", "rodina", "vina"],
  dating_clarity: ["partner", "dating", "pressure", "boundary", "vztah", "tlak"],
};

const pressureSignals = [
  "pressure",
  "pushing",
  "urgent",
  "guilt",
  "keeps asking",
  "tlak",
  "tlaci",
  "vina",
  "urgentni",
];

const riskSignals = [
  "threat",
  "blackmail",
  "stalking",
  "unsafe",
  "scared",
  "vyhrozuje",
  "vydirani",
  "bojim",
];

const fakeAlibiSignals = [
  "fake alibi",
  "fake illness",
  "fake accident",
  "fake death",
  "fake emergency",
  "fake evidence",
  "fake excuse",
  "pretend",
  "vymyslet nemoc",
  "falesna nehoda",
  "falesna smrt",
  "falesna nouze",
  "falesny dukaz",
  "falesne dukazy",
];

const antiDeceptionSignals = [
  "nechci lhat",
  "nechci si vymyslet",
  "nechci vymluvu",
  "bez lzi",
  "pravdive",
  "uprimne",
  "i don't want to lie",
  "i dont want to lie",
  "without making up a fake excuse",
  "i don't want to make up an excuse",
  "i dont want to make up an excuse",
  "no fake excuse",
  "honestly",
  "truthful",
  "truthfully",
];

const coercionSignals = [
  "make them",
  "force them",
  "pressure them",
  "convince them no matter what",
  "donutit",
  "pritlacit",
  "vynutit",
];

const blameShiftSignals = [
  "blame someone else",
  "make it look like",
  "say it was their fault",
  "hodit vinu",
  "svalit vinu",
  "rict ze za to muze",
];

const impersonationSignals = [
  "impersonate",
  "pretend to be",
  "write as them",
  "vydavej se za",
  "predstirej ze jsi",
  "napis to za nej",
  "napis to za ni",
];

export function createNormalizedGenerationContext(input, category, language = "cs") {
  const userText = input.situation.trim();
  const strategy = normalizeSelector({
    explicitId: selectExplicitId(input, "strategy"),
    legacyValue: input.strategyId,
    allowedIds: finalStrategyIds,
    legacyMap: legacyStrategyToFinal,
    fallbackId: defaultStrategyForCategory(category),
  });
  const relationship = normalizeSelector({
    explicitId: selectExplicitId(input, "relationship"),
    legacyValue: input.relationship,
    allowedIds: finalRelationshipIds,
    legacyMap: legacyRelationshipToFinal,
    fallbackId: defaultRelationshipForCategory(category),
  });
  const channel = normalizeSelector({
    explicitId: selectExplicitId(input, "channel"),
    legacyValue: input.channel,
    allowedIds: finalChannelIds,
    legacyMap: legacyChannelToFinal,
    fallbackId: defaultChannelForRelationship(relationship.id),
  });
  const rawTone = normalizeSelector({
    explicitId: selectExplicitId(input, "tone"),
    legacyValue: input.tone,
    allowedIds: finalToneIds,
    legacyMap: legacyToneToFinal,
    fallbackId: defaultToneForContext(strategy.id, relationship.id, channel.id),
  });
  const signalKeywords = detectSignalKeywords(userText);
  const inferredDomain = inferDomain(category, relationship.id, signalKeywords);
  const inferredScenarioFamily = inferScenarioFamily(
    category,
    strategy.id,
    relationship.id,
    inferredDomain,
    signalKeywords
  );
  const safetyWarnings = createSafetyWarnings({
    userText,
    toneId: rawTone.id,
    strategyId: strategy.id,
    relationshipId: relationship.id,
    inferredDomain,
    signalKeywords,
  });
  const tone = applyToneSafety(rawTone, safetyWarnings);
  const candidates = findMicroSituationCandidates({
    userText,
    language,
    scenarioFamily: inferredScenarioFamily,
    strategyId: strategy.id,
    relationshipId: relationship.id,
    channelId: channel.id,
  });
  const matchedMicroSituation = candidates[0] || null;
  const inferredRisk = inferRisk(category, matchedMicroSituation, signalKeywords);
  const inferredPressure = inferPressure(matchedMicroSituation, signalKeywords);
  const confidence = inferConfidence({
    matchedMicroSituation,
    candidates,
    selectors: { tone, relationship, channel, strategy },
  });
  const compatibility = scoreCompatibility({
    selectors: { tone, relationship, channel, strategy },
    matchedMicroSituation,
    confidence,
    warnings: safetyWarnings,
  });

  return {
    userText,
    selected: {
      tone,
      relationship,
      channel,
      strategy,
    },
    inferredLanguage: language,
    inferredDomain,
    inferredScenarioFamily,
    inferredRisk,
    inferredPressure,
    matchedMicroSituation,
    microSituationCandidates: candidates,
    confidence,
    safetyNotes:
      matchedMicroSituation?.safetyNotes || [
        "Keep the reply truthful and proportionate.",
        "Do not invent alibis, diagnoses, pressure tactics or third-party blame.",
      ],
    safetyWarnings,
    signalKeywords,

    situation: {
      text: userText,
      language,
      categoryId: category.id,
      categoryLabel: category.label,
      scenarioCategory: inferredScenarioFamily,
      intent: strategyIntentById[strategy.id] || category.intent,
    },
    selectors: {
      tone,
      relationship,
      channel,
      strategy,
    },
    compatibility,
    riskLayer: {
      level: inferredRisk,
      pressureLevel: inferredPressure,
      safetyPolicyIds:
        matchedMicroSituation?.blockedSafetyPolicyIds || [
          "deception",
          "fake_alibi",
          "coercion",
        ],
      notes:
        matchedMicroSituation?.safetyNotes || [
          "Keep the reply truthful and proportionate.",
          "Do not invent alibis, diagnoses, pressure tactics or third-party blame.",
        ],
      warnings: safetyWarnings,
    },
  };
}

export function mapSelectorStrategyToIntent(strategyId) {
  return strategyIntentById[strategyId] || "decline";
}

function selectExplicitId(input, group) {
  const directId = input[`${group}Id`];
  const selected = input.selectorMixing?.selected;
  return directId || selected?.[`${group}Id`] || selected?.[group];
}

function normalizeSelector({
  explicitId,
  legacyValue,
  allowedIds,
  legacyMap,
  fallbackId,
}) {
  if (allowedIds.has(explicitId)) {
    return { id: explicitId, source: "explicit" };
  }

  const legacyId = legacyMap[legacyValue];

  if (legacyId && allowedIds.has(legacyId)) {
    return { id: legacyId, source: "legacy" };
  }

  return { id: fallbackId, source: "default" };
}

function defaultStrategyForCategory(category) {
  if (["delay", "reschedule", "not_available"].includes(category.intent)) {
    return "delay";
  }

  if (category.intent === "apology") return "repair";
  if (["boundary", "refuse_cost", "refuse_scope"].includes(category.intent)) {
    return "hard_boundary";
  }

  if (["clarify", "follow_up"].includes(category.intent)) return "clarify";
  return "soft_decline";
}

function defaultRelationshipForCategory(category) {
  if (category.domain === "work") return "authority";
  if (category.domain === "business" || category.domain === "money") return "client";
  if (category.domain === "digital") return "partner";
  return "friend";
}

function defaultChannelForRelationship(relationshipId) {
  if (relationshipId === "authority" || relationshipId === "peer") {
    return "work_chat";
  }

  if (relationshipId === "client") return "email";
  return "messenger_1to1";
}

function defaultToneForContext(strategyId, relationshipId, channelId) {
  if (strategyId === "repair") return "apologetic";
  if (strategyId === "hard_boundary") return "assertive";
  if (strategyId === "soft_decline") return "soft";
  if (strategyId === "delay") return "concise";
  if (
    channelId === "email" ||
    relationshipId === "authority" ||
    relationshipId === "client"
  ) {
    return "formal";
  }

  return "neutral";
}

function detectSignalKeywords(userText) {
  const normalized = normalizeText(userText);
  const signals = new Set();

  for (const [group, keywords] of Object.entries({
    ...domainSignals,
    ...scenarioSignals,
    pressure: pressureSignals,
    risk: riskSignals,
    fake_alibi: fakeAlibiSignals,
    anti_deception: antiDeceptionSignals,
    coercion: coercionSignals,
    blame_shift: blameShiftSignals,
    impersonation: impersonationSignals,
  })) {
    for (const keyword of keywords) {
      if (normalized.includes(normalizeText(keyword))) {
        signals.add(group);
        signals.add(normalizeText(keyword).trim());
      }
    }
  }

  return [...signals];
}

function inferDomain(category, relationshipId, signalKeywords) {
  if (relationshipId === "client") return "business";
  if (["authority", "peer"].includes(relationshipId)) return "work";
  if (relationshipId === "family") return "family";
  if (relationshipId === "partner") return "dating";

  for (const domain of ["business", "work", "family", "dating", "money", "social"]) {
    if (signalKeywords.includes(domain)) return domain;
  }

  return category.domain;
}

function inferScenarioFamily(
  category,
  strategyId,
  relationshipId,
  inferredDomain,
  signalKeywords
) {
  if (inferredDomain === "work") return "work_commitments";
  if (inferredDomain === "business" || relationshipId === "client") {
    return "service_request";
  }

  if (inferredDomain === "family" || relationshipId === "family") {
    return "family_boundaries";
  }

  if (inferredDomain === "dating" || relationshipId === "partner") {
    return "dating_clarity";
  }

  if (strategyId === "hard_boundary" && category.intent === "boundary") {
    return "family_boundaries";
  }

  for (const scenarioFamily of Object.keys(scenarioSignals)) {
    if (signalKeywords.includes(scenarioFamily)) return scenarioFamily;
  }

  if (category.domain === "money") return "service_request";
  return "social_plans";
}

function findMicroSituationCandidates({
  userText,
  language,
  scenarioFamily,
  strategyId,
  relationshipId,
  channelId,
}) {
  const normalizedText = normalizeText(userText);

  return microSituationSeed
    .map((record) => {
      let overlap = 0;
      const reasons = [];

      if (record.locale === language) {
        overlap += 2;
        reasons.push("language");
      }

      if (record.scenarioCategory === scenarioFamily) {
        overlap += 4;
        reasons.push("scenario_family");
      }

      overlap += taxonomyOverlap(
        record.relationshipId,
        relationshipId,
        2,
        reasons,
        "relationship"
      );
      overlap += taxonomyOverlap(record.channelId, channelId, 1, reasons, "channel");
      overlap += taxonomyOverlap(
        record.strategyId,
        strategyId,
        3,
        reasons,
        "strategy"
      );

      const textOverlap = scoreTextOverlap(
        normalizedText,
        normalizeText(record.inputPattern)
      );

      if (textOverlap > 0) {
        overlap += textOverlap;
        reasons.push("text_overlap");
      }

      return { record, overlap, reasons };
    })
    .filter((candidate) => candidate.overlap > 0)
    .sort((left, right) => right.overlap - left.overlap)
    .slice(0, 3)
    .map(({ record, overlap, reasons }) => ({
      id: record.id,
      title: record.title,
      locale: record.locale,
      sourceCategoryId: record.sourceCategoryId,
      scenarioCategory: record.scenarioCategory,
      intent: record.intent,
      riskLevel: record.riskLevel,
      pressureLevel: record.pressureLevel,
      overlap,
      confidence: overlap >= 15 ? "high" : overlap >= 9 ? "medium" : "low",
      reasons,
      safetyNotes: record.safetyNotes,
      blockedSafetyPolicyIds: record.blockedTaxonomies?.safetyPolicyIds || [],
    }));
}

function inferRisk(category, matchedMicroSituation, signalKeywords) {
  if (signalKeywords.includes("risk")) return "high";
  if (matchedMicroSituation?.riskLevel) return matchedMicroSituation.riskLevel;
  return category.riskLevel;
}

function inferPressure(matchedMicroSituation, signalKeywords) {
  if (signalKeywords.includes("pressure")) return "high";
  return matchedMicroSituation?.pressureLevel || "low";
}

function inferConfidence({ matchedMicroSituation, candidates, selectors }) {
  if (
    matchedMicroSituation?.confidence === "high" &&
    selectors.relationship.source === "explicit" &&
    selectors.strategy.source === "explicit"
  ) {
    return "high";
  }

  if (matchedMicroSituation || candidates.length >= 2) return "medium";
  return "low";
}

function createSafetyWarnings({
  userText,
  toneId,
  strategyId,
  relationshipId,
  inferredDomain,
  signalKeywords,
}) {
  const warnings = [];
  const hasAntiDeceptionIntent = isAntiDeceptionIntent(userText, signalKeywords);

  if (signalKeywords.includes("fake_alibi")) {
    if (hasAntiDeceptionIntent) {
      warnings.push("anti_deception_truthful_reply_preferred");
    } else {
      warnings.push("fake_alibi_request_blocked");
      warnings.push("unsafe_fake_alibi_degraded");
    }
  } else if (hasAntiDeceptionIntent) {
    warnings.push("anti_deception_truthful_reply_preferred");
  }

  if (signalKeywords.includes("coercion")) {
    warnings.push("coercive_request_degraded");
  }

  if (signalKeywords.includes("blame_shift")) {
    warnings.push("blame_shifting_request_degraded");
  }

  if (signalKeywords.includes("impersonation")) {
    warnings.push("impersonation_request_blocked");
  }

  if (
    toneId === "playful" &&
    (["authority", "client", "family"].includes(relationshipId) ||
      ["work", "business", "money", "family"].includes(inferredDomain) ||
      ["repair", "hard_boundary"].includes(strategyId) ||
      signalKeywords.includes("risk") ||
      signalKeywords.includes("pressure"))
  ) {
    warnings.push("playful_tone_downgraded_for_safety");
  }

  if (/gaslight|manipulat|blackmail|stalk|vydir|sledovat|coerc/i.test(userText)) {
    warnings.push("manipulation_or_harassment_request_blocked");
  }

  return warnings;
}

function isAntiDeceptionIntent(userText, signalKeywords) {
  return (
    signalKeywords.includes("anti_deception") &&
    !hasExplicitDeceptionRequest(userText)
  );
}

function hasExplicitDeceptionRequest(userText) {
  const normalized = normalizeText(userText);

  return [
    /\b(help me|can you|please|give me|make up|invent|pretend|say)\b.{0,30}\b(fake excuse|fake illness|fake accident|fake death|lie)\b/,
    /\b(help me|can you|please|give me|make up|invent|pretend|say)\b.{0,30}\b(fake emergency|fake evidence|fake alibi|alibi)\b/,
    /\b(i need|need to|i want|(?<!don t )want to)\b.{0,12}\b(lie|make up|invent|pretend)\b/,
    /\b(fake excuse|fake illness|fake accident|fake death|fake emergency|fake evidence|fake alibi|alibi)\b.{0,30}\b(for me|so i can|to avoid|to get out)\b/,
    /\b(vymysli|potrebuju|chci|dej mi|pomoz mi|predstirej|rekni)\b.{0,30}\b(vymluvu|lez|lhat|falesn)\b/,
    /\b(vymluvu|falesn)\b.{0,30}\b(abych|pro me|kvuli)\b/,
  ].some((pattern) => pattern.test(normalized));
}

function applyToneSafety(tone, safetyWarnings) {
  if (!safetyWarnings.includes("playful_tone_downgraded_for_safety")) {
    return tone;
  }

  return {
    id: "soft",
    source: tone.source,
    requestedId: tone.id,
    adjusted: true,
    adjustmentReason: "playful_tone_downgraded_for_safety",
  };
}

function scoreCompatibility({ selectors, matchedMicroSituation, confidence, warnings }) {
  const reasons = [];
  let score = 0;
  const maxScore = 40;

  for (const [group, selector] of Object.entries(selectors)) {
    if (selector.source === "explicit") {
      score += group === "strategy" ? 8 : 6;
      reasons.push(`${group}_selected`);
    }

    if (selector.adjusted) {
      reasons.push(`${group}_adjusted`);
    }
  }

  if (matchedMicroSituation) {
    score += confidence === "high" ? 10 : 7;
    reasons.push("micro_situation_matched");
  }

  return {
    score,
    maxScore,
    confidence,
    reasons,
    warnings,
  };
}

function taxonomyOverlap(recordId, selectedId, points, reasons, reason) {
  if (recordId === selectedId) {
    reasons.push(reason);
    return points;
  }

  if (compatibleLegacyByFinal[selectedId]?.has(recordId)) {
    reasons.push(`${reason}_legacy`);
    return points;
  }

  return 0;
}

function scoreTextOverlap(input, pattern) {
  const inputTokens = new Set(tokenize(input));
  const patternTokens = tokenize(pattern);

  if (inputTokens.size === 0 || patternTokens.length === 0) return 0;

  const overlap = patternTokens.filter((token) => inputTokens.has(token)).length;
  return Math.min(overlap, 8);
}

function tokenize(text) {
  return normalizeText(text)
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 4);
}

function normalizeText(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s_-]/g, " ");
}
