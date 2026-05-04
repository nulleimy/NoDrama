export const taxonomySchemaV2Version = "nodrama-taxonomy-schema-v2";

export const lockedChannelTaxonomyV2 = [
  {
    id: "messenger_1to1",
    uiLabel: "Messenger 1:1",
    deliveryMode: "chat",
    detailBudget: "short",
    legacyIds: ["whatsapp", "messenger", "sms", "signal"],
  },
  {
    id: "group_chat",
    uiLabel: "Skupinový chat",
    deliveryMode: "chat",
    detailBudget: "short",
  },
  {
    id: "email",
    uiLabel: "E-mail",
    deliveryMode: "email",
    detailBudget: "structured",
  },
  {
    id: "work_chat",
    uiLabel: "Pracovní chat",
    deliveryMode: "work_chat",
    detailBudget: "concise",
    legacyIds: ["slack", "teams"],
  },
  {
    id: "professional_dm",
    uiLabel: "Profesní DM",
    deliveryMode: "chat",
    detailBudget: "concise",
  },
  {
    id: "social_dm",
    uiLabel: "Sociální DM",
    deliveryMode: "chat",
    detailBudget: "short",
    legacyIds: ["instagram_dm"],
  },
  {
    id: "voice_call",
    uiLabel: "Telefonát",
    deliveryMode: "voice",
    detailBudget: "short",
  },
  {
    id: "face_to_face",
    uiLabel: "Osobně",
    deliveryMode: "in_person",
    detailBudget: "short",
  },
];

export const lockedRelationshipTaxonomyV2 = [
  {
    id: "authority",
    uiLabel: "Autorita",
    boundaryDefault: "clear",
    legacyIds: ["work"],
  },
  {
    id: "peer",
    uiLabel: "Rovnocenný vztah",
    boundaryDefault: "clear",
    legacyIds: ["group"],
  },
  {
    id: "client",
    uiLabel: "Klient",
    boundaryDefault: "transactional",
    legacyIds: ["service"],
  },
  {
    id: "friend",
    uiLabel: "Kamarád",
    boundaryDefault: "warm",
    legacyIds: ["acquaintance"],
  },
  {
    id: "close_friend",
    uiLabel: "Blízký kamarád",
    boundaryDefault: "warm",
  },
  {
    id: "partner",
    uiLabel: "Partner",
    boundaryDefault: "consent_aware",
    legacyIds: ["dating"],
  },
  {
    id: "family",
    uiLabel: "Rodina",
    boundaryDefault: "de_escalating",
  },
  {
    id: "stranger_public",
    uiLabel: "Cizí / veřejnost",
    boundaryDefault: "clear",
  },
];

export const lockedStrategyTaxonomyV2 = [
  {
    id: "delay",
    promptProfileId: "truthful-message-v2",
    description:
      "Give a clear delay update with a realistic next checkpoint when known.",
    legacyIds: ["delay_update", "reschedule_option"],
  },
  {
    id: "soft_decline",
    promptProfileId: "truthful-message-v2",
    description:
      "Decline gently without false justification or avoidant overexplaining.",
    legacyIds: ["decline_capacity"],
  },
  {
    id: "hard_boundary",
    promptProfileId: "boundary-message-v2",
    description:
      "Name the boundary directly and keep the next step actionable.",
    legacyIds: ["truthful_boundary", "direct_boundary"],
  },
  {
    id: "redirect",
    promptProfileId: "truthful-message-v2",
    description:
      "Move the conversation toward a safer topic, channel or next step.",
  },
  {
    id: "repair",
    promptProfileId: "truthful-message-v2",
    description:
      "Acknowledge impact, take proportionate responsibility and avoid blame.",
    legacyIds: ["repair_accountability"],
  },
  {
    id: "exit",
    promptProfileId: "boundary-message-v2",
    description:
      "Close the thread briefly without escalating or reopening debate.",
    legacyIds: ["brief_exit"],
  },
  {
    id: "negotiate",
    promptProfileId: "truthful-message-v2",
    description:
      "Offer a realistic counterproposal without pressure or false leverage.",
  },
  {
    id: "clarify",
    promptProfileId: "truthful-message-v2",
    description:
      "Ask for clarity once without pressure, traps or coercive framing.",
    legacyIds: ["clarify_intent"],
  },
];

export const riskLevelsV2 = ["low", "medium", "high"];
export const pressureLevelsV2 = ["low", "medium", "high"];
export const datasetLocalesV2 = ["cs", "en"];
export const outputContractsV2 = ["four_reply_variants"];

export const microSituationSchemaV2 = {
  requiredStringFields: [
    "id",
    "title",
    "locale",
    "channelId",
    "relationshipId",
    "strategyId",
    "riskLevel",
    "pressureLevel",
    "scenarioCategory",
    "intent",
    "userNeed",
    "microSituationText",
    "inputPattern",
    "defaultStrategyId",
    "expectedOutputContract",
  ],
  requiredStringArrayFields: ["safetyNotes", "tags"],
  optionalStringFields: ["sourceCategoryId"],
};

