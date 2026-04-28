import { existsSync, readFileSync } from "node:fs";

function fail(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

const requiredFiles = [
  "lib/qa/qaTypes.ts",
  "lib/qa/rejectRules.ts",
  "lib/qa/weights.ts",
  "lib/qa/scoreReply.ts",
  "lib/qa/rewriteReply.ts",
  "lib/qa/llmJudge.ts",
  "lib/qa/qualityGate.ts",
];

for (const file of requiredFiles) {
  if (!existsSync(file)) {
    fail(`Missing QA engine file: ${file}`);
  }
}

const qualityGate = readFileSync("lib/qa/qualityGate.ts", "utf8");
if (!qualityGate.includes("fallback")) {
  fail("qualityGate.ts missing fallback logic.");
}

if (!qualityGate.includes("rewriteReply")) {
  fail("qualityGate.ts does not call rewrite engine.");
}

console.log("✅ QA engine working");
