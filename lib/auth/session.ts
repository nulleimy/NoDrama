import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";

export function getCurrentSession() {
  return getServerSession(authOptions);
}
