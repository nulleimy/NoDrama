import { existsSync, readFileSync } from "node:fs";

function fail(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

const requiredFiles = [
  "lib/language/phraseScoring.ts",
  "lib/language/phraseDiversity.ts",
  "docs/PHRASE_QUALITY_ENGINE.md",
];

for (const file of requiredFiles) {
  if (!existsSync(file)) {
    fail(`Missing phrase quality file: ${file}`);
  }
}

const selector = readFileSync("lib/language/phraseSelector.ts", "utf8");
const engine = readFileSync("lib/language/phraseEngine.ts", "utf8");
const composer = readFileSync("lib/language/replyComposer.ts", "utf8");
const ui = readFileSync("components/InteractiveGenerator.tsx", "utf8");

if (!selector.includes("rankPhrases")) {
  fail("Phrase selector does not rank phrases.");
}

if (!selector.includes("diversifyRankedPhrases")) {
  fail("Phrase selector does not diversify ranked phrases.");
}

if (!engine.includes("recommendedId")) {
  fail("Phrase engine does not expose recommendedId.");
}

if (!ui.includes("Best pick")) {
  fail("UI does not show Best pick label.");
}

if (!engine.includes("composeReplyVariants")) {
  fail("Phrase engine does not use the deterministic reply composer.");
}

if (!composer.includes("isFirmContext")) {
  fail("Phrase engine does not create a distinct firm reply.");
}

if (!composer.includes("selectedPhrases") || !composer.includes("phraseFallback")) {
  fail("Reply composer should preserve phrase selector fallback behavior.");
}

console.log("✅ Phrase quality engine verified");
