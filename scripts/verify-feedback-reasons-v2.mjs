import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const generator = readFileSync("components/InteractiveGenerator.tsx", "utf8");
const verify = readFileSync("scripts/verify.sh", "utf8");

const expectedRatings = [
  "good",
  "bad",
  "wrong_context",
  "too_formal",
  "too_harsh",
  "not_sendable",
];

const expectedCzechLabels = ["Sedí ti to?", "Sedí", "Nesedí", "Jiná verze"];

for (const rating of expectedRatings) {
  assert.ok(
    generator.includes(`| "${rating}"`) || generator.includes(`${rating}:`),
    `Missing feedback rating: ${rating}`
  );
}

for (const label of expectedCzechLabels) {
  assert.ok(generator.includes(label), `Missing Czech feedback label: ${label}`);
}

assert.ok(!generator.includes("too_fake"), "Feedback reasons must not include unrequested too_fake option");
assert.ok(generator.includes('const MEMORY_KEY = "nodrama.memory-lane.v1"'), "Feedback must use Memory Lane storage");
assert.ok(generator.includes("function updateMemoryFeedback"), "Missing feedback storage hook");
assert.ok(generator.includes("feedbackEvents"), "Feedback storage should preserve per-card feedback events");
assert.ok(generator.includes("variantKey"), "Feedback events should identify the generated reply card");
assert.ok(
  generator.includes("regressionCandidate") && generator.includes('rating === "wrong_context"'),
  "wrong_context feedback should be marked as a future regression candidate"
);
assert.ok(
  generator.includes("aria-pressed={selectedFeedback === key}") ||
    generator.includes("aria-pressed={isSelected}"),
  "Feedback controls should expose selected state"
);
assert.ok(
  verify.includes("scripts/verify-feedback-reasons-v2.mjs"),
  "Feedback verifier must be wired into npm run verify"
);

console.log("OK: feedback reasons v2 verified");
