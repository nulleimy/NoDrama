import { existsSync, readFileSync } from "node:fs";

import {
  lockedChannelTaxonomyV2,
  lockedRelationshipTaxonomyV2,
  lockedStrategyTaxonomyV2,
  pressureLevelsV2,
  riskLevelsV2,
  validateMicroSituationDatasetV2,
} from "../lib/nodrama/taxonomySchemaV2.mjs";

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function assertMaxEight(name, taxonomy) {
  if (!Array.isArray(taxonomy) || taxonomy.length === 0) {
    fail(`${name} taxonomy must be a non-empty array.`);
  }

  if (taxonomy.length > 8) {
    fail(`${name} taxonomy must stay at max 8 items, found ${taxonomy.length}.`);
  }

  const ids = taxonomy.map((item) => item.id);
  const uniqueIds = new Set(ids);

  if (uniqueIds.size !== ids.length) {
    fail(`${name} taxonomy contains duplicate IDs.`);
  }
}

function assertIncludes(name, taxonomy, ids) {
  const availableIds = new Set(taxonomy.map((item) => item.id));

  for (const id of ids) {
    if (!availableIds.has(id)) {
      fail(`${name} taxonomy is missing existing generator ID: ${id}.`);
    }
  }
}

assertMaxEight("channel", lockedChannelTaxonomyV2);
assertMaxEight("relationship", lockedRelationshipTaxonomyV2);
assertMaxEight("strategy", lockedStrategyTaxonomyV2);

assertIncludes("channel", lockedChannelTaxonomyV2, [
  "whatsapp",
  "sms",
  "email",
  "slack",
]);
assertIncludes("relationship", lockedRelationshipTaxonomyV2, [
  "friend",
  "work",
  "family",
  "dating",
]);

for (const level of ["low", "medium", "high"]) {
  if (!riskLevelsV2.includes(level)) {
    fail(`Risk enum is missing compact level: ${level}.`);
  }

  if (!pressureLevelsV2.includes(level)) {
    fail(`Pressure enum is missing compact level: ${level}.`);
  }
}

const seedPath = "lib/nodrama/microSituationSeed.v2.json";

if (!existsSync(seedPath)) {
  fail(`Missing seed dataset: ${seedPath}`);
}

const seedRecords = JSON.parse(readFileSync(seedPath, "utf8"));
const validationIssues = validateMicroSituationDatasetV2(seedRecords);

if (validationIssues.length > 0) {
  fail(`Seed dataset is invalid:\n${validationIssues.join("\n")}`);
}

if (seedRecords.length < 4 || seedRecords.length > 8) {
  fail(`Seed dataset must remain representative and small, found ${seedRecords.length}.`);
}

const docsPath = "docs/NODRAMA_TAXONOMY_SCHEMA_V2.md";

if (!existsSync(docsPath)) {
  fail(`Missing taxonomy schema docs: ${docsPath}`);
}

const docs = readFileSync(docsPath, "utf8");

for (const requiredText of [
  "No public API contract changes",
  "Do not generate 9,000 production situations",
  "category -> cluster -> micro-situation",
  "UI chaos",
]) {
  if (!docs.includes(requiredText)) {
    fail(`Docs missing required guidance: ${requiredText}`);
  }
}

console.log("OK: NoDrama taxonomy schema v2 verified");
