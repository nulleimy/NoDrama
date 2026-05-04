import { existsSync, readFileSync } from "node:fs";

import {
  lockedChannelTaxonomyV2,
  lockedRelationshipTaxonomyV2,
  lockedStrategyTaxonomyV2,
  validateMicroSituationDatasetV2,
} from "../lib/nodrama/taxonomySchemaV2.mjs";

const seedPath = "lib/nodrama/microSituationSeed.v2.json";
const situationCategoriesPath = "lib/language/situationCategories.ts";

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function readJson(path) {
  if (!existsSync(path)) {
    fail(`Missing required file: ${path}`);
  }

  return JSON.parse(readFileSync(path, "utf8"));
}

function extractSituationCategoryIds() {
  if (!existsSync(situationCategoriesPath)) {
    fail(`Missing situation categories file: ${situationCategoriesPath}`);
  }

  const content = readFileSync(situationCategoriesPath, "utf8");
  return new Set([...content.matchAll(/id: "([^"]+)"/g)].map((match) => match[1]));
}

function countBy(records, field) {
  const counts = new Map();

  for (const record of records) {
    counts.set(record[field], (counts.get(record[field]) || 0) + 1);
  }

  return counts;
}

function assertEveryLockedTaxonomyCovered(records) {
  const expectedTaxonomies = [
    ["channelId", lockedChannelTaxonomyV2],
    ["relationshipId", lockedRelationshipTaxonomyV2],
    ["strategyId", lockedStrategyTaxonomyV2],
  ];

  for (const [field, taxonomy] of expectedTaxonomies) {
    const covered = new Set(records.map((record) => record[field]));

    for (const item of taxonomy) {
      const compatibleIds = [item.id, ...(item.legacyIds || [])];

      if (
        item.legacyIds?.length > 0 &&
        !compatibleIds.some((id) => covered.has(id))
      ) {
        fail(`Seed dataset does not cover locked ${field}: ${item.id}`);
      }
    }
  }
}

const records = readJson(seedPath);
const validationIssues = validateMicroSituationDatasetV2(records);

if (validationIssues.length > 0) {
  fail(`Seed dataset schema validation failed:\n${validationIssues.join("\n")}`);
}

if (records.length < 100 || records.length > 150) {
  fail(`Seed dataset must contain 100-150 records, found ${records.length}.`);
}

const localeCounts = countBy(records, "locale");

for (const locale of ["cs", "en"]) {
  if (!localeCounts.has(locale)) {
    fail(`Seed dataset is missing locale: ${locale}`);
  }
}

if (localeCounts.get("cs") !== localeCounts.get("en")) {
  fail(
    `Seed dataset must be locale-balanced, found cs=${localeCounts.get(
      "cs"
    )}, en=${localeCounts.get("en")}.`
  );
}

const scenarioCounts = countBy(records, "scenarioCategory");

for (const scenarioCategory of [
  "social_plans",
  "work_commitments",
  "family_boundaries",
  "dating_clarity",
  "service_request",
]) {
  if ((scenarioCounts.get(scenarioCategory) || 0) < 10) {
    fail(
      `Scenario category ${scenarioCategory} needs at least 10 records, found ${
        scenarioCounts.get(scenarioCategory) || 0
      }.`
    );
  }
}

const sourceCategoryIds = extractSituationCategoryIds();

for (const record of records) {
  if (record.sourceCategoryId && !sourceCategoryIds.has(record.sourceCategoryId)) {
    fail(`${record.id}.sourceCategoryId is unknown: ${record.sourceCategoryId}`);
  }

  for (const field of ["bad", "good", "top"]) {
    if (record.examples[field].length > 180) {
      fail(`${record.id}.examples.${field} must stay concise.`);
    }
  }

  const blockedPolicyIds = record.blockedTaxonomies.safetyPolicyIds || [];

  for (const requiredPolicyId of ["deception", "fake_alibi", "coercion"]) {
    if (!blockedPolicyIds.includes(requiredPolicyId)) {
      fail(`${record.id} is missing blocked safety policy: ${requiredPolicyId}`);
    }
  }
}

assertEveryLockedTaxonomyCovered(records);

console.log(
  `OK: NoDrama micro-situation seed v1 verified (${records.length} records)`
);
