import { readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();

function absolute(path) {
  return resolve(root, path);
}

function read(path) {
  return readFileSync(absolute(path), "utf8");
}

function requireFile(path, minimumBytes = 1) {
  const target = absolute(path);
  const stat = statSync(target);

  if (!stat.isFile() || stat.size < minimumBytes) {
    throw new Error(`Required production-readiness file is missing or incomplete: ${path}`);
  }

  return readFileSync(target, "utf8");
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

const requiredFiles = [
  ".env.example",
  ".gitignore",
  "package.json",
  "app/api/billing/checkout/route.ts",
  "app/api/billing/webhook/route.ts",
  "lib/billing/checkoutCatalog.ts",
  "lib/billing/stripeCheckout.ts",
  "lib/billing/stripeConfig.ts",
  "lib/billing/stripeEntitlements.ts",
  "lib/billing/stripeWebhookVerifier.ts",
  "lib/billing/stripeWebhookFulfillment.ts",
  "lib/billing/supabaseBillingEventStore.ts",
  "lib/credits/supabaseCreditLedger.ts",
  "lib/persistence/persistenceMode.ts",
  "lib/persistence/supabaseRest.ts",
  "supabase/migrations/0001_nodrama_persistence.sql",
  "supabase/migrations/0002_atomic_credit_debit_rpc.sql",
  "supabase/migrations/0003_atomic_credit_grant_rpc.sql",
  "scripts/smoke-persistence-backend-routing.mjs",
  "scripts/smoke-preview-billing.mjs",
  "scripts/verify-stripe-webhook-fulfillment.mjs",
  "scripts/verify-stripe-checkout-session.mjs",
  "docs/ops/PRODUCTION_READINESS_PHASE10.md",
  "docs/ops/RELEASE_GATE_STATUS.md",
];

for (const file of requiredFiles) {
  requireFile(file, 40);
}

const packageJson = JSON.parse(read("package.json"));

for (const script of ["verify", "lint", "build", "release:gate", "release:gate:strict"]) {
  if (typeof packageJson.scripts?.[script] !== "string") {
    throw new Error(`package.json is missing required script: ${script}`);
  }
}

const env = read(".env.example");

const environmentContracts = [
  {
    label: "persistence backend",
    keys: ["NODRAMA_PERSISTENCE_BACKEND"],
  },
  {
    label: "Supabase URL",
    keys: ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_URL"],
  },
  {
    label: "Supabase service role",
    keys: ["SUPABASE_SERVICE_ROLE_KEY"],
  },
  {
    label: "Stripe secret key",
    keys: ["STRIPE_SECRET_KEY"],
  },
  {
    label: "Stripe webhook secret",
    keys: ["STRIPE_WEBHOOK_SECRET"],
  },
  {
    label: "development credit grant control",
    keys: [
      "NODRAMA_ALLOW_DEV_CREDIT_GRANTS",
      "NODRAMA_ENABLE_DEV_CREDIT_GRANTS",
    ],
  },
];

for (const contract of environmentContracts) {
  const documented = contract.keys.some((key) =>
    new RegExp(`^${key}=`, "m").test(env)
  );

  if (!documented) {
    throw new Error(
      `.env.example must document ${contract.label}: ${contract.keys.join(" or ")}`
    );
  }
}

requireMatch(
  env,
  /^NODRAMA_ALLOW_DEV_CREDIT_GRANTS=false$/m,
  "Development credit grants must be disabled by default."
);

const gitignore = read(".gitignore");

requireMatch(
  gitignore,
  /(^|\n)\.env(\.local)?(\n|$)|\.env\*/,
  ".gitignore must exclude local environment files."
);

requireMatch(
  gitignore,
  /supabase\/\.temp\//,
  ".gitignore must exclude Supabase local CLI state."
);

const webhook = read("app/api/billing/webhook/route.ts");

requireMatch(
  webhook,
  /export\s+const\s+runtime\s*=\s*["']nodejs["']/,
  "Webhook route must explicitly use the Node.js runtime."
);

requireMatch(
  webhook,
  /stripe_webhook_security_hold/,
  "Webhook route must retain the explicit security-hold code."
);

requireMatch(
  webhook,
  /status\s*:\s*503/,
  "Webhook security hold must return HTTP 503."
);

requireMatch(
  webhook,
  /Cache-Control["']?\s*:\s*["']no-store["']/i,
  "Webhook security hold must disable caching."
);

rejectMatch(
  webhook,
  /request\.json\s*\(|req\.json\s*\(|request\.text\s*\(|req\.text\s*\(/,
  "Fail-closed webhook must not parse a request body before re-enablement."
);

rejectMatch(
  webhook,
  /checkout\.session\.(completed|async_payment_succeeded)|grantCredits\s*\(|recordBillingEvent\s*\(|anon:local/,
  "Fail-closed webhook must not perform fulfillment."
);

const checkout = read("app/api/billing/checkout/route.ts");

requireMatch(
  checkout,
  /stripe_checkout_foundation_disabled/,
  "Checkout route must expose an explicit disabled state."
);

requireMatch(
  checkout,
  /status\s*:\s*503/,
  "Disabled checkout foundation must return HTTP 503."
);

requireMatch(
  checkout,
  /stripe_session_deferred/,
  "Checkout route must expose an explicit deferred state."
);

requireMatch(
  checkout,
  /status\s*:\s*501/,
  "Deferred checkout session creation must return HTTP 501."
);

rejectMatch(
  checkout,
  /checkout\.sessions\.create|request\.json\s*\(|req\.json\s*\(|price_data|line_items/,
  "Deferred checkout route must not create sessions or accept client-controlled prices."
);

const persistenceMode = read("lib/persistence/persistenceMode.ts");

requireMatch(
  persistenceMode,
  /(local_json|supabase)/,
  "Persistence mode contract must declare supported backends."
);

const migration1 = read("supabase/migrations/0001_nodrama_persistence.sql");
const migration2 = read("supabase/migrations/0002_atomic_credit_debit_rpc.sql");
const migration3 = read("supabase/migrations/0003_atomic_credit_grant_rpc.sql");

requireMatch(
  migration1,
  /create\s+table/i,
  "Initial Supabase migration must create durable tables."
);

requireMatch(
  migration2,
  /create\s+(or\s+replace\s+)?function/i,
  "Atomic credit debit migration must define a database function."
);

requireMatch(
  migration3,
  /create\s+(or\s+replace\s+)?function/i,
  "Atomic credit grant migration must define a database function."
);

const webhookVerifier = read("scripts/verify-stripe-webhook-fulfillment.mjs");
const checkoutVerifier = read("scripts/verify-stripe-checkout-session.mjs");

requireMatch(
  webhookVerifier,
  /fail-closed security-hold mode/,
  "Webhook verification contract must understand fail-closed mode."
);

requireMatch(
  checkoutVerifier,
  /deferred security mode/,
  "Checkout verification contract must understand deferred mode."
);

console.log(
  "Production recovery readiness verified: persistence foundation is present; billing endpoints remain fail-closed/deferred"
);
