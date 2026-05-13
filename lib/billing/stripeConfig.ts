import "server-only";
const requiredEnvKeys = ["STRIPE_SECRET_KEY","STRIPE_WEBHOOK_SECRET","STRIPE_PRICE_STARTER_MONTHLY","STRIPE_PRICE_PRO_MONTHLY","STRIPE_PRICE_POWER_MONTHLY","STRIPE_PRICE_SOS_PACK","STRIPE_PRICE_MINI_PACK","STRIPE_PRICE_KLID_PACK","NEXT_PUBLIC_APP_URL"] as const;
export type BillingMode = "subscription" | "credit_pack";
const priceLookup = { subscription: { starter_monthly: "STRIPE_PRICE_STARTER_MONTHLY", pro_monthly: "STRIPE_PRICE_PRO_MONTHLY", power_monthly: "STRIPE_PRICE_POWER_MONTHLY" }, credit_pack: { sos_pack: "STRIPE_PRICE_SOS_PACK", mini_pack: "STRIPE_PRICE_MINI_PACK", klid_pack: "STRIPE_PRICE_KLID_PACK" } } as const;
export type BillingPlanId = keyof typeof priceLookup.subscription | keyof typeof priceLookup.credit_pack;
export function getMissingStripeEnvKeys() { return requiredEnvKeys.filter((key) => !process.env[key]); }
export function isStripeFoundationEnabled() { return getMissingStripeEnvKeys().length === 0; }
export function getStripePriceId(mode: BillingMode, planId: BillingPlanId) { const key = (priceLookup as Record<string, Record<string, string>>)[mode]?.[planId]; if (!key) return null; return process.env[key] || null; }
