import "server-only";

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { CreditAccount, CreditStatus } from "@/lib/credits/creditTypes";

const creditsDir = path.join(process.cwd(), "data", "credits");
const creditsFile = path.join(creditsDir, "credits.json");

type CreditDb = Record<string, CreditAccount>;

async function readCreditDb(): Promise<CreditDb> {
  try {
    const raw = await readFile(creditsFile, "utf8");
    return JSON.parse(raw) as CreditDb;
  } catch {
    return {};
  }
}

async function writeCreditDb(db: CreditDb) {
  await mkdir(creditsDir, { recursive: true });
  await writeFile(creditsFile, `${JSON.stringify(db, null, 2)}\n`, "utf8");
}

function createAccount(userId: string): CreditAccount {
  const now = new Date().toISOString();

  return {
    userId,
    credits: 0,
    createdAt: now,
    updatedAt: now,
  };
}

export async function getCreditStatus(userId: string): Promise<CreditStatus> {
  const db = await readCreditDb();
  const account = db[userId] || createAccount(userId);

  return {
    userId,
    credits: account.credits,
    hasCredits: account.credits > 0,
  };
}

export async function addCredits(userId: string, amount: number) {
  if (!Number.isInteger(amount) || amount <= 0 || amount > 10000) {
    throw new Error("Invalid credit amount.");
  }

  const db = await readCreditDb();
  const account = db[userId] || createAccount(userId);

  account.credits += amount;
  account.updatedAt = new Date().toISOString();

  db[userId] = account;

  await writeCreditDb(db);

  return getCreditStatus(userId);
}

export async function consumeCredit(userId: string) {
  const db = await readCreditDb();
  const account = db[userId] || createAccount(userId);

  if (account.credits <= 0) {
    return {
      consumed: false,
      status: {
        userId,
        credits: account.credits,
        hasCredits: false,
      },
    };
  }

  account.credits -= 1;
  account.updatedAt = new Date().toISOString();

  db[userId] = account;

  await writeCreditDb(db);

  return {
    consumed: true,
    status: {
      userId,
      credits: account.credits,
      hasCredits: account.credits > 0,
    },
  };
}
