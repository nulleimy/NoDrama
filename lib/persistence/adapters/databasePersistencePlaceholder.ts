import type { PersistenceRepository } from "@/lib/persistence/persistenceTypes";

function notImplemented(operation: string): never {
  throw new Error(`Database persistence is selected but '${operation}' is not implemented/configured yet.`);
}

export const databasePersistencePlaceholderRepository: PersistenceRepository = {
  async getCreditAccount() { return notImplemented("getCreditAccount"); },
  async upsertCreditAccount() { return notImplemented("upsertCreditAccount"); },
  async appendBillingEvent() { return notImplemented("appendBillingEvent"); },
  async findBillingEventById() { return notImplemented("findBillingEventById"); },
};
