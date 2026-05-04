import type { GenerateRequest } from "@/lib/generateContract";
import type { LanguageCode, SituationCategory } from "@/lib/language/phraseTypes";

export type SelectorMixingSource = "explicit" | "legacy" | "default";

export type NormalizedSelector = {
  id: string;
  source: SelectorMixingSource;
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
  score: number;
  reasons: string[];
  safetyNotes: string[];
  blockedSafetyPolicyIds: string[];
};

export type NormalizedGenerationContext = {
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
  matchedMicroSituation: MatchedMicroSituation | null;
  compatibility: {
    score: number;
    maxScore: number;
    reasons: string[];
    warnings: string[];
  };
  riskLayer: {
    level: string;
    pressureLevel: string;
    safetyPolicyIds: string[];
    notes: string[];
  };
};

export function createNormalizedGenerationContext(
  input: GenerateRequest,
  category: SituationCategory,
  language?: LanguageCode
): NormalizedGenerationContext;

export function mapSelectorStrategyToIntent(strategyId: string): string;
