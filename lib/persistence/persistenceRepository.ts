import { databasePersistencePlaceholderRepository } from "@/lib/persistence/adapters/databasePersistencePlaceholder";
import { localFilePersistenceRepository } from "@/lib/persistence/adapters/localFilePersistence";
import { assertPersistenceSafeConfig, getPersistenceMode } from "@/lib/persistence/persistenceConfig";
import type { PersistenceRepository } from "@/lib/persistence/persistenceTypes";

const disabledRepository: PersistenceRepository = {
  async getCreditAccount() {
    return null;
  },
  async upsertCreditAccount() {},
  async appendCreditLedger() {},
  async recordBillingEvent() {},
};

export function getPersistenceRepository(): PersistenceRepository {
  const mode = getPersistenceMode();

  if (mode === "database") {
    assertPersistenceSafeConfig();
    return databasePersistencePlaceholderRepository;
  }

  if (mode === "disabled") {
    return disabledRepository;
  }

  return localFilePersistenceRepository;
}
