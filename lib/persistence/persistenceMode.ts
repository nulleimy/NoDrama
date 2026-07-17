import "server-only";

export type PersistenceBackend = "local_json" | "supabase";

const VALID_BACKENDS = new Set<PersistenceBackend>(["local_json", "supabase"]);

export class PersistenceConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PersistenceConfigurationError";
  }
}

export function getPersistenceBackend(): PersistenceBackend {
  const raw = process.env.NODRAMA_PERSISTENCE_BACKEND || "local_json";

  if (!VALID_BACKENDS.has(raw as PersistenceBackend)) {
    throw new PersistenceConfigurationError(
      `Unsupported NODRAMA_PERSISTENCE_BACKEND=${raw}. Use local_json or supabase.`
    );
  }

  return raw as PersistenceBackend;
}

export function getMissingSupabasePersistenceConfig() {
  return [
    ["NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL],
    ["SUPABASE_SERVICE_ROLE_KEY", process.env.SUPABASE_SERVICE_ROLE_KEY],
  ]
    .filter(([, value]) => !value)
    .map(([key]) => key);
}

export function assertLocalJsonPersistence(area: string) {
  const backend = getPersistenceBackend();

  if (process.env.NODE_ENV === "production") {
    throw new PersistenceConfigurationError(
      `${area} is still using local JSON persistence. Production requires a durable DB adapter before write/read traffic is allowed.`
    );
  }

  if (backend !== "local_json") {
    throw new PersistenceConfigurationError(
      `${area} requested ${backend}, but this route is still wired to the local JSON adapter. Finish the DB adapter migration before enabling it.`
    );
  }

  return backend;
}

export function assertSupabasePersistenceConfigured(area: string) {
  const missing = getMissingSupabasePersistenceConfig();

  if (missing.length) {
    throw new PersistenceConfigurationError(
      `${area} requires Supabase persistence config: ${missing.join(", ")}.`
    );
  }
}
