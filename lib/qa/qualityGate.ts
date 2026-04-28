import { llmJudge } from "./llmJudge";
import { isHardReject } from "./rejectRules";
import { rewriteReply } from "./rewriteReply";
import { scoreReply } from "./scoreReply";

type QaContext = {
  language?: "cs" | "en";
  category?: string;
};

export async function qualityGate(text: string, ctx: QaContext) {
  const reject = isHardReject(text);

  if (reject) {
    return {
      final: fallback(ctx),
      verdict: "reject" as const,
      reason: reject,
    };
  }

  const score = scoreReply(text, ctx);
  const llm = await llmJudge(text, ctx);
  if (llm?.overrideVerdict) {
    score.verdict = llm.overrideVerdict;
  }

  if (score.verdict === "pass") {
    return { final: text, verdict: "pass" as const, score };
  }

  if (score.verdict === "rewrite") {
    const rewritten = rewriteReply(text, ctx);
    const rescored = scoreReply(rewritten, ctx);

    return {
      final: rewritten,
      verdict: "rewrite" as const,
      score: rescored,
    };
  }

  return {
    final: fallback(ctx),
    verdict: "reject" as const,
    score,
  };
}

function fallback(ctx: QaContext) {
  return ctx.language === "cs"
    ? "Teď na to nemám kapacitu, ozvu se později."
    : "I don’t have capacity for this right now, I’ll follow up later.";
}
