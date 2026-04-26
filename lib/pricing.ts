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
    description: "Na rychlé vyzkoušení bez závazku.",
    limit: "2 generace denně",
    features: [
      "Základní odpověď",
      "Krátká verze zprávy",
      "Čeština",
      "Bez historie",
    ],
  },
  {
    name: "Starter",
    price: "79 Kč / měsíc",
    description: "Pro občasné použití v práci, škole i běžném životě.",
    limit: "100 generací měsíčně",
    features: [
      "Krátká i přirozená verze",
      "Základní tóny",
      "Historie 30 dní",
      "SMS / WhatsApp / e-mail styl",
    ],
  },
  {
    name: "Pro",
    price: "149 Kč / měsíc",
    description: "Hlavní plán pro lidi, kteří chtějí rychle a elegantně odpovídat.",
    limit: "500 generací měsíčně",
    highlighted: true,
    features: [
      "Všechny tóny",
      "Follow-up odpovědi",
      "Relationship režimy",
      "Make it less awkward",
      "Make it more believable",
    ],
  },
  {
    name: "Power",
    price: "299 Kč / měsíc",
    description: "Pro heavy users, freelancery a lidi, kteří řeší hodně komunikace.",
    limit: "2 000 generací měsíčně",
    features: [
      "Neomezená historie",
      "Pracovní šablony",
      "Dating šablony",
      "Klientské šablony",
      "Prioritní generování",
    ],
  },
];
