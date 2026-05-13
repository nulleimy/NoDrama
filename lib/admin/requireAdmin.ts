import "server-only";

import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth/session";

function getConfiguredAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export async function isCurrentUserAdmin(): Promise<boolean> {
  const session = await getCurrentSession();
  const email = session?.user?.email?.toLowerCase();

  if (!email) {
    return false;
  }

  const adminEmails = getConfiguredAdminEmails();

  if (adminEmails.length === 0) {
    return false;
  }

  return adminEmails.includes(email);
}

export async function requireAdminPage() {
  const session = await getCurrentSession();
  const email = session?.user?.email?.toLowerCase();
  const adminEmails = getConfiguredAdminEmails();

  if (!email || adminEmails.length === 0 || !adminEmails.includes(email)) {
    redirect("/account?reason=admin_required");
  }

  return session;
}
