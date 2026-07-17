import "server-only";

const checkoutFoundationKeys = [
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

const webhookFulfillmentKeys = [
  "STRIPE_WEBHOOK_SECRET",
  "STRIPE_PRICE_CREDITS_25",
  "STRIPE_PRICE_CREDITS_100",
  "STRIPE_PRICE_PRO_MONTHLY",
] as const;

type CheckoutFoundationKey = (typeof checkoutFoundationKeys)[number];
type WebhookFulfillmentKey = (typeof webhookFulfillmentKeys)[number];

export function getMissingStripeConfig(): CheckoutFoundationKey[] {
  return checkoutFoundationKeys.filter((key) => !process.env[key]?.trim());
}

export function isStripeCheckoutFoundationEnabled(): boolean {
  return getMissingStripeConfig().length === 0;
}

export function getMissingStripeWebhookFulfillmentConfig(): WebhookFulfillmentKey[] {
  return webhookFulfillmentKeys.filter((key) => !process.env[key]?.trim());
}

export function isStripeWebhookFulfillmentEnabled(): boolean {
  return getMissingStripeWebhookFulfillmentConfig().length === 0;
}
