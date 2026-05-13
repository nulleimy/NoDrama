import { createHash } from "node:crypto";

export type AbuseRiskLevel = "low" | "medium" | "high";

export type AbuseDecision = {
  allowed: boolean;
  reason?: string;
  retryAfterSeconds?: number;
  riskLevel: AbuseRiskLevel;
  metadata: {
    clientHash?: string;
    route: string;
    windowSeconds: number;
    limit: number;
    count?: number;
  };
};

type ClientSignal = {
  signal?: string;
  riskLevel: AbuseRiskLevel;
  userAgentClass: "browser" | "bot" | "script" | "unknown";
};

type GenerateAbuseLimitInput = {
  clientHash?: string;
  route?: string;
  nowMs?: number;
};

type LimitWindowRecord = { count: number; startedAtMs: number };

const DEFAULT_WINDOW_SECONDS = 10 * 60;
const DEFAULT_LIMIT_MAX = 20;
const NO_SIGNAL_LIMIT_MAX = 8;
const ROUTE_GENERATE = "/api/generate";
const ABUSE_HASH_SALT = process.env.NODRAMA_ABUSE_GUARD_HASH_SALT || "nodrama-abuse-guard-v1";

const windowStore = new Map<string, LimitWindowRecord>();

export function isAbuseGuardEnabled(): boolean {
  const raw = process.env.NODRAMA_ABUSE_GUARD_ENABLED;
  if (!raw) return true;
  return raw.toLowerCase() !== "false";
}

export function getClientSignal(request: Request): ClientSignal {
  const forwardedFor = request.headers.get("x-forwarded-for") || "";
  const firstForwardedIp = forwardedFor.split(",")[0]?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();
  const ip = firstForwardedIp || realIp;

  const cookieHeader = request.headers.get("cookie") || "";
  const sessionCookie =
    readCookieValue(cookieHeader, "next-auth.session-token") ||
    readCookieValue(cookieHeader, "__Secure-next-auth.session-token") ||
    readCookieValue(cookieHeader, "nodrama_anon_id");

  const userAgent = request.headers.get("user-agent") || "";
  const userAgentClass = classifyUserAgent(userAgent);

  const parts = [ip, sessionCookie, userAgentClass].filter(Boolean);

  return {
    signal: parts.length ? parts.join("|") : undefined,
    riskLevel: parts.length ? "low" : "high",
    userAgentClass,
  };
}

export function hashClientSignal(value?: string): string | undefined {
  if (!value) return undefined;

  return createHash("sha256").update(`${ABUSE_HASH_SALT}:${value}`).digest("hex").slice(0, 24);
}

export function checkGenerateAbuseLimit(input: GenerateAbuseLimitInput): AbuseDecision {
  const windowSeconds = parsePositiveInt(process.env.NODRAMA_GENERATE_LIMIT_WINDOW_SECONDS, DEFAULT_WINDOW_SECONDS);
  const baseLimit = parsePositiveInt(process.env.NODRAMA_GENERATE_LIMIT_MAX, DEFAULT_LIMIT_MAX);
  const limit = input.clientHash ? baseLimit : Math.min(baseLimit, NO_SIGNAL_LIMIT_MAX);
  const route = input.route || ROUTE_GENERATE;

  if (!isAbuseGuardEnabled()) {
    return buildAbuseDecision({
      allowed: true,
      riskLevel: "low",
      metadata: { clientHash: input.clientHash, route, windowSeconds, limit, count: 0 },
    });
  }

  const nowMs = input.nowMs ?? Date.now();
  const key = `${route}:${input.clientHash || "missing-signal"}`;
  const existing = windowStore.get(key);

  if (!existing || nowMs - existing.startedAtMs >= windowSeconds * 1000) {
    windowStore.set(key, { count: 1, startedAtMs: nowMs });
    return buildAbuseDecision({
      allowed: true,
      riskLevel: input.clientHash ? "low" : "medium",
      metadata: { clientHash: input.clientHash, route, windowSeconds, limit, count: 1 },
    });
  }

  const nextCount = existing.count + 1;
  const blocked = nextCount > limit;

  windowStore.set(key, { ...existing, count: nextCount });

  const elapsedMs = nowMs - existing.startedAtMs;
  const retryAfterSeconds = Math.max(1, Math.ceil((windowSeconds * 1000 - elapsedMs) / 1000));

  return buildAbuseDecision({
    allowed: !blocked,
    reason: blocked ? "generate_rate_limit" : undefined,
    retryAfterSeconds: blocked ? retryAfterSeconds : undefined,
    riskLevel: blocked ? "high" : input.clientHash ? "low" : "medium",
    metadata: { clientHash: input.clientHash, route, windowSeconds, limit, count: nextCount },
  });
}

export function buildAbuseDecision(input: AbuseDecision): AbuseDecision {
  return {
    allowed: input.allowed,
    reason: input.reason,
    retryAfterSeconds: input.retryAfterSeconds,
    riskLevel: input.riskLevel,
    metadata: input.metadata,
  };
}

function parsePositiveInt(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(value || "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function readCookieValue(cookieHeader: string, name: string): string | undefined {
  const cookies = cookieHeader.split(";");
  for (const cookie of cookies) {
    const [rawName, ...rest] = cookie.trim().split("=");
    if (rawName !== name) continue;
    return rest.join("=") || undefined;
  }
  return undefined;
}

function classifyUserAgent(userAgent: string): ClientSignal["userAgentClass"] {
  if (!userAgent) return "unknown";
  const normalized = userAgent.toLowerCase();
  if (normalized.includes("bot") || normalized.includes("crawler") || normalized.includes("spider")) return "bot";
  if (
    normalized.includes("node") ||
    normalized.includes("curl") ||
    normalized.includes("httpie") ||
    normalized.includes("postman")
  )
    return "script";
  return "browser";
}

export function __resetAbuseGuardForTests() {
  windowStore.clear();
}
