import type { GenerateRequest } from "@/lib/generateContract";
import type { SituationCategory } from "@/lib/language/phraseTypes";
import { createContentDepthAuditDebug } from "@/lib/nodrama/auditDebug";
import {
  type ContentDepthChannel,
  type ContentDepthIntent,
  type ContentDepthRelationship,
  type ContentDepthScenarioCategory,
  type ContentDepthToneId,
  type SafetyDecision,
  promptRegistry,
  safetyLayers,
  scenarioTemplates,
  lockedTonePresets,
} from "@/lib/nodrama";

export type ContentDepthRuntimeContext = {
  promptProfileId: string;
  scenarioTemplateId: string;
  scenarioCategory: ContentDepthScenarioCategory;
  tonePresetId: ContentDepthToneId;
  toneGuidance: {
    description: string;
    bestFor: string[];
    riskNotes: string[];
  };
  safetyDecisions: {
    layerId: string;
    decision: SafetyDecision;
  }[];
  auditDebug: ReturnType<typeof createContentDepthAuditDebug>;
};

export function createContentDepthRuntimeContext(
  input: GenerateRequest,
  category: SituationCategory
): ContentDepthRuntimeContext {
  const normalized = {
    category: mapSituationCategory(category),
    intent: normalizeIntent(category.intent),
    relationship: mapRelationship(input.relationship),
    tone: mapTone(input.tone),
    channel: mapChannel(input.channel),
  };

  const scenario = selectScenarioTemplate(normalized);
  const promptProfile =
    promptRegistry.find((profile) => profile.id === scenario.promptProfileId) ||
    promptRegistry[0];
  const tonePreset =
    lockedTonePresets.find((preset) => preset.id === normalized.tone) ||
    lockedTonePresets.find((preset) => preset.id === scenario.tone) ||
    lockedTonePresets[0];
  const activeSafetyLayers = safetyLayers.filter((layer) =>
    promptProfile.defaultSafetyLayers.includes(layer.id)
  );

  return {
    promptProfileId: promptProfile.id,
    scenarioTemplateId: scenario.id,
    scenarioCategory: scenario.category,
    tonePresetId: tonePreset.id,
    toneGuidance: {
      description: tonePreset.description,
      bestFor: tonePreset.bestFor,
      riskNotes: tonePreset.riskNotes,
    },
    safetyDecisions: activeSafetyLayers.map((layer) => ({
      layerId: layer.id,
      decision: layer.decision,
    })),
    auditDebug: createContentDepthAuditDebug(scenario.id),
  };
}

function selectScenarioTemplate(normalized: {
  category: ContentDepthScenarioCategory;
  intent: string;
  relationship: ContentDepthRelationship;
  tone: ContentDepthToneId;
  channel: ContentDepthChannel;
}) {
  return scenarioTemplates
    .map((scenario) => ({
      scenario,
      score:
        (scenario.category === normalized.category ? 20 : 0) +
        (scenario.intent === normalized.intent ? 12 : 0) +
        (scenario.relationship === normalized.relationship ? 8 : 0) +
        (scenario.tone === normalized.tone ? 4 : 0) +
        (scenario.channel === normalized.channel ? 2 : 0),
    }))
    .sort((left, right) => right.score - left.score)[0].scenario;
}

function mapSituationCategory(
  category: SituationCategory
): ContentDepthScenarioCategory {
  if (category.domain === "work" || category.domain === "business") {
    return "work_commitments";
  }

  if (category.intent === "boundary") {
    return "family_boundaries";
  }

  if (category.domain === "digital") {
    return "dating_clarity";
  }

  if (category.domain === "money") {
    return "service_request";
  }

  return "social_plans";
}

function normalizeIntent(intent: SituationCategory["intent"]): ContentDepthIntent {
  if (intent === "soft_exit" || intent === "follow_up") return "clarify";
  if (intent === "refuse_cost" || intent === "refuse_scope") return "decline";
  if (intent === "not_available") return "delay";
  if (intent === "apology") return "repair";
  return intent;
}

function mapRelationship(
  relationship: GenerateRequest["relationship"]
): ContentDepthRelationship {
  if (relationship === "Práce") return "work";
  if (relationship === "Rodina") return "family";
  if (relationship === "Randění") return "dating";
  return "friend";
}

function mapTone(tone: GenerateRequest["tone"]): ContentDepthToneId {
  if (tone === "Asertivní") return "firm";
  if (tone === "Formální") return "formal";
  if (tone === "Vtipný") return "light";
  return "kind";
}

function mapChannel(channel: GenerateRequest["channel"]): ContentDepthChannel {
  if (channel === "SMS") return "sms";
  if (channel === "E-mail") return "email";
  if (channel === "Slack") return "slack";
  return "whatsapp";
}
