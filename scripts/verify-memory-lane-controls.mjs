import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";

const generator = readFileSync("components/InteractiveGenerator.tsx", "utf8");
const verify = readFileSync("scripts/verify.sh", "utf8");
const apiFiles = readdirSync("app/api", { recursive: true }).map(String);

for (const required of [
  'const MEMORY_KEY = "nodrama.memory-lane.v1"',
  'const PRIVATE_MODE_KEY = "nodrama.private-mode.v1"',
  "function loadMemoryRecords",
  "function saveMemoryRecord",
  "function updateMemoryFeedback",
  "export function exportMemoryLane",
  "function clearMemoryLane",
  "function readPrivateMode",
  "function writePrivateMode",
]) {
  assert.ok(generator.includes(required), `Missing Memory Lane helper or key: ${required}`);
}

for (const label of [
  "Memory Lane",
  "Exportovat historii",
  "Smazat historii",
  "Soukromý režim",
  "Historie se neukládá",
  "Historie uložena jen v tomto prohlížeči",
  "Soukromý režim — historie se neukládá",
  "Export history",
  "Clear history",
  "Private mode",
  "History is not saved",
  "History is stored only in this browser",
  "Private mode — history is not saved",
]) {
  assert.ok(generator.includes(label), `Missing Memory Lane UI label: ${label}`);
}

for (const field of [
  "id: record.id",
  "createdAt: record.createdAt",
  "language: record.language",
  "selectedContext: record.selectedContext",
  "inferredContext: record.inferredContext",
  "qa: summarizeMemoryQa(record.qa)",
  "feedbackEvents: record.feedbackEvents || []",
  "regressionCandidate: isRegressionCandidate(record)",
]) {
  assert.ok(generator.includes(field), `Memory Lane export missing preserved field: ${field}`);
}

assert.ok(
  generator.includes("nodrama-memory-lane-${new Date().toISOString().slice(0, 10)}.json"),
  "Memory Lane export must use the requested dated filename"
);
assert.ok(
  generator.includes("situationPreview: createSituationPreview") &&
    !generator.includes("outputPreview: record.outputPreview"),
  "Memory Lane export should use minimized previews instead of full raw content"
);
assert.ok(
  generator.includes("if (readPrivateMode()) return record") &&
    generator.includes("if (readPrivateMode()) return;") &&
    generator.includes("if (privateMode) return;"),
  "Private mode must block Memory Lane records and feedback event saves"
);

for (const trigger of [
  'rating === "wrong_context"',
  'rating === "bad"',
  'rating === "not_sendable"',
  "regressionCandidate: isProblemFeedbackRating(rating) ? true : undefined",
]) {
  assert.ok(generator.includes(trigger), `Regression candidate behavior changed or missing: ${trigger}`);
}

assert.ok(
  !generator.includes('fetch("/api') || generator.includes('fetch("/api/generate"'),
  "Memory Lane controls must not add backend calls"
);
assert.ok(
  generator.includes("Blob") && generator.includes("URL.createObjectURL") && generator.includes("localStorage"),
  "Memory Lane export must stay as a local browser download"
);
assert.ok(
  !apiFiles.some((path) => path.toLowerCase().includes("memory")),
  "Memory Lane controls must not add an API route or server persistence"
);
assert.ok(
  verify.includes('echo "==> Memory Lane controls"') &&
    verify.includes("node scripts/verify-memory-lane-controls.mjs"),
  "Memory Lane controls verifier must be wired into scripts/verify.sh"
);

console.log("OK: Memory Lane controls verified");
