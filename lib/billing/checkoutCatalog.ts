import "server-only";

export type CheckoutMode = "payment" | "subscription";

export type CheckoutSku =
  | "pack_sos"
  | "pack_mini"
  | "pack_klid"
  | "starter_monthly"
  | "pro_monthly"
  | "power_monthly";

export type CheckoutCatalogItem = {
  sku: CheckoutSku;
  label: string;
  mode: CheckoutMode;
  priceEnvKey:
    | "STRIPE_PRICE_SOS_PACK"
    | "STRIPE_PRICE_MINI_PACK"
    | "STRIPE_PRICE_KLID_PACK"
    | "STRIPE_PRICE_STARTER_MONTHLY"
    | "STRIPE_PRICE_PRO_MONTHLY"
    | "STRIPE_PRICE_POWER_MONTHLY";
  entitlementKey: string;
  credits: number;
};

export const checkoutCatalog: CheckoutCatalogItem[] = [
  {
    sku: "pack_sos",
    label: "SOS pack",
    mode: "payment",
    priceEnvKey: "STRIPE_PRICE_SOS_PACK",
    entitlementKey: "pack_sos",
    credits: 4,
  },
  {
    sku: "pack_mini",
    label: "Mini pack",
    mode: "payment",
    priceEnvKey: "STRIPE_PRICE_MINI_PACK",
    entitlementKey: "pack_mini",
    credits: 15,
  },
  {
    sku: "pack_klid",
    label: "Klid pack",
    mode: "payment",
    priceEnvKey: "STRIPE_PRICE_KLID_PACK",
    entitlementKey: "pack_klid",
    credits: 40,
  },
  {
    sku: "starter_monthly",
    label: "Starter monthly",
    mode: "subscription",
    priceEnvKey: "STRIPE_PRICE_STARTER_MONTHLY",
    entitlementKey: "starter_monthly",
    credits: 20,
  },
  {
    sku: "pro_monthly",
    label: "Pro monthly",
    mode: "subscription",
    priceEnvKey: "STRIPE_PRICE_PRO_MONTHLY",
    entitlementKey: "pro_monthly",
    credits: 45,
  },
  {
    sku: "power_monthly",
    label: "Power monthly",
    mode: "subscription",
    priceEnvKey: "STRIPE_PRICE_POWER_MONTHLY",
    entitlementKey: "power_monthly",
    credits: 100,
  },
];

export function resolveCheckoutCatalogItem(sku: string | null | undefined) {
  if (!sku) return null;
  return checkoutCatalog.find((item) => item.sku === sku) || null;
}

export function getMissingCheckoutSessionConfig(item: CheckoutCatalogItem) {
  return [
    "STRIPE_SECRET_KEY",
    "NEXT_PUBLIC_APP_URL",
    item.priceEnvKey,
  ].filter((key) => !process.env[key]?.trim());
}
