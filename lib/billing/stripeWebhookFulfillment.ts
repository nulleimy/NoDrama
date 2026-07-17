import "server-only";

import { recordBillingEvent } from "@/lib/billing/billingEventStore";
import {
  buildStripeCreditGrantIdempotencyKey,
  resolveStripeCreditEntitlement,
  resolveStripeCreditEntitlementByKey,
} from "@/lib/billing/stripeEntitlements";
import type { StripeWebhookEvent } from "@/lib/billing/stripeWebhookVerifier";
import { grantCredits } from "@/lib/credits/creditLedger";

type StripeMetadata = Record<string, string>;

function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  return {};
}

function asMetadata(value: unknown): StripeMetadata {
  const raw = asRecord(value);
  const metadata: StripeMetadata = {};

  for (const [key, item] of Object.entries(raw)) {
    if (typeof item === "string") metadata[key] = item;
  }

  return metadata;
}

function readNestedString(root: Record<string, unknown>, path: string[]) {
  let current: unknown = root;

  for (const key of path) {
    current = asRecord(current)[key];
  }

  return typeof current === "string" ? current : null;
}

function getStripeObject(event: StripeWebhookEvent) {
  return asRecord(event.data?.object);
}

function extractAccountKey(stripeObject: Record<string, unknown>) {
  const metadata = asMetadata(stripeObject.metadata);
  const accountKey = metadata.nodrama_account_key;

  if (accountKey?.startsWith("user:") || accountKey?.startsWith("anon:")) {
    return accountKey;
  }

  const clientReferenceId =
    typeof stripeObject.client_reference_id === "string"
      ? stripeObject.client_reference_id
      : null;

  if (clientReferenceId?.startsWith("user:") || clientReferenceId?.startsWith("anon:")) {
    return clientReferenceId;
  }

  return null;
}

function extractEntitlement(stripeObject: Record<string, unknown>) {
  const metadata = asMetadata(stripeObject.metadata);
  const entitlementKey = metadata.nodrama_entitlement_key;
  const metadataPriceId = metadata.nodrama_price_id || metadata.price_id;
  const nestedLinePriceId =
    readNestedString(stripeObject, ["lines", "data", "0", "price", "id"]) ||
    readNestedString(stripeObject, ["items", "data", "0", "price", "id"]);

  return (
    resolveStripeCreditEntitlementByKey(entitlementKey) ||
    resolveStripeCreditEntitlement(metadataPriceId) ||
    resolveStripeCreditEntitlement(nestedLinePriceId)
  );
}

function isFulfillableStripeEvent(eventType: string) {
  return eventType === "checkout.session.completed" || eventType === "invoice.paid";
}

export async function fulfillStripeWebhookEvent(event: StripeWebhookEvent) {
  const billingEvent = await recordBillingEvent({
    eventId: event.id,
    eventType: event.type,
    metadata: {
      livemode: Boolean(event.livemode),
      created: typeof event.created === "number" ? event.created : null,
    },
  });

  if (!billingEvent.accepted) {
    return {
      ok: true,
      accepted: false,
      duplicate: true,
      fulfilled: false,
      code: "duplicate_event",
    };
  }

  if (!isFulfillableStripeEvent(event.type)) {
    return {
      ok: true,
      accepted: true,
      duplicate: false,
      fulfilled: false,
      code: "ignored_event_type",
    };
  }

  const stripeObject = getStripeObject(event);
  const accountKey = extractAccountKey(stripeObject);
  const entitlement = extractEntitlement(stripeObject);

  if (!accountKey || !entitlement) {
    return {
      ok: true,
      accepted: true,
      duplicate: false,
      fulfilled: false,
      code: "missing_account_or_entitlement",
    };
  }

  const grant = await grantCredits({
    accountKey,
    amount: entitlement.credits,
    reason: entitlement.reason,
    source: "stripe_webhook",
    referenceId: event.id,
    idempotencyKey: buildStripeCreditGrantIdempotencyKey({
      stripeEventId: event.id,
      accountKey,
      entitlementKey: entitlement.key,
    }),
    metadata: {
      stripeEventType: event.type,
      entitlementKey: entitlement.key,
      entitlementKind: entitlement.kind,
    },
  });

  return {
    ok: true,
    accepted: true,
    duplicate: false,
    fulfilled: true,
    code: "credit_granted",
    accountKey,
    entitlementKey: entitlement.key,
    credits: entitlement.credits,
    ledgerEntryId: grant.id,
  };
}
