export type PersistenceMode = "local_file" | "database" | "disabled";

export type UserRecord = {
  userId: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
};

export type SubscriptionRecord = {
  userId: string;
  subscriptionId: string;
  status: "active" | "past_due" | "canceled" | "incomplete" | "trialing";
  planCode: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  updatedAt: string;
};

export type CreditLedgerRecord = {
  entryId: string;
  userId: string;
  delta: number;
  reason: "purchase" | "grant" | "consume" | "refund" | "adjustment";
  source: "stripe" | "admin" | "api" | "system";
  idempotencyKey?: string;
  createdAt: string;
  metadata?: Record<string, string | number | boolean | null>;
};

export type BillingEventRecord = {
  eventId: string;
  eventType: string;
  receivedAt: string;
  status: "accepted" | "duplicate" | "ignored";
  metadata?: Record<string, string | number | boolean | null>;
};

export type GenerationEventRecord = {
  generationId: string;
  userId?: string;
  createdAt: string;
  scenario?: string;
  metadata?: Record<string, string | number | boolean | null>;
};

export type FeedbackEventRecord = {
  feedbackId: string;
  generationId?: string;
  userId?: string;
  createdAt: string;
  sentiment?: "positive" | "negative" | "neutral";
  metadata?: Record<string, string | number | boolean | null>;
};

export type RegressionCandidateRecord = {
  candidateId: string;
  detectedAt: string;
  source: "feedback" | "qa" | "manual";
  metadata?: Record<string, string | number | boolean | null>;
};

export type AuditLogRecord = {
  logId: string;
  actorType: "user" | "admin" | "system";
  actorId?: string;
  action: string;
  createdAt: string;
  metadata?: Record<string, string | number | boolean | null>;
};

export type CreditAccountRecord = {
  userId: string;
  credits: number;
  createdAt: string;
  updatedAt: string;
};

export type PersistenceRepository = {
  getCreditAccount(userId: string): Promise<CreditAccountRecord | null>;
  upsertCreditAccount(account: CreditAccountRecord): Promise<void>;
  appendCreditLedger(entry: CreditLedgerRecord): Promise<void>;
  recordBillingEvent(event: BillingEventRecord): Promise<void>;
};
