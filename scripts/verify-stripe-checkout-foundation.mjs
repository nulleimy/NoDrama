import { existsSync, readFileSync } from "node:fs";

const requiredFiles = [
  "lib/billing/stripeConfig.ts",
  "lib/billing/billingEventStore.ts",
  "app/api/billing/checkout/route.ts",
  "app/api/billing/webhook/route.ts",
  "app/api/billing/portal/route.ts",
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

console.log("Stripe checkout foundation verify passed");
