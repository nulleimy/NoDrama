import { createHash } from "node:crypto";

const DEFAULT_WINDOW_SECONDS = 60;
const DEFAULT_MAX = 10;

type AbuseGuardEntry = {
  count: number;
  resetAt: number;
};

type AbuseGuardDecision = {
  limited: boolean;
  retryAfterSeconds: number;
};

const entries = new Map<string, AbuseGuardEntry>();

function readWindowSeconds(): number {
  const raw = Number(process.env.NODRAMA_GENERATE_LIMIT_WINDOW_SECONDS ?? DEFAULT_WINDOW_SECONDS);
  if (!Number.isFinite(raw) || raw <= 0) {
    return DEFAULT_WINDOW_SECONDS;
  }

  return Math.floor(raw);
}

function readLimitMax(): number {
  const raw = Number(process.env.NODRAMA_GENERATE_LIMIT_MAX ?? DEFAULT_MAX);
  if (!Number.isFinite(raw) || raw <= 0) {
    return DEFAULT_MAX;
  }

  return Math.floor(raw);
}

export function isAbuseGuardEnabled(): boolean {
  return process.env.NODRAMA_ABUSE_GUARD_ENABLED === "1";
}

export function buildClientSignalHash(request: Request): string {
  const salt = process.env.NODRAMA_ABUSE_GUARD_HASH_SALT ?? "";
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";
  const ua = request.headers.get("user-agent") ?? "";
  const lang = request.headers.get("accept-language") ?? "";
  const method = request.method;

  return createHash("sha256")
    .update(`${salt}|${ip}|${ua}|${lang}|${method}`)
    .digest("hex");
}

export function enforceGenerateAbuseLimit(clientSignalHash: string): AbuseGuardDecision {
  const now = Date.now();
  const windowSeconds = readWindowSeconds();
  const max = readLimitMax();
  const windowMs = windowSeconds * 1000;
  const current = entries.get(clientSignalHash);

  if (!current || current.resetAt <= now) {
    entries.set(clientSignalHash, { count: 1, resetAt: now + windowMs });
    return { limited: false, retryAfterSeconds: 0 };
  }

  if (current.count >= max) {
    const retryAfterSeconds = Math.max(1, Math.ceil((current.resetAt - now) / 1000));
    return { limited: true, retryAfterSeconds };
  }

  entries.set(clientSignalHash, { ...current, count: current.count + 1 });
  return { limited: false, retryAfterSeconds: 0 };
}
