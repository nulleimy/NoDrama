import { LlmJudgeResult, QaContext } from "./qaTypes";

export function llmJudge(text: string, ctx: QaContext): LlmJudgeResult {
  void text;
  void ctx;

  return {
    score: 0.8,
    verdict: "pass",
  };
}
