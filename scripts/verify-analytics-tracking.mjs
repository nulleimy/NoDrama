import { existsSync, readFileSync } from "node:fs";

function fail(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

const requiredFiles = [
  "app/api/events/route.ts",
  "lib/analytics/eventContract.ts",
  "lib/analytics/eventLogger.ts",
  "lib/analytics/trackEvent.ts",
  "docs/ANALYTICS_TRACKING.md",
];

for (const file of requiredFiles) {
  if (!existsSync(file)) {
    fail(`Missing analytics file: ${file}`);
  }
}

const contract = readFileSync("lib/analytics/eventContract.ts", "utf8");
const generator = readFileSync("components/InteractiveGenerator.tsx", "utf8");
const creditPacks = readFileSync("components/CreditPacks.tsx", "utf8");
const paywall = readFileSync("components/PaywallBox.tsx", "utf8");

for (const eventName of [
  "generate_clicked",
  "generate_success",
  "generate_failed",
  "copy_reply",
  "paywall_shown",
  "paywall_closed",
  "credit_pack_clicked",
  "pricing_cta_clicked",
]) {
  if (!contract.includes(eventName)) {
    fail(`Analytics contract missing event: ${eventName}`);
  }
}

if (!generator.includes("generate_clicked")) fail("Generator missing generate_clicked tracking.");
if (!generator.includes("copy_reply")) fail("Generator missing copy_reply tracking.");
if (!creditPacks.includes("credit_pack_clicked")) fail("Credit packs missing click tracking.");
if (!paywall.includes("pricing_cta_clicked")) fail("Paywall missing CTA tracking.");

console.log("✅ Analytics tracking verified");
