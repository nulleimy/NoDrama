import "server-only";

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const billingDir = path.join(process.cwd(), "data", "billing");
const billingEventsFile = path.join(billingDir, "events.json");

type BillingEventRecord = {
  eventId: string;
  eventType: string;
  receivedAt: string;
  status: "accepted" | "duplicate" | "ignored";
  metadata?: Record<string, string | number | boolean | null>;
};

type BillingDb = {
  handledEventIds: string[];
  events: BillingEventRecord[];
};

async function readBillingDb(): Promise<BillingDb> {
  try {
    const raw = await readFile(billingEventsFile, "utf8");
    return JSON.parse(raw) as BillingDb;
  } catch {
    return { handledEventIds: [], events: [] };
  }
}

async function writeBillingDb(db: BillingDb) {
  await mkdir(billingDir, { recursive: true });
  await writeFile(billingEventsFile, `${JSON.stringify(db, null, 2)}\n`, "utf8");
}

export async function recordBillingEvent(input: {
  eventId: string;
  eventType: string;
  metadata?: Record<string, string | number | boolean | null>;
}) {
  const db = await readBillingDb();

  if (db.handledEventIds.includes(input.eventId)) {
    db.events.push({
      eventId: input.eventId,
      eventType: input.eventType,
      receivedAt: new Date().toISOString(),
      status: "duplicate",
    });
    await writeBillingDb(db);
    return { accepted: false, duplicate: true };
  }

  db.handledEventIds.push(input.eventId);
  db.events.push({
    eventId: input.eventId,
    eventType: input.eventType,
    receivedAt: new Date().toISOString(),
    status: "accepted",
    metadata: input.metadata,
  });

  await writeBillingDb(db);
  return { accepted: true, duplicate: false };
}
