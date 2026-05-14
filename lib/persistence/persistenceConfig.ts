import type { PersistenceMode } from "@/lib/persistence/persistenceTypes";

function normalizeMode(value: string | undefined): PersistenceMode {
  if (value === "database") return "database";
  if (value === "disabled") return "disabled";
  return "local_file";
}

export function getPersistenceMode(): PersistenceMode {
  return normalizeMode(process.env.NODRAMA_PERSISTENCE_MODE);
}

export function isDatabasePersistenceEnabled(): boolean {
  return getPersistenceMode() === "database";
}

export function assertPersistenceSafeConfig(): void {
  const mode = getPersistenceMode();

  if (mode !== "database") return;

  const dbUrl = process.env.DATABASE_URL || process.env.NODRAMA_DATABASE_URL;
  if (!dbUrl) {
    throw new Error(
      "Persistence mode is set to database, but DATABASE_URL/NODRAMA_DATABASE_URL is missing. Falling back is blocked for safety.",
    );
  }
}
