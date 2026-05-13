import { NextResponse } from "next/server";

import { getMissingStripeConfig, isStripeCheckoutFoundationEnabled } from "@/lib/billing/stripeConfig";

export async function POST() {
  if (!isStripeCheckoutFoundationEnabled()) {
    return NextResponse.json(
      {
        ok: false,
        code: "stripe_billing_portal_disabled",
        message: "Billing portal is disabled until required Stripe env vars are configured.",
        missing: getMissingStripeConfig(),
      },
      { status: 503 }
    );
  }

  return NextResponse.json(
    {
      ok: false,
      code: "stripe_portal_deferred",
      message: "Portal session creation is intentionally deferred in this foundation phase.",
    },
    { status: 501 }
  );
}
