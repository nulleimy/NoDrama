import type { ContentDepthPromptProfile } from "./contentDepthTypes";

export const promptRegistry: ContentDepthPromptProfile[] = [
  {
    id: "truthful-message-v2",
    label: {
      cs: "Pravdivá bezpečná zpráva",
      en: "Truthful safe message",
    },
    supportedLanguages: ["cs", "en"],
    defaultTone: "kind",
    defaultSafetyLayers: [
      "truthfulness",
      "boundary_setting",
      "conflict_reduction",
      "anti_manipulation",
      "non_clinical",
    ],
    strategy:
      "Acknowledge the situation, state the truthful boundary, keep details minimal, and offer a practical next step when appropriate.",
    outputContract: "four_reply_variants",
  },
  {
    id: "boundary-message-v2",
    label: {
      cs: "Hranice bez eskalace",
      en: "Boundary without escalation",
    },
    supportedLanguages: ["cs", "en"],
    defaultTone: "firm",
    defaultSafetyLayers: [
      "truthfulness",
      "boundary_setting",
      "conflict_reduction",
      "anti_manipulation",
    ],
    strategy:
      "Name the boundary directly, avoid blame, avoid invented excuses, and keep the request actionable.",
    outputContract: "four_reply_variants",
  },
];

export function getPromptProfile(profileId: string) {
  return promptRegistry.find((profile) => profile.id === profileId);
}
