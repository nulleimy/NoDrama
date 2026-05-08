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
    description: "Na rychlé vyzkoušení bez závazku.",
    limit: "2 situace zdarma, potom 1 situace týdně",
    features: [
      "Základní tóny",
      "Hotová odpověď s variantami",
      "Čeština",
      "Bez historie, nebo jen 24 hodin",
    ],
  },
  {
    name: "Starter",
    price: "79 Kč / měsíc",
    description: "Pro občasné zprávy, kdy nechceš přemýšlet nad každou větou.",
    limit: "20 situací měsíčně",
    features: [
      "Méně trapně",
      "Bez zbytečného vysvětlování",
      "Základní tóny",
      "Pro práci, školu i běžný život",
    ],
  },
  {
    name: "Pro",
    price: "149 Kč / měsíc",
    description: "Hlavní plán pro rychlé, bezpečně formulované odpovědi bez přestřelení.",
    limit: "45 situací měsíčně",
    badge: "Nejčastější volba",
    highlighted: true,
    features: [
      "Všechny tóny",
      "Follow-up doladění",
      "Historie",
      "Work / dating / client režimy",
      "Zní to přirozeněji",
    ],
  },
  {
    name: "Power",
    price: "299 Kč / měsíc",
    description: "Pro časté pracovní, klientské a dating situace.",
    limit: "100 situací měsíčně",
    features: ["Templates", "Saved profiles", "Work / clients / dating heavy use", "Víc lidsky"],
  },
];
