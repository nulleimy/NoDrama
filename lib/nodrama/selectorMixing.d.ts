import type { GenerateRequest } from "@/lib/generateContract";
import type { LanguageCode, SituationCategory } from "@/lib/language/phraseTypes";
import type {
  IntentConflict,
  ReplyDetectedContext,
  SelectedSource,
} from "@/lib/nodrama/replyIntelligenceTypes";

export type SelectorMixingSource = "explicit" | "legacy" | "default";
export type SelectorMixingConfidence = "high" | "medium" | "low";

export type NormalizedSelector = {
  id: string;
  source: SelectorMixingSource;
  requestedId?: string;
  adjusted?: boolean;
  adjustmentReason?: string;
};

export type MatchedMicroSituation = {
  id: string;
  title: string;
  locale: string;
  sourceCategoryId?: string;
  scenarioCategory: string;
  intent: string;
  riskLevel: string;
  pressureLevel: string;
  overlap: number;
  confidence: SelectorMixingConfidence;
  reasons: string[];
  safetyNotes: string[];
  blockedSafetyPolicyIds: string[];
};

export type NormalizedGenerationContext = {
  userText: string;
  selected: {
    tone: NormalizedSelector;
    relationship: NormalizedSelector;
    channel: NormalizedSelector;
    strategy: NormalizedSelector;
  };
  inferredLanguage: LanguageCode;
  inferredDomain: string;
  inferredScenarioFamily: string;
  inferredRisk: string;
  inferredPressure: string;
  matchedMicroSituation: MatchedMicroSituation | null;
  microSituationCandidates: MatchedMicroSituation[];
  confidence: SelectorMixingConfidence;
  safetyNotes: string[];
  safetyWarnings: string[];
  signalKeywords: string[];
  replyIntelligence: {
    detectedContext: ReplyDetectedContext;
    intentConflicts: IntentConflict[];
    selectedSources: Record<"tone" | "relationship" | "channel" | "strategy", SelectedSource>;
    routingWarnings: string[];
  };
  situation: {
    text: string;
    language: LanguageCode;
    categoryId: string;
    categoryLabel: string;
    scenarioCategory: string;
    intent: string;
  };
  selectors: {
    tone: NormalizedSelector;
    relationship: NormalizedSelector;
    channel: NormalizedSelector;
    strategy: NormalizedSelector;
  };
  compatibility: {
    score: number;
    maxScore: number;
    confidence: SelectorMixingConfidence;
    reasons: string[];
    warnings: string[];
  };
  riskLayer: {
    level: string;
    pressureLevel: string;
    safetyPolicyIds: string[];
    notes: string[];
    warnings: string[];
  };
};

export function createNormalizedGenerationContext(
  input: GenerateRequest,
  category: SituationCategory,
  language?: LanguageCode
): NormalizedGenerationContext;

export function mapSelectorStrategyToIntent(strategyId: string): string;
