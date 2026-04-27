import { existsSync, readFileSync } from "node:fs";

function fail(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

const requiredFiles = [
  "lib/monetization.ts",
  "components/CreditPacks.tsx",
  "components/PaywallBox.tsx",
  "docs/MONETIZATION_LAYER.md",
];

for (const file of requiredFiles) {
  if (!existsSync(file)) {
    fail(`Missing monetization file: ${file}`);
  }
}

const generator = readFileSync("components/InteractiveGenerator.tsx", "utf8");
const page = readFileSync("app/page.tsx", "utf8");

if (!generator.includes("Kopírovat")) {
  fail("Generator does not include copy buttons.");
}

if (!generator.includes("PaywallBox")) {
  fail("Generator does not use PaywallBox.");
}

if (!page.includes("Jednorázové balíčky")) {
  fail("Homepage does not include credit packs.");
}

const creditPacks = readFileSync("components/CreditPacks.tsx", "utf8");
const paywall = readFileSync("components/PaywallBox.tsx", "utf8");

if (!creditPacks.includes("compact")) {
  fail("CreditPacks does not support compact mobile-safe rendering.");
}

if (!paywall.includes("CreditPacks compact")) {
  fail("Paywall does not use compact credit packs.");
}

console.log("✅ Monetization layer verified");
