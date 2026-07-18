import "server-only";

import { assertSupabasePersistenceConfigured } from "@/lib/persistence/persistenceMode";

type SupabaseMethod = "GET" | "POST" | "PATCH" | "DELETE";

type SupabaseQuery = Record<string, string | number | boolean | null | undefined>;

export class SupabaseRestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SupabaseRestError";
  }
}

function getSupabaseRestConfig(area: string) {
  assertSupabasePersistenceConfigured(area);

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new SupabaseRestError(`${area} is missing Supabase REST config.`);
  }

  return {
    url: url.replace(/\/$/, ""),
    serviceRoleKey,
  };
}

function buildQueryString(query?: SupabaseQuery) {
  if (!query) return "";

  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value === null || value === undefined) continue;
    params.set(key, String(value));
  }

  const raw = params.toString();
  return raw ? `?${raw}` : "";
}

async function parseSupabaseResponse<T>(response: Response, area: string): Promise<T> {
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new SupabaseRestError(
      `${area} Supabase REST request failed: ${response.status} ${response.statusText}${detail ? ` — ${detail}` : ""}`
    );
  }

  if (response.status === 204) {
    return null as T;
  }

  const text = await response.text();
  return (text ? JSON.parse(text) : null) as T;
}

export async function supabaseRestRequest<T>(input: {
  area: string;
  table: string;
  method?: SupabaseMethod;
  query?: SupabaseQuery;
  body?: unknown;
  prefer?: string;
}): Promise<T> {
  const { url, serviceRoleKey } = getSupabaseRestConfig(input.area);
  const method = input.method || "GET";
  const queryString = buildQueryString(input.query);

  const response = await fetch(`${url}/rest/v1/${input.table}${queryString}`, {
    method,
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      ...(input.prefer ? { Prefer: input.prefer } : {}),
    },
    body: typeof input.body === "undefined" ? undefined : JSON.stringify(input.body),
    cache: "no-store",
  });

  return parseSupabaseResponse<T>(response, input.area);
}

export async function supabaseRpcRequest<T>(input: {
  area: string;
  functionName: string;
  body?: unknown;
}): Promise<T> {
  const { url, serviceRoleKey } = getSupabaseRestConfig(input.area);

  const response = await fetch(`${url}/rest/v1/rpc/${input.functionName}`, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
    },
    body: typeof input.body === "undefined" ? undefined : JSON.stringify(input.body),
    cache: "no-store",
  });

  return parseSupabaseResponse<T>(response, input.area);
}
