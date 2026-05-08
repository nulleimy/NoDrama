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
const pricingPage = readFileSync("app/[lang]/page.tsx", "utf8");

if (!creditPacks.includes("compact")) {
  fail("CreditPacks does not support compact mobile-safe rendering.");
}

if (!paywall.includes("CreditPacks compact")) {
  fail("Paywall does not use compact credit packs.");
}

const requiredPricingCopy = [
  "20 situací měsíčně",
  "45 situací měsíčně",
  "100 situací měsíčně",
  "Nejčastější volba",
  "1 situace = hotová odpověď + varianty tónu + rychlé doladění",
];

for (const copy of requiredPricingCopy) {
  if (!pricing.includes(copy) && !pricingPage.includes(copy)) {
    fail(`Missing situation pricing copy: ${copy}`);
  }
}

const requiredPackCopy = [
  'label: "SOS"',
  'price: "29 Kč"',
  "credits: 4",
  "validForDays: 7",
  'label: "Mini"',
  'price: "69 Kč"',
  "credits: 15",
  "validForDays: 14",
  'label: "Klid"',
  'price: "149 Kč"',
  "credits: 40",
  "validForDays: 30",
];

for (const copy of requiredPackCopy) {
  if (!monetization.includes(copy)) {
    fail(`Missing SOS pack metadata: ${copy}`);
  }
}

const userFacingPricingSources = [
  pricing,
  monetization,
  creditPacks,
  paywall,
  pricingPage,
].join("\n");

const forbiddenCopy = [
  "Unlimited",
  "500 generací",
  "AI výmluvy",
  "Make it more believable",
];

for (const copy of forbiddenCopy) {
  if (userFacingPricingSources.includes(copy)) {
    fail(`Forbidden pricing copy still present: ${copy}`);
  }
}

console.log("✅ Monetization layer verified");
