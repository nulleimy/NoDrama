import { readFileSync } from "node:fs";

const pricingSource = readFileSync(new URL("../lib/pricing.ts", import.meta.url), "utf8");
const monetizationSource = readFileSync(new URL("../lib/monetization.ts", import.meta.url), "utf8");
const pricingCardsSource = readFileSync(new URL("../components/PricingCards.tsx", import.meta.url), "utf8");
const combined = `${pricingSource}\n${monetizationSource}\n${pricingCardsSource}`;

const requiredSnippets = [
  'price: "0 Kč"',
  'limit: "2 situace zdarma, potom 1 situace týdně"',
  'price: "79 Kč / měsíc"',
  'limit: "20 situací měsíčně"',
  'price: "149 Kč / měsíc"',
  'limit: "45 situací měsíčně"',
  'badge: "Nejčastější volba"',
  'price: "299 Kč / měsíc"',
  'limit: "100 situací měsíčně"',
  'price: "29 Kč"',
  'credits: 4',
  'validity: "Platí 7 dní"',
  'price: "69 Kč"',
  'credits: 15',
  'validity: "Platí 14 dní"',
  'price: "149 Kč"',
  'credits: 40',
  'validity: "Platí 30 dní"',
  'Platíš za vyřešenou situaci, ne za klikání.',
  '1 situace = hotová odpověď + varianty tónu + rychlé doladění.',
  'Ceny jsou konečné pro zákazníka.',
];

const forbiddenPhrases = ["AI výmluvy", "Make it more believable", "Unlimited", "500 generací"];

for (const snippet of requiredSnippets) {
  if (!combined.includes(snippet)) {
    throw new Error(`Chybí povinný text: ${snippet}`);
  }
}

for (const phrase of forbiddenPhrases) {
  if (combined.includes(phrase)) {
    throw new Error(`Zakázaná fráze nalezena: ${phrase}`);
  }
}

console.log("✅ verify-pricing-copy-polish passed");
