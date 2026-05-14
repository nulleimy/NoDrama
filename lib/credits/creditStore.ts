import "server-only";

import { randomUUID } from "node:crypto";
import type { CreditStatus } from "@/lib/credits/creditTypes";
import { buildCreditStatus, debitCredits, grantCredits } from "@/lib/credits/creditLedger";

export async function getCreditStatus(userId: string): Promise<CreditStatus> {
  const status = await buildCreditStatus({
    accountKey: userId,
    accountMode: userId.startsWith("user:") ? "authenticated" : "anonymous",
  });

  return {
    userId,
    credits: status.credits,
    hasCredits: status.hasCredits,
  };
}

export async function addCredits(userId: string, amount: number) {
  if (!Number.isInteger(amount) || amount <= 0 || amount > 10000) {
    throw new Error("Invalid credit amount.");
  }

  await grantCredits({
    accountKey: userId,
    amount,
    reason: "manual_dev_grant",
    source: "api",
    referenceId: `manual:${userId}`,
    idempotencyKey: `manual:${userId}:${amount}:${randomUUID()}`,
  });

  return getCreditStatus(userId);
}

export async function consumeCredit(userId: string) {
  const referenceId = `generation:${Date.now()}`;
  const idempotencyKey = `${referenceId}:${userId}`;
  const result = await debitCredits({ accountKey: userId, referenceId, idempotencyKey, amount: 1 });

  const status = await getCreditStatus(userId);
  return { consumed: result.debited, status };
}
