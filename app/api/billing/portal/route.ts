import { NextResponse } from "next/server";
import { getMissingStripeEnvKeys, isStripeFoundationEnabled } from "@/lib/billing/stripeConfig";
export async function POST() {
  if (!isStripeFoundationEnabled()) return NextResponse.json({ ok: false, code: "STRIPE_NOT_CONFIGURED", message: "Billing portal is disabled until Stripe env is configured.", missing: getMissingStripeEnvKeys() }, { status: 503 });
  return NextResponse.json({ ok: false, code: "PORTAL_NOT_ENABLED", message: "Billing portal foundation exists, but portal session creation is not enabled yet." }, { status: 501 });
}
