import { NextResponse } from "next/server";
import { getAnalyticsSummary } from "@/lib/analytics/eventStore";

export async function GET() {
  const summary = await getAnalyticsSummary();

  return NextResponse.json({
    ok: true,
    summary,
  });
}
