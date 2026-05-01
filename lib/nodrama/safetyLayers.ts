import type { SafetyLayerConfig } from "./contentDepthTypes";

export const safetyLayers: SafetyLayerConfig[] = [
  {
    id: "truthfulness",
    label: "Truthful communication",
    decision: "revise",
    guidance:
      "Prefer honest, low-detail phrasing over fake alibis, fabricated emergencies, or misleading timelines.",
    blocks: ["fake alibi", "fabricated emergency", "false accusation"],
    requires: ["truthful boundary", "minimal necessary detail"],
  },
  {
    id: "boundary_setting",
    label: "Boundary setting",
    decision: "allow",
    guidance:
      "Support clear limits without overexplaining, apologizing for legitimate needs, or inviting negotiation by default.",
    blocks: ["self-erasing wording", "unwanted negotiation loop"],
    requires: ["clear limit", "respectful phrasing"],
  },
  {
    id: "conflict_reduction",
    label: "Conflict reduction",
    decision: "revise",
    guidance:
      "Reduce escalation by removing blame, insults, threats, and unnecessary emotional intensifiers.",
    blocks: ["insult", "threat", "retaliation"],
    requires: ["calm wording", "specific next step"],
  },
  {
    id: "anti_manipulation",
    label: "No manipulation or deception",
    decision: "block",
    guidance:
      "Block requests that aim to coerce, stalk, blackmail, guilt-trip, deceive, or pressure another person.",
    blocks: ["coercion", "stalking", "blackmail", "guilt trap"],
    requires: ["consent-respecting framing"],
  },
  {
    id: "non_clinical",
    label: "Non-clinical support",
    decision: "revise",
    guidance:
      "Do not present psychological guesses, diagnoses, or pathology labels as facts about another person.",
    blocks: ["diagnosis claim", "pathology label"],
    requires: ["behavior-focused wording", "non-clinical framing"],
  },
];

export function getSafetyLayer(layerId: SafetyLayerConfig["id"]) {
  return safetyLayers.find((layer) => layer.id === layerId);
}
