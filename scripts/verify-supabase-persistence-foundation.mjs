import { existsSync, readFileSync } from "node:fs";

function fail(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

const requiredFiles = [
  "lib/persistence/persistenceMode.ts",
  "lib/persistence/supabaseRest.ts",
  "lib/credits/supabaseCreditLedger.ts",
  "lib/analytics/supabaseEventStore.ts",
  "lib/billing/supabaseBillingEventStore.ts",
  "supabase/migrations/0001_nodrama_persistence.sql",
  "docs/ops/SUPABASE_PERSISTENCE_PHASE3.md",
];

for (const file of requiredFiles) {
  if (!existsSync(file)) fail(`Missing required file: ${file}`);
}

const persistenceMode = readFileSync("lib/persistence/persistenceMode.ts", "utf8");
for (const phrase of [
  "getMissingSupabasePersistenceConfig",
  "assertSupabasePersistenceConfigured",
  "SUPABASE_SERVICE_ROLE_KEY",
  "NEXT_PUBLIC_SUPABASE_URL",
]) {
  if (!persistenceMode.includes(phrase)) fail(`persistenceMode.ts missing: ${phrase}`);
}

const restClient = readFileSync("lib/persistence/supabaseRest.ts", "utf8");
for (const phrase of [
  "/rest/v1/",
  "SUPABASE_SERVICE_ROLE_KEY",
  "cache: \"no-store\"",
  "Authorization",
]) {
  if (!restClient.includes(phrase)) fail(`supabaseRest.ts missing: ${phrase}`);
}

const sql = readFileSync("supabase/migrations/0001_nodrama_persistence.sql", "utf8");
for (const phrase of [
  "create table if not exists public.credit_ledger",
  "create table if not exists public.analytics_events",
  "create table if not exists public.billing_events",
  "create table if not exists public.generation_history_metadata",
  "create table if not exists public.user_profiles",
  "create table if not exists public.plans",
  "enable row level security",
  "No full prompt storage by default",
]) {
  if (!sql.includes(phrase)) fail(`Supabase migration missing: ${phrase}`);
}

console.log("✅ Supabase persistence foundation verified");
