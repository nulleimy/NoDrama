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
import { createNormalizedGenerationContext } from "@/lib/nodrama/selectorMixing.mjs";

type NormalizedGenerationContext = {
  situation: {
    scenarioCategory: string;
  };
  selectors: {
    tone: { id: string };
    relationship: { id: string };
    channel: { id: string };
    strategy: { id: string };
  };
  matchedMicroSituation: unknown;
  compatibility: unknown;
  riskLayer: unknown;
};

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
  selectorMixing: NormalizedGenerationContext;
  auditDebug: ReturnType<typeof createContentDepthAuditDebug>;
};

export function createContentDepthRuntimeContext(
  input: GenerateRequest,
  category: SituationCategory,
  language: "cs" | "en" = "cs"
): ContentDepthRuntimeContext {
  const selectorMixing = createNormalizedGenerationContext(
    input,
    category,
    language
  ) as NormalizedGenerationContext;
  const normalized = {
    category: normalizeScenarioCategory(selectorMixing.situation.scenarioCategory),
    intent: normalizeIntent(category.intent),
    relationship: mapRelationship(selectorMixing.selectors.relationship.id),
    tone: mapTone(selectorMixing.selectors.tone.id),
    channel: mapChannel(selectorMixing.selectors.channel.id),
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
    selectorMixing,
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

function normalizeScenarioCategory(
  scenarioCategory: string
): ContentDepthScenarioCategory {
  if (
    [
      "social_plans",
      "work_commitments",
      "family_boundaries",
      "dating_clarity",
      "service_request",
    ].includes(scenarioCategory)
  ) {
    return scenarioCategory as ContentDepthScenarioCategory;
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
  relationship: string
): ContentDepthRelationship {
  if (relationship === "authority" || relationship === "peer") return "work";
  if (relationship === "client") return "service";
  if (relationship === "family") return "family";
  if (relationship === "partner") return "dating";
  return "friend";
}

function mapTone(tone: string): ContentDepthToneId {
  if (tone === "assertive") return "firm";
  if (tone === "formal") return "formal";
  if (tone === "playful") return "light";
  if (tone === "warm") return "warm";
  if (tone === "concise") return "brief";
  if (tone === "neutral") return "calm";
  return "kind";
}

function mapChannel(channel: string): ContentDepthChannel {
  if (channel === "email") return "email";
  if (channel === "work_chat" || channel === "professional_dm") return "slack";
  return "whatsapp";
}
