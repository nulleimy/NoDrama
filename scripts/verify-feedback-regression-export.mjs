import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";

const generator = readFileSync("components/InteractiveGenerator.tsx", "utf8");
const verify = readFileSync("scripts/verify.sh", "utf8");
const safeLoggingDoc = readFileSync("docs/ops/SAFE_LOGGING_AND_HISTORY.md", "utf8");
const apiFiles = readdirSync("app/api", { recursive: true }).map(String);

for (const label of [
  "Exportovat problémové případy",
  "Kandidáti pro regresní testy",
  "Export problem cases",
  "Regression candidates",
]) {
  assert.ok(generator.includes(label), `Missing regression export label: ${label}`);
}

assert.ok(
  generator.includes("export function getRegressionCandidates"),
  "Missing getRegressionCandidates helper"
);
assert.ok(
  generator.includes("export function exportRegressionCandidates"),
  "Missing exportRegressionCandidates helper"
);

for (const trigger of [
  'rating === "wrong_context"',
  'rating === "bad"',
  'rating === "not_sendable"',
]) {
  assert.ok(generator.includes(trigger), `Missing candidate trigger: ${trigger}`);
}

assert.ok(
  generator.includes("nodrama-regression-candidates-"),
  "Export filename must contain nodrama-regression-candidates"
);

for (const field of [
  "selectedContext: record.selectedContext",
  "inferredContext: record.inferredContext",
  "qa: summarizeMemoryQa(record.qa)",
  "feedbackEvents",
  "ratings",
  "reason",
]) {
  assert.ok(generator.includes(field), `Exported data missing ${field}`);
}

assert.ok(
  generator.includes("situationPreview: createSituationPreview"),
  "Regression export should minimize situation content"
);
assert.ok(!generator.includes("outputPreview: record.outputPreview"), "Regression export must not include full output previews");

assert.ok(
  !generator.includes('fetch("/api') || generator.includes('fetch("/api/generate"'),
  "Regression export must not add backend calls"
);
assert.ok(
  generator.includes("Blob") && generator.includes("URL.createObjectURL") && generator.includes("localStorage"),
  "Regression export should remain local browser download behavior"
);

assert.ok(
  !apiFiles.some((path) => path.includes("regression") || path.includes("memory")),
  "Regression export must not add an API route or server persistence"
);

assert.ok(
  safeLoggingDoc.includes("local-only regression candidate export") &&
    safeLoggingDoc.includes("metadata/minimized") &&
    safeLoggingDoc.includes("No server upload"),
  "Safe logging docs must explain local-only minimized regression export"
);

assert.ok(
  verify.includes("==> Feedback regression export") &&
    verify.includes("node scripts/verify-feedback-regression-export.mjs"),
  "Feedback regression export verifier must be wired into scripts/verify.sh"
);

console.log("OK: feedback regression export verified");
