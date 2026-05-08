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

export function detectReplyContext(
  userInput: string,
  selected?: Record<string, string>
): ReplyDetectedContext;

export function detectIntentConflict(
  detected: ReplyDetectedContext,
  selected?: Record<string, string>
): IntentConflict[];

export function applyReplyIntelligenceRouting(
  selected: Record<string, string>,
  detected: ReplyDetectedContext
): { selected: Record<string, string>; warnings: string[] };

export function qaReplyOutput(input: {
  input: string;
  output: Record<string, string>;
  detected: ReplyDetectedContext;
  selected?: Record<string, string>;
}): ReplyQaResult;

export function normalizeText(text: string): string;

export function normalizeSelectorSources(
  sources?: Partial<Record<"tone" | "relationship" | "channel" | "strategy", string>>
): Record<"tone" | "relationship" | "channel" | "strategy", SelectedSource>;

export function isFinalSelectorId(group: string, id: string): boolean;
