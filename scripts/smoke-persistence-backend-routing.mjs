import { existsSync, readFileSync } from "node:fs";

function fail(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

const checks = [
  [
    "lib/credits/creditLedger.ts",
    [
      "getPersistenceBackend() === \"supabase\"",
      "readSupabaseCreditLedgerEntries",
      "insertSupabaseCreditLedgerEntry",
      "readLocalCreditLedgerDb",
      "writeLocalCreditLedgerDb",
    ],
  ],
  [
    "lib/analytics/eventStore.ts",
    [
      "getPersistenceBackend() === \"supabase\"",
      "storeSupabaseAnalyticsEvent",
      "readSupabaseAnalyticsEvents",
      "assertLocalJsonPersistence(\"Analytics event store\")",
    ],
  ],
  [
    "lib/billing/billingEventStore.ts",
    [
      "getPersistenceBackend() === \"supabase\"",
      "recordSupabaseBillingEvent",
      "readLocalBillingDb",
      "writeLocalBillingDb",
    ],
  ],
  [
    "docs/ops/PERSISTENCE_RUNTIME_WIRING_PHASE4.md",
    [
      "backend routing added",
      "Credit debit is still not fully transactional",
      "Phase 5",
    ],
  ],
];

for (const [file, phrases] of checks) {
  if (!existsSync(file)) fail(`Missing file: ${file}`);
  const text = readFileSync(file, "utf8");

  for (const phrase of phrases) {
    if (!text.includes(phrase)) {
      fail(`${file} missing phrase: ${phrase}`);
    }
  }
}

console.log("✅ Persistence backend routing smoke verified");
