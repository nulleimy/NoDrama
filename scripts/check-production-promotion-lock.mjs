import { existsSync, readFileSync } from "node:fs";
import { execSync } from "node:child_process";

function fail(message) {
  console.error("ERROR: " + message);
  process.exit(1);
}

function ok(message) {
  console.log("OK: " + message);
}

const requiredFiles = [
  "scripts/preflight-production-deploy.mjs",
  "scripts/smoke-preview-billing.mjs",
  "scripts/verify-production-readiness.mjs",
  "docs/ops/PREVIEW_SMOKE_PHASE18.md",
  "app/api/billing/webhook/route.ts",
  "app/api/billing/checkout/route.ts",
  "lib/billing/stripeWebhookFulfillment.ts",
  "lib/billing/stripeCheckout.ts",
];

for (const file of requiredFiles) {
  if (!existsSync(file)) fail("Missing required production promotion file: " + file);
}

const webhook = readFileSync("app/api/billing/webhook/route.ts", "utf8");
if (!webhook.includes("await req.text()")) {
  fail("Webhook must use raw request body.");
}
if (webhook.includes("await req.json()")) {
  fail("Webhook must not parse JSON before Stripe signature verification.");
}

const fulfillment = readFileSync("lib/billing/stripeWebhookFulfillment.ts", "utf8");
for (const phrase of [
  "recordBillingEvent",
  "grantCredits",
  "source: \"stripe_webhook\"",
  "buildStripeCreditGrantIdempotencyKey",
]) {
  if (!fulfillment.includes(phrase)) {
    fail("Webhook fulfillment missing: " + phrase);
  }
}

const checkout = readFileSync("lib/billing/stripeCheckout.ts", "utf8");
for (const phrase of [
  "client_reference_id",
  "metadata[nodrama_account_key]",
  "metadata[nodrama_entitlement_key]",
  "subscription_data[metadata][nodrama_account_key]",
]) {
  if (!checkout.includes(phrase)) {
    fail("Checkout missing: " + phrase);
  }
}

const status = execSync("git status --short", { encoding: "utf8" }).trim();
if (status) {
  fail("Working tree is not clean. Commit or revert before production promotion:\n" + status);
}

ok("Production promotion lock passed");
