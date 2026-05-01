import type { TonePresetMetadata } from "./contentDepthTypes";

export const lockedTonePresets: TonePresetMetadata[] = [
  {
    id: "kind",
    label: { cs: "Milý", en: "Kind" },
    description: "Softens the message while preserving the truthful point.",
    bestFor: ["cancel", "decline", "repair"],
    riskNotes: ["Can become vague if the boundary is sensitive."],
    blockedContexts: ["requests for deception"],
  },
  {
    id: "direct",
    label: { cs: "Přímý", en: "Direct" },
    description: "States the point plainly with minimal cushioning.",
    bestFor: ["decline", "boundary", "clarify"],
    riskNotes: ["Can feel abrupt in family or dating contexts."],
    blockedContexts: ["threats", "retaliation"],
  },
  {
    id: "formal",
    label: { cs: "Formální", en: "Formal" },
    description: "Keeps professional distance and avoids casual detail.",
    bestFor: ["delay", "reschedule", "clarify"],
    riskNotes: ["Can sound cold in close relationships."],
    blockedContexts: ["fake official authority"],
  },
  {
    id: "light",
    label: { cs: "Lehký", en: "Light" },
    description: "Adds mild levity without making the other person the joke.",
    bestFor: ["cancel", "delay", "decline"],
    riskNotes: ["Avoid when harm, grief, safety, or serious conflict is present."],
    blockedContexts: ["high-risk conflict", "harassment"],
  },
  {
    id: "warm",
    label: { cs: "Vřelý", en: "Warm" },
    description: "Adds reassurance and relationship care around the boundary.",
    bestFor: ["repair", "reschedule", "cancel"],
    riskNotes: ["Can overpromise if the next step is not realistic."],
    blockedContexts: ["love bombing", "pressure campaign"],
  },
  {
    id: "firm",
    label: { cs: "Pevný", en: "Firm" },
    description: "Protects a boundary without hostility or debate framing.",
    bestFor: ["boundary", "decline", "clarify"],
    riskNotes: ["Needs conflict-reduction checks to avoid sounding punitive."],
    blockedContexts: ["ultimatums used for coercion"],
  },
  {
    id: "calm",
    label: { cs: "Klidný", en: "Calm" },
    description: "De-escalates tension and keeps the reply grounded.",
    bestFor: ["repair", "clarify", "reschedule"],
    riskNotes: ["Should not minimize real harm or dismiss the user's boundary."],
    blockedContexts: ["covering abuse", "silencing a safety concern"],
  },
  {
    id: "brief",
    label: { cs: "Stručný", en: "Brief" },
    description: "Keeps the message short for channels where detail adds risk.",
    bestFor: ["decline", "delay", "boundary"],
    riskNotes: ["May need a follow-up option for practical logistics."],
    blockedContexts: ["complex legal, medical, or safety-critical situations"],
  },
];

export function getTonePreset(toneId: TonePresetMetadata["id"]) {
  return lockedTonePresets.find((tone) => tone.id === toneId);
}
