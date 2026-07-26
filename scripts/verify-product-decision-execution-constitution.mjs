#!/usr/bin/env node

import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const repositoryRoot = resolve(process.argv[2] ?? process.cwd());
const worldPath = resolve(repositoryRoot, "WORLD_CLASS_SOFTWARE_DEVOPS_OPERATING_MODE.md");
const productPath = resolve(repositoryRoot, "PRODUCT_DECISION_EXECUTION_CONSTITUTION.md");
const expectedWorldSha = "ed44c6147049887d941b7497f1bce3b817f22b6ae00a5136a27365a2f688d918";

function readUtf8(path) {
  try {
    return readFileSync(path, "utf8");
  } catch (error) {
    console.error(`BLOCKED: cannot read ${path}: ${error.message}`);
    process.exit(2);
  }
}

function sha256(text) {
  return createHash("sha256").update(text, "utf8").digest("hex");
}

const world = readUtf8(worldPath);
const product = readUtf8(productPath);
const checks = [];

function check(name, condition, detail = "") {
  checks.push({ name, condition: Boolean(condition), detail });
}

check("WORLD_SHA256", sha256(world) === expectedWorldSha, sha256(world));
check("WORLD_LINE_COUNT", world.split(/\r?\n/).length - 1 === 536, `lines=${world.split(/\r?\n/).length - 1}`);
check("PRODUCT_VERSION", product.includes("**Verze:** 1.1.1"));
check("PROPOSED_STATE", product.includes("PROPOSED_CONFLICT_AUDITED_NOT_IMPLEMENTED"));
check("ARTICLE_ZERO", product.includes("## ČLÁNEK 0 — NEJVYŠŠÍ PRINCIP"));
check("MASTER_MOTTO", product.includes("Nejsilnější vývojový model spojuje Jobsovu produktovou čistotu"));
check("CHANGE_PROPERTIES", product.includes("jednoduchá, účelná, automatizovaná, bezpečná, měřitelná, vratná a důkazně ověřitelná"));

const statuses = [
  "`VERIFIED`",
  "`IMPLEMENTED`",
  "`PROPOSED`",
  "`INFERRED`",
  "`UNKNOWN`",
  "`BLOCKED`",
  "`FAILED`",
  "`DEFERRED`",
  "`PARTIALLY_VERIFIED`",
];
check("TRUTH_STATES", statuses.every((status) => product.includes(status)));

const authority = [
  "1. systémová pravidla platformy, závazné právo a nepřekročitelné bezpečnostní omezení,",
  "2. `WORLD_CLASS_SOFTWARE_DEVOPS_OPERATING_MODE.md`,",
  "3. explicitní aktuální instrukce a autorizace vlastníka projektu,",
  "4. tato produktová, rozhodovací a realizační ústava po jejím kanonickém přijetí,",
];
const authorityPositions = authority.map((entry) => product.indexOf(entry));
check(
  "AUTHORITY_ORDER",
  authorityPositions.every((position) => position >= 0) &&
    authorityPositions.every((position, index) => index === 0 || position > authorityPositions[index - 1]),
  JSON.stringify(authorityPositions)
);

const requiredFragments = [
  "nesmí oslabit bezpečnostní, technické ani důkazní požadavky WORLD dokumentu",
  "### 1.3 Normativní hranice externích rámců",
  "### 1.4 Projektový profil NoDrama",
  "OVERALL_SCORE = MIN(",
  "### 3.6 Kalibrace skóre 0–10",
  "Hodnoty jako `200 %`",
  "`UNKNOWN` omezuje celkové skóre maximálně na `6/10`",
  "Časově omezená výjimka omezuje celkové skóre maximálně na `9/10`",
  "D3 a D4 nesmějí získat `10/10` bez nezávislého review",
  "### 12.1 Release authorization gate",
  "### 12.2 Post-release verification gate",
  "`PRODUCTION_READY=YES` nebo `RELEASE_SCORE=10/10` vyžaduje obě části",
  "deployment frequency",
  "change lead time",
  "failed deployment recovery time",
  "change fail rate",
  "deployment rework rate",
  "NIST SP 800-218 SSDF 1.1 — `FINAL`",
  "SSDF 1.2 — `DRAFT`",
  "OWASP ASVS 5.0.0 — `STABLE`",
  "OWASP AISVS 1.0 — `LIVE_2026-06-24`",
  "SLSA 1.2 — `APPROVED`",
  "WCAG 2.2 — `RECOMMENDATION_2024-12-12`",
  "EDPB Guidelines 4/2019 — `FINAL_2020-10-20`",
  "### 30.1 Auditovatelný registr oficiálních zdrojů",
  "## 31. AUTOMATIZOVANÝ CONSTITUTION LINT",
  "## 32. ZÁVĚREČNÉ USTANOVENÍ",
  "NO_EVIDENCE = NO_10_OUT_OF_10",
  "NO_ROLLBACK = NO_RELEASE",
  "NO_AUDIT_TRAIL = NO_COMPLETE",
];

for (const fragment of requiredFragments) {
  check(`FRAGMENT_${fragment.slice(0, 42)}`, product.includes(fragment));
}

const codeFenceCount = [...product.matchAll(/^```/gm)].length;
check("BALANCED_CODE_FENCES", codeFenceCount % 2 === 0, `count=${codeFenceCount}`);

const levelTwoHeadings = [...product.matchAll(/^## (.+)$/gm)].map((match) => match[1]);
check("UNIQUE_LEVEL2_HEADINGS", new Set(levelTwoHeadings).size === levelTwoHeadings.length, `count=${levelTwoHeadings.length}`);
check("MINIMUM_LINE_COUNT", product.split(/\r?\n/).length - 1 >= 1400, `lines=${product.split(/\r?\n/).length - 1}`);

const placeholderPatterns = [/\bTODO\b/i, /\bTBD\b/i, /\bFIXME\b/i, /<placeholder>/i, /\[INSERT\]/i, /lorem ipsum/i];
check("NO_PLACEHOLDERS", placeholderPatterns.every((pattern) => !pattern.test(product)));

const trailingWhitespaceLines = product
  .split(/\r?\n/)
  .map((line, index) => ({ line, number: index + 1 }))
  .filter(({ line }) => /[ \t]+$/.test(line))
  .map(({ number }) => number);
check(
  "NO_TRAILING_WHITESPACE",
  trailingWhitespaceLines.length === 0,
  trailingWhitespaceLines.length ? `lines=${trailingWhitespaceLines.join(",")}` : "lines=NONE"
);

const failures = checks.filter((entry) => !entry.condition);
for (const entry of checks) {
  console.log(`${entry.name}=${entry.condition ? "PASS" : "FAIL"}${entry.detail ? ` (${entry.detail})` : ""}`);
}

console.log(`PRODUCT_SHA256=${sha256(product)}`);
console.log(`CHECK_COUNT=${checks.length}`);
console.log(`FAIL_COUNT=${failures.length}`);
console.log(`CONSTITUTION_VALIDATION_STATE=${failures.length === 0 ? "VERIFIED" : "FAILED"}`);
console.log("VALIDATION_SCOPE=STRUCTURE_INTERNAL_CONSISTENCY_AND_WORLD_COMPATIBILITY");
console.log("PROJECT_COMPLIANCE_STATE=NOT_PROVEN_BY_THIS_VALIDATOR");

if (failures.length > 0) {
  process.exit(2);
}
