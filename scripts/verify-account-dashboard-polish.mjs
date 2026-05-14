#!/usr/bin/env node

import { readFileSync } from "node:fs";

function fail(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

const accountPage = readFileSync("app/account/page.tsx", "utf8");
const normalizedAccountPage = accountPage.replace(/\s+/g, " ");
const verifySh = readFileSync("scripts/verify.sh", "utf8");

const requiredCopy = [
  "Stav účtu / Account status",
  "Situace / Credits",
  "Memory Lane",
  "Billing",
  "Další kroky / Next steps",
  "CreditStatusCard",
  "AuthButtons",
  "href=\"/cs#generator\"",
  "href=\"/cs#pricing\"",
  "Platební jednotka je situace, ne syrový počet generování.",
  "The billing unit is a situation, not raw generation count.",
  "local-first",
  "browser-local",
  "future sync is explicitly added and enabled",
  "žádný falešný stav tarifu",
  "no fake plan state",
  "žádné aktivní",
  "no active subscription",
  "žádný platební checkout",
  "no payment checkout",
];

for (const copy of requiredCopy) {
  if (!normalizedAccountPage.includes(copy)) {
    fail(`Account dashboard polish is missing required copy or wiring: ${copy}`);
  }
}

const forbiddenAccountCopy = [
  "subscriptionState",
  "planStatus",
  "currentPlan",
  "checkoutSession",
  "stripe.checkout",
  "Stripe Checkout",
  "prisma",
  "create table",
  "INSERT INTO",
];

for (const copy of forbiddenAccountCopy) {
  if (accountPage.includes(copy)) {
    fail(`Account dashboard must not add real billing, DB, or fake subscription state: ${copy}`);
  }
}

if (!verifySh.includes("verify-account-dashboard-polish.mjs")) {
  fail("scripts/verify.sh does not run account dashboard polish verification.");
}

console.log("✅ Account dashboard polish verified");
