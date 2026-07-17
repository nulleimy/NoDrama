import "server-only";

import type { CreditLedgerEntry } from "@/lib/credits/creditLedger";
import {
  supabaseRestRequest,
  supabaseRpcRequest,
} from "@/lib/persistence/supabaseRest";

type CreditLedgerMetadata = Record<string, string | number | boolean | null>;

type SupabaseCreditLedgerRow = {
  id: string;
  account_key: string;
  user_id_hash: string | null;
  delta: number;
  reason: CreditLedgerEntry["reason"];
  source: CreditLedgerEntry["source"];
  reference_id: string;
  created_at: string;
  metadata: CreditLedgerMetadata | null;
  idempotency_key: string;
};

type SupabaseCreditDebitResult = {
  debited: boolean;
  balance: number;
};

function fromCreditLedgerRow(row: SupabaseCreditLedgerRow): CreditLedgerEntry {
  return {
    id: row.id,
    accountKey: row.account_key,
    userIdHash: row.user_id_hash,
    delta: row.delta,
    reason: row.reason,
    source: row.source,
    referenceId: row.reference_id,
    createdAt: row.created_at,
    metadata: row.metadata || undefined,
    idempotencyKey: row.idempotency_key,
  };
}

export async function readSupabaseCreditLedgerEntries(accountKey: string) {
  const rows = await supabaseRestRequest<SupabaseCreditLedgerRow[]>({
    area: "Credit ledger",
    table: "credit_ledger",
    query: {
      account_key: `eq.${accountKey}`,
      order: "created_at.asc",
    },
  });

  return rows.map(fromCreditLedgerRow);
}

export async function insertSupabaseCreditLedgerEntry(
  entry: Omit<CreditLedgerEntry, "id" | "createdAt">
) {
  const rows = await supabaseRestRequest<SupabaseCreditLedgerRow[]>({
    area: "Credit ledger",
    table: "credit_ledger",
    method: "POST",
    query: {
      select: "*",
    },
    prefer: "return=representation,resolution=ignore-duplicates",
    body: [
      {
        account_key: entry.accountKey,
        user_id_hash: entry.userIdHash,
        delta: entry.delta,
        reason: entry.reason,
        source: entry.source,
        reference_id: entry.referenceId,
        metadata: entry.metadata || {},
        idempotency_key: entry.idempotencyKey,
      },
    ],
  });

  if (rows.length) return fromCreditLedgerRow(rows[0]);

  const existing = await supabaseRestRequest<SupabaseCreditLedgerRow[]>({
    area: "Credit ledger",
    table: "credit_ledger",
    query: {
      idempotency_key: `eq.${entry.idempotencyKey}`,
      limit: 1,
    },
  });

  if (!existing.length) {
    throw new Error("Credit ledger insert produced no row and no idempotency match.");
  }

  return fromCreditLedgerRow(existing[0]);
}

export async function grantSupabaseCreditsAtomically(
  entry: Omit<CreditLedgerEntry, "id" | "createdAt" | "delta"> & {
    amount: number;
  }
) {
  const rows = await supabaseRpcRequest<SupabaseCreditLedgerRow[]>({
    area: "Credit ledger",
    functionName: "nodrama_grant_credits",
    body: {
      p_account_key: entry.accountKey,
      p_user_id_hash: entry.userIdHash,
      p_amount: entry.amount,
      p_reason: entry.reason,
      p_source: entry.source,
      p_reference_id: entry.referenceId,
      p_idempotency_key: entry.idempotencyKey,
      p_metadata: entry.metadata || {},
    },
  });

  if (!rows.length) {
    throw new Error("Atomic credit grant RPC returned no result.");
  }

  return fromCreditLedgerRow(rows[0]);
}

export async function debitSupabaseCreditsAtomically(input: {
  accountKey: string;
  userIdHash: string | null;
  amount: number;
  referenceId: string;
  idempotencyKey: string;
  metadata?: CreditLedgerMetadata;
}) {
  const rows = await supabaseRpcRequest<SupabaseCreditDebitResult[]>({
    area: "Credit ledger",
    functionName: "nodrama_debit_credits",
    body: {
      p_account_key: input.accountKey,
      p_user_id_hash: input.userIdHash,
      p_amount: input.amount,
      p_reference_id: input.referenceId,
      p_idempotency_key: input.idempotencyKey,
      p_metadata: input.metadata || {},
    },
  });

  if (!rows.length) {
    throw new Error("Atomic credit debit RPC returned no result.");
  }

  return rows[0];
}
