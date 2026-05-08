export type CreditPack = {
  id: string;
  label: string;
  price: string;
  credits: number;
  validity: string;
  badge?: string;
  description: string;
};

export const creditPacks: CreditPack[] = [
  {
    id: "pack_sos",
    label: "SOS",
    price: "29 Kč",
    credits: 4,
    validity: "Platí 7 dní",
    badge: "urgentní",
    description: "4 situace pro chvíli, kdy potřebuješ rychle odpovědět bez paniky.",
  },
  {
    id: "pack_mini",
    label: "Mini",
    price: "69 Kč",
    credits: 15,
    validity: "Platí 14 dní",
    badge: "rychlý klid",
    description: "15 situací pro pár náročnějších konverzací bez subscription.",
  },
  {
    id: "pack_klid",
    label: "Klid",
    price: "149 Kč",
    credits: 40,
    validity: "Platí 30 dní",
    badge: "nejvíc situací",
    description: "40 situací na měsíc, když chceš rezervu bez pravidelného plánu.",
  },
];

export const upgradeCopy = {
  headline: "Došly free situace.",
  subheadline:
    "1 situace = hotová odpověď + varianty tónu + rychlé doladění. Odemkni další situace, když nevíš, co napsat.",
  primaryCta: "Odemknout Pro",
  secondaryCta: "Koupit SOS balíček",
};
