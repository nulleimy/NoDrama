export type ReplyIntelligenceLanguage = "cs" | "en";
export type ReplyIntelligenceConfidence = "low" | "medium" | "high";
export type SelectedSource = "auto" | "manual" | "default";

export type ReplyDetectedContext = {
  language: ReplyIntelligenceLanguage;
  domain: string;
  scenarioFamily: string;
  relationshipSuggestion: string;
  strategySuggestion: string;
  channelSuggestion: string;
  toneSuggestion: string;
  confidence: ReplyIntelligenceConfidence;
  reasons: string[];
  warnings: string[];
};

export type ReplyQaVerdict = "pass" | "rewrite" | "reject";

export type ReplyQaResult = {
  verdict: ReplyQaVerdict;
  contextFit: number;
  strategyFit: number;
  relationshipFit: number;
  channelFit: number;
  toneFit: number;
  sendability: number;
  reasons: string[];
  forbiddenTermsHit: string[];
  mismatchType?: string;
};

export type IntentConflict = {
  type: string;
  severity: string;
  message: string;
  recommendedStrategyId?: string;
};
