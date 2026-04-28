import { NextResponse } from "next/server";
import { getAnalyticsSummary } from "@/lib/analytics/eventStore";

function isAuthorized(request: Request) {
  const expectedToken = process.env.ADMIN_ANALYTICS_TOKEN;

  // Local-first default: allow without token only in local development.
  if (!expectedToken && process.env.NODE_ENV !== "production") {
    return true;
  }

  if (!expectedToken) {
    return false;
  }

  return request.headers.get("x-admin-token") === expectedToken;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      {
        ok: false,
        code: "UNAUTHORIZED",
        message: "Admin analytics access denied.",
      },
      { status: 401 }
    );
  }

  const summary = await getAnalyticsSummary();

  return NextResponse.json({
    ok: true,
    summary,
  });
}
