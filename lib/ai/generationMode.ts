export type GenerationMode = "phrase" | "hybrid";

export type OpenAiRuntimeConfig = {
  apiKey: string;
  model: string;
  timeoutMs: number;
};

export function getGenerationMode(): GenerationMode {
  const raw = (process.env.NODRAMA_GENERATION_MODE ?? "phrase")
    .trim()
    .toLowerCase();

  return raw === "hybrid" ? "hybrid" : "phrase";
}

export function getOpenAiRuntimeConfig(): OpenAiRuntimeConfig | null {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) return null;

  const model = (process.env.NODRAMA_OPENAI_MODEL ?? "gpt-5.6").trim();
  if (!model) return null;

  const timeoutCandidate = Number(process.env.NODRAMA_OPENAI_TIMEOUT_MS ?? "12000");
  const timeoutMs = Number.isFinite(timeoutCandidate)
    ? Math.min(Math.max(Math.trunc(timeoutCandidate), 1000), 30000)
    : 12000;

  return {
    apiKey,
    model,
    timeoutMs,
  };
}
