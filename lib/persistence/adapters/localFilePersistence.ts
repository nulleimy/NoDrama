import "server-only";

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type {
  BillingEventRecord,
  CreditAccountRecord,
  CreditLedgerRecord,
  PersistenceRepository,
} from "@/lib/persistence/persistenceTypes";

const dataDir = path.join(process.cwd(), "data", "persistence");
const creditsFile = path.join(dataDir, "credits.json");
const ledgerFile = path.join(dataDir, "credit-ledger.json");
const billingFile = path.join(dataDir, "billing-events.json");

type CreditDb = Record<string, CreditAccountRecord>;

async function readJsonOrDefault<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await readFile(file, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson(file: string, data: unknown): Promise<void> {
  await mkdir(dataDir, { recursive: true });
  await writeFile(file, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

export const localFilePersistenceRepository: PersistenceRepository = {
  async getCreditAccount(userId) {
    const db = await readJsonOrDefault<CreditDb>(creditsFile, {});
    return db[userId] ?? null;
  },

  async upsertCreditAccount(account) {
    const db = await readJsonOrDefault<CreditDb>(creditsFile, {});
    db[account.userId] = account;
    await writeJson(creditsFile, db);
  },

  async appendCreditLedger(entry: CreditLedgerRecord) {
    const ledger = await readJsonOrDefault<CreditLedgerRecord[]>(ledgerFile, []);
    ledger.push(entry);
    await writeJson(ledgerFile, ledger);
  },

  async recordBillingEvent(event: BillingEventRecord) {
    const events = await readJsonOrDefault<BillingEventRecord[]>(billingFile, []);
    events.push(event);
    await writeJson(billingFile, events);
  },
};
