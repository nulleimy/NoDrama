import "server-only";

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { BillingEventRecord, CreditAccountRecord, PersistenceRepository } from "@/lib/persistence/persistenceTypes";

const creditsDir = path.join(process.cwd(), "data", "credits");
const creditsFile = path.join(creditsDir, "credits.json");
const billingDir = path.join(process.cwd(), "data", "billing");
const billingEventsFile = path.join(billingDir, "events.json");

type CreditDb = Record<string, CreditAccountRecord>;

type BillingDb = { events: BillingEventRecord[] };

async function readCreditDb(): Promise<CreditDb> { try { return JSON.parse(await readFile(creditsFile, "utf8")) as CreditDb; } catch { return {}; } }
async function writeCreditDb(db: CreditDb) { await mkdir(creditsDir, { recursive: true }); await writeFile(creditsFile, `${JSON.stringify(db, null, 2)}\n`, "utf8"); }
async function readBillingDb(): Promise<BillingDb> { try { return JSON.parse(await readFile(billingEventsFile, "utf8")) as BillingDb; } catch { return { events: [] }; } }
async function writeBillingDb(db: BillingDb) { await mkdir(billingDir, { recursive: true }); await writeFile(billingEventsFile, `${JSON.stringify(db, null, 2)}\n`, "utf8"); }

export const localFilePersistenceRepository: PersistenceRepository = {
  async getCreditAccount(userId) {
    const db = await readCreditDb();
    return db[userId] ?? null;
  },
  async upsertCreditAccount(account) {
    const db = await readCreditDb();
    db[account.userId] = account;
    await writeCreditDb(db);
  },
  async appendBillingEvent(event) {
    const db = await readBillingDb();
    db.events.push(event);
    await writeBillingDb(db);
  },
  async findBillingEventById(eventId) {
    const db = await readBillingDb();
    return db.events.find((event) => event.eventId === eventId) ?? null;
  },
};
