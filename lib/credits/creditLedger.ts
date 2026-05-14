import "server-only";

import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const creditsDir = path.join(process.cwd(), "data", "credits");
const ledgerFile = path.join(creditsDir, "ledger.json");

const ALLOWED_REASONS = [
  "free_initial",
  "free_weekly",
  "manual_dev_grant",
  "stripe_pack_purchase",
  "stripe_subscription_grant",
  "generation_debit",
  "adjustment",
  "refund",
  "reversal",
] as const;

type CreditReason = (typeof ALLOWED_REASONS)[number];
type CreditSource = "api" | "generate" | "stripe_webhook" | "system";

export type CreditLedgerEntry = {
  id: string;
  accountKey: string;
  userIdHash: string | null;
  delta: number;
  reason: CreditReason;
  source: CreditSource;
  referenceId: string;
  createdAt: string;
  metadata?: Record<string, string | number | boolean | null>;
  idempotencyKey: string;
};

type CreditLedgerDb = { entries: CreditLedgerEntry[] };

function hashUserId(userId: string) {
  return createHash("sha256").update(userId).digest("hex");
}

async function readCreditLedgerDb(): Promise<CreditLedgerDb> {
  try {
    const raw = await readFile(ledgerFile, "utf8");
    const parsed = JSON.parse(raw) as CreditLedgerDb;
    return { entries: Array.isArray(parsed.entries) ? parsed.entries : [] };
  } catch {
    return { entries: [] };
  }
}

async function writeCreditLedgerDb(db: CreditLedgerDb) {
  await mkdir(creditsDir, { recursive: true });
  await writeFile(ledgerFile, `${JSON.stringify(db, null, 2)}\n`, "utf8");
}

export function getCreditAccountKey(input: { userId?: string | null; anonId?: string | null }) {
  if (input.userId) return { accountKey: `user:${input.userId}`, accountMode: "authenticated" as const };
  return { accountKey: `anon:${input.anonId ?? "local"}`, accountMode: "anonymous" as const };
}

export async function getCreditLedgerEntries(accountKey: string) {
  const db = await readCreditLedgerDb();
  return db.entries.filter((entry) => entry.accountKey === accountKey);
}

export async function getCurrentCreditBalance(accountKey: string) {
  const entries = await getCreditLedgerEntries(accountKey);
  return entries.reduce((sum, entry) => sum + entry.delta, 0);
}

export async function appendCreditLedgerEntry(entry: Omit<CreditLedgerEntry, "id" | "createdAt">) {
  const db = await readCreditLedgerDb();
  const duplicate = db.entries.find((item) => item.idempotencyKey === entry.idempotencyKey);
  if (duplicate) return duplicate;

  const next: CreditLedgerEntry = {
    ...entry,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  };

  db.entries.push(next);
  await writeCreditLedgerDb(db);
  return next;
}

export async function grantCredits(input: {
  accountKey: string;
  userId?: string | null;
  amount: number;
  reason: CreditReason;
  source: CreditSource;
  referenceId: string;
  idempotencyKey: string;
  metadata?: CreditLedgerEntry["metadata"];
}) {
  if (!ALLOWED_REASONS.includes(input.reason) || input.amount <= 0) throw new Error("Invalid grant input.");

  return appendCreditLedgerEntry({
    accountKey: input.accountKey,
    userIdHash: input.userId ? hashUserId(input.userId) : null,
    delta: Math.abs(Math.trunc(input.amount)),
    reason: input.reason,
    source: input.source,
    referenceId: input.referenceId,
    metadata: input.metadata,
    idempotencyKey: input.idempotencyKey,
  });
}

export async function debitCredits(input: {
  accountKey: string;
  userId?: string | null;
  amount?: number;
  referenceId: string;
  idempotencyKey: string;
}) {
  const amount = Math.abs(Math.trunc(input.amount ?? 1));
  const balance = await getCurrentCreditBalance(input.accountKey);
  if (balance < amount) return { debited: false, balance };

  await appendCreditLedgerEntry({
    accountKey: input.accountKey,
    userIdHash: input.userId ? hashUserId(input.userId) : null,
    delta: -amount,
    reason: "generation_debit",
    source: "generate",
    referenceId: input.referenceId,
    idempotencyKey: input.idempotencyKey,
  });

  return { debited: true, balance: balance - amount };
}

export async function buildCreditStatus(input: { accountKey: string; accountMode: "authenticated" | "anonymous" }) {
  const balance = await getCurrentCreditBalance(input.accountKey);
  return {
    accountMode: input.accountMode,
    balance,
    credits: balance,
    hasCredits: balance > 0,
    ledgerAvailable: true,
    planId: null,
    situationUnitCopy: "1 situation is the billing unit.",
  };
}
