import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const accountPage = readFileSync("app/account/page.tsx", "utf8");
const verify = readFileSync("scripts/verify.sh", "utf8");

for (const section of [
  "1) Stav účtu / Account status",
  "2) Situace / Credits",
  "3) Memory Lane privacy note",
  "4) Billing placeholder",
  "5) Next steps / Upcoming features",
]) {
  assert.ok(accountPage.includes(section), `Missing account dashboard section: ${section}`);
}

for (const required of [
  "<CreditStatusCard />",
  "situace (ne počet interních generací)",
  "1 situation is the billing unit",
  "Memory Lane je local-first",
  "browser-local by default",
  "no fake subscription state",
  'href="/"',
  'href="/#pricing"',
]) {
  assert.ok(accountPage.includes(required), `Missing required account dashboard content: ${required}`);
}

assert.ok(
  verify.includes('echo "==> Account dashboard polish"') &&
    verify.includes("node scripts/verify-account-dashboard-polish.mjs"),
  "Account dashboard verifier must be wired into scripts/verify.sh"
);

console.log("OK: account dashboard polish verified");
