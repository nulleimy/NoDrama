import { cookies } from "next/headers";
import { randomUUID } from "crypto";

export const FREE_WEEKLY_LIMIT = 2;

const USER_COOKIE = "nodrama_anon_id";
const USAGE_COOKIE_PREFIX = "nodrama_usage_week";

function weekKey() {
  const now = new Date();
  const day = now.getUTCDay() || 7;
  const monday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  monday.setUTCDate(monday.getUTCDate() - day + 1);
  return monday.toISOString().slice(0, 10);
}

function usageCookieName(anonId: string) {
  return `${USAGE_COOKIE_PREFIX}_${weekKey()}_${anonId}`;
}

export async function getOrCreateAnonId() {
  const cookieStore = await cookies();
  const existing = cookieStore.get(USER_COOKIE)?.value;

  if (existing) {
    return existing;
  }

  const anonId = randomUUID();

  cookieStore.set(USER_COOKIE, anonId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  return anonId;
}

export async function readWeeklyUsage(anonId: string) {
  const cookieStore = await cookies();
  const cookieName = usageCookieName(anonId);
  const value = cookieStore.get(cookieName)?.value;

  return value ? Number(value) || 0 : 0;
}

export async function incrementWeeklyUsage(anonId: string) {
  const cookieStore = await cookies();
  const cookieName = usageCookieName(anonId);
  const current = await readWeeklyUsage(anonId);
  const next = current + 1;

  cookieStore.set(cookieName, String(next), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 8,
  });

  return next;
}
