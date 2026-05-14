import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const generator = readFileSync("components/InteractiveGenerator.tsx", "utf8");
const verify = readFileSync("scripts/verify.sh", "utf8");

for (const label of [
  "Exportovat problémové případy",
  "Kandidáti pro regresní testy",
  "Export problem cases",
  "Regression candidates",
]) {
  assert.ok(generator.includes(label), `Missing regression export label: ${label}`);
}

assert.ok(
  generator.includes("function getRegressionCandidates"),
  "Regression candidate helper must exist"
);
assert.ok(
  generator.includes("function exportRegressionCandidates"),
  "Regression candidate export helper must exist"
);
assert.ok(
  generator.includes('"wrong_context"') &&
    generator.includes('"bad"') &&
    generator.includes('"not_sendable"') &&
    generator.includes("REGRESSION_TRIGGER_RATINGS"),
  "wrong_context, bad, and not_sendable must be regression candidate triggers"
);
assert.ok(
  generator.includes("event.regressionCandidate === true"),
  "Explicit feedbackEvent regressionCandidate flag must trigger candidate export"
);
assert.ok(
  generator.includes("nodrama-regression-candidates-${exportDate}.json"),
  "Regression export filename must include nodrama-regression-candidates"
);
assert.ok(
  generator.includes("selectedContext: record.selectedContext") &&
    generator.includes("inferredContext: record.inferredContext") &&
    generator.includes("qa: summarizeMemoryQa(record.qa)") &&
    generator.includes("feedbackEvents: record.feedbackEvents || []") &&
    generator.includes("ratings: collectRegressionRatings(record)"),
  "Regression export must preserve selectedContext, inferredContext, qa summary, feedbackEvents, and ratings"
);
assert.ok(
  generator.includes("situationPreview: record.userInputPreview") &&
    generator.includes("situationHash: record.situationHash"),
  "Regression export must use minimized situation preview and hash"
);

const regressionExportMatch = generator.match(
  /function exportRegressionCandidates\([\s\S]*?\n}\n\nfunction isRegressionCandidate/
);
assert.ok(regressionExportMatch, "Regression export function body must be discoverable");
const regressionExportBody = regressionExportMatch[0];

assert.ok(
  !/fetch\(/.test(regressionExportBody),
  "Regression candidate export must not call backend fetch/server persistence"
);
assert.ok(
  !/(indexedDB|openDatabase|navigator\.sendBeacon)/.test(regressionExportBody),
  "Regression candidate export must not add DB/cloud/telemetry persistence"
);
assert.ok(
  !/app\/api|route\.ts/.test(regressionExportBody),
  "Regression candidate export must not add or reference a backend endpoint"
);
assert.ok(
  verify.includes("==> Feedback regression export") &&
    verify.includes("node scripts/verify-feedback-regression-export.mjs"),
  "Feedback regression export verifier must be wired into npm run verify"
);

console.log("OK: Feedback regression export verified");
