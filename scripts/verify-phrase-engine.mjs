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

if (!route.includes("generatePhraseEngineReply")) {
  fail("Generate API route does not use phrase engine.");
}

console.log("✅ Phrase engine verified");
