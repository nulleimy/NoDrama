import { NextResponse } from "next/server";
import { getCreditStatus } from "@/lib/credits/creditStore";
import { getCreditUserId } from "@/lib/credits/userIdentity";

export async function GET() {
  const userId = await getCreditUserId();
  const status = await getCreditStatus(userId);

  return NextResponse.json({
    ok: true,
    status,
  });
}
