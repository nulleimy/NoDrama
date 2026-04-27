import { NextResponse } from "next/server";
import {
  analyticsEventSchema,
  type AnalyticsEventResponse,
} from "@/lib/analytics/eventContract";
import { logAnalyticsEvent } from "@/lib/analytics/eventLogger";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = analyticsEventSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          code: "VALIDATION_ERROR",
          message: "Invalid analytics event.",
          issues: parsed.error.flatten(),
        } satisfies AnalyticsEventResponse,
        { status: 400 }
      );
    }

    logAnalyticsEvent(parsed.data);

    return NextResponse.json({
      ok: true,
      accepted: true,
    } satisfies AnalyticsEventResponse);
  } catch (error) {
    console.error("Analytics event error", error);

    return NextResponse.json(
      {
        ok: false,
        code: "SERVER_ERROR",
        message: "Analytics event could not be processed.",
      } satisfies AnalyticsEventResponse,
      { status: 500 }
    );
  }
}
