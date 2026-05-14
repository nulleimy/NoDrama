import { existsSync, readFileSync } from "node:fs";

function fail(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

const requiredFiles = [
  "app/api/auth/[...nextauth]/route.ts",
  "lib/auth/authOptions.ts",
  "components/UserSessionCard.tsx",
  "app/account/page.tsx",
  ".env.example",
  "scripts/verify.sh",
];

for (const file of requiredFiles) {
  if (!existsSync(file)) fail(`Missing required file: ${file}`);
}

const accountPage = readFileSync("app/account/page.tsx", "utf8");
const userSessionCard = readFileSync("components/UserSessionCard.tsx", "utf8");
const envExample = readFileSync(".env.example", "utf8");
const verifyScript = readFileSync("scripts/verify.sh", "utf8");

if (!accountPage.includes("UserSessionCard")) fail("/account does not import or render UserSessionCard.");

const requiredEnvKeys = [
  "NEXTAUTH_URL=",
  "NEXTAUTH_SECRET=",
  "GOOGLE_CLIENT_ID=",
  "GOOGLE_CLIENT_SECRET=",
  "EMAIL_SERVER=",
  "EMAIL_FROM=",
  "RESEND_API_KEY=",
];

for (const key of requiredEnvKeys) {
  if (!envExample.includes(key)) fail(`.env.example is missing ${key}`);
}

if (!userSessionCard.includes("Memory Lane") || !userSessionCard.includes("local-first")) {
  fail("User session UI copy must mention local-first Memory Lane privacy.");
}

if (!verifyScript.includes("verify-auth-experience-foundation.mjs")) {
  fail("scripts/verify.sh does not run verify-auth-experience-foundation.mjs");
}

console.log("✅ Auth experience foundation verified");
