export async function llmJudge(text: string, ctx: any) {
  if (process.env.LLM_QA_ENABLED !== "true") {
    return null;
  }

  return {
    overrideVerdict: null,
    notes: []
  };
}
