export type PricingPlan = {
  name: string;
  price: string;
  description: string;
  limit: string;
  highlighted?: boolean;
  features: string[];
};

export const pricingPlans: PricingPlan[] = [
  {
    name: "Free",
    price: "0 Kč",
    description: "Ochutnávka bez závazku.",
    limit: "2 situace týdně",
    features: [
      "Pouze základní výstup",
      "Jen 3 tóny: milý / přátelský / formální",
      "Bez Reality Checku a Risk Score",
      "Bez Bad/Good/Top a follow-upů",
      "Bez historie",
    ],
  },
  {
    name: "Emergency",
    price: "39 Kč",
    description: "Jedna krizová zpráva bez subscription.",
    limit: "1 situace jednorázově",
    features: [
      "3 varianty odpovědi",
      "Krátká + delší verze",
      "Co neříkat",
      "Risk note",
    ],
  },
  {
    name: "Mini",
    price: "79 Kč / měsíc",
    description: "Lehký měsíční plán pro běžné použití.",
    limit: "15 situací měsíčně",
    features: [
      "Všechny tóny / kanály / vztahy",
      "CZ + EN",
      "Krátká + delší verze",
      "Bez pokročilého Reality Checku",
    ],
  },
  {
    name: "Plus",
    price: "129 Kč / měsíc",
    description: "Doporučený plán pro pravidelné používání.",
    limit: "40 situací měsíčně",
    highlighted: true,
    features: [
      "Bad / Good / Top odpovědi",
      "Reality Check",
      "Risk Score + co neříkat",
      "Historie posledních situací",
    ],
  },
  {
    name: "Pro",
    price: "249 Kč / měsíc",
    description: "Pro heavy users, freelancery a work/client use-cases.",
    limit: "100 situací měsíčně",
    features: [
      "Conversation follow-up",
      "Odpověď na reakci druhé strany",
      "Work / Client / Relationship packy",
      "Uložené šablony + osobní styl",
    ],
  },
];
