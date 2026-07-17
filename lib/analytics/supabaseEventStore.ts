import "server-only";

import type { AnalyticsEvent, AnalyticsEventName } from "@/lib/analytics/eventContract";
import type { StoredAnalyticsEvent } from "@/lib/analytics/eventStore";
import { supabaseRestRequest } from "@/lib/persistence/supabaseRest";

type AnalyticsProperties = Record<string, string | number | boolean | null>;

type SupabaseAnalyticsEventRow = {
  id: string;
  name: AnalyticsEventName;
  timestamp: string;
  session_id: string | null;
  path: string | null;
  properties: AnalyticsProperties | null;
  stored_at: string;
};

function fromAnalyticsRow(row: SupabaseAnalyticsEventRow): StoredAnalyticsEvent {
  return {
    name: row.name,
    timestamp: row.timestamp,
    sessionId: row.session_id || undefined,
    path: row.path || undefined,
    properties: row.properties || undefined,
    storedAt: row.stored_at,
  };
}

export async function storeSupabaseAnalyticsEvent(event: AnalyticsEvent) {
  const timestamp = event.timestamp || new Date().toISOString();

  const rows = await supabaseRestRequest<SupabaseAnalyticsEventRow[]>({
    area: "Analytics event store",
    table: "analytics_events",
    method: "POST",
    query: {
      select: "*",
    },
    prefer: "return=representation",
    body: [
      {
        name: event.name,
        timestamp,
        session_id: event.sessionId || null,
        path: event.path || null,
        properties: event.properties || {},
      },
    ],
  });

  if (!rows.length) {
    throw new Error("Analytics event insert produced no row.");
  }

  return fromAnalyticsRow(rows[0]);
}

export async function readSupabaseAnalyticsEvents() {
  const rows = await supabaseRestRequest<SupabaseAnalyticsEventRow[]>({
    area: "Analytics event store",
    table: "analytics_events",
    query: {
      order: "stored_at.asc",
      limit: 500,
    },
  });

  return rows.map(fromAnalyticsRow);
}
