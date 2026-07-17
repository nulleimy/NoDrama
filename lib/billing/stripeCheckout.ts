import "server-only";

import type { CheckoutCatalogItem } from "@/lib/billing/checkoutCatalog";
import { getMissingCheckoutSessionConfig } from "@/lib/billing/checkoutCatalog";

export class StripeCheckoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StripeCheckoutError";
  }
}

type StripeCheckoutSessionResponse = {
  id: string;
  url: string | null;
};

function appUrl() {
  const raw = process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (!raw) {
    throw new StripeCheckoutError("NEXT_PUBLIC_APP_URL is missing.");
  }

  return raw.replace(/\/$/, "");
}

function getStripeSecretKey() {
  const key = process.env.STRIPE_SECRET_KEY?.trim();

  if (!key) {
    throw new StripeCheckoutError("STRIPE_SECRET_KEY is missing.");
  }

  return key;
}

export async function createStripeCheckoutSession(input: {
  item: CheckoutCatalogItem;
  accountKey: string;
}) {
  const missing = getMissingCheckoutSessionConfig(input.item);

  if (missing.length) {
    throw new StripeCheckoutError("Missing Stripe checkout config: " + missing.join(", "));
  }

  const priceId = process.env[input.item.priceEnvKey]?.trim();

  if (!priceId) {
    throw new StripeCheckoutError("Missing Stripe price id for " + input.item.priceEnvKey);
  }

  const baseUrl = appUrl();
  const params = new URLSearchParams();

  params.append("mode", input.item.mode);
  params.append("line_items[0][price]", priceId);
  params.append("line_items[0][quantity]", "1");
  params.append("success_url", baseUrl + "/account?checkout=success&session_id={CHECKOUT_SESSION_ID}");
  params.append("cancel_url", baseUrl + "/?checkout=cancelled");
  params.append("client_reference_id", input.accountKey);
  params.append("allow_promotion_codes", "true");

  params.append("metadata[nodrama_account_key]", input.accountKey);
  params.append("metadata[nodrama_entitlement_key]", input.item.entitlementKey);
  params.append("metadata[nodrama_checkout_sku]", input.item.sku);
  params.append("metadata[nodrama_price_id]", priceId);

  if (input.item.mode === "subscription") {
    params.append("subscription_data[metadata][nodrama_account_key]", input.accountKey);
    params.append("subscription_data[metadata][nodrama_entitlement_key]", input.item.entitlementKey);
    params.append("subscription_data[metadata][nodrama_checkout_sku]", input.item.sku);
    params.append("subscription_data[metadata][nodrama_price_id]", priceId);
  }

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + getStripeSecretKey(),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
    cache: "no-store",
  });

  const text = await response.text();
  const parsed = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message =
      parsed && typeof parsed.error?.message === "string"
        ? parsed.error.message
        : response.statusText;

    throw new StripeCheckoutError("Stripe checkout session failed: " + message);
  }

  const session = parsed as StripeCheckoutSessionResponse;

  if (!session.url) {
    throw new StripeCheckoutError("Stripe checkout session returned no url.");
  }

  return session;
}
