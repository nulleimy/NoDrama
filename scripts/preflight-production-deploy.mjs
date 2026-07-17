import { existsSync, readFileSync } from "node:fs";
import { execSync } from "node:child_process";

function fail(message) {
  console.error("ERROR: " + message);
  process.exit(1);
}

function ok(message) {
  console.log("OK: " + message);
}

function warn(message) {
  console.warn("WARN: " + message);
}

function fileIncludes(file, phrase) {
  if (!existsSync(file)) fail("Missing file: " + file);
  return readFileSync(file, "utf8").includes(phrase);
}

if (!existsSync(".env.local")) {
  warn(".env.local missing. OK for CI, not OK for local smoke test.");
} else {
  ok(".env.local exists locally");
}

if (existsSync(".gitignore")) {
  const gitignore = readFileSync(".gitignore", "utf8");
  if (!gitignore.split(/\r?\n/).includes(".env.local")) {
    fail(".gitignore must contain .env.local");
  }
  ok(".env.local is ignored");
}

const requiredFiles = [
  "supabase/migrations/0001_nodrama_persistence.sql",
  "supabase/migrations/0002_atomic_credit_debit_rpc.sql",
  "supabase/migrations/0003_atomic_credit_grant_rpc.sql",
  "app/api/billing/webhook/route.ts",
  "app/api/billing/checkout/route.ts",
  "lib/billing/stripeWebhookVerifier.ts",
  "lib/billing/stripeWebhookFulfillment.ts",
  "lib/billing/stripeCheckout.ts",
  "scripts/verify-production-readiness.mjs",
];

for (const file of requiredFiles) {
  if (!existsSync(file)) fail("Missing deploy readiness file: " + file);
}

if (!fileIncludes("app/api/billing/webhook/route.ts", "await req.text()")) {
  fail("Webhook route must read raw body with req.text().");
}

if (fileIncludes("app/api/billing/webhook/route.ts", "await req.json()")) {
  fail("Webhook route must not use req.json() before Stripe signature verification.");
}

for (const phrase of [
  "client_reference_id",
  "metadata[nodrama_account_key]",
  "metadata[nodrama_entitlement_key]",
  "subscription_data[metadata][nodrama_account_key]",
]) {
  if (!fileIncludes("lib/billing/stripeCheckout.ts", phrase)) {
    fail("Stripe checkout missing: " + phrase);
  }
}

for (const phrase of [
  "recordBillingEvent",
  "grantCredits",
  "source: \"stripe_webhook\"",
  "buildStripeCreditGrantIdempotencyKey",
]) {
  if (!fileIncludes("lib/billing/stripeWebhookFulfillment.ts", phrase)) {
    fail("Stripe webhook fulfillment missing: " + phrase);
  }
}

const status = execSync("git status --short", { encoding: "utf8" }).trim();

if (status) {
  warn("Working tree is not clean:");
  console.warn(status);
} else {
  ok("Working tree clean");
}

ok("Production deploy preflight passed");
