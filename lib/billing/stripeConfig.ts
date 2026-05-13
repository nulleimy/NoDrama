import "server-only";

const requiredKeys = [
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "STRIPE_PRICE_STARTER_MONTHLY",
  "STRIPE_PRICE_PRO_MONTHLY",
  "STRIPE_PRICE_POWER_MONTHLY",
  "STRIPE_PRICE_SOS_PACK",
  "STRIPE_PRICE_MINI_PACK",
  "STRIPE_PRICE_KLID_PACK",
  "NEXT_PUBLIC_APP_URL",
] as const;

type StripeConfigKey = (typeof requiredKeys)[number];

export function getMissingStripeConfig(): StripeConfigKey[] {
  return requiredKeys.filter((key) => !process.env[key]?.trim());
}

export function isStripeCheckoutFoundationEnabled(): boolean {
  return getMissingStripeConfig().length === 0;
}
