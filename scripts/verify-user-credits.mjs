import { existsSync, readFileSync } from "node:fs";

function fail(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

const requiredFiles = [
  "lib/credits/creditTypes.ts",
  "lib/credits/creditStore.ts",
  "lib/credits/userIdentity.ts",
  "app/api/credits/status/route.ts",
  "app/api/credits/add/route.ts",
  "components/CreditStatusCard.tsx",
  "docs/USER_CREDITS.md",
];

for (const file of requiredFiles) {
  if (!existsSync(file)) {
    fail(`Missing user credits file: ${file}`);
  }
}

const accountPage = readFileSync("app/account/page.tsx", "utf8");
const generateRoute = readFileSync("app/api/generate/route.ts", "utf8");
const gitignore = readFileSync(".gitignore", "utf8");

if (!accountPage.includes("CreditStatusCard")) {
  fail("Account page does not show credit status.");
}

if (!generateRoute.includes("consumeCredit")) {
  fail("Generate route does not consume credits.");
}

if (!gitignore.includes("data/credits/*.json")) {
  fail("Local credit store is not ignored.");
}

console.log("✅ User credits verified");
