import type { AnalyticsEventName } from "@/lib/analytics/eventContract";
import { logAnalyticsEvent } from "@/lib/analytics/eventLogger";

type FunnelMetaValue = string | number | boolean | null | undefined;
type FunnelMetaInput = Record<string, FunnelMetaValue>;

const ALLOWED_KEYS = new Set([
  "reason",
  "scenario",
  "tone",
  "channel",
  "source",
  "status",
  "code",
  "retry_after_seconds",
  "remaining",
  "limit",
  "has_credits",
]);

export async function logFunnelEvent(
  name: AnalyticsEventName,
  metadata: FunnelMetaInput = {}
) {
  const properties: Record<string, string | number | boolean | null> = {};

  for (const [key, value] of Object.entries(metadata)) {
    if (!ALLOWED_KEYS.has(key) || value === undefined) continue;
    properties[key] = value;
  }

  await logAnalyticsEvent({
    name,
    timestamp: new Date().toISOString(),
    properties,
  });
}
