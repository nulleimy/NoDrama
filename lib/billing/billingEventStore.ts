import "server-only";

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { recordSupabaseBillingEvent } from "@/lib/billing/supabaseBillingEventStore";
import {
  assertLocalJsonPersistence,
  getPersistenceBackend,
} from "@/lib/persistence/persistenceMode";

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

async function readLocalBillingDb(): Promise<BillingDb> {
  assertLocalJsonPersistence("Billing event store");

  try {
    const raw = await readFile(billingEventsFile, "utf8");
    return JSON.parse(raw) as BillingDb;
  } catch {
    return { handledEventIds: [], events: [] };
  }
}

async function writeLocalBillingDb(db: BillingDb) {
  assertLocalJsonPersistence("Billing event store");

  await mkdir(billingDir, { recursive: true });
  await writeFile(billingEventsFile, `${JSON.stringify(db, null, 2)}\n`, "utf8");
}

export async function recordBillingEvent(input: {
  eventId: string;
  eventType: string;
  metadata?: Record<string, string | number | boolean | null>;
}) {
  if (getPersistenceBackend() === "supabase") {
    return recordSupabaseBillingEvent(input);
  }

  const db = await readLocalBillingDb();

  if (db.handledEventIds.includes(input.eventId)) {
    db.events.push({
      eventId: input.eventId,
      eventType: input.eventType,
      receivedAt: new Date().toISOString(),
      status: "duplicate",
    });
    await writeLocalBillingDb(db);
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

  await writeLocalBillingDb(db);
  return { accepted: true, duplicate: false };
}
