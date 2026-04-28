export type CreditPack = {
  id: string;
  label: string;
  price: string;
  credits: number;
  badge?: string;
  description: string;
};

export const creditPacks: CreditPack[] = [
  {
    id: "emergency_1",
    label: "Emergency 1 situace",
    price: "39 Kč",
    credits: 1,
    badge: "nejrychlejší",
    description: "Jedna krizová NoDrama zpráva přesně ve chvíli, kdy ji potřebuješ.",
  },
  {
    id: "pack_20",
    label: "20 kreditů",
    price: "49 Kč",
    credits: 20,
    description: "Na občasné akutní situace bez měsíčního závazku.",
  },
  {
    id: "pack_75",
    label: "75 kreditů",
    price: "149 Kč",
    credits: 75,
    badge: "nejlepší hodnota",
    description: "Vyvážený balíček pro pravidelnější použití.",
  },
  {
    id: "pack_200",
    label: "200 kreditů",
    price: "299 Kč",
    credits: 200,
    description: "Pro náročnější období, práci a klientskou komunikaci.",
  },
  {
    id: "pack_500",
    label: "500 kreditů",
    price: "599 Kč",
    credits: 500,
    badge: "power",
    description: "Pro heavy users a intenzivní používání bez limitního stresu.",
  },
];

export const upgradeCopy = {
  headline: "Tento týden máš vyčerpané 2 bezplatné NoDrama situace.",
  subheadline:
    "Přidej jednu krizovou zprávu za 39 Kč nebo odemkni Mini. Chceš bezpečnější TOP verzi s nižším rizikem konfliktu?",
  primaryCta: "Odemknout Mini",
  secondaryCta: "Koupit Emergency",
};
