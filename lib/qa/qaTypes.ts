export type QaContext = {
  tone?: string;
  relationship?: string;
  channel?: string;
  category?: string;
};

export type QaWeights = {
  clarity: number;
  honesty: number;
  dramaReduction: number;
  boundaryStrength: number;
  languageNaturalness: number;
};

export type QaScore = {
  clarity: number;
  honesty: number;
  dramaReduction: number;
  boundaryStrength: number;
  languageNaturalness: number;
  total: number;
};

export type LlmJudgeResult = {
  score: number;
  verdict: "pass" | "fail";
};
