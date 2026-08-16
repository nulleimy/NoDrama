import type { GenerateRequest, GenerateResponse } from "@/lib/generateContract";
import type { ContextDetectionResult } from "@/lib/nodrama/replyIntelligence";
import { getOpenAiRuntimeConfig } from "@/lib/ai/generationMode";

export type AiReplyVariants = GenerateResponse["output"];

export type OpenAiGenerationResult =
  | {
      ok: true;
      model: string;
      responseId?: string;
      output: AiReplyVariants;
    }
  | {
      ok: false;
      model?: string;
      reason:
        | "missing_config"
        | "timeout"
        | "network_error"
        | "http_error"
        | "invalid_response"
        | "invalid_json";
      status?: number;
    };

type OpenAiGenerationArgs = {
  input: GenerateRequest;
  detectedContext: ContextDetectionResult;
  deterministicFallback: AiReplyVariants;
  selected: {
    toneId: string;
    relationshipId: string;
    channelId: string;
    strategyId: string;
  };
};

const OUTPUT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["shortReply", "naturalReply", "strongReply", "followUpReply"],
  properties: {
    shortReply: { type: "string", minLength: 1, maxLength: 240 },
    naturalReply: { type: "string", minLength: 1, maxLength: 420 },
    strongReply: { type: "string", minLength: 1, maxLength: 420 },
    followUpReply: { type: "string", minLength: 1, maxLength: 420 },
  },
} as const;

const INSTRUCTIONS = `You are the NoDrama hybrid ethical generation layer.
Generate four ready-to-send communication variants that help the user handle an uncomfortable situation without deception or manipulation.

Hard rules:
- Never invent illness, emergencies, accidents, deaths, appointments, third-party blame, credentials, evidence, promises, or other facts the user did not provide.
- Never impersonate another person or create forged/official claims.
- Do not pressure, threaten, guilt-trip, blackmail, or manipulate the recipient.
- Preserve uncertainty instead of fabricating a reason.
- Respect the requested relationship, channel, strategy, and tone.
- Keep the message practical, natural, concise, and sendable.
- If the user explicitly asks for a fake excuse, redirect to a truthful boundary or concise refusal.
- Return only the structured four-reply object requested by the response schema.`;

export async function generateOpenAiReply(
  args: OpenAiGenerationArgs
): Promise<OpenAiGenerationResult> {
  const config = getOpenAiRuntimeConfig();
  if (!config) {
    return { ok: false, reason: "missing_config" };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.timeoutMs);

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        authorization: `Bearer ${config.apiKey}`,
        "content-type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: config.model,
        store: false,
        instructions: INSTRUCTIONS,
        input: JSON.stringify({
          situation: args.input.situation,
          locale: args.detectedContext.language,
          selected: args.selected,
          detectedContext: {
            domain: args.detectedContext.domain,
            scenarioFamily: args.detectedContext.scenarioFamily,
            confidence: args.detectedContext.confidence,
            warnings: args.detectedContext.warnings,
          },
          deterministicFallback: args.deterministicFallback,
        }),
        text: {
          format: {
            type: "json_schema",
            name: "nodrama_reply_variants",
            strict: true,
            schema: OUTPUT_SCHEMA,
          },
        },
      }),
    });

    if (!response.ok) {
      return {
        ok: false,
        model: config.model,
        reason: "http_error",
        status: response.status,
      };
    }

    let payload: unknown;
    try {
      payload = await response.json();
    } catch {
      return {
        ok: false,
        model: config.model,
        reason: "invalid_json",
      };
    }

    const text = extractResponseText(payload);
    if (!text) {
      return {
        ok: false,
        model: config.model,
        reason: "invalid_response",
      };
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      return {
        ok: false,
        model: config.model,
        reason: "invalid_json",
      };
    }

    const output = parseReplyVariants(parsed);
    if (!output) {
      return {
        ok: false,
        model: config.model,
        reason: "invalid_response",
      };
    }

    const responseId = readStringField(payload, "id") ?? undefined;

    return {
      ok: true,
      model: config.model,
      responseId,
      output,
    };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return {
        ok: false,
        model: config.model,
        reason: "timeout",
      };
    }

    return {
      ok: false,
      model: config.model,
      reason: "network_error",
    };
  } finally {
    clearTimeout(timeout);
  }
}

function extractResponseText(payload: unknown): string | null {
  if (!isRecord(payload)) return null;

  const direct = payload.output_text;
  if (typeof direct === "string" && direct.trim()) {
    return direct.trim();
  }

  const output = payload.output;
  if (!Array.isArray(output)) return null;

  const parts: string[] = [];

  for (const item of output) {
    if (!isRecord(item) || !Array.isArray(item.content)) continue;

    for (const content of item.content) {
      if (!isRecord(content)) continue;
      if (content.type !== "output_text") continue;
      if (typeof content.text !== "string" || !content.text.trim()) continue;
      parts.push(content.text.trim());
    }
  }

  return parts.length > 0 ? parts.join("\n") : null;
}

function parseReplyVariants(value: unknown): AiReplyVariants | null {
  if (!isRecord(value)) return null;

  const shortReply = readBoundedString(value, "shortReply", 240);
  const naturalReply = readBoundedString(value, "naturalReply", 420);
  const strongReply = readBoundedString(value, "strongReply", 420);
  const followUpReply = readBoundedString(value, "followUpReply", 420);

  if (!shortReply || !naturalReply || !strongReply || !followUpReply) {
    return null;
  }

  return {
    shortReply,
    naturalReply,
    strongReply,
    followUpReply,
  };
}

function readBoundedString(
  value: Record<string, unknown>,
  key: string,
  maxLength: number
): string | null {
  const text = value[key];
  if (typeof text !== "string") return null;

  const normalized = text.trim();
  if (!normalized || normalized.length > maxLength) return null;

  return normalized;
}

function readStringField(value: unknown, key: string): string | null {
  if (!isRecord(value)) return null;
  const field = value[key];
  return typeof field === "string" && field.trim() ? field.trim() : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
