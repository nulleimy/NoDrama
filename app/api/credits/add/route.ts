import { NextResponse } from "next/server";
import { z } from "zod";
import { addCredits } from "@/lib/credits/creditStore";
import { getCreditUserId } from "@/lib/credits/userIdentity";

const addCreditsSchema = z.object({
  amount: z.number().int().positive().max(10000),
});

function isLocalDevCreditGrantEnabled() {
  return process.env.NODE_ENV !== "production" && process.env.NODRAMA_ENABLE_DEV_CREDIT_GRANTS === "1";
}

export async function POST(request: Request) {
  if (!isLocalDevCreditGrantEnabled()) {
    return NextResponse.json(
      {
        ok: false,
        code: "CREDIT_GRANT_DISABLED",
        message: "Manual credit grants are disabled outside explicit local development mode.",
      },
      { status: 403 }
    );
  }

  const body = await request.json();
  const parsed = addCreditsSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        code: "VALIDATION_ERROR",
        message: "Invalid credit amount.",
      },
      { status: 400 }
    );
  }

  const userId = await getCreditUserId();
  const status = await addCredits(userId, parsed.data.amount);

  return NextResponse.json({
    ok: true,
    status,
  });
}
