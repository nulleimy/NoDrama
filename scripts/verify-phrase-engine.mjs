import { existsSync, readFileSync } from "node:fs";

function fail(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

const requiredFiles = [
  "lib/language/toneMap.ts",
  "lib/language/channelMap.ts",
  "lib/language/situationMatcher.ts",
  "lib/language/phraseSelector.ts",
  "lib/language/phraseEngine.ts",
];

for (const file of requiredFiles) {
  if (!existsSync(file)) {
    fail(`Missing phrase engine file: ${file}`);
  }
}

const route = readFileSync("app/api/generate/route.ts", "utf8");
const directPhraseRoute = route.includes("generatePhraseEngineReply");
const hybridRoute = route.includes("generateHybridEthicalReply");

let governedHybridRoute = false;

if (hybridRoute) {
  const hybridPath = "lib/ai/hybridGeneration.ts";
  if (!existsSync(hybridPath)) {
    fail("Generate API route uses hybrid generation but hybrid orchestrator is missing.");
  }

  const hybrid = readFileSync(hybridPath, "utf8");
  governedHybridRoute = hybrid.includes("generatePhraseEngineReply");
}

if (!directPhraseRoute && !governedHybridRoute) {
  fail("Generate API call graph does not preserve the phrase engine baseline/fallback.");
}

console.log(
  governedHybridRoute
    ? "✅ Phrase engine verified through governed hybrid fallback"
    : "✅ Phrase engine verified"
);
