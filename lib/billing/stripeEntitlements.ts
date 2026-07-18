import "server-only";

export type StripeCreditEntitlement = {
  kind: "credit_pack" | "subscription_grant";
  key: string;
  credits: number;
  reason: "stripe_pack_purchase" | "stripe_subscription_grant";
  priceEnvKey: string;
};

export const stripeCreditEntitlements: StripeCreditEntitlement[] = [
  {
    kind: "credit_pack",
    key: "pack_sos",
    credits: 4,
    reason: "stripe_pack_purchase",
    priceEnvKey: "STRIPE_PRICE_SOS_PACK",
  },
  {
    kind: "credit_pack",
    key: "pack_mini",
    credits: 15,
    reason: "stripe_pack_purchase",
    priceEnvKey: "STRIPE_PRICE_MINI_PACK",
  },
  {
    kind: "credit_pack",
    key: "pack_klid",
    credits: 40,
    reason: "stripe_pack_purchase",
    priceEnvKey: "STRIPE_PRICE_KLID_PACK",
  },
  {
    kind: "subscription_grant",
    key: "starter_monthly",
    credits: 20,
    reason: "stripe_subscription_grant",
    priceEnvKey: "STRIPE_PRICE_STARTER_MONTHLY",
  },
  {
    kind: "subscription_grant",
    key: "pro_monthly",
    credits: 45,
    reason: "stripe_subscription_grant",
    priceEnvKey: "STRIPE_PRICE_PRO_MONTHLY",
  },
  {
    kind: "subscription_grant",
    key: "power_monthly",
    credits: 100,
    reason: "stripe_subscription_grant",
    priceEnvKey: "STRIPE_PRICE_POWER_MONTHLY",
  },
  {
    kind: "credit_pack",
    key: "credits_25",
    credits: 25,
    reason: "stripe_pack_purchase",
    priceEnvKey: "STRIPE_PRICE_CREDITS_25",
  },
  {
    kind: "credit_pack",
    key: "credits_100",
    credits: 100,
    reason: "stripe_pack_purchase",
    priceEnvKey: "STRIPE_PRICE_CREDITS_100",
  },
];

export function resolveStripeCreditEntitlement(priceId: string | null | undefined) {
  if (!priceId) return null;

  return (
    stripeCreditEntitlements.find((entitlement) => {
      const configuredPriceId = process.env[entitlement.priceEnvKey];
      return configuredPriceId && configuredPriceId === priceId;
    }) || null
  );
}

export function resolveStripeCreditEntitlementByKey(key: string | null | undefined) {
  if (!key) return null;
  return stripeCreditEntitlements.find((entitlement) => entitlement.key === key) || null;
}

export function buildStripeCreditGrantIdempotencyKey(input: {
  stripeEventId: string;
  accountKey: string;
  entitlementKey: string;
}) {
  return [
    "stripe-credit-grant",
    input.stripeEventId,
    input.accountKey,
    input.entitlementKey,
  ].join(":");
}
