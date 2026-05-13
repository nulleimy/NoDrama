import "server-only";

import { appendFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import type { AnalyticsEvent } from "@/lib/analytics/eventContract";
import { aggregateAnalyticsEvents, analyticsEventNames, type AnalyticsEventName } from "@/lib/analytics/funnelEvents";

const analyticsDir = path.join(process.cwd(), "data", "analytics");
const analyticsFile = path.join(analyticsDir, "events.jsonl");

export type StoredAnalyticsEvent = AnalyticsEvent & {
  storedAt: string;
};

export type AnalyticsSummary = {
  totalEvents: number;
  counts: Record<AnalyticsEventName, number>;
  generateAttempts: number;
  successRate: number;
  wrongContextCount: number;
  wrongContextRate: number;
  notSendableCount: number;
  notSendableRate: number;
  freeLimitHits: number;
  rateLimitHits: number;
  copyClicks: number;
  pricingCtaClicks: number;
  topScenarioFamilies: [string, number][];
  topFeedbackReasons: [string, number][];
  recentEvents: StoredAnalyticsEvent[];
};


function emptyCounts(): Record<AnalyticsEventName, number> {
  return analyticsEventNames.reduce((acc, name) => {
    acc[name] = 0;
    return acc;
  }, {} as Record<AnalyticsEventName, number>);
}

export async function storeAnalyticsEvent(event: AnalyticsEvent) {
  await mkdir(analyticsDir, { recursive: true });

  const storedEvent: StoredAnalyticsEvent = {
    ...event,
    timestamp: event.timestamp || new Date().toISOString(),
    storedAt: new Date().toISOString(),
  };

  await appendFile(analyticsFile, `${JSON.stringify(storedEvent)}\n`, "utf8");

  return storedEvent;
}

function parseAnalyticsLine(line: string): StoredAnalyticsEvent | null {
  try {
    return JSON.parse(line) as StoredAnalyticsEvent;
  } catch {
    return null;
  }
}

export async function readAnalyticsEvents(): Promise<StoredAnalyticsEvent[]> {
  try {
    const raw = await readFile(analyticsFile, "utf8");

    return raw
      .split("\n")
      .filter(Boolean)
      .map(parseAnalyticsLine)
      .filter((event): event is StoredAnalyticsEvent => event !== null);
  } catch {
    return [];
  }
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const events = await readAnalyticsEvents();
  const aggregated = aggregateAnalyticsEvents(events);

  return {
    ...aggregated,
    counts: {
      ...emptyCounts(),
      ...aggregated.counts,
    },
    recentEvents: events.slice(-20).reverse(),
  };
}
