import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

export type StripeWebhookEvent = {
  id: string;
  type: string;
  created?: number;
  livemode?: boolean;
  data?: {
    object?: Record<string, unknown>;
  };
  [key: string]: unknown;
};

export class StripeWebhookVerificationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StripeWebhookVerificationError";
  }
}

function parseStripeSignatureHeader(header: string) {
  const values = new Map<string, string[]>();

  for (const part of header.split(",")) {
    const [key, value] = part.split("=", 2);
    if (!key || !value) continue;
    const existing = values.get(key) || [];
    existing.push(value);
    values.set(key, existing);
  }

  const timestamp = values.get("t")?.[0];
  const signatures = values.get("v1") || [];

  if (!timestamp || signatures.length === 0) {
    throw new StripeWebhookVerificationError("Stripe signature header is missing t or v1.");
  }

  return { timestamp, signatures };
}

function safeEqualHex(a: string, b: string) {
  const left = Buffer.from(a, "hex");
  const right = Buffer.from(b, "hex");

  if (left.length !== right.length) return false;

  return timingSafeEqual(left, right);
}

export function verifyStripeWebhookPayload(input: {
  rawBody: string;
  signatureHeader: string | null;
  webhookSecret: string | undefined;
  toleranceSeconds?: number;
}) {
  if (!input.webhookSecret) {
    throw new StripeWebhookVerificationError("STRIPE_WEBHOOK_SECRET is missing.");
  }

  if (!input.signatureHeader) {
    throw new StripeWebhookVerificationError("Stripe-Signature header is missing.");
  }

  const { timestamp, signatures } = parseStripeSignatureHeader(input.signatureHeader);
  const timestampNumber = Number(timestamp);

  if (!Number.isFinite(timestampNumber)) {
    throw new StripeWebhookVerificationError("Stripe signature timestamp is invalid.");
  }

  const toleranceSeconds = input.toleranceSeconds ?? 300;
  const nowSeconds = Math.floor(Date.now() / 1000);

  if (Math.abs(nowSeconds - timestampNumber) > toleranceSeconds) {
    throw new StripeWebhookVerificationError("Stripe signature timestamp is outside tolerance.");
  }

  const signedPayload = `${timestamp}.${input.rawBody}`;
  const expectedSignature = createHmac("sha256", input.webhookSecret)
    .update(signedPayload, "utf8")
    .digest("hex");

  const valid = signatures.some((signature) => safeEqualHex(expectedSignature, signature));

  if (!valid) {
    throw new StripeWebhookVerificationError("Stripe webhook signature verification failed.");
  }

  const parsed = JSON.parse(input.rawBody) as StripeWebhookEvent;

  if (!parsed.id || !parsed.type) {
    throw new StripeWebhookVerificationError("Stripe event payload is missing id or type.");
  }

  return parsed;
}
