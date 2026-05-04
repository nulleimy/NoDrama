export const taxonomySchemaV2Version = "nodrama-taxonomy-schema-v2";

export const lockedChannelTaxonomyV2 = [
  {
    id: "whatsapp",
    uiLabel: "WhatsApp",
    deliveryMode: "chat",
    detailBudget: "short",
  },
  {
    id: "sms",
    uiLabel: "SMS",
    deliveryMode: "text",
    detailBudget: "short",
  },
  {
    id: "email",
    uiLabel: "E-mail",
    deliveryMode: "email",
    detailBudget: "structured",
  },
  {
    id: "slack",
    uiLabel: "Slack",
    deliveryMode: "work_chat",
    detailBudget: "concise",
  },
];

export const lockedRelationshipTaxonomyV2 = [
  {
    id: "friend",
    uiLabel: "Kamarádi",
    boundaryDefault: "warm",
  },
  {
    id: "work",
    uiLabel: "Práce",
    boundaryDefault: "clear",
  },
  {
    id: "family",
    uiLabel: "Rodina",
    boundaryDefault: "de_escalating",
  },
  {
    id: "dating",
    uiLabel: "Randění",
    boundaryDefault: "consent_aware",
  },
  {
    id: "service",
    uiLabel: "Služba",
    boundaryDefault: "transactional",
  },
  {
    id: "group",
    uiLabel: "Skupina",
    boundaryDefault: "low_drama",
  },
];

export const lockedStrategyTaxonomyV2 = [
  {
    id: "truthful_boundary",
    promptProfileId: "truthful-message-v2",
    description:
      "State the real boundary without inventing an excuse or overexplaining.",
  },
  {
    id: "direct_boundary",
    promptProfileId: "boundary-message-v2",
    description:
      "Name the boundary directly and keep the next step actionable.",
  },
  {
    id: "repair_accountability",
    promptProfileId: "truthful-message-v2",
    description:
      "Acknowledge impact, take proportionate responsibility and avoid blame.",
  },
  {
    id: "delay_update",
    promptProfileId: "truthful-message-v2",
    description:
      "Give a clear delay update with a realistic next checkpoint when known.",
  },
  {
    id: "decline_capacity",
    promptProfileId: "truthful-message-v2",
    description:
      "Decline because of capacity or preference without false justification.",
  },
  {
    id: "clarify_intent",
    promptProfileId: "truthful-message-v2",
    description:
      "Ask for clarity once without pressure, traps or coercive framing.",
  },
  {
    id: "reschedule_option",
    promptProfileId: "truthful-message-v2",
    description:
      "Offer rescheduling only when the user has a real alternative.",
  },
  {
    id: "brief_exit",
    promptProfileId: "boundary-message-v2",
    description:
      "Close the thread briefly without escalating or reopening debate.",
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
    "inputPattern",
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

  const channelIds = new Set(lockedChannelTaxonomyV2.map((item) => item.id));
  const relationshipIds = new Set(
    lockedRelationshipTaxonomyV2.map((item) => item.id)
  );
  const strategyIds = new Set(lockedStrategyTaxonomyV2.map((item) => item.id));

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

  return issues;
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
