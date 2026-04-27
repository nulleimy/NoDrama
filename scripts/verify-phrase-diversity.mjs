import { readFileSync } from "node:fs";

function fail(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

const file = readFileSync("lib/language/phraseDiversity.ts", "utf8");

if (!file.includes("> 0.52")) {
  fail("Phrase diversity similarity threshold is not strict enough.");
}

if (!file.includes("openingFingerprint")) {
  fail("Phrase diversity does not check opening fingerprint.");
}

if (!file.includes("coreFingerprint")) {
  fail("Phrase diversity does not check core fingerprint.");
}

console.log("✅ Phrase diversity verified");
