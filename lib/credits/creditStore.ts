import "server-only";

import type { CreditAccount, CreditStatus } from "@/lib/credits/creditTypes";
import { getPersistenceRepository } from "@/lib/persistence/persistenceRepository";

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
  const repository = getPersistenceRepository();
  const account = (await repository.getCreditAccount(userId)) || createAccount(userId);

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

  const repository = getPersistenceRepository();
  const account = (await repository.getCreditAccount(userId)) || createAccount(userId);

  account.credits += amount;
  account.updatedAt = new Date().toISOString();

  await repository.upsertCreditAccount(account);
  await repository.appendCreditLedger({
    entryId: `ledger_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
    userId,
    delta: amount,
    reason: "purchase",
    source: "api",
    createdAt: new Date().toISOString(),
  });

  return getCreditStatus(userId);
}

export async function consumeCredit(userId: string) {
  const repository = getPersistenceRepository();
  const account = (await repository.getCreditAccount(userId)) || createAccount(userId);

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

  await repository.upsertCreditAccount(account);
  await repository.appendCreditLedger({
    entryId: `ledger_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
    userId,
    delta: -1,
    reason: "consume",
    source: "system",
    createdAt: new Date().toISOString(),
  });

  return {
    consumed: true,
    status: {
      userId,
      credits: account.credits,
      hasCredits: account.credits > 0,
    },
  };
}
