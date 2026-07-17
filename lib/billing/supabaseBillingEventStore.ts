import "server-only";

import { supabaseRestRequest } from "@/lib/persistence/supabaseRest";

type BillingEventStatus = "accepted" | "duplicate" | "ignored";

type BillingMetadata = Record<string, string | number | boolean | null>;

type SupabaseBillingEventRow = {
  id: string;
  event_id: string;
  event_type: string;
  received_at: string;
  status: BillingEventStatus;
  metadata: BillingMetadata | null;
};

export async function recordSupabaseBillingEvent(input: {
  eventId: string;
  eventType: string;
  metadata?: BillingMetadata;
}) {
  const accepted = await supabaseRestRequest<SupabaseBillingEventRow[]>({
    area: "Billing event store",
    table: "billing_events",
    query: {
      event_id: `eq.${input.eventId}`,
      status: "eq.accepted",
      limit: 1,
    },
  });

  const status: BillingEventStatus = accepted.length ? "duplicate" : "accepted";

  await supabaseRestRequest<SupabaseBillingEventRow[]>({
    area: "Billing event store",
    table: "billing_events",
    method: "POST",
    query: {
      select: "*",
    },
    prefer: "return=representation",
    body: [
      {
        event_id: input.eventId,
        event_type: input.eventType,
        status,
        metadata: input.metadata || {},
      },
    ],
  });

  return {
    accepted: status === "accepted",
    duplicate: status === "duplicate",
  };
}
