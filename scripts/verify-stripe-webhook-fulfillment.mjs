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

const routePath = "app/api/billing/webhook/route.ts";
const route = requireFile(routePath, 200);

requireMatch(
  route,
  /export\s+const\s+runtime\s*=\s*["']nodejs["']/,
  "Webhook route must explicitly use the Node.js runtime."
);

requireMatch(
  route,
  /stripe_webhook_security_hold/,
  "Webhook route must retain the explicit Stripe security hold."
);

requireMatch(
  route,
  /status\s*:\s*503/,
  "Webhook security hold must return HTTP 503."
);

requireMatch(
  route,
  /Cache-Control["']?\s*:\s*["']no-store["']/i,
  "Webhook security hold must disable caching."
);

requireMatch(
  route,
  /Retry-After["']?\s*:\s*["']3600["']/i,
  "Webhook security hold must expose a retry interval."
);

rejectMatch(
  route,
  /request\.json\s*\(|req\.json\s*\(/,
  "Fail-closed webhook must not parse attacker-controlled JSON."
);

rejectMatch(
  route,
  /\bgrantCredits\s*\(|\brecordBillingEvent\s*\(|anon:local/,
  "Fail-closed webhook must not grant credits or record fulfillment."
);

rejectMatch(
  route,
  /checkout\.session\.(completed|async_payment_succeeded)/,
  "Fail-closed webhook must not dispatch Stripe checkout events."
);

const infrastructure = [
  "lib/billing/stripeWebhookVerifier.ts",
  "lib/billing/stripeWebhookFulfillment.ts",
  "lib/billing/supabaseBillingEventStore.ts",
  "lib/credits/supabaseCreditLedger.ts",
  "supabase/migrations/0001_nodrama_persistence.sql",
  "supabase/migrations/0002_atomic_credit_debit_rpc.sql",
  "supabase/migrations/0003_atomic_credit_grant_rpc.sql",
];

for (const file of infrastructure) {
  requireFile(file, 80);
}

const signatureVerifier = read("lib/billing/stripeWebhookVerifier.ts");
requireMatch(
  signatureVerifier,
  /(signature|stripe-signature|constructEvent|webhook)/i,
  "Stripe signature verifier foundation is incomplete."
);

const fulfillment = read("lib/billing/stripeWebhookFulfillment.ts");
requireMatch(
  fulfillment,
  /(fulfill|checkout|event|credit)/i,
  "Stripe fulfillment service foundation is incomplete."
);

const grantMigration = read("supabase/migrations/0003_atomic_credit_grant_rpc.sql");
requireMatch(
  grantMigration,
  /(function|procedure)/i,
  "Atomic credit grant migration must define a database routine."
);

console.log(
  "Stripe webhook fulfillment foundation verified in fail-closed security-hold mode"
);
