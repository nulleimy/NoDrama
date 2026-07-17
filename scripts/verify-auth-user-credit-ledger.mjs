import { readFileSync, existsSync } from "node:fs";

function fail(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

const mustExist = [
  "lib/credits/creditLedger.ts",
  "app/api/credits/status/route.ts",
  "app/api/credits/add/route.ts",
  "app/api/billing/webhook/route.ts",
  "docs/ops/CREDIT_LEDGER.md",
  "docs/ops/STRIPE_WEBHOOK_SECURITY_HOLD.md",
];

for (const file of mustExist) {
  if (!existsSync(file)) fail(`Missing required file: ${file}`);
}

const ledger = readFileSync("lib/credits/creditLedger.ts", "utf8");
for (const token of ["delta", "reason", "source", "referenceId", "idempotencyKey"]) {
  if (!ledger.includes(token)) fail(`Ledger entry is missing: ${token}`);
}
if (ledger.includes("prompt") || ledger.includes("reply")) {
  fail("Ledger should not store full prompt/reply content.");
}

const statusRoute = readFileSync("app/api/credits/status/route.ts", "utf8");
if (!statusRoute.includes("getCreditIdentity") && !statusRoute.includes("buildCreditStatus")) {
  fail("Credits status route is not user/session aware.");
}

const addRoute = readFileSync("app/api/credits/add/route.ts", "utf8");
if (
  !addRoute.includes("NODRAMA_TEST_MODE") &&
  !addRoute.includes("NODRAMA_ALLOW_DEV_CREDIT_GRANTS")
) {
  fail("Credits add route is not guarded for production.");
}

const webhookRoute = readFileSync("app/api/billing/webhook/route.ts", "utf8");
for (const token of ['code: "stripe_webhook_security_hold"', "status: 503"]) {
  if (!webhookRoute.includes(token)) {
    fail(`Webhook must remain fail closed until secure fulfillment exists: ${token}`);
  }
}
for (const forbiddenToken of ["grantCredits", 'source: "stripe_webhook"', "anon:local"]) {
  if (webhookRoute.includes(forbiddenToken)) {
    fail(`Webhook security hold contains unsafe fulfillment token: ${forbiddenToken}`);
  }
}

const envExample = readFileSync(".env.example", "utf8");
if (
  !envExample.includes("NODRAMA_ALLOW_DEV_CREDIT_GRANTS=") &&
  !envExample.includes("NODRAMA_ENABLE_DEV_CREDIT_GRANTS=")
) {
  fail(".env.example missing dev-credit-grant toggle.");
}

const verifyScript = readFileSync("scripts/verify.sh", "utf8");
if (!verifyScript.includes("verify-auth-user-credit-ledger.mjs")) {
  fail("scripts/verify.sh does not wire verify-auth-user-credit-ledger.mjs");
}

console.log("✅ Auth user credit ledger and webhook security hold verified");
