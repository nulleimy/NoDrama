import { NextResponse } from "next/server";
import { generateRequestSchema, type GenerateErrorResponse } from "@/lib/generateContract";
import { generatePhraseEngineReply } from "@/lib/language/phraseEngine";
import { FREE_DAILY_LIMIT, getOrCreateAnonId, incrementDailyUsage, readDailyUsage } from "@/lib/usageLimit";

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

    const anonId = await getOrCreateAnonId();
    const currentUsage = await readDailyUsage(anonId);
    const remainingBeforeGenerate = Math.max(FREE_DAILY_LIMIT - currentUsage, 0);

    if (remainingBeforeGenerate <= 0) {
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

    const nextUsage = await incrementDailyUsage(anonId);
    const remaining = Math.max(FREE_DAILY_LIMIT - nextUsage, 0);

    const response = generatePhraseEngineReply(parsed.data, remaining, FREE_DAILY_LIMIT);

    return NextResponse.json(response);
  } catch (error) {
    console.error("Generate API error", error);

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
