import { existsSync, readFileSync } from "node:fs";

function fail(message) {
  console.error("ERROR: " + message);
  process.exit(1);
}

const requiredFiles = [
  "lib/billing/checkoutCatalog.ts",
  "lib/billing/stripeCheckout.ts",
  "app/api/billing/checkout/route.ts",
  "components/CheckoutButton.tsx",
  "components/CreditPacks.tsx",
  "components/PricingCards.tsx",
  "lib/billing/stripeEntitlements.ts",
  "docs/ops/STRIPE_CHECKOUT_SESSION_PHASE8.md",
];

for (const file of requiredFiles) {
  if (!existsSync(file)) fail("Missing required file: " + file);
}

const checkout = readFileSync("lib/billing/stripeCheckout.ts", "utf8");
for (const phrase of [
  "https://api.stripe.com/v1/checkout/sessions",
  "client_reference_id",
  "metadata[nodrama_account_key]",
  "metadata[nodrama_entitlement_key]",
  "subscription_data[metadata][nodrama_account_key]",
  "application/x-www-form-urlencoded",
]) {
  if (!checkout.includes(phrase)) fail("Stripe checkout helper missing: " + phrase);
}

const route = readFileSync("app/api/billing/checkout/route.ts", "utf8");
for (const phrase of [
  "resolveCheckoutCatalogItem",
  "getCreditIdentity",
  "createStripeCheckoutSession",
  "checkoutUrl",
]) {
  if (!route.includes(phrase)) fail("Checkout route missing: " + phrase);
}

if (route.includes("stripe_session_deferred")) {
  fail("Checkout route still contains deferred placeholder.");
}

const catalog = readFileSync("lib/billing/checkoutCatalog.ts", "utf8");
for (const phrase of [
  "pack_sos",
  "pack_mini",
  "pack_klid",
  "starter_monthly",
  "pro_monthly",
  "power_monthly",
  "STRIPE_PRICE_SOS_PACK",
  "STRIPE_PRICE_POWER_MONTHLY",
]) {
  if (!catalog.includes(phrase)) fail("Checkout catalog missing: " + phrase);
}

const entitlements = readFileSync("lib/billing/stripeEntitlements.ts", "utf8");
for (const phrase of [
  "pack_sos",
  "pack_mini",
  "pack_klid",
  "starter_monthly",
  "pro_monthly",
  "power_monthly",
]) {
  if (!entitlements.includes(phrase)) fail("Stripe entitlements missing: " + phrase);
}

const creditPacks = readFileSync("components/CreditPacks.tsx", "utf8");
if (!creditPacks.includes("CheckoutButton")) fail("CreditPacks must use CheckoutButton.");
if (creditPacks.includes("cursor-not-allowed")) fail("CreditPacks still contains disabled checkout UI.");

const pricingCards = readFileSync("components/PricingCards.tsx", "utf8");
if (!pricingCards.includes("CheckoutButton")) fail("PricingCards must use CheckoutButton.");

console.log("OK: Stripe checkout session creation verified");
