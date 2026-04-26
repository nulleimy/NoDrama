import { readFileSync } from "node:fs";

function fail(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

const file = readFileSync("lib/language/situationCategories.ts", "utf8");

const idMatches = [...file.matchAll(/id: "([^"]+)"/g)].map((match) => match[1]);
const uniqueIds = new Set(idMatches);

if (idMatches.length < 100) {
  fail(`Expected at least 100 situation categories, found ${idMatches.length}`);
}

if (uniqueIds.size !== idMatches.length) {
  fail("Duplicate situation category ids found");
}

const bannedWords = [
  "partner",
  "partnerstvi",
  "partnerství",
  "rozchod",
  "nevera",
  "nevěra",
  "nasili",
  "násilí",
  "sebeposkozeni",
  "sebepoškození",
  "stalking",
];

const lower = file.toLowerCase();

for (const word of bannedWords) {
  if (lower.includes(word)) {
    fail(`Sensitive or parked topic found in public taxonomy: ${word}`);
  }
}

console.log(`✅ Language foundation verified: ${idMatches.length} categories`);
