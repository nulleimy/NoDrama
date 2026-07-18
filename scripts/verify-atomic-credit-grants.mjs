import { existsSync, readFileSync } from "node:fs";

function fail(message) {
  console.error("ERROR: " + message);
  process.exit(1);
}

const requiredFiles = [
  "supabase/migrations/0003_atomic_credit_grant_rpc.sql",
  "lib/credits/supabaseCreditLedger.ts",
  "lib/credits/creditLedger.ts",
  "lib/billing/stripeEntitlements.ts",
  "docs/ops/ATOMIC_CREDIT_GRANTS_PHASE6.md",
];

for (const file of requiredFiles) {
  if (!existsSync(file)) fail("Missing required file: " + file);
}

const sql = readFileSync("supabase/migrations/0003_atomic_credit_grant_rpc.sql", "utf8");
for (const phrase of [
  "create or replace function public.nodrama_grant_credits",
  "pg_advisory_xact_lock(hashtext(p_account_key))",
  "idempotency_key = p_idempotency_key",
  "p_amount must be positive",
  "revoke all on function public.nodrama_grant_credits",
]) {
  if (!sql.includes(phrase)) fail("Atomic credit grant migration missing: " + phrase);
}

const adapter = readFileSync("lib/credits/supabaseCreditLedger.ts", "utf8");
for (const phrase of [
  "grantSupabaseCreditsAtomically",
  "nodrama_grant_credits",
  "p_account_key",
  "p_idempotency_key",
]) {
  if (!adapter.includes(phrase)) fail("Supabase credit grant adapter missing: " + phrase);
}

const ledger = readFileSync("lib/credits/creditLedger.ts", "utf8");
for (const phrase of [
  "grantSupabaseCreditsAtomically",
  "getPersistenceBackend() === \"supabase\"",
]) {
  if (!ledger.includes(phrase)) fail("Credit ledger missing atomic grant routing: " + phrase);
}

const entitlements = readFileSync("lib/billing/stripeEntitlements.ts", "utf8");
for (const phrase of [
  "resolveStripeCreditEntitlement",
  "buildStripeCreditGrantIdempotencyKey",
  "STRIPE_PRICE_CREDITS_25",
  "STRIPE_PRICE_CREDITS_100",
  "STRIPE_PRICE_PRO_MONTHLY",
]) {
  if (!entitlements.includes(phrase)) fail("Stripe entitlement map missing: " + phrase);
}

console.log("OK: Atomic credit grants verified");
