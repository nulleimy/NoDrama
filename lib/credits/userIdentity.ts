import { cookies } from "next/headers";
import { getCurrentSession } from "@/lib/auth/session";
import { getCreditAccountKey } from "@/lib/credits/creditLedger";
import { getOrCreateAnonId } from "@/lib/usageLimit";

const anonCookieName = "nodrama_anon_id";

export async function getCreditIdentity() {
  const session = await getCurrentSession();

  if (session?.user?.id) {
    const key = getCreditAccountKey({ userId: session.user.id });
    return { ...key, userId: session.user.id, anonId: null as string | null };
  }

  const cookieStore = await cookies();
  const anonId = cookieStore.get(anonCookieName)?.value || (await getOrCreateAnonId());
  const key = getCreditAccountKey({ anonId });

  return { ...key, userId: null as string | null, anonId };
}

export async function getCreditUserId() {
  const identity = await getCreditIdentity();
  return identity.accountKey;
}
