import { NextResponse } from "next/server";

import { getMissingStripeConfig, isStripeCheckoutFoundationEnabled } from "@/lib/billing/stripeConfig";

export async function POST() {
  if (!isStripeCheckoutFoundationEnabled()) {
    return NextResponse.json(
      {
        ok: false,
        code: "stripe_checkout_foundation_disabled",
        message: "Stripe checkout foundation is disabled until required env vars are configured.",
        missing: getMissingStripeConfig(),
      },
      { status: 503 }
    );
  }

  return NextResponse.json(
    {
      ok: false,
      code: "stripe_session_deferred",
      message: "Checkout session creation is intentionally deferred in this foundation phase.",
    },
    { status: 501 }
  );
}
