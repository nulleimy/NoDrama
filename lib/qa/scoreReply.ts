import type { QaContext, QaScore } from "./qaTypes";
import { CATEGORY_WEIGHTS } from "./weights";

export function scoreReply(text: string, ctx: QaContext): QaScore {
  const weights = CATEGORY_WEIGHTS[ctx.category || "default"];

  const clarity = text.length > 20 ? 1 : 0.4;
  const honesty = /nevím|nestíhám|je to na mě|I can't|I won’t/.test(text) ? 1 : 0.6;
  const dramaReduction = !/vždycky|nikdy|your fault/.test(text) ? 1 : 0.3;
  const boundaryStrength = /nemůžu|nebude to možné|I can’t/.test(text) ? 1 : 0.5;

  const languageNaturalness =
    ctx.language === "cs"
      ? /[a-zA-Z]{3,}/.test(text) ? 0.5 : 1
      : /[ěščřžýáíé]/.test(text) ? 0.5 : 1;

  const total =
    (
      clarity * weights.clarity +
      honesty * weights.honesty +
      dramaReduction * weights.dramaReduction +
      boundaryStrength * weights.boundaryStrength +
      languageNaturalness
    ) / 5;

  let verdict: QaScore["verdict"] = "pass";

  if (total < 0.5) verdict = "reject";
  else if (total < 0.75) verdict = "rewrite";

  return {
    clarity,
    honesty,
    dramaReduction,
    relationshipPreservation: 0.8,
    boundaryStrength,
    toneMatch: 0.8,
    channelMatch: 0.8,
    languageNaturalness,
    total,
    verdict,
    reasons: []
  };
}
