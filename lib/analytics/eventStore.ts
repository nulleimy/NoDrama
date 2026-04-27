import "server-only";

import { appendFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import type { AnalyticsEvent, AnalyticsEventName } from "@/lib/analytics/eventContract";

const analyticsDir = path.join(process.cwd(), "data", "analytics");
const analyticsFile = path.join(analyticsDir, "events.jsonl");

export type StoredAnalyticsEvent = AnalyticsEvent & {
  storedAt: string;
};

export type AnalyticsSummary = {
  totalEvents: number;
  counts: Record<AnalyticsEventName, number>;
  funnel: {
    generateToSuccessRate: number;
    successToCopyRate: number;
    paywallToCreditPackClickRate: number;
  };
  recentEvents: StoredAnalyticsEvent[];
};

const eventNames: AnalyticsEventName[] = [
  "generate_clicked",
  "generate_success",
  "generate_failed",
  "copy_reply",
  "paywall_shown",
  "paywall_closed",
  "credit_pack_clicked",
  "pricing_cta_clicked",
];

function emptyCounts(): Record<AnalyticsEventName, number> {
  return eventNames.reduce((acc, name) => {
    acc[name] = 0;
    return acc;
  }, {} as Record<AnalyticsEventName, number>);
}

function safeRate(numerator: number, denominator: number) {
  if (denominator <= 0) return 0;
  return Math.round((numerator / denominator) * 1000) / 10;
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

export async function readAnalyticsEvents(): Promise<StoredAnalyticsEvent[]> {
  try {
    const raw = await readFile(analyticsFile, "utf8");

    return raw
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line) as StoredAnalyticsEvent);
  } catch {
    return [];
  }
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const events = await readAnalyticsEvents();
  const counts = emptyCounts();

  for (const event of events) {
    if (event.name in counts) {
      counts[event.name] += 1;
    }
  }

  return {
    totalEvents: events.length,
    counts,
    funnel: {
      generateToSuccessRate: safeRate(counts.generate_success, counts.generate_clicked),
      successToCopyRate: safeRate(counts.copy_reply, counts.generate_success),
      paywallToCreditPackClickRate: safeRate(
        counts.credit_pack_clicked,
        counts.paywall_shown
      ),
    },
    recentEvents: events.slice(-20).reverse(),
  };
}
