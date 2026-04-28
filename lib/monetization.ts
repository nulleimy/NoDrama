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
    id: "pack_20",
    label: "20 odpovědí",
    price: "29 Kč",
    credits: 20,
    badge: "rychlý nákup",
    description: "Na pár akutních situací bez čekání do zítra.",
  },
  {
    id: "pack_100",
    label: "100 odpovědí",
    price: "99 Kč",
    credits: 100,
    badge: "nejlepší start",
    description: "Nejlepší první balíček pro pravidelné používání.",
  },
  {
    id: "pack_500",
    label: "500 odpovědí",
    price: "299 Kč",
    credits: 500,
    badge: "power",
    description: "Pro heavy users, práci, klienty a každodenní komunikaci.",
  },
];

export function getCreditPackById(packId: string) {
  return creditPacks.find((pack) => pack.id === packId) || null;
}

export const upgradeCopy = {
  headline: "Došly free odpovědi.",
  subheadline:
    "Free plán má jen 2 odpovědi denně. Odemkni další odpovědi, follow-upy a lepší varianty bez čekání.",
  primaryCta: "Odemknout Pro",
  secondaryCta: "Koupit balíček",
};
