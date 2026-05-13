import { NextResponse } from "next/server";
import { z } from "zod";
import { getCreditUserId } from "@/lib/credits/userIdentity";
import { BillingPlanId, BillingMode, getMissingStripeEnvKeys, getStripePriceId, isStripeFoundationEnabled } from "@/lib/billing/stripeConfig";
const checkoutSchema = z.object({ mode: z.enum(["subscription", "credit_pack"]), planId: z.string().min(1) });
export async function POST(request: Request) {
  if (!isStripeFoundationEnabled()) return NextResponse.json({ ok: false, code: "STRIPE_NOT_CONFIGURED", message: "Stripe checkout is disabled until required environment variables are configured.", missing: getMissingStripeEnvKeys() }, { status: 503 });
  const parsed = checkoutSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ ok: false, code: "VALIDATION_ERROR", message: "Invalid checkout request payload." }, { status: 400 });
  const { mode, planId } = parsed.data as { mode: BillingMode; planId: BillingPlanId };
  const priceId = getStripePriceId(mode, planId);
  if (!priceId) return NextResponse.json({ ok: false, code: "UNSUPPORTED_PLAN", message: "Unsupported billing plan for checkout." }, { status: 400 });
  const userId = await getCreditUserId();
  const base = process.env.NEXT_PUBLIC_APP_URL as string;
  return NextResponse.json({ ok: true, checkout: { enabled: true, provider: "stripe", mode, planId, priceId, sessionUrl: null, message: "Checkout foundation enabled, but session creation is intentionally disabled until Stripe server client wiring is completed." }, next: { successUrl: `${base}/account?billing=success`, cancelUrl: `${base}/account?billing=cancelled` }, metadata: { userId } });
}
