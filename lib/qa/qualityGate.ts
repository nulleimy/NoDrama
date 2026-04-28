import { scoreReply } from "./scoreReply";
import { rewriteReply } from "./rewriteReply";
import { isHardReject } from "./rejectRules";
import { llmJudge } from "./llmJudge";
import type { QaContext, QaScore } from "./qaTypes";

type QualityGateResult = {
  final: string;
  verdict: QaScore["verdict"];
  score?: QaScore;
  reason?: string;
};

export async function qualityGate(text: string, ctx: QaContext): Promise<QualityGateResult> {
  const reject = isHardReject(text);

  if (reject) {
    return {
      final: fallback(ctx),
      verdict: "reject",
      reason: reject
    };
  }

  const score = scoreReply(text, ctx);

  const llm = await llmJudge(ctx);
  if (llm?.overrideVerdict) {
    score.verdict = llm.overrideVerdict;
  }

  if (score.verdict === "pass") {
    return { final: text, verdict: "pass", score };
  }

  if (score.verdict === "rewrite") {
    const rewritten = rewriteReply(text, ctx);
    const rescored = scoreReply(rewritten, ctx);

    return {
      final: rewritten,
      verdict: "rewrite",
      score: rescored
    };
  }

  return {
    final: fallback(ctx),
    verdict: "reject",
    score
  };
}

function fallback(ctx: QaContext) {
  return ctx.language === "cs"
    ? "Teď na to nemám kapacitu, ozvu se později."
    : "I don’t have capacity for this right now, I’ll follow up later.";
}
