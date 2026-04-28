import { NextResponse } from "next/server";
import { z } from "zod";
import { addCredits } from "@/lib/credits/creditStore";
import { getCreditUserId } from "@/lib/credits/userIdentity";
import { getCreditPackById } from "@/lib/monetization";

const purchaseRequestSchema = z.object({
  packId: z.string().min(3).max(40),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = purchaseRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          code: "VALIDATION_ERROR",
          message: "Neplatný vstup nákupu.",
          issues: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const selectedPack = getCreditPackById(parsed.data.packId);

    if (!selectedPack) {
      return NextResponse.json(
        {
          ok: false,
          code: "PACK_NOT_FOUND",
          message: "Balíček nebyl nalezen.",
        },
        { status: 404 }
      );
    }

    const userId = await getCreditUserId();
    const status = await addCredits(userId, selectedPack.credits);

    return NextResponse.json({
      ok: true,
      packId: selectedPack.id,
      grantedCredits: selectedPack.credits,
      status,
    });
  } catch (error) {
    console.error("Purchase API error", error);

    return NextResponse.json(
      {
        ok: false,
        code: "SERVER_ERROR",
        message: "Nákup se nepodařilo dokončit. Zkus to prosím znovu.",
      },
      { status: 500 }
    );
  }
}
