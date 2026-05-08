export type PricingPlan = {
  name: string;
  price: string;
  description: string;
  limit: string;
  badge?: string;
  highlighted?: boolean;
  features: string[];
};

export const pricingPlans: PricingPlan[] = [
  {
    name: "Free",
    price: "0 Kč",
    description: "Na vyzkoušení pro první nepříjemné zprávy.",
    limit: "2 situace zdarma, potom 1 situace týdně",
    features: [
      "Základní tóny",
      "Hotová odpověď s variantami",
      "Rychlé doladění",
      "Bez historie, nebo historie jen 24 h",
    ],
  },
  {
    name: "Starter",
    price: "79 Kč / měsíc",
    description: "Pro občasné zprávy, kdy nechceš přestřelit tón.",
    limit: "20 situací měsíčně",
    features: [
      "Pro občasné zprávy",
      "Základní tóny",
      "Stručnější odpovědi bez overexplainingu",
      "SMS / WhatsApp / e-mail styl",
    ],
  },
  {
    name: "Pro",
    price: "149 Kč / měsíc",
    description: "Hlavní plán pro práci, dating i citlivé konverzace.",
    limit: "45 situací měsíčně",
    badge: "Nejčastější volba",
    highlighted: true,
    features: [
      "Všechny tóny",
      "Follow-up doladění",
      "Historie",
      "Work / dating / client režimy",
      "Méně trapně a víc lidsky",
    ],
  },
  {
    name: "Power",
    price: "299 Kč / měsíc",
    description: "Pro časté pracovní, klientské a dating situace.",
    limit: "100 situací měsíčně",
    features: [
      "Šablony",
      "Uložené profily",
      "Work / clients / dating heavy use",
      "Více opakovaných komunikačních situací",
    ],
  },
];
