import { existsSync, readFileSync } from "node:fs";

function fail(message) {
  console.error("ERROR: " + message);
  process.exit(1);
}

const requiredFiles = [
  "app/api/billing/webhook/route.ts",
  "lib/billing/stripeWebhookVerifier.ts",
  "lib/billing/stripeWebhookFulfillment.ts",
  "lib/billing/stripeEntitlements.ts",
  "lib/billing/stripeConfig.ts",
  "docs/ops/STRIPE_WEBHOOK_FULFILLMENT_PHASE7.md",
];

for (const file of requiredFiles) {
  if (!existsSync(file)) fail("Missing required file: " + file);
}

const route = readFileSync("app/api/billing/webhook/route.ts", "utf8");
for (const phrase of [
  "export const runtime = \"nodejs\"",
  "await req.text()",
  "stripe-signature",
  "verifyStripeWebhookPayload",
  "fulfillStripeWebhookEvent",
]) {
  if (!route.includes(phrase)) fail("Webhook route missing: " + phrase);
}

if (route.includes("await req.json()")) {
  fail("Webhook route must not parse JSON before signature verification.");
}

const verifier = readFileSync("lib/billing/stripeWebhookVerifier.ts", "utf8");
for (const phrase of [
  "createHmac(\"sha256\"",
  "timingSafeEqual",
  "Stripe-Signature",
  "timestamp is outside tolerance",
]) {
  if (!verifier.includes(phrase)) fail("Webhook verifier missing: " + phrase);
}

const fulfillment = readFileSync("lib/billing/stripeWebhookFulfillment.ts", "utf8");
for (const phrase of [
  "recordBillingEvent",
  "resolveStripeCreditEntitlement",
  "resolveStripeCreditEntitlementByKey",
  "buildStripeCreditGrantIdempotencyKey",
  "grantCredits",
  "checkout.session.completed",
  "invoice.paid",
]) {
  if (!fulfillment.includes(phrase)) fail("Webhook fulfillment missing: " + phrase);
}

const config = readFileSync("lib/billing/stripeConfig.ts", "utf8");
for (const phrase of [
  "getMissingStripeWebhookFulfillmentConfig",
  "STRIPE_WEBHOOK_SECRET",
  "STRIPE_PRICE_CREDITS_25",
  "STRIPE_PRICE_CREDITS_100",
  "STRIPE_PRICE_PRO_MONTHLY",
]) {
  if (!config.includes(phrase)) fail("Stripe config missing: " + phrase);
}

console.log("OK: Stripe webhook fulfillment verified");
