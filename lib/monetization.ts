export type CreditPack = {
  id: string;
  label: string;
  price: string;
  credits: number;
  validForDays: number;
  badge?: string;
  description: string;
};

export const creditPacks: CreditPack[] = [
  {
    id: "pack_sos",
    label: "SOS",
    price: "29 Kč",
    credits: 4,
    validForDays: 7,
    badge: "urgentně",
    description: "4 situace na akutní momenty. Platí 7 dní.",
  },
  {
    id: "pack_mini",
    label: "Mini",
    price: "69 Kč",
    credits: 15,
    validForDays: 14,
    badge: "rychlý klid",
    description: "15 situací pro několik citlivých zpráv. Platí 14 dní.",
  },
  {
    id: "pack_klid",
    label: "Klid",
    price: "149 Kč",
    credits: 40,
    validForDays: 30,
    badge: "nejvíc času",
    description: "40 situací, když potřebuješ rezervu bez předplatného. Platí 30 dní.",
  },
];

export const upgradeCopy = {
  headline: "Došly free situace.",
  subheadline:
    "Jedna situace znamená hotovou odpověď, varianty tónu a rychlé doladění. Odemkni další situace bez čekání.",
  primaryCta: "Odemknout Pro",
  secondaryCta: "Koupit SOS balíček",
};
