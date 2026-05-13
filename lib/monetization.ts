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
    badge: "hned k použití",
    description: "Rychlá jednorázová pomoc, když hoří konverzace tady a teď.",
  },
  {
    id: "pack_mini",
    label: "Mini",
    price: "69 Kč",
    credits: 15,
    validity: "Platí 14 dní",
    badge: "na pár dní klidu",
    description: "Jednorázový balíček pro období, kdy se ti nahromadí víc zpráv.",
  },
  {
    id: "pack_klid",
    label: "Klid",
    price: "149 Kč",
    credits: 40,
    validity: "Platí 30 dní",
    badge: "největší jednorázovka",
    description: "Měsíční rezerva bez předplatného, když chceš mít jistotu po ruce.",
  },
];

export const upgradeCopy = {
  headline: "Došly zkušební situace.",
  subheadline:
    "1 situace = hotová odpověď + varianty tónu + rychlé doladění. Odemkni další situace přes plán nebo jednorázový balíček.",
  primaryCta: "Odemknout Pro",
  secondaryCta: "Koupit SOS balíček",
};
