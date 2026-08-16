import type { GenerateRequest, GenerateResponse } from "@/lib/generateContract";
import { generatePhraseEngineReply } from "@/lib/language/phraseEngine";
import {
  applyQaRewrite,
  runReplyQa,
  type ReplyQaResult,
} from "@/lib/nodrama/replyIntelligence";
import { getGenerationMode } from "@/lib/ai/generationMode";
import {
  generateOpenAiReply,
  type AiReplyVariants,
  type OpenAiGenerationResult,
} from "@/lib/ai/openaiResponsesProvider";

type PhraseResponse = ReturnType<typeof generatePhraseEngineReply>;

type HybridGenerationMeta = {
  requestedMode: "hybrid";
  provider: "openai";
  providerModel?: string;
  providerResponseId?: string;
  fallbackUsed: boolean;
  fallbackReason?: string;
};

export type HybridGenerateResponse = GenerateResponse & {
  meta: unknown;
};

export async function generateHybridEthicalReply(
  input: GenerateRequest,
  remaining: number,
  limit: number
): Promise<HybridGenerateResponse> {
  const deterministic = generatePhraseEngineReply(input, remaining, limit);

  if (getGenerationMode() !== "hybrid") {
    return deterministic;
  }

  const selectors = deterministic.meta.contentDepth.selectorMixing.selectors;
  const detectedContext = deterministic.meta.replyIntelligence.detectedContext;

  const providerResult = await generateOpenAiReply({
    input,
    detectedContext,
    deterministicFallback: deterministic.output,
    selected: {
      toneId: selectors.tone.id,
      relationshipId: selectors.relationship.id,
      channelId: selectors.channel.id,
      strategyId: selectors.strategy.id,
    },
  });

  if (!providerResult.ok) {
    return withFallbackMeta(deterministic, providerResult);
  }

  const qaByVariant = runQaForVariants(providerResult.output, deterministic);
  const hasReject = Object.values(qaByVariant).some(
    (qa) => qa.verdict === "reject"
  );

  if (hasReject) {
    return withFallbackMeta(deterministic, providerResult, "qa_reject");
  }

  const language = detectedContext.language;
  const output: AiReplyVariants = {
    shortReply: applyQaRewrite(
      providerResult.output.shortReply,
      qaByVariant.shortReply,
      language
    ),
    naturalReply: applyQaRewrite(
      providerResult.output.naturalReply,
      qaByVariant.naturalReply,
      language
    ),
    strongReply: applyQaRewrite(
      providerResult.output.strongReply,
      qaByVariant.strongReply,
      language
    ),
    followUpReply: applyQaRewrite(
      providerResult.output.followUpReply,
      qaByVariant.followUpReply,
      language
    ),
  };

  return {
    ...deterministic,
    output,
    meta: {
      ...deterministic.meta,
      engine: "hybrid",
      deterministicEngine: "phrase",
      hybridGeneration: {
        requestedMode: "hybrid",
        provider: "openai",
        providerModel: providerResult.model,
        providerResponseId: providerResult.responseId,
        fallbackUsed: false,
      } satisfies HybridGenerationMeta,
      replyIntelligence: {
        ...deterministic.meta.replyIntelligence,
        qaByVariant,
      },
    },
  };
}

function runQaForVariants(
  output: AiReplyVariants,
  deterministic: PhraseResponse
): Record<keyof AiReplyVariants, ReplyQaResult> {
  const detected = deterministic.meta.replyIntelligence.detectedContext;
  const selectors = deterministic.meta.contentDepth.selectorMixing.selectors;

  const qa = (text: string) =>
    runReplyQa({
      text,
      detected,
      strategyId: selectors.strategy.id,
      relationshipId: selectors.relationship.id,
      channelId: selectors.channel.id,
      toneId: selectors.tone.id,
    });

  return {
    shortReply: qa(output.shortReply),
    naturalReply: qa(output.naturalReply),
    strongReply: qa(output.strongReply),
    followUpReply: qa(output.followUpReply),
  };
}

function withFallbackMeta(
  deterministic: PhraseResponse,
  providerResult: OpenAiGenerationResult,
  overrideReason?: string
): HybridGenerateResponse {
  const providerModel = providerResult.model;
  const providerResponseId = providerResult.ok
    ? providerResult.responseId
    : undefined;
  const fallbackReason = overrideReason ??
    (providerResult.ok ? "provider_output_rejected" : providerResult.reason);

  return {
    ...deterministic,
    meta: {
      ...deterministic.meta,
      hybridGeneration: {
        requestedMode: "hybrid",
        provider: "openai",
        providerModel,
        providerResponseId,
        fallbackUsed: true,
        fallbackReason,
      } satisfies HybridGenerationMeta,
    },
  };
}
