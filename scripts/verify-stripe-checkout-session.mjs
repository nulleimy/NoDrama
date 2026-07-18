import { readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();

function read(path) {
  return readFileSync(resolve(root, path), "utf8");
}

function requireFile(path, minimumBytes = 1) {
  const absolute = resolve(root, path);
  const stat = statSync(absolute);

  if (!stat.isFile() || stat.size < minimumBytes) {
    throw new Error(`Required file is missing or incomplete: ${path}`);
  }

  return readFileSync(absolute, "utf8");
}

function requireMatch(source, pattern, message) {
  if (!pattern.test(source)) {
    throw new Error(message);
  }
}

function rejectMatch(source, pattern, message) {
  if (pattern.test(source)) {
    throw new Error(message);
  }
}

const routePath = "app/api/billing/checkout/route.ts";
const route = requireFile(routePath, 300);

requireMatch(
  route,
  /isStripeCheckoutFoundationEnabled/,
  "Checkout route must use the server-side Stripe configuration gate."
);

requireMatch(
  route,
  /getMissingStripeConfig/,
  "Checkout route must report missing server-side configuration."
);

requireMatch(
  route,
  /stripe_checkout_foundation_disabled/,
  "Checkout route must expose an explicit disabled-state code."
);

requireMatch(
  route,
  /status\s*:\s*503/,
  "Disabled checkout foundation must return HTTP 503."
);

requireMatch(
  route,
  /stripe_session_deferred/,
  "Checkout route must expose an explicit deferred-state code."
);

requireMatch(
  route,
  /status\s*:\s*501/,
  "Deferred checkout session creation must return HTTP 501."
);

rejectMatch(
  route,
  /request\.json\s*\(|req\.json\s*\(/,
  "Deferred checkout route must not parse client-controlled checkout parameters."
);

rejectMatch(
  route,
  /checkout\.sessions\.create|price_data|line_items/,
  "Deferred checkout route must not create Stripe sessions."
);

const infrastructure = [
  "lib/billing/checkoutCatalog.ts",
  "lib/billing/stripeCheckout.ts",
  "lib/billing/stripeConfig.ts",
  "lib/billing/stripeEntitlements.ts",
  "components/CheckoutButton.tsx",
  "scripts/smoke-preview-billing.mjs",
  "docs/ops/STRIPE_CHECKOUT_SESSION_PHASE8.md",
];

for (const file of infrastructure) {
  requireFile(file, 80);
}

const catalog = read("lib/billing/checkoutCatalog.ts");
requireMatch(
  catalog,
  /(catalog|price|credit|pack)/i,
  "Server-side checkout catalog foundation is incomplete."
);

const checkoutService = read("lib/billing/stripeCheckout.ts");
requireMatch(
  checkoutService,
  /(checkout|session|stripe)/i,
  "Stripe checkout service foundation is incomplete."
);

const config = read("lib/billing/stripeConfig.ts");
requireMatch(
  config,
  /(STRIPE_SECRET_KEY|STRIPE_WEBHOOK_SECRET|stripe)/i,
  "Stripe server configuration foundation is incomplete."
);

console.log(
  "Stripe checkout session foundation verified in deferred security mode"
);
