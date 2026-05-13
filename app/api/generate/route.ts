import { NextResponse } from "next/server";
import { consumeCredit } from "@/lib/credits/creditStore";
import { getCreditUserId } from "@/lib/credits/userIdentity";
import {
  isLocalGenerationLimitBypassed,
  shouldBlockFreeGeneration,
} from "@/lib/generationLimit";
import { generateRequestSchema, type GenerateErrorResponse } from "@/lib/generateContract";
import { generatePhraseEngineReply } from "@/lib/language/phraseEngine";
import { logAnalyticsEvent } from "@/lib/analytics/eventLogger";
import { createAnalyticsEvent, bucketScore } from "@/lib/analytics/funnelEvents";
import {
  FREE_DAILY_LIMIT,
  getOrCreateAnonId,
  incrementDailyUsage,
  readDailyUsage,
} from "@/lib/usageLimit";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = generateRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          code: "VALIDATION_ERROR",
          message: "Zkontroluj prosím vstupní údaje.",
          issues: parsed.error.flatten(),
        } satisfies GenerateErrorResponse,
        { status: 400 }
      );
    }

    await logAnalyticsEvent(createAnalyticsEvent({
      name: "generate_attempt",
      path: "/api/generate",
      properties: { language: parsed.data.language || "unknown" },
    }));

    const creditUserId = await getCreditUserId();
    const creditResult = await consumeCredit(creditUserId);

    const anonId = await getOrCreateAnonId();
    const currentUsage = await readDailyUsage(anonId);
    const limitBypassed = isLocalGenerationLimitBypassed();

    if (!creditResult.consumed && !limitBypassed) {
      if (
        shouldBlockFreeGeneration({
          currentUsage,
          creditConsumed: creditResult.consumed,
          freeLimit: FREE_DAILY_LIMIT,
          limitBypassed,
        })
      ) {
        await logAnalyticsEvent(createAnalyticsEvent({ name: "free_limit_hit", path: "/api/generate" }));
        await logAnalyticsEvent(createAnalyticsEvent({ name: "rate_limited", path: "/api/generate" }));
        return NextResponse.json(
          {
            ok: false,
            code: "FREE_LIMIT_EXCEEDED",
            message: "Free limit pro dnešek je vyčerpaný.",
            remaining: 0,
            limit: FREE_DAILY_LIMIT,
          } satisfies GenerateErrorResponse,
          { status: 429 }
        );
      }
    }

    const nextUsage = creditResult.consumed
      ? currentUsage
      : limitBypassed
      ? currentUsage
      : await incrementDailyUsage(anonId);

    const remaining = creditResult.consumed
      ? Math.max(FREE_DAILY_LIMIT - currentUsage, 0)
      : Math.max(FREE_DAILY_LIMIT - nextUsage, 0);

    const response = generatePhraseEngineReply(parsed.data, remaining, FREE_DAILY_LIMIT);

    await logAnalyticsEvent(createAnalyticsEvent({
      name: "generate_success",
      path: "/api/generate",
      properties: {
        language: parsed.data.language || "unknown",
        scenarioFamily: response.scenario.context.scenarioFamily,
        relationshipSuggestion: response.scenario.context.relationshipSuggestion,
        strategySuggestion: response.scenario.context.strategySuggestion,
        channelSuggestion: response.scenario.context.channelSuggestion,
        toneSuggestion: response.scenario.context.toneSuggestion,
        confidence: bucketScore(response.scenario.context.confidence),
      },
    }));

    return NextResponse.json(response);
  } catch (error) {
    console.error("Generate API error", error);
    await logAnalyticsEvent(createAnalyticsEvent({ name: "generate_failed", path: "/api/generate" }));

    return NextResponse.json(
      {
        ok: false,
        code: "SERVER_ERROR",
        message: "Generování teď selhalo. Zkus to prosím znovu.",
      } satisfies GenerateErrorResponse,
      { status: 500 }
    );
  }
}
