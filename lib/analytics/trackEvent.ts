import type { AnalyticsEventName } from "@/lib/analytics/eventContract";

type AnalyticsProperties = Record<string, string | number | boolean | null>;

function getOrCreateSessionId() {
  if (typeof window === "undefined") return undefined;

  const key = "nodrama_session_id";
  const existing = window.sessionStorage.getItem(key);

  if (existing) return existing;

  const value =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  window.sessionStorage.setItem(key, value);
  return value;
}

export async function trackEvent(
  name: AnalyticsEventName,
  properties: AnalyticsProperties = {}
) {
  if (typeof window === "undefined") return;

  try {
    await fetch("/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      keepalive: true,
      body: JSON.stringify({
        name,
        timestamp: new Date().toISOString(),
        sessionId: getOrCreateSessionId(),
        path: window.location.pathname,
        properties,
      }),
    });
  } catch {
    // Analytics must never break product UX.
  }
}
