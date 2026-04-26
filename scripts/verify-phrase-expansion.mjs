import { readFileSync } from "node:fs";

function fail(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

const expansionFile = readFileSync("lib/language/phraseExpansion.ts", "utf8");
const patternsFile = readFileSync("lib/language/phrasePatterns.ts", "utf8");
const selectorFile = readFileSync("lib/language/phraseSelector.ts", "utf8");

if (!expansionFile.includes("getExpandedPhraseBank")) {
  fail("Missing getExpandedPhraseBank in phrase expansion.");
}

if (!patternsFile.includes("phrasePatterns")) {
  fail("Missing phrasePatterns export.");
}

if (!selectorFile.includes("expandedPhraseBank")) {
  fail("Phrase selector does not use expanded phrase bank.");
}

console.log("✅ Phrase expansion verified");
