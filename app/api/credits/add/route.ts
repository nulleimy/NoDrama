import { NextResponse } from "next/server";
import { z } from "zod";
import { addCredits } from "@/lib/credits/creditStore";
import { getCreditIdentity } from "@/lib/credits/userIdentity";

const addCreditsSchema = z.object({
  amount: z.number().int().positive().max(10000),
});

function isDevCreditGrantEnabled() {
  const isTest = process.env.NODRAMA_TEST_MODE === "true";
  const allowDev = process.env.NODRAMA_ALLOW_DEV_CREDIT_GRANTS === "true";
  const legacyAllowDev = process.env.NODRAMA_ENABLE_DEV_CREDIT_GRANTS === "1";
  const notProduction = process.env.NODE_ENV !== "production";
  return notProduction && (isTest || allowDev || legacyAllowDev);
}

export async function POST(request: Request) {
  if (!isDevCreditGrantEnabled()) {
    return NextResponse.json(
      {
        ok: false,
        code: "CREDIT_GRANT_DISABLED",
        message: "Manual credit grants are disabled. Enable NODRAMA_TEST_MODE=true or NODRAMA_ALLOW_DEV_CREDIT_GRANTS=true.",
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

  const identity = await getCreditIdentity();
  const status = await addCredits(identity.accountKey, parsed.data.amount);

  return NextResponse.json({
    ok: true,
    status,
  });
}
