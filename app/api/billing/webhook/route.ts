import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { addCredits } from "@/lib/credits/creditStore";
import { logBillingEvent, markWebhookEventProcessed } from "@/lib/billing/billingEventStore";
import { getMissingStripeEnvKeys, isStripeFoundationEnabled } from "@/lib/billing/stripeConfig";

function verifyStripeSignature(payload: string, signatureHeader: string, secret: string): boolean {
  const fields = Object.fromEntries(signatureHeader.split(",").map((item) => item.split("=")));
  const timestamp = fields.t;
  const signature = fields.v1;
  if (!timestamp || !signature) return false;
  const expected = createHmac("sha256", secret).update(`${timestamp}.${payload}`, "utf8").digest("hex");
  const a = Buffer.from(signature, "utf8");
  const b = Buffer.from(expected, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  if (!isStripeFoundationEnabled()) return NextResponse.json({ ok: false, code: "STRIPE_NOT_CONFIGURED", missing: getMissingStripeEnvKeys() }, { status: 503 });
  const signatureHeader = request.headers.get("stripe-signature");
  if (!signatureHeader) return NextResponse.json({ ok: false, code: "MISSING_SIGNATURE" }, { status: 400 });
  const payload = await request.text();
  if (!verifyStripeSignature(payload, signatureHeader, process.env.STRIPE_WEBHOOK_SECRET as string)) return NextResponse.json({ ok: false, code: "INVALID_SIGNATURE" }, { status: 400 });
  const event = JSON.parse(payload) as Record<string, unknown>;
  const first = await markWebhookEventProcessed(event.id);
  if (!first) return NextResponse.json({ ok: true, duplicate: true });
  if (event.type === "checkout.session.completed" && event.data?.object?.mode === "payment") {
    const metadata = event.data?.object?.metadata || {};
    const userId = typeof metadata.userId === "string" ? metadata.userId : null;
    const credits = Number(metadata.credits || 0);
    if (userId && Number.isInteger(credits) && credits > 0) await addCredits(userId, credits);
  }
  await logBillingEvent({ eventId: event.id, type: event.type, createdAt: new Date().toISOString(), livemode: Boolean(event.livemode), metadata: { object: event.data?.object?.object ?? null, mode: event.data?.object?.mode ?? null, clientReferenceId: event.data?.object?.client_reference_id ?? null, userId: event.data?.object?.metadata?.userId ?? null, planId: event.data?.object?.metadata?.planId ?? null } });
  return NextResponse.json({ ok: true });
}
