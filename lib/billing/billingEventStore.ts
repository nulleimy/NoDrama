import "server-only";

import { getPersistenceRepository } from "@/lib/persistence/persistenceRepository";

export async function recordBillingEvent(input: {
  eventId: string;
  eventType: string;
  metadata?: Record<string, string | number | boolean | null>;
}) {
  const repository = getPersistenceRepository();
  const existing = await repository.findBillingEventById(input.eventId);

  if (existing) {
    await repository.appendBillingEvent({
      eventId: input.eventId,
      eventType: input.eventType,
      receivedAt: new Date().toISOString(),
      status: "duplicate",
    });
    return { accepted: false, duplicate: true };
  }

  await repository.appendBillingEvent({
    eventId: input.eventId,
    eventType: input.eventType,
    receivedAt: new Date().toISOString(),
    status: "accepted",
    metadata: input.metadata,
  });

  return { accepted: true, duplicate: false };
}
