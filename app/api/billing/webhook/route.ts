import { NextResponse } from "next/server";

import { recordBillingEvent } from "@/lib/billing/billingEventStore";
import { grantCredits } from "@/lib/credits/creditLedger";
import { getMissingStripeConfig, isStripeCheckoutFoundationEnabled } from "@/lib/billing/stripeConfig";

export async function POST(req: Request) {
  if (!isStripeCheckoutFoundationEnabled()) {
    return NextResponse.json(
      {
        ok: false,
        code: "stripe_webhook_disabled",
        message: "Stripe webhook foundation is disabled until required env vars are configured.",
        missing: getMissingStripeConfig(),
      },
      { status: 503 }
    );
  }

  const payload = (await req.json().catch(() => null)) as { id?: string; type?: string } | null;
  const eventId = payload?.id;
  const eventType = payload?.type;

  if (!eventId || !eventType) {
    return NextResponse.json({ ok: false, code: "invalid_webhook_payload" }, { status: 400 });
  }

  const result = await recordBillingEvent({ eventId, eventType });

  if (result.accepted && eventType.startsWith("checkout.session")) {
    await grantCredits({
      accountKey: "anon:local",
      amount: 0 + 4,
      reason: "stripe_pack_purchase",
      source: "stripe_webhook",
      referenceId: eventId,
      idempotencyKey: `${eventId}:anon:local:pack`,
      metadata: { note: "MVP placeholder mapping; bind to authenticated user in DB migration." },
    });
  }

  return NextResponse.json({ ok: true, accepted: result.accepted, duplicate: result.duplicate });
}
