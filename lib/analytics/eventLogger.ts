import type { AnalyticsEvent } from "@/lib/analytics/eventContract";

export function logAnalyticsEvent(event: AnalyticsEvent) {
  const safeEvent = {
    ...event,
    timestamp: event.timestamp || new Date().toISOString(),
  };

  if (process.env.NODE_ENV !== "production") {
    console.info("[analytics:event]", JSON.stringify(safeEvent));
  }

  return safeEvent;
}
