import "server-only";

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { getPersistenceRepository } from "@/lib/persistence/persistenceRepository";

const billingDir = path.join(process.cwd(), "data", "billing");
const dedupeFile = path.join(billingDir, "handled-event-ids.json");

type DedupeDb = {
  handledEventIds: string[];
};

async function readDedupeDb(): Promise<DedupeDb> {
  try {
    const raw = await readFile(dedupeFile, "utf8");
    return JSON.parse(raw) as DedupeDb;
  } catch {
    return { handledEventIds: [] };
  }
}

async function writeDedupeDb(db: DedupeDb) {
  await mkdir(billingDir, { recursive: true });
  await writeFile(dedupeFile, `${JSON.stringify(db, null, 2)}\n`, "utf8");
}

export async function recordBillingEvent(input: {
  eventId: string;
  eventType: string;
  metadata?: Record<string, string | number | boolean | null>;
}) {
  const db = await readDedupeDb();
  const repository = getPersistenceRepository();

  if (db.handledEventIds.includes(input.eventId)) {
    await repository.recordBillingEvent({
      eventId: input.eventId,
      eventType: input.eventType,
      receivedAt: new Date().toISOString(),
      status: "duplicate",
    });
    return { accepted: false, duplicate: true };
  }

  db.handledEventIds.push(input.eventId);
  await writeDedupeDb(db);

  await repository.recordBillingEvent({
    eventId: input.eventId,
    eventType: input.eventType,
    receivedAt: new Date().toISOString(),
    status: "accepted",
    metadata: input.metadata,
  });

  return { accepted: true, duplicate: false };
}
