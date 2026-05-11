import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

function read(path) {
  return readFileSync(path, "utf8");
}

const generationEventsPath = "lib/nodrama/generationEvents.ts";
const safeLoggingPath = "lib/nodrama/safeLogging.ts";
const safeDocPath = "docs/ops/SAFE_LOGGING_AND_HISTORY.md";

assert.ok(existsSync(generationEventsPath), "GenerationEvent type file must exist");
assert.ok(existsSync(safeLoggingPath), "safe logging helper file must exist");
assert.ok(existsSync(safeDocPath), "safe logging docs must exist");

const generationEvents = read(generationEventsPath);
const safeLogging = read(safeLoggingPath);
const safeDoc = read(safeDocPath);
const gitignore = read(".gitignore");

for (const required of [
  "type GenerationEvent",
  "storesFullSituation: false",
  "storesGeneratedOutput: false",
]) {
  assert.ok(generationEvents.includes(required), `GenerationEvent missing ${required}`);
}

for (const helper of [
  "createSituationHash",
  "createSituationPreview",
  "summarizeQa",
  "createGenerationEvent",
]) {
  assert.ok(safeLogging.includes(`function ${helper}`), `Missing helper ${helper}`);
}

for (const text of ["metadata-only", "localStorage", "Future DB/cloud history", "Delete/export"]) {
  assert.ok(safeDoc.includes(text), `Safe logging doc missing ${text}`);
}

assert.ok(gitignore.includes("data/runtime/"), "Runtime report directory must be gitignored");

console.log("OK: safe logging core verified");
