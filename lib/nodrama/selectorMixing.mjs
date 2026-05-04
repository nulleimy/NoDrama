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
  "redirect",
  "repair",
  "exit",
  "negotiate",
  "clarify",
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
  redirect: "clarify",
  repair: "repair",
  exit: "soft_exit",
  negotiate: "clarify",
  clarify: "clarify",
};

export function createNormalizedGenerationContext(input, category, language = "cs") {
  const strategy = normalizeSelector({
    explicitId: input.strategyId,
    legacyValue: input.strategyId,
    allowedIds: finalStrategyIds,
    legacyMap: legacyStrategyToFinal,
    fallbackId: defaultStrategyForCategory(category),
  });
  const relationship = normalizeSelector({
    explicitId: input.relationshipId,
    legacyValue: input.relationship,
    allowedIds: finalRelationshipIds,
    legacyMap: legacyRelationshipToFinal,
    fallbackId: defaultRelationshipForCategory(category),
  });
  const channel = normalizeSelector({
    explicitId: input.channelId,
    legacyValue: input.channel,
    allowedIds: finalChannelIds,
    legacyMap: legacyChannelToFinal,
    fallbackId: defaultChannelForRelationship(relationship.id),
  });
  const tone = normalizeSelector({
    explicitId: input.toneId,
    legacyValue: input.tone,
    allowedIds: finalToneIds,
    legacyMap: legacyToneToFinal,
    fallbackId: defaultToneForContext(strategy.id, relationship.id, channel.id),
  });
  const scenarioCategory = mapSituationCategory(category);
  const matchedMicroSituation = matchMicroSituation({
    situation: input.situation,
    language,
    scenarioCategory,
    intent: category.intent,
    selectors: {
      tone,
      relationship,
      channel,
      strategy,
    },
  });
  const compatibility = scoreCompatibility({
    category,
    selectors: {
      tone,
      relationship,
      channel,
      strategy,
    },
    matchedMicroSituation,
  });

  return {
    situation: {
      text: input.situation.trim(),
      language,
      categoryId: category.id,
      categoryLabel: category.label,
      scenarioCategory: matchedMicroSituation?.scenarioCategory || scenarioCategory,
      intent: category.intent,
    },
    selectors: {
      tone,
      relationship,
      channel,
      strategy,
    },
    matchedMicroSituation,
    compatibility,
    riskLayer: {
      level: matchedMicroSituation?.riskLevel || category.riskLevel,
      pressureLevel: matchedMicroSituation?.pressureLevel || "low",
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
    },
  };
}

export function mapSelectorStrategyToIntent(strategyId) {
  return strategyIntentById[strategyId] || "decline";
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

function matchMicroSituation({
  situation,
  language,
  scenarioCategory,
  intent,
  selectors,
}) {
  const normalizedSituation = normalizeText(situation);
  const scored = microSituationSeed
    .map((record) => {
      const reasons = [];
      let score = 0;

      if (record.locale === language) {
        score += 10;
        reasons.push("locale");
      }

      if (record.scenarioCategory === scenarioCategory) {
        score += 20;
        reasons.push("scenario");
      }

      if (record.intent === intent) {
        score += 12;
        reasons.push("intent");
      }

      score += scoreTaxonomyMatch(
        record.relationshipId,
        selectors.relationship.id,
        8,
        reasons,
        "relationship"
      );
      score += scoreTaxonomyMatch(
        record.channelId,
        selectors.channel.id,
        4,
        reasons,
        "channel"
      );
      score += scoreTaxonomyMatch(
        record.strategyId,
        selectors.strategy.id,
        10,
        reasons,
        "strategy"
      );

      const textScore = scoreTextOverlap(
        normalizedSituation,
        normalizeText(record.inputPattern)
      );

      if (textScore > 0) {
        score += textScore;
        reasons.push("input_text");
      }

      return { record, score, reasons };
    })
    .sort((left, right) => right.score - left.score);

  const best = scored[0];

  if (!best || best.score <= 0) return null;

  return {
    id: best.record.id,
    title: best.record.title,
    locale: best.record.locale,
    sourceCategoryId: best.record.sourceCategoryId,
    scenarioCategory: best.record.scenarioCategory,
    intent: best.record.intent,
    riskLevel: best.record.riskLevel,
    pressureLevel: best.record.pressureLevel,
    score: best.score,
    reasons: best.reasons,
    safetyNotes: best.record.safetyNotes,
    blockedSafetyPolicyIds: best.record.blockedTaxonomies?.safetyPolicyIds || [],
  };
}

function scoreCompatibility({ category, selectors, matchedMicroSituation }) {
  const reasons = [];
  const warnings = [];
  let score = 0;
  const maxScore = 40;

  if (selectors.strategy.source === "explicit") {
    score += 8;
    reasons.push("strategy_selected");
  }

  if (selectors.tone.source === "explicit") {
    score += 6;
    reasons.push("tone_selected");
  }

  if (selectors.relationship.source === "explicit") {
    score += 6;
    reasons.push("relationship_selected");
  }

  if (selectors.channel.source === "explicit") {
    score += 6;
    reasons.push("channel_selected");
  }

  if (matchedMicroSituation) {
    score += 10;
    reasons.push("micro_situation_matched");
  }

  if (
    category.domain === "work" &&
    !["authority", "peer", "client"].includes(selectors.relationship.id)
  ) {
    warnings.push("work_text_with_non_work_relationship");
  }

  if (
    selectors.strategy.id === "hard_boundary" &&
    selectors.tone.id === "playful"
  ) {
    warnings.push("playful_tone_with_boundary_strategy");
  }

  if (
    selectors.channel.id === "email" &&
    ["playful", "warm"].includes(selectors.tone.id)
  ) {
    warnings.push("informal_tone_on_structured_channel");
  }

  return {
    score,
    maxScore,
    reasons,
    warnings,
  };
}

function scoreTaxonomyMatch(recordId, selectedId, points, reasons, reason) {
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
  return Math.min(overlap * 2, 12);
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

function mapSituationCategory(category) {
  if (category.domain === "work" || category.domain === "business") {
    return "work_commitments";
  }

  if (category.domain === "digital") {
    return "dating_clarity";
  }

  if (category.intent === "boundary") {
    return "family_boundaries";
  }

  if (category.domain === "money") {
    return "service_request";
  }

  return "social_plans";
}
