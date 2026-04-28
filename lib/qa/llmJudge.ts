type QaContext = {
  [key: string]: unknown;
};

export async function llmJudge(_text: string, _ctx: QaContext) {
  void _text;
  void _ctx;

  if (process.env.LLM_QA_ENABLED !== "true") {
    return null;
  }

  return {
    overrideVerdict: null,
    notes: [],
  };
}
