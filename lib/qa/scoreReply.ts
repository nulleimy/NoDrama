import { QaScore, QaContext } from "./qaTypes";
import { DEFAULT_WEIGHTS } from "./weights";

export function scoreReply(text: string, ctx: QaContext): QaScore {
  void ctx;
  const clarity = text.length > 20 ? 0.8 : 0.5;
  const honesty = 0.9;
  const dramaReduction = 0.85;
  const boundaryStrength = 0.75;
  const languageNaturalness = 0.85;

  const total =
    clarity * DEFAULT_WEIGHTS.clarity +
    honesty * DEFAULT_WEIGHTS.honesty +
    dramaReduction * DEFAULT_WEIGHTS.dramaReduction +
    boundaryStrength * DEFAULT_WEIGHTS.boundaryStrength +
    languageNaturalness * DEFAULT_WEIGHTS.languageNaturalness;

  return {
    clarity,
    honesty,
    dramaReduction,
    boundaryStrength,
    languageNaturalness,
    total,
  };
}
