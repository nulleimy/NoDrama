import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const generationEvents = "lib/nodrama/generationEvents.ts";
const safeLogging = "lib/nodrama/safeLogging.ts";
const generator = readFileSync("components/InteractiveGenerator.tsx", "utf8");
const smoke = readFileSync("scripts/smoke-cli-scenarios.mjs", "utf8");
const verify = readFileSync("scripts/verify.sh", "utf8");
const gitignore = readFileSync(".gitignore", "utf8");
const safeDocPath = "docs/ops/SAFE_LOGGING_AND_HISTORY.md";

assert.ok(existsSync(generationEvents), "GenerationEvent type file must exist");
assert.ok(existsSync(safeLogging), "safe logging helper file must exist");

const generationEventsSource = readFileSync(generationEvents, "utf8");
const safeLoggingSource = readFileSync(safeLogging, "utf8");
const safeDoc = readFileSync(safeDocPath, "utf8");
const retentionDoc = readFileSync("docs/ops/DATA_RETENTION.md", "utf8");
const backupDoc = readFileSync("docs/ops/BACKUP_AND_RESTORE.md", "utf8");
const replyDoc = readFileSync("docs/REPLY_INTELLIGENCE_V2.md", "utf8");

for (const required of [
  "type GenerationEvent",
  "storesFullSituation: false",
  "storesGeneratedOutput: false",
  '"localStorage" | "file" | "none"',
]) {
  assert.ok(generationEventsSource.includes(required), `GenerationEvent missing ${required}`);
}

for (const helper of [
  "createSituationHash",
  "createSituationPreview",
  "summarizeQa",
  "createGenerationEvent",
]) {
  assert.ok(safeLoggingSource.includes(`function ${helper}`), `Missing helper ${helper}`);
}

assert.ok(generator.includes('const MEMORY_KEY = "nodrama.memory-lane.v1"'), "Memory Lane key missing");
assert.ok(
  generator.includes('const TECHNICAL_EVENT_LOG_KEY = "nodrama.technical-event-log.v1"'),
  "Technical event log key missing"
);
assert.ok(
  generator.includes(
    "Historie je uložená jen v tomto prohlížeči. Technické záznamy neukládají celé zadání ani vygenerované odpovědi."
  ),
  "Privacy copy missing"
);

for (const control of [
  "clearLocalHistory",
  "clearFeedbackRecords",
  "clearRegressionCandidates",
  "exportLocalHistoryJson",
]) {
  assert.ok(generator.includes(control), `Missing local history control: ${control}`);
}

assert.ok(
  !generator.includes("outputPreview"),
  "Memory Lane technical records must not include generated output previews"
);
assert.ok(
  !generator.includes("userInputPreview"),
  "Memory Lane technical records should use situationPreview instead of legacy input preview"
);
assert.ok(
  generator.includes('rating === "wrong_context" || rating === "bad"'),
  "wrong_context and bad feedback should be regression candidates"
);

assert.ok(smoke.includes("--write-report"), "Smoke CLI must support --write-report");
assert.ok(
  smoke.includes('"data", "runtime", "smoke-results"') ||
    smoke.includes("data/runtime/smoke-results"),
  "Smoke report path missing"
);
assert.ok(smoke.includes("inputPreview"), "Smoke report should include input preview");
assert.ok(smoke.includes("inputHash"), "Smoke report should include input hash");
assert.ok(
  !smoke.includes("OUTPUT.shortReply:") && !smoke.includes("OUTPUT.naturalReply:"),
  "Smoke CLI should not print full generated outputs"
);

assert.ok(gitignore.includes("data/runtime/"), "Runtime report directory must be gitignored");
assert.ok(verify.includes("scripts/verify-safe-logging-history.mjs"), "verify.sh must run safe logging verifier");

for (const doc of [safeDoc, retentionDoc, backupDoc, replyDoc]) {
  assert.ok(doc.includes("metadata-only"), "Docs must mention metadata-only logs");
  assert.ok(doc.includes("localStorage"), "Docs must mention localStorage behavior");
}

assert.ok(safeDoc.includes("Future DB/cloud history"), "Safe logging doc must cover future DB/cloud history");
assert.ok(safeDoc.includes("Delete/export"), "Safe logging doc must cover delete/export expectations");

console.log("OK: safe logging and local history verified");
