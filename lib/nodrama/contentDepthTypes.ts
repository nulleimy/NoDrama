export type ContentDepthLanguage = "cs" | "en";

export type ContentDepthToneId =
  | "kind"
  | "direct"
  | "formal"
  | "light"
  | "warm"
  | "firm"
  | "calm"
  | "brief";

export type ContentDepthRelationship =
  | "friend"
  | "work"
  | "family"
  | "dating"
  | "service"
  | "group";

export type ContentDepthChannel =
  | "whatsapp"
  | "sms"
  | "email"
  | "slack";

export type ContentDepthIntent =
  | "cancel"
  | "decline"
  | "delay"
  | "reschedule"
  | "boundary"
  | "repair"
  | "clarify";

export type ContentDepthScenarioCategory =
  | "social_plans"
  | "work_commitments"
  | "family_boundaries"
  | "dating_clarity"
  | "service_request";

export type SafetyLayerId =
  | "truthfulness"
  | "boundary_setting"
  | "conflict_reduction"
  | "anti_manipulation"
  | "non_clinical";

export type SafetyDecision = "allow" | "revise" | "block";

export type ContentDepthPromptProfile = {
  id: string;
  label: Record<ContentDepthLanguage, string>;
  supportedLanguages: ContentDepthLanguage[];
  defaultTone: ContentDepthToneId;
  defaultSafetyLayers: SafetyLayerId[];
  strategy: string;
  outputContract: "four_reply_variants";
};

export type ScenarioTemplate = {
  id: string;
  category: ContentDepthScenarioCategory;
  intent: ContentDepthIntent;
  relationship: ContentDepthRelationship;
  tone: ContentDepthToneId;
  channel: ContentDepthChannel;
  label: Record<ContentDepthLanguage, string>;
  userNeed: Record<ContentDepthLanguage, string>;
  safetyNotes: string[];
  promptProfileId: string;
};

export type SafetyLayerConfig = {
  id: SafetyLayerId;
  label: string;
  decision: SafetyDecision;
  guidance: string;
  blocks: string[];
  requires: string[];
};

export type TonePresetMetadata = {
  id: ContentDepthToneId;
  label: Record<ContentDepthLanguage, string>;
  description: string;
  bestFor: ContentDepthIntent[];
  riskNotes: string[];
  blockedContexts: string[];
};

export type ContentDepthAuditDebug = {
  internalOnly: true;
  promptProfileId: string;
  scenarioTemplateId: string;
  selectedTone: ContentDepthToneId;
  relationship: ContentDepthRelationship;
  channel: ContentDepthChannel;
  strategy: string;
  safety: {
    layerId: SafetyLayerId;
    decision: SafetyDecision;
    reason: string;
  }[];
};
