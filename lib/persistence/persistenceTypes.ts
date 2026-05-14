export type PersistenceMode = "local_file" | "database" | "disabled";

export type UserRecord = { userId: string; email?: string; createdAt: string; updatedAt: string };
export type SubscriptionRecord = { userId: string; provider: "stripe"; status: "active" | "canceled" | "past_due" | "incomplete"; priceId?: string; currentPeriodEnd?: string; updatedAt: string };
export type CreditLedgerRecord = { id: string; userId: string; delta: number; reason: "purchase" | "usage" | "grant" | "correction"; idempotencyKey?: string; createdAt: string; metadata?: Record<string, string | number | boolean | null> };
export type BillingEventRecord = { eventId: string; eventType: string; receivedAt: string; status: "accepted" | "duplicate" | "ignored"; metadata?: Record<string, string | number | boolean | null> };
export type GenerationEventRecord = { id: string; createdAt: string; source: "ui" | "api" | "cli" | "test"; locale: "cs" | "en"; situationHash?: string; situationLength: number; storesFullSituation: false; storesGeneratedOutput: false; metadata?: Record<string, string | number | boolean | null> };
export type FeedbackEventRecord = { id: string; generationId: string; reason: string; noteStored: false; createdAt: string };
export type RegressionCandidateRecord = { id: string; generationId: string; reason: string; createdAt: string };
export type AuditLogRecord = { id: string; actorId?: string; action: string; createdAt: string; metadata?: Record<string, string | number | boolean | null> };

export type CreditAccountRecord = { userId: string; credits: number; createdAt: string; updatedAt: string };

export type PersistenceRepository = {
  getCreditAccount(userId: string): Promise<CreditAccountRecord | null>;
  upsertCreditAccount(account: CreditAccountRecord): Promise<void>;
  appendBillingEvent(event: BillingEventRecord): Promise<void>;
  findBillingEventById(eventId: string): Promise<BillingEventRecord | null>;
};
