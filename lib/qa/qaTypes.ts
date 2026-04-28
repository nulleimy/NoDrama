export type QaVerdict = "pass" | "rewrite" | "reject";

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
