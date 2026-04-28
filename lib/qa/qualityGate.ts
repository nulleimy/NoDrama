import { scoreReply } from "./scoreReply";
import { rewriteReply } from "./rewriteReply";
import { QaContext } from "./qaTypes";

export function qualityGate(text: string, ctx: QaContext) {
  const score = scoreReply(text, ctx);

  if (score.total < 0.7) {
    return {
      text: rewriteReply(text, ctx),
      score,
      passed: false,
    };
  }

  return {
    text,
    score,
    passed: true,
  };
}
