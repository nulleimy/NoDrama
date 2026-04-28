import type { LlmJudgeResult, QaContext } from "./qaTypes";

export async function llmJudge(_ctx: QaContext): Promise<LlmJudgeResult> {
  void _ctx;

  if (process.env.LLM_QA_ENABLED !== "true") {
    return null;
  }

  return {
    overrideVerdict: null,
    notes: []
  };
}
