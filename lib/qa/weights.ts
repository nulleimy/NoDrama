import type { QaCategory } from "./qaTypes";

type QaWeights = {
  honesty: number;
  clarity: number;
  dramaReduction: number;
  boundaryStrength: number;
};

export const CATEGORY_WEIGHTS: Record<QaCategory, QaWeights> = {
  work: {
    honesty: 1.2,
    clarity: 1.2,
    dramaReduction: 1,
    boundaryStrength: 1.0
  },
  social: {
    honesty: 1,
    clarity: 1,
    dramaReduction: 1.3,
    boundaryStrength: 1,
  },
  default: {
    clarity: 1,
    honesty: 1,
    dramaReduction: 1,
    boundaryStrength: 1
  }
};
