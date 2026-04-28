export type QaVerdict = "pass" | "rewrite" | "reject";

export type QaCategory = "work" | "social" | "default";

export type QaContext = {
  language: "cs" | "en";
  category?: QaCategory;
};

export type QaScore = {
  clarity: number;
  honesty: number;
  dramaReduction: number;
  relationshipPreservation: number;
  boundaryStrength: number;
  toneMatch: number;
  channelMatch: number;
  languageNaturalness: number;
  total: number;
  verdict: QaVerdict;
  reasons: string[];
};

export type LlmJudgeResult = {
  overrideVerdict: QaVerdict | null;
  notes: string[];
} | null;
