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
    throw new Error(`Promotion-lock dependency is missing or incomplete: ${path}`);
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
  "package.json",
  "app/api/billing/checkout/route.ts",
  "app/api/billing/webhook/route.ts",
  "scripts/verify-production-readiness.mjs",
  "scripts/verify-release-gate.mjs",
  "docs/ops/RELEASE_GATE_STATUS.md",
  "supabase/migrations/0001_nodrama_persistence.sql",
  "supabase/migrations/0002_atomic_credit_debit_rpc.sql",
  "supabase/migrations/0003_atomic_credit_grant_rpc.sql",
];

for (const file of requiredFiles) {
  requireFile(file, 40);
}

const packageJson = JSON.parse(read("package.json"));

for (const script of ["verify", "build", "release:gate", "release:gate:strict"]) {
  if (typeof packageJson.scripts?.[script] !== "string") {
    throw new Error(`Promotion lock requires package script: ${script}`);
  }
}

const env = read(".env.example");

requireMatch(
  env,
  /^NODRAMA_ALLOW_DEV_CREDIT_GRANTS=false$/m,
  "Development credit grants must remain disabled by default."
);

const webhook = read("app/api/billing/webhook/route.ts");

requireMatch(
  webhook,
  /export\s+const\s+runtime\s*=\s*["']nodejs["']/,
  "Webhook must remain pinned to the Node.js runtime."
);

requireMatch(
  webhook,
  /stripe_webhook_security_hold/,
  "Promotion lock requires the explicit webhook security hold."
);

requireMatch(
  webhook,
  /status\s*:\s*503/,
  "Promotion lock requires webhook HTTP 503."
);

requireMatch(
  webhook,
  /Cache-Control["']?\s*:\s*["']no-store["']/i,
  "Promotion lock requires no-store on the webhook response."
);

rejectMatch(
  webhook,
  /request\.text\s*\(|req\.text\s*\(|request\.json\s*\(|req\.json\s*\(/,
  "Locked webhook must not consume the request body."
);

rejectMatch(
  webhook,
  /checkout\.session\.(completed|async_payment_succeeded)|grantCredits\s*\(|recordBillingEvent\s*\(|anon:local/,
  "Locked webhook must not perform billing fulfillment."
);

const checkout = read("app/api/billing/checkout/route.ts");

requireMatch(
  checkout,
  /stripe_checkout_foundation_disabled/,
  "Promotion lock requires the checkout disabled-state contract."
);

requireMatch(
  checkout,
  /stripe_session_deferred/,
  "Promotion lock requires the checkout deferred-state contract."
);

requireMatch(
  checkout,
  /status\s*:\s*503/,
  "Disabled checkout foundation must return HTTP 503."
);

requireMatch(
  checkout,
  /status\s*:\s*501/,
  "Deferred checkout creation must return HTTP 501."
);

rejectMatch(
  checkout,
  /checkout\.sessions\.create|request\.json\s*\(|req\.json\s*\(|price_data|line_items/,
  "Locked checkout route must not create sessions or accept client prices."
);

const readiness = read("scripts/verify-production-readiness.mjs");

requireMatch(
  readiness,
  /Production recovery readiness verified/,
  "Promotion lock requires a recovery-aware readiness contract."
);

requireMatch(
  readiness,
  /billing endpoints remain fail-closed\/deferred/,
  "Readiness contract must state that production billing remains disabled."
);

const releaseGate = read("scripts/verify-release-gate.mjs");

requireMatch(
  releaseGate,
  /(STRICT|NODRAMA_RELEASE_GATE_STRICT)/,
  "Release gate must support strict mode."
);

const statusDocument = read("docs/ops/RELEASE_GATE_STATUS.md");

requireMatch(
  statusDocument,
  /(release|gate|blocked|readiness)/i,
  "Release gate status document is incomplete."
);

console.log(
  "Production promotion lock verified: recovery is validated while billing and release promotion remain blocked"
);