export function validateMicroSituationRecordV2(record, index = 0) {
  const issues = [];
  const prefix = record?.id || `record[${index}]`;

  if (!record || typeof record !== "object" || Array.isArray(record)) {
    return [`record[${index}] must be an object.`];
  }

  for (const field of microSituationSchemaV2.requiredStringFields) {
    if (typeof record[field] !== "string" || record[field].trim().length === 0) {
      issues.push(`${prefix}.${field} must be a non-empty string.`);
    }
  }

  for (const field of microSituationSchemaV2.requiredStringArrayFields) {
    if (
      !Array.isArray(record[field]) ||
      record[field].length === 0 ||
      record[field].some((value) => typeof value !== "string" || !value.trim())
    ) {
      issues.push(`${prefix}.${field} must be a non-empty string array.`);
    }
  }

  for (const field of microSituationSchemaV2.optionalStringFields) {
    if (
      record[field] !== undefined &&
      (typeof record[field] !== "string" || !record[field].trim())
    ) {
      issues.push(`${prefix}.${field} must be a non-empty string when present.`);
    }
  }

  const channelIds = collectTaxonomyIdsWithLegacy(lockedChannelTaxonomyV2);
  const relationshipIds = collectTaxonomyIdsWithLegacy(
    lockedRelationshipTaxonomyV2
  );
  const strategyIds = collectTaxonomyIdsWithLegacy(lockedStrategyTaxonomyV2);

  if (record.channelId && !channelIds.has(record.channelId)) {
    issues.push(`${prefix}.channelId is not locked: ${record.channelId}.`);
  }

  if (record.relationshipId && !relationshipIds.has(record.relationshipId)) {
    issues.push(
      `${prefix}.relationshipId is not locked: ${record.relationshipId}.`
    );
  }

  if (record.strategyId && !strategyIds.has(record.strategyId)) {
    issues.push(`${prefix}.strategyId is not locked: ${record.strategyId}.`);
  }

  if (record.defaultStrategyId && !strategyIds.has(record.defaultStrategyId)) {
    issues.push(
      `${prefix}.defaultStrategyId is not locked: ${record.defaultStrategyId}.`
    );
  }

  if (
    record.strategyId &&
    record.defaultStrategyId &&
    record.strategyId !== record.defaultStrategyId
  ) {
    issues.push(`${prefix}.defaultStrategyId must match strategyId.`);
  }

  if (record.riskLevel && !riskLevelsV2.includes(record.riskLevel)) {
    issues.push(`${prefix}.riskLevel is not compact: ${record.riskLevel}.`);
  }

  if (record.pressureLevel && !pressureLevelsV2.includes(record.pressureLevel)) {
    issues.push(
      `${prefix}.pressureLevel is not compact: ${record.pressureLevel}.`
    );
  }

  if (record.locale && !datasetLocalesV2.includes(record.locale)) {
    issues.push(`${prefix}.locale is unsupported: ${record.locale}.`);
  }

  if (
    record.expectedOutputContract &&
    !outputContractsV2.includes(record.expectedOutputContract)
  ) {
    issues.push(
      `${prefix}.expectedOutputContract is unsupported: ${record.expectedOutputContract}.`
    );
  }

  const examples = record.examples;

  if (!examples || typeof examples !== "object" || Array.isArray(examples)) {
    issues.push(`${prefix}.examples must be an object.`);
  } else {
    for (const field of ["bad", "good", "top"]) {
      if (
        typeof examples[field] !== "string" ||
        examples[field].trim().length === 0
      ) {
        issues.push(`${prefix}.examples.${field} must be a non-empty string.`);
      }
    }
  }

  validateTaxonomyReferenceGroup({
    group: record.recommendedTaxonomies,
    groupName: "recommendedTaxonomies",
    prefix,
    issues,
    channelIds,
    relationshipIds,
    strategyIds,
    requireNonEmpty: true,
  });

  validateTaxonomyReferenceGroup({
    group: record.blockedTaxonomies,
    groupName: "blockedTaxonomies",
    prefix,
    issues,
    channelIds,
    relationshipIds,
    strategyIds,
    requireNonEmpty: false,
  });

  return issues;
}

function collectTaxonomyIdsWithLegacy(taxonomy) {
  const ids = new Set();

  for (const item of taxonomy) {
    ids.add(item.id);

    for (const legacyId of item.legacyIds || []) {
      ids.add(legacyId);
    }
  }

  return ids;
}

function validateTaxonomyReferenceGroup({
  group,
  groupName,
  prefix,
  issues,
  channelIds,
  relationshipIds,
  strategyIds,
  requireNonEmpty,
}) {
  if (!group || typeof group !== "object" || Array.isArray(group)) {
    issues.push(`${prefix}.${groupName} must be an object.`);
    return;
  }

  const taxonomySets = {
    channelIds,
    relationshipIds,
    strategyIds,
  };

  for (const [field, allowedIds] of Object.entries(taxonomySets)) {
    const values = group[field];

    if (!Array.isArray(values)) {
      if (requireNonEmpty) {
        issues.push(`${prefix}.${groupName}.${field} must be an array.`);
      }

      continue;
    }

    if (requireNonEmpty && values.length === 0) {
      issues.push(`${prefix}.${groupName}.${field} must not be empty.`);
    }

    for (const value of values) {
      if (typeof value !== "string" || !value.trim()) {
        issues.push(`${prefix}.${groupName}.${field} contains a blank ID.`);
        continue;
      }

      if (!allowedIds.has(value)) {
        issues.push(`${prefix}.${groupName}.${field} has unknown ID: ${value}.`);
      }
    }
  }

  if (
    group.safetyPolicyIds !== undefined &&
    (!Array.isArray(group.safetyPolicyIds) ||
      group.safetyPolicyIds.some(
        (value) => typeof value !== "string" || !value.trim()
      ))
  ) {
    issues.push(`${prefix}.${groupName}.safetyPolicyIds must be a string array.`);
  }
}

export function validateMicroSituationDatasetV2(records) {
  const issues = [];

  if (!Array.isArray(records)) {
    return ["Dataset root must be an array."];
  }

  const ids = new Set();

  records.forEach((record, index) => {
    issues.push(...validateMicroSituationRecordV2(record, index));

    if (record?.id) {
      if (ids.has(record.id)) {
        issues.push(`Duplicate micro-situation id: ${record.id}.`);
      }

      ids.add(record.id);
    }
  });

  return issues;
}
