import type { StoredAnalyticsEvent } from "@/lib/analytics/eventStore";

export const analyticsEventNames = [
  "page_view",
  "generator_input_started",
  "generate_attempt",
  "generate_success",
  "generate_failed",
  "copy_clicked",
  "rating_positive",
  "rating_negative",
  "feedback_wrong_context",
  "feedback_not_sendable",
  "tuning_chip_clicked",
  "memory_export_clicked",
  "memory_clear_clicked",
  "private_mode_enabled",
  "private_mode_disabled",
  "pricing_viewed",
  "plan_cta_clicked",
  "sos_pack_cta_clicked",
  "free_limit_hit",
  "rate_limited",
] as const;

export type AnalyticsEventName = (typeof analyticsEventNames)[number];
export type AnalyticsEvent = {
  name: AnalyticsEventName;
  eventId?: string;
  clientIdHash?: string;
  sessionIdHash?: string;
  path?: string;
  timestamp: string;
  properties?: Record<string, string | number | boolean | null>;
};

const forbiddenKeys = ["email", "ip", "token", "clipboard", "full", "prompt", "reply"];
const forbiddenPatterns = [/bearer\s+[a-z0-9\-_\.]+/i, /@/, /\b\d{1,3}(?:\.\d{1,3}){3}\b/];

export function bucketScore(score?: number | null): string {
  if (score == null || Number.isNaN(score)) return "unknown";
  if (score >= 0.85) return "high";
  if (score >= 0.65) return "medium";
  return "low";
}

export function sanitizeAnalyticsPayload(payload: Record<string, unknown>): Record<string, string | number | boolean | null> {
  const clean: Record<string, string | number | boolean | null> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (forbiddenKeys.some((fk) => key.toLowerCase().includes(fk.toLowerCase()))) continue;
    if (typeof value === "string") {
      if (value.length > 120 || forbiddenPatterns.some((p) => p.test(value))) continue;
      clean[key] = value;
      continue;
    }
    if (typeof value === "number" || typeof value === "boolean" || value === null) {
      clean[key] = value;
    }
  }
  return clean;
}

export function assertNoSensitiveAnalyticsPayload(payload: Record<string, unknown>): void {
  const serialized = JSON.stringify(payload).toLowerCase();
  for (const key of forbiddenKeys.map((k) => k.toLowerCase())) {
    if (serialized.includes(key.toLowerCase())) {
      throw new Error(`Sensitive analytics payload key detected: ${key}`);
    }
  }
}

export function createAnalyticsEvent(input: {
  name: AnalyticsEventName;
  path?: string;
  sessionIdHash?: string;
  clientIdHash?: string;
  properties?: Record<string, unknown>;
}): AnalyticsEvent {
  const properties = sanitizeAnalyticsPayload(input.properties || {});
  assertNoSensitiveAnalyticsPayload(properties);
  return {
    name: input.name,
    path: input.path,
    sessionIdHash: input.sessionIdHash,
    clientIdHash: input.clientIdHash,
    timestamp: new Date().toISOString(),
    properties,
  };
}

export function aggregateAnalyticsEvents(events: StoredAnalyticsEvent[]) {
  const counts = Object.fromEntries(analyticsEventNames.map((name) => [name, 0])) as Record<AnalyticsEventName, number>;
  const scenarioFamilies: Record<string, number> = {};
  const feedbackReasons: Record<string, number> = {};

  for (const event of events) {
    if (event.name in counts) counts[event.name as AnalyticsEventName] += 1;
    const family = event.properties?.scenarioFamily;
    if (typeof family === "string") scenarioFamilies[family] = (scenarioFamilies[family] || 0) + 1;
    const reason = event.properties?.feedback_reason;
    if (typeof reason === "string") feedbackReasons[reason] = (feedbackReasons[reason] || 0) + 1;
  }

  const generateAttempts = counts.generate_attempt;
  const safeRate = (n: number, d: number) => (d > 0 ? Math.round((n / d) * 1000) / 10 : 0);

  return {
    totalEvents: events.length,
    counts,
    generateAttempts,
    successRate: safeRate(counts.generate_success, generateAttempts),
    wrongContextCount: counts.feedback_wrong_context,
    wrongContextRate: safeRate(counts.feedback_wrong_context, generateAttempts),
    notSendableCount: counts.feedback_not_sendable,
    notSendableRate: safeRate(counts.feedback_not_sendable, generateAttempts),
    freeLimitHits: counts.free_limit_hit,
    rateLimitHits: counts.rate_limited,
    copyClicks: counts.copy_clicked,
    pricingCtaClicks: counts.plan_cta_clicked + counts.sos_pack_cta_clicked,
    topScenarioFamilies: Object.entries(scenarioFamilies).sort((a, b) => b[1] - a[1]).slice(0, 5),
    topFeedbackReasons: Object.entries(feedbackReasons).sort((a, b) => b[1] - a[1]).slice(0, 5),
  };
}
