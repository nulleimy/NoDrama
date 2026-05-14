import type { PersistenceMode } from "@/lib/persistence/persistenceTypes";

const DEFAULT_MODE: PersistenceMode = "local_file";

export function getPersistenceMode(): PersistenceMode {
  const raw = process.env.NODRAMA_PERSISTENCE_MODE?.trim().toLowerCase();
  if (raw === "database" || raw === "local_file" || raw === "disabled") return raw;
  return DEFAULT_MODE;
}

export function getPersistenceDatabaseUrl(): string | null {
  return process.env.NODRAMA_DATABASE_URL || process.env.DATABASE_URL || null;
}

export function isDatabasePersistenceEnabled(): boolean {
  return getPersistenceMode() === "database" && Boolean(getPersistenceDatabaseUrl());
}

export function assertPersistenceSafeConfig() {
  const mode = getPersistenceMode();
  if (mode === "database" && !getPersistenceDatabaseUrl()) {
    throw new Error("Persistence mode is 'database' but no DATABASE_URL/NODRAMA_DATABASE_URL is configured.");
  }
}
