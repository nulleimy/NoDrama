import { existsSync, readFileSync } from "node:fs";

function fail(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

function readRequired(file) {
  if (!existsSync(file)) {
    fail(`Missing content-depth file: ${file}`);
  }

  return readFileSync(file, "utf8");
}

function extractIds(source) {
  return [...source.matchAll(/id:\s*"([^"]+)"/g)].map((match) => match[1]);
}

const files = {
  types: "lib/nodrama/contentDepthTypes.ts",
  prompts: "lib/nodrama/promptRegistry.ts",
  scenarios: "lib/nodrama/scenarioTemplates.ts",
  safety: "lib/nodrama/safetyLayers.ts",
  tones: "lib/nodrama/tonePresets.ts",
  audit: "lib/nodrama/auditDebug.ts",
  runtime: "lib/nodrama/contentDepthRuntime.ts",
  engine: "lib/language/phraseEngine.ts",
  docs: "docs/CONTENT_DEPTH_V2_FOUNDATION.md",
};

const sources = Object.fromEntries(
  Object.entries(files).map(([key, file]) => [key, readRequired(file)])
);

const toneIds = extractIds(sources.tones);
const uniqueToneIds = new Set(toneIds);

if (uniqueToneIds.size !== 8 || toneIds.length !== 8) {
  fail(`Expected exactly 8 unique locked tone presets, found ${toneIds.length}.`);
}

for (const requiredTone of [
  "kind",
  "direct",
  "formal",
  "light",
  "warm",
  "firm",
  "calm",
  "brief",
]) {
  if (!uniqueToneIds.has(requiredTone)) {
    fail(`Missing locked tone preset: ${requiredTone}`);
  }
}

const promptIds = new Set(extractIds(sources.prompts));
const safetyLayerIds = new Set(extractIds(sources.safety));

for (const requiredLayer of [
  "truthfulness",
  "boundary_setting",
  "conflict_reduction",
  "anti_manipulation",
  "non_clinical",
]) {
  if (!safetyLayerIds.has(requiredLayer)) {
    fail(`Missing safety layer: ${requiredLayer}`);
  }
}

const scenarioPromptRefs = [
  ...sources.scenarios.matchAll(/promptProfileId:\s*"([^"]+)"/g),
].map((match) => match[1]);

for (const promptRef of scenarioPromptRefs) {
  if (!promptIds.has(promptRef)) {
    fail(`Scenario references unknown prompt profile: ${promptRef}`);
  }
}

const scenarioToneRefs = [
  ...sources.scenarios.matchAll(/tone:\s*"([^"]+)"/g),
].map((match) => match[1]);

for (const toneRef of scenarioToneRefs) {
  if (!uniqueToneIds.has(toneRef)) {
    fail(`Scenario references unknown tone preset: ${toneRef}`);
  }
}

const promptSafetyRefs = [
  ...sources.prompts.matchAll(
    /"(truthfulness|boundary_setting|conflict_reduction|anti_manipulation|non_clinical)"/g
  ),
].map((match) => match[1]);

for (const safetyRef of promptSafetyRefs) {
  if (!safetyLayerIds.has(safetyRef)) {
    fail(`Prompt profile references unknown safety layer: ${safetyRef}`);
  }
}

if (!sources.audit.includes("internalOnly: true")) {
  fail("Audit debug output is not marked internal-only.");
}

for (const requiredRuntimeUse of [
  "promptRegistry",
  "scenarioTemplates",
  "safetyLayers",
  "lockedTonePresets",
  "createContentDepthAuditDebug",
]) {
  if (!sources.runtime.includes(requiredRuntimeUse)) {
    fail(`Content-depth runtime does not use ${requiredRuntimeUse}.`);
  }
}

if (!sources.engine.includes("createContentDepthRuntimeContext")) {
  fail("Phrase engine is not wired to the content-depth runtime.");
}

if (!sources.engine.includes("contentDepth")) {
  fail("Phrase engine meta does not include content-depth metadata.");
}

if (!sources.docs.includes("No public API contract changes")) {
  fail("Content-depth documentation must state public API contract impact.");
}

console.log("✅ NoDrama content-depth v2 foundation verified");
