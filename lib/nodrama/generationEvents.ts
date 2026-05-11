export type GenerationEventSource = "ui" | "api" | "cli" | "test";
export type GenerationEventLocale = "cs" | "en";
export type GenerationEventStorage = "localStorage" | "file" | "none";
export type GenerationFeedbackReason =
  | "good"
  | "bad"
  | "wrong_context"
  | "too_formal"
  | "too_harsh"
  | "not_sendable";

export type GenerationEvent = {
  id: string;
  createdAt: string;
  source: GenerationEventSource;
  locale: GenerationEventLocale;
  situationPreview?: string;
  situationHash?: string;
  situationLength: number;
  selectors: {
    toneId?: string;
    relationshipId?: string;
    channelId?: string;
    strategyId?: string;
  };
  detectedContext?: {
    domain?: string;
    scenarioFamily?: string;
    relationshipSuggestion?: string;
    strategySuggestion?: string;
    channelSuggestion?: string;
    toneSuggestion?: string;
    confidence?: string;
    warnings?: string[];
  };
  qaSummary?: {
    worstVerdict?: "pass" | "rewrite" | "reject";
    minContextFit?: number;
    minSendability?: number;
    forbiddenTermsHit?: string[];
  };
  feedback?: {
    reason?: GenerationFeedbackReason;
    note?: string;
    regressionCandidate?: boolean;
  };
  privacy: {
    storesFullSituation: false;
    storesGeneratedOutput: false;
    storage: GenerationEventStorage;
  };
};
