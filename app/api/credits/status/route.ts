import { NextResponse } from "next/server";
import { buildCreditStatus } from "@/lib/credits/creditLedger";
import { getCreditIdentity } from "@/lib/credits/userIdentity";

export async function GET() {
  const identity = await getCreditIdentity();
  const status = await buildCreditStatus({ accountKey: identity.accountKey, accountMode: identity.accountMode });

  return NextResponse.json({
    ok: true,
    status: {
      userId: identity.accountKey,
      credits: status.credits,
      hasCredits: status.hasCredits,
      accountMode: status.accountMode,
      balance: status.balance,
      ledgerAvailable: status.ledgerAvailable,
      planId: status.planId,
      situationUnitCopy: status.situationUnitCopy,
    },
  });
}
