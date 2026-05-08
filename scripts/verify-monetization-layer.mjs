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
const pricing = readFileSync("lib/pricing.ts", "utf8");
const monetization = readFileSync("lib/monetization.ts", "utf8");
const localizedPage = readFileSync("app/[lang]/page.tsx", "utf8");

if (!creditPacks.includes("compact")) {
  fail("CreditPacks does not support compact mobile-safe rendering.");
}

if (!paywall.includes("CreditPacks compact")) {
  fail("Paywall does not use compact credit packs.");
}

const requiredPricingCopy = [
  "2 situace zdarma, potom 1 situace týdně",
  "20 situací měsíčně",
  "45 situací měsíčně",
  "100 situací měsíčně",
  "Nejčastější volba",
];

for (const copy of requiredPricingCopy) {
  if (!pricing.includes(copy)) {
    fail(`Pricing model is missing required copy: ${copy}`);
  }
}

const requiredPackCopy = [
  "SOS",
  "29 Kč",
  "4,",
  "Platí 7 dní",
  "Mini",
  "69 Kč",
  "15,",
  "Platí 14 dní",
  "Klid",
  "149 Kč",
  "40,",
  "Platí 30 dní",
];

for (const copy of requiredPackCopy) {
  if (!monetization.includes(copy)) {
    fail(`SOS pack model is missing required copy: ${copy}`);
  }
}

if (
  !localizedPage.includes("1 situace = hotová odpověď + varianty tónu + rychlé doladění") ||
  !monetization.includes("1 situace = hotová odpověď + varianty tónu + rychlé doladění")
) {
  fail("Situation value explanation is missing from pricing/paywall copy.");
}

const scannedCopy = [pricing, monetization, localizedPage, paywall, creditPacks].join("\n");
const bannedCopy = [
  "Unlimited",
  "unlimited",
  "500 generací",
  "500 odpovědí",
  "AI výmluvy",
  "Make it more believable",
];

for (const copy of bannedCopy) {
  if (scannedCopy.includes(copy)) {
    fail(`Forbidden user-facing pricing copy remains: ${copy}`);
  }
}

console.log("✅ Monetization layer verified");
