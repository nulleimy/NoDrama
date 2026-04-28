import { cookies } from "next/headers";
import { getCurrentSession } from "@/lib/auth/session";

const anonCookieName = "nodrama_anon_id";

export async function getCreditUserId() {
  const session = await getCurrentSession();

  if (session?.user?.id) {
    return `user:${session.user.id}`;
  }

  const cookieStore = await cookies();
  const anonId = cookieStore.get(anonCookieName)?.value;

  if (anonId) {
    return `anon:${anonId}`;
  }

  return "anon:unknown";
}
