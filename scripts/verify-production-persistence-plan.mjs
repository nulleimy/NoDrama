import { existsSync, readFileSync } from "node:fs";

function fail(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

const docPath = "docs/architecture/PRODUCTION_PERSISTENCE_PLAN.md";

if (!existsSync(docPath)) {
  fail(`Missing required architecture doc: ${docPath}`);
}

const text = readFileSync(docPath, "utf8").toLowerCase();

const requiredPhrases = [
  "metadata-only",
  "private mode",
  "credit ledger",
  "webhook source of truth",
  "retention policy",
  "export/delete",
  "no full prompt storage by default",
];

for (const phrase of requiredPhrases) {
  if (!text.includes(phrase)) {
    fail(`Missing required phrase in persistence plan: ${phrase}`);
  }
}

console.log("✅ Production persistence plan verified");
