import type { ScenarioTemplate } from "./contentDepthTypes";

export const scenarioTemplates: ScenarioTemplate[] = [
  {
    id: "social-cancel-plan-kind-whatsapp",
    category: "social_plans",
    intent: "cancel",
    relationship: "friend",
    tone: "kind",
    channel: "whatsapp",
    label: {
      cs: "Zrušení plánu s kamarádem",
      en: "Canceling a plan with a friend",
    },
    userNeed: {
      cs: "Uživatel chce zrušit domluvený plán bez falešné výmluvy.",
      en: "The user needs to cancel an agreed plan without a fake excuse.",
    },
    safetyNotes: [
      "Do not invent emergencies.",
      "Keep apology proportional.",
      "Offer rescheduling only when the user indicated it is true.",
    ],
    promptProfileId: "truthful-message-v2",
  },
  {
    id: "work-delay-formal-email",
    category: "work_commitments",
    intent: "delay",
    relationship: "work",
    tone: "formal",
    channel: "email",
    label: {
      cs: "Pracovní zpoždění e-mailem",
      en: "Work delay by email",
    },
    userNeed: {
      cs: "Uživatel potřebuje oznámit zpoždění bez obviňování nebo mlžení.",
      en: "The user needs to communicate a delay without blame or evasiveness.",
    },
    safetyNotes: [
      "Do not imply external approval unless provided.",
      "Include a realistic next update window when available.",
      "Avoid blaming a colleague or client.",
    ],
    promptProfileId: "truthful-message-v2",
  },
  {
    id: "family-boundary-firm-sms",
    category: "family_boundaries",
    intent: "boundary",
    relationship: "family",
    tone: "firm",
    channel: "sms",
    label: {
      cs: "Rodinná hranice stručně",
      en: "Brief family boundary",
    },
    userNeed: {
      cs: "Uživatel chce nastavit hranici bez hádky a bez diagnóz druhé osoby.",
      en: "The user needs to set a boundary without arguing or diagnosing the other person.",
    },
    safetyNotes: [
      "Do not diagnose family members.",
      "Do not escalate with threats.",
      "State the boundary and the next practical step.",
    ],
    promptProfileId: "boundary-message-v2",
  },
  {
    id: "dating-clarity-calm-whatsapp",
    category: "dating_clarity",
    intent: "clarify",
    relationship: "dating",
    tone: "calm",
    channel: "whatsapp",
    label: {
      cs: "Klidné vyjasnění v randění",
      en: "Calm dating clarification",
    },
    userNeed: {
      cs: "Uživatel chce být jasný bez nátlaku, testování nebo manipulace.",
      en: "The user needs clarity without pressure, testing, or manipulation.",
    },
    safetyNotes: [
      "Respect consent and non-response.",
      "Avoid jealousy traps or pressure tactics.",
      "Ask one clear question at most.",
    ],
    promptProfileId: "truthful-message-v2",
  },
];

export function getScenarioTemplate(templateId: string) {
  return scenarioTemplates.find((template) => template.id === templateId);
}
