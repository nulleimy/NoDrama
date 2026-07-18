import { existsSync, readFileSync } from "node:fs";

function fail(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

const requiredFiles = [
  "supabase/migrations/0002_atomic_credit_debit_rpc.sql",
  "lib/persistence/supabaseRest.ts",
  "lib/credits/supabaseCreditLedger.ts",
  "lib/credits/creditLedger.ts",
  "docs/ops/ATOMIC_CREDIT_LEDGER_PHASE5.md",
];

for (const file of requiredFiles) {
  if (!existsSync(file)) fail(`Missing required file: ${file}`);
}

const sql = readFileSync("supabase/migrations/0002_atomic_credit_debit_rpc.sql", "utf8");
for (const phrase of [
  "create or replace function public.nodrama_debit_credits",
  "pg_advisory_xact_lock(hashtext(p_account_key))",
  "idempotency_key = p_idempotency_key",
  "v_balance < p_amount",
  "'generation_debit'",
  "revoke all on function public.nodrama_debit_credits",
]) {
  if (!sql.includes(phrase)) fail(`Atomic credit RPC migration missing: ${phrase}`);
}

const rest = readFileSync("lib/persistence/supabaseRest.ts", "utf8");
for (const phrase of [
  "supabaseRpcRequest",
  "/rest/v1/rpc/",
  "cache: \"no-store\"",
]) {
  if (!rest.includes(phrase)) fail(`Supabase REST client missing: ${phrase}`);
}

const adapter = readFileSync("lib/credits/supabaseCreditLedger.ts", "utf8");
for (const phrase of [
  "debitSupabaseCreditsAtomically",
  "nodrama_debit_credits",
  "p_account_key",
  "p_idempotency_key",
]) {
  if (!adapter.includes(phrase)) fail(`Supabase credit adapter missing: ${phrase}`);
}

const ledger = readFileSync("lib/credits/creditLedger.ts", "utf8");
for (const phrase of [
  "debitSupabaseCreditsAtomically",
  "getPersistenceBackend() === \"supabase\"",
]) {
  if (!ledger.includes(phrase)) fail(`Credit ledger missing runtime atomic debit routing: ${phrase}`);
}

console.log("✅ Atomic credit debit RPC verified");
