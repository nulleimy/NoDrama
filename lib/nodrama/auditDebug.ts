import type {
  ContentDepthAuditDebug,
  SafetyDecision,
  SafetyLayerId,
} from "./contentDepthTypes";
import { getPromptProfile } from "./promptRegistry";
import { getScenarioTemplate } from "./scenarioTemplates";
import { getSafetyLayer } from "./safetyLayers";

export function createContentDepthAuditDebug(
  scenarioTemplateId: string
): ContentDepthAuditDebug | undefined {
  const scenario = getScenarioTemplate(scenarioTemplateId);
  if (!scenario) return undefined;

  const profile = getPromptProfile(scenario.promptProfileId);
  if (!profile) return undefined;

  return {
    internalOnly: true,
    promptProfileId: profile.id,
    scenarioTemplateId: scenario.id,
    selectedTone: scenario.tone,
    relationship: scenario.relationship,
    channel: scenario.channel,
    strategy: profile.strategy,
    safety: profile.defaultSafetyLayers.map((layerId) => {
      const layer = getSafetyLayer(layerId);
      return {
        layerId,
        decision: (layer?.decision ?? "revise") as SafetyDecision,
        reason: layer?.guidance ?? fallbackSafetyReason(layerId),
      };
    }),
  };
}

function fallbackSafetyReason(layerId: SafetyLayerId) {
  return `Safety layer ${layerId} is referenced but not configured.`;
}
