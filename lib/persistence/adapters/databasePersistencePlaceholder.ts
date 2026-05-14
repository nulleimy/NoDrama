import "server-only";

import { getPersistenceMode, isDatabasePersistenceEnabled } from "@/lib/persistence/persistenceConfig";
import type { PersistenceRepository } from "@/lib/persistence/persistenceTypes";

function notImplementedError(method: string): Error {
  const mode = getPersistenceMode();
  const enabled = isDatabasePersistenceEnabled();
  return new Error(
    `Database persistence placeholder invoked via ${method}. mode=${mode}, databaseEnabled=${enabled}. Database adapter is not implemented/configured yet.`,
  );
}

export const databasePersistencePlaceholderRepository: PersistenceRepository = {
  async getCreditAccount() {
    throw notImplementedError("getCreditAccount");
  },
  async upsertCreditAccount() {
    throw notImplementedError("upsertCreditAccount");
  },
  async appendCreditLedger() {
    throw notImplementedError("appendCreditLedger");
  },
  async recordBillingEvent() {
    throw notImplementedError("recordBillingEvent");
  },
};
