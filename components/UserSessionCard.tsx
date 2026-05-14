"use client";

import { useEffect, useMemo, useState } from "react";
import { getProviders, signIn, signOut, useSession } from "next-auth/react";
import type { ClientSafeProvider } from "next-auth/react";

type ProvidersMap = Record<string, ClientSafeProvider>;

export function UserSessionCard() {
  const { data: session, status } = useSession();
  const [providers, setProviders] = useState<ProvidersMap | null>(null);

  useEffect(() => {
    let active = true;

    async function loadProviders() {
      try {
        const available = await getProviders();
        if (active) {
          setProviders(available);
        }
      } catch {
        if (active) {
          setProviders(null);
        }
      }
    }

    void loadProviders();

    return () => {
      active = false;
    };
  }, []);

  const hasGoogle = useMemo(() => Boolean(providers?.google), [providers]);
  const hasEmail = useMemo(() => Boolean(providers?.email), [providers]);
  const hasAnyProvider = hasGoogle || hasEmail;

  if (status === "loading") {
    return <div className="rounded-2xl border border-neutral-200 bg-white p-5 text-sm font-bold text-neutral-600">Loading account…</div>;
  }

  if (session?.user) {
    return (
      <section className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-neutral-500">Signed in</p>
        <h2 className="mt-3 text-2xl font-black text-neutral-950">{session.user.name || "NoDrama user"}</h2>
        {session.user.email ? <p className="mt-1 text-sm text-neutral-600">{session.user.email}</p> : null}
        <p className="mt-3 text-sm leading-6 text-neutral-700">
          Login supports account continuity across devices. Memory Lane stays local-first unless cloud sync is explicitly enabled in a future opt-in release.
        </p>
        <button
          type="button"
          onClick={() => void signOut()}
          className="mt-5 rounded-2xl bg-neutral-950 px-5 py-3 text-sm font-bold text-white hover:bg-neutral-800"
        >
          Sign out
        </button>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-bold uppercase tracking-[0.25em] text-neutral-500">Account</p>
      <h2 className="mt-3 text-2xl font-black text-neutral-950">Sign in to keep your account continuity</h2>
      <p className="mt-2 text-sm leading-6 text-neutral-700">
        Sign-in lets you return to your account identity later. Memory Lane remains local-first for privacy, and there is no silent cloud history sync.
      </p>

      {hasAnyProvider ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => void signIn("google")}
            disabled={!hasGoogle}
            className="rounded-2xl bg-neutral-950 px-5 py-3 text-sm font-bold text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
          >
            Continue with Google
          </button>
          <button
            type="button"
            onClick={() => void signIn("email")}
            disabled={!hasEmail}
            className="rounded-2xl border border-neutral-300 px-5 py-3 text-sm font-bold text-neutral-950 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:border-neutral-200 disabled:text-neutral-400"
          >
            Sign in with email
          </button>
        </div>
      ) : (
        <p className="mt-5 rounded-2xl border border-neutral-200 bg-neutral-100 px-4 py-3 text-sm font-semibold text-neutral-600">
          Login is not configured in this environment.
        </p>
      )}
    </section>
  );
}
