import { localFilePersistenceRepository } from "@/lib/persistence/adapters/localFilePersistence";
import { databasePersistencePlaceholderRepository } from "@/lib/persistence/adapters/databasePersistencePlaceholder";
import { assertPersistenceSafeConfig, getPersistenceMode, isDatabasePersistenceEnabled } from "@/lib/persistence/persistenceConfig";
import type { PersistenceRepository } from "@/lib/persistence/persistenceTypes";

export function getPersistenceRepository(): PersistenceRepository {
  const mode = getPersistenceMode();
  if (mode === "database") {
    assertPersistenceSafeConfig();
    if (!isDatabasePersistenceEnabled()) {
      throw new Error("Database persistence requested but unavailable. Falling back is disabled for safety.");
    }
    return databasePersistencePlaceholderRepository;
  }

  if (mode === "disabled") {
    return databasePersistencePlaceholderRepository;
  }

  return localFilePersistenceRepository;
}
