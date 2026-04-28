import { existsSync, readFileSync } from "node:fs";

function fail(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

const requiredFiles = [
  "lib/auth/authOptions.ts",
  "lib/auth/session.ts",
  "app/api/auth/[...nextauth]/route.ts",
  "components/AuthButtons.tsx",
  "components/AuthProvider.tsx",
  "app/account/page.tsx",
  "docs/AUTH_FOUNDATION.md",
  "next-auth.d.ts",
];

for (const file of requiredFiles) {
  if (!existsSync(file)) {
    fail(`Missing auth foundation file: ${file}`);
  }
}

const packageJson = readFileSync("package.json", "utf8");
const authOptions = readFileSync("lib/auth/authOptions.ts", "utf8");
const accountPage = readFileSync("app/account/page.tsx", "utf8");
const layout = readFileSync("app/layout.tsx", "utf8");

if (!packageJson.includes("next-auth")) {
  fail("next-auth dependency is missing.");
}

if (!authOptions.includes("GoogleProvider")) {
  fail("Google provider is not configured.");
}

if (!authOptions.includes("EmailProvider")) {
  fail("Email provider is not configured.");
}

if (!accountPage.includes("AuthButtons")) {
  fail("Account page does not render auth buttons.");
}

if (!layout.includes("AuthProvider")) {
  fail("Root layout does not include AuthProvider.");
}

console.log("✅ Auth foundation verified");
