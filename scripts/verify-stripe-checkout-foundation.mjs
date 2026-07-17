import { existsSync, readFileSync } from "node:fs";

const requiredFiles = [
  "lib/billing/stripeConfig.ts",
  "lib/billing/billingEventStore.ts",
  "app/api/billing/checkout/route.ts",
  "app/api/billing/webhook/route.ts",
  "app/api/billing/portal/route.ts",
  "docs/ops/STRIPE_WEBHOOK_SECURITY_HOLD.md",
];

for (const file of requiredFiles) {
  if (!existsSync(file)) {
    throw new Error(`Missing required billing foundation file: ${file}`);
  }
}

const envExample = readFileSync(".env.example", "utf8");
for (const key of [
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "STRIPE_PRICE_STARTER_MONTHLY",
  "STRIPE_PRICE_PRO_MONTHLY",
  "STRIPE_PRICE_POWER_MONTHLY",
  "STRIPE_PRICE_SOS_PACK",
  "STRIPE_PRICE_MINI_PACK",
  "STRIPE_PRICE_KLID_PACK",
  "NEXT_PUBLIC_APP_URL",
]) {
  if (!envExample.includes(`${key}=`)) {
    throw new Error(`Missing env var in .env.example: ${key}`);
  }
}

const webhookRoute = readFileSync("app/api/billing/webhook/route.ts", "utf8");
for (const token of [
  'code: "stripe_webhook_security_hold"',
  "status: 503",
  '"Cache-Control": "no-store"',
  '"Retry-After": "3600"',
]) {
  if (!webhookRoute.includes(token)) {
    throw new Error(`Stripe webhook security hold missing required token: ${token}`);
  }
}

for (const forbiddenToken of [
  "recordBillingEvent",
  "grantCredits",
  "request.json(",
  "req.json(",
  "checkout.session",
  "anon:local",
]) {
  if (webhookRoute.includes(forbiddenToken)) {
    throw new Error(`Stripe webhook security hold contains forbidden token: ${forbiddenToken}`);
  }
}

const holdDoc = readFileSync("docs/ops/STRIPE_WEBHOOK_SECURITY_HOLD.md", "utf8");
for (const token of [
  "exact raw request body",
  "unique constraint",
  "one database transaction",
  "authenticated NoDrama account",
  "allowlisted server-side price mapping",
]) {
  if (!holdDoc.includes(token)) {
    throw new Error(`Stripe webhook security hold runbook missing required token: ${token}`);
  }
}

console.log("Stripe checkout foundation and webhook security hold verify passed");
