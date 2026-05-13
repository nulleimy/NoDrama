import "server-only";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
type BillingEventRecord = { eventId: string; type: string; createdAt: string; livemode: boolean; metadata: Record<string, string | number | boolean | null>; };
type BillingDb = { processedEventIds: string[]; events: BillingEventRecord[]; };
const billingDir = path.join(process.cwd(), "data", "billing");
const billingFile = path.join(billingDir, "events.json");
async function readDb(): Promise<BillingDb> { try { const raw = await readFile(billingFile, "utf8"); return JSON.parse(raw) as BillingDb; } catch { return { processedEventIds: [], events: [] }; } }
async function writeDb(db: BillingDb) { await mkdir(billingDir, { recursive: true }); await writeFile(billingFile, `${JSON.stringify(db, null, 2)}\n`, "utf8"); }
export async function markWebhookEventProcessed(eventId: string) { const db = await readDb(); if (db.processedEventIds.includes(eventId)) return false; db.processedEventIds.push(eventId); await writeDb(db); return true; }
export async function logBillingEvent(record: BillingEventRecord) { const db = await readDb(); db.events.push(record); db.events = db.events.slice(-2000); await writeDb(db); }
