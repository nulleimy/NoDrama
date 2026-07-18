import { existsSync, readFileSync } from "node:fs";

function fail(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

const requiredFiles = [
  "lib/persistence/persistenceMode.ts",
  "docs/ops/PERSISTENCE_BOUNDARY.md",
  ".env.example",
  "lib/credits/creditLedger.ts",
  "lib/analytics/eventStore.ts",
  "lib/billing/billingEventStore.ts",
];

for (const file of requiredFiles) {
  if (!existsSync(file)) {
    fail(`Missing required file: ${file}`);
  }
}

const env = readFileSync(".env.example", "utf8");
if (!env.includes("NODRAMA_PERSISTENCE_BACKEND=local_json")) {
  fail(".env.example must document NODRAMA_PERSISTENCE_BACKEND=local_json");
}

for (const store of [
  "lib/credits/creditLedger.ts",
  "lib/analytics/eventStore.ts",
  "lib/billing/billingEventStore.ts",
]) {
  const text = readFileSync(store, "utf8");

  if (!text.includes("@/lib/persistence/persistenceMode")) {
    fail(`${store} is missing persistence mode import`);
  }

  if (!text.includes("assertLocalJsonPersistence")) {
    fail(`${store} must enforce the local JSON persistence boundary`);
  }
}

console.log("✅ Production persistence boundary verified");
