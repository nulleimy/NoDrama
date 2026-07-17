import { existsSync, readdirSync, readFileSync } from "node:fs";

function fail(message) {
  console.error("ERROR: " + message);
  process.exit(1);
}

function warn(message) {
  console.warn("WARN: " + message);
}

const requiredFiles = [
  ".env.example",
  "supabase/migrations/0001_nodrama_persistence.sql",
  "supabase/migrations/0002_atomic_credit_debit_rpc.sql",
  "supabase/migrations/0003_atomic_credit_grant_rpc.sql",
  "app/api/billing/webhook/route.ts",
  "app/api/billing/checkout/route.ts",
  "lib/billing/stripeWebhookFulfillment.ts",
  "lib/billing/stripeCheckout.ts",
  "lib/persistence/persistenceMode.ts",
  "docs/ops/STRIPE_WEBHOOK_FULFILLMENT_PHASE7.md",
  "docs/ops/STRIPE_CHECKOUT_SESSION_PHASE8.md",
];

for (const file of requiredFiles) {
  if (!existsSync(file)) fail("Missing production readiness file: " + file);
}

const migrations = readdirSync("supabase/migrations").filter((file) => file.endsWith(".sql")).sort();
const expectedMigrations = [
  "0001_nodrama_persistence.sql",
  "0002_atomic_credit_debit_rpc.sql",
  "0003_atomic_credit_grant_rpc.sql",
];

for (const migration of expectedMigrations) {
  if (!migrations.includes(migration)) {
    fail("Missing Supabase migration: " + migration);
  }
}

const envExample = readFileSync(".env.example", "utf8");

const requiredEnvKeys = [
  "NODRAMA_PERSISTENCE_BACKEND=",
  "NEXT_PUBLIC_SUPABASE_URL=",
  "SUPABASE_SERVICE_ROLE_KEY=",
  "STRIPE_SECRET_KEY=",
  "STRIPE_WEBHOOK_SECRET=",
  "NEXT_PUBLIC_APP_URL=",
  "STRIPE_PRICE_SOS_PACK=",
  "STRIPE_PRICE_MINI_PACK=",
  "STRIPE_PRICE_KLID_PACK=",
  "STRIPE_PRICE_STARTER_MONTHLY=",
  "STRIPE_PRICE_PRO_MONTHLY=",
  "STRIPE_PRICE_POWER_MONTHLY=",
];

for (const key of requiredEnvKeys) {
  if (!envExample.includes(key)) {
    fail(".env.example missing required key: " + key);
  }
}

const webhookRoute = readFileSync("app/api/billing/webhook/route.ts", "utf8");
if (webhookRoute.includes("await req.json()")) {
  fail("Webhook route must not use req.json() before Stripe signature verification.");
}
if (!webhookRoute.includes("await req.text()")) {
  fail("Webhook route must read raw request body with req.text().");
}

const checkoutRoute = readFileSync("app/api/billing/checkout/route.ts", "utf8");
if (!checkoutRoute.includes("getCreditIdentity")) {
  fail("Checkout route must bind session to internal credit identity.");
}
if (!checkoutRoute.includes("createStripeCheckoutSession")) {
  fail("Checkout route must create a real Stripe Checkout Session.");
}

const checkout = readFileSync("lib/billing/stripeCheckout.ts", "utf8");
for (const phrase of [
  "client_reference_id",
  "metadata[nodrama_account_key]",
  "metadata[nodrama_entitlement_key]",
  "subscription_data[metadata][nodrama_account_key]",
]) {
  if (!checkout.includes(phrase)) {
    fail("Stripe checkout missing required metadata binding: " + phrase);
  }
}

const fulfillment = readFileSync("lib/billing/stripeWebhookFulfillment.ts", "utf8");
for (const phrase of [
  "recordBillingEvent",
  "grantCredits",
  "source: \"stripe_webhook\"",
  "buildStripeCreditGrantIdempotencyKey",
]) {
  if (!fulfillment.includes(phrase)) {
    fail("Webhook fulfillment missing required production behavior: " + phrase);
  }
}

if (process.env.NODRAMA_PERSISTENCE_BACKEND === "supabase") {
  const runtimeKeys = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "NEXT_PUBLIC_APP_URL",
  ];

  for (const key of runtimeKeys) {
    if (!process.env[key]?.trim()) {
      fail("Runtime production env missing: " + key);
    }
  }
} else {
  warn("Runtime env is not set to NODRAMA_PERSISTENCE_BACKEND=supabase. This is OK for local dev, not production.");
}

console.log("OK: Production readiness gate verified");
