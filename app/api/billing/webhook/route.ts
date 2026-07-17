import { NextResponse } from "next/server";

export const runtime = "nodejs";

const SECURITY_HOLD_MESSAGE =
  "Stripe fulfillment is disabled until signed raw-body verification, durable transactional persistence, and authenticated account binding are active.";

export async function POST(request: Request) {
  const signaturePresented = Boolean(request.headers.get("stripe-signature"));

  return NextResponse.json(
    {
      ok: false,
      code: "stripe_webhook_security_hold",
      message: SECURITY_HOLD_MESSAGE,
      signaturePresented,
    },
    {
      status: 503,
      headers: {
        "Cache-Control": "no-store",
        "Retry-After": "3600",
      },
    }
  );
}
