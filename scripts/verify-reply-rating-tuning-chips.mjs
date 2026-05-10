import fs from "node:fs";

const source = fs.readFileSync("components/InteractiveGenerator.tsx", "utf8");

function fail(message) {
  console.error(`Reply rating/tuning chips verification failed: ${message}`);
  process.exit(1);
}

const requiredCopy = [
  "Sedí ti to?",
  "Sedí",
  "Nesedí",
  "Jiná verze",
  "Chceš to doladit?",
  "Jemnější",
  "Důraznější",
  "Kratší",
  "Přirozenější",
  "Více jako já",
  "Méně trapné",
  "Does this feel right?",
  "Feels right",
  "Not quite",
  "Try another",
  "Tune it",
  "Softer",
  "Stronger",
  "Shorter",
  "More natural",
  "More like me",
  "Less awkward",
  "If they push back",
];

for (const text of requiredCopy) {
  if (!source.includes(text)) {
    fail(`missing copy: ${text}`);
  }
}

const requiredActionIds = [
  "fits",
  "not_quite",
  "try_again",
  "softer",
  "stronger",
  "shorter",
  "more_natural",
  "more_like_me",
  "less_awkward",
];

for (const actionId of requiredActionIds) {
  if (!source.includes(actionId)) {
    fail(`missing action id: ${actionId}`);
  }
}

if (!source.includes('action === "try_again"') || !source.includes("disabled={isUnavailable}")) {
  fail("try-another feedback must be guarded when regeneration is unavailable.");
}

if (!source.includes("disabled") || !source.includes("ReplyTuningChips")) {
  fail("tuning chips must render as disabled prepared controls until backend support exists.");
}

if (!source.includes("aria-pressed") || !source.includes("aria-label")) {
  fail("chip and copy controls need accessible pressed state and labels.");
}

if (!source.includes("navigator.clipboard.writeText(text)")) {
  fail("specific reply copy behavior is missing.");
}

console.log("Reply rating/tuning chips verification passed");
