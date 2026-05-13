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
    description: "Zkušební režim na první situace bez závazku.",
    limit: "2 situace zdarma, potom 1 situace týdně",
    features: [
      "Rychlé vyzkoušení, než se rozhodneš",
      "Hotová odpověď s variantami tónu",
      "Rychlé doladění odpovědi",
      "Bez dlouhodobé historie",
    ],
  },
  {
    name: "Starter",
    price: "79 Kč / měsíc",
    description: "Pro občasné použití, když řešíš pár zpráv měsíčně.",
    limit: "20 situací měsíčně",
    features: [
      "Na běžné konverzace v práci i soukromí",
      "Jasné odpovědi bez zbytečné omáčky",
      "Základní tóny",
      "Vhodné pro klidnější tempo",
    ],
  },
  {
    name: "Pro",
    price: "149 Kč / měsíc",
    description: "Hlavní volba pro pravidelné používání a jistotu ve složitějších situacích.",
    limit: "45 situací měsíčně",
    badge: "Nejčastější volba",
    highlighted: true,
    features: [
      "Všechny tóny",
      "Follow-up doladění",
      "Historie odpovědí",
      "Režimy práce, klienti i randění",
      "Nejlepší poměr ceny a počtu situací",
    ],
  },
  {
    name: "Power",
    price: "299 Kč / měsíc",
    description: "Pro intenzivní používání: práce, klienti, vztahy i randění každý týden.",
    limit: "100 situací měsíčně",
    features: [
      "Vysoký měsíční limit pro heavy use",
      "Šablony pro opakované situace",
      "Uložené profily konverzací",
      "Rezerva pro náročné období",
    ],
  },
];
