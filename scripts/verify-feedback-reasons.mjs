import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const generator = readFileSync("components/InteractiveGenerator.tsx", "utf8");
const verify = readFileSync("scripts/verify.sh", "utf8");

const requiredLabels = [
  "Použitelné",
  "Mimo",
  "Špatný kontext",
  "Moc formální",
  "Moc ostré",
  "Neposlatelné",
];

const requiredReasons = [
  "good",
  "bad",
  "wrong_context",
  "too_formal",
  "too_harsh",
  "not_sendable",
];

for (const label of requiredLabels) {
  assert.ok(generator.includes(label), `Missing Czech feedback label: ${label}`);
}

for (const reason of requiredReasons) {
  assert.ok(generator.includes(`"${reason}"`), `Missing feedback reason: ${reason}`);
}

assert.equal(
  generator.includes("too_fake"),
  false,
  "Feedback reasons must stay limited to the requested six-option set"
);
assert.ok(
  generator.includes("selectedFeedback"),
  "Generated reply cards must expose selected feedback state"
);
assert.ok(
  generator.includes("feedbackByReply"),
  "Memory Lane records must store feedback per generated reply"
);
assert.ok(
  generator.includes('regressionCandidate: rating === "wrong_context"'),
  "wrong_context feedback must be marked as a regression candidate"
);
assert.ok(
  generator.includes("window.localStorage.setItem(memoryStorageKey"),
  "Feedback must stay local-first in Memory Lane localStorage"
);
assert.ok(
  verify.includes("scripts/verify-feedback-reasons.mjs"),
  "npm run verify must include feedback reason verification"
);

console.log("OK: feedback reasons verified");
