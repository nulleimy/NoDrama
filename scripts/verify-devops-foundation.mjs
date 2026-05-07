import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { getNoDramaFeatureFlags, isGenerationLimitBypassed } from "../lib/featureFlags.ts";

const rootFiles = [
  ".env.example",
  ".github/workflows/ci.yml",
  "docs/ops/ENVIRONMENT.md",
  "docs/ops/RELEASE_CHECKLIST.md",
  "docs/ops/BACKUP_AND_RESTORE.md",
  "docs/ops/INCIDENT_RUNBOOK.md",
  "docs/ops/DATA_RETENTION.md",
  "scripts/smoke-generate.mjs",
];

const requiredEnvVars = [
  "NEXTAUTH_URL",
  "NEXTAUTH_SECRET",
  "NODRAMA_TEST_MODE",
  "NODRAMA_DISABLE_FREE_LIMIT",
  "NODRAMA_ENABLE_HISTORY",
  "NODRAMA_ENABLE_EVENT_LOGGING",
  "NODRAMA_ENABLE_CLOUD_HISTORY",
  "NODRAMA_ENABLE_PHRASE_REALIZER",
];

for (const filePath of rootFiles) {
  const content = readFileSync(filePath, "utf8");
  assert.ok(content.trim().length > 0, `${filePath} should not be empty`);
}

const envExample = readFileSync(".env.example", "utf8");
const environmentDoc = readFileSync("docs/ops/ENVIRONMENT.md", "utf8");

for (const envVar of requiredEnvVars) {
  assert.match(envExample, new RegExp(`^${envVar}=`, "m"), `.env.example documents ${envVar}`);
  assert.ok(environmentDoc.includes(envVar), `ENVIRONMENT.md documents ${envVar}`);
}

const ci = readFileSync(".github/workflows/ci.yml", "utf8");
assert.ok(ci.includes("npm ci"), "CI should install with npm ci");
assert.ok(ci.includes("npm run verify"), "CI should run npm run verify");

const backupDoc = readFileSync("docs/ops/BACKUP_AND_RESTORE.md", "utf8");
for (const forbiddenLogData of ["Full situation text", "Generated outputs", "Secrets"]) {
  assert.ok(
    backupDoc.includes(forbiddenLogData),
    `BACKUP_AND_RESTORE.md names forbidden log data: ${forbiddenLogData}`
  );
}

assert.deepEqual(getNoDramaFeatureFlags({}), {
  testMode: false,
  disableFreeLimit: false,
  historyEnabled: false,
  eventLoggingEnabled: false,
  cloudHistoryEnabled: false,
  phraseRealizerEnabled: false,
});

assert.equal(isGenerationLimitBypassed({ NODRAMA_TEST_MODE: "true" }), true);
assert.equal(isGenerationLimitBypassed({ NODRAMA_DISABLE_FREE_LIMIT: "true" }), true);
assert.equal(isGenerationLimitBypassed({ NODRAMA_TEST_MODE: "1" }), false);
assert.equal(isGenerationLimitBypassed({ NODRAMA_TEST_MODE: "false" }), false);

console.log("DevOps foundation verification passed");
