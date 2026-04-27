import type { AnalyticsEvent } from "@/lib/analytics/eventContract";
import { storeAnalyticsEvent } from "@/lib/analytics/eventStore";

export async function logAnalyticsEvent(event: AnalyticsEvent) {
  const storedEvent = await storeAnalyticsEvent(event);

  if (process.env.NODE_ENV !== "production") {
    console.info("[analytics:event]", JSON.stringify(storedEvent));
  }

  return storedEvent;
}
