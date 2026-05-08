"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export function AuthButtons() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 text-sm font-bold text-neutral-600">
        Načítám účet...
      </div>
    );
  }

  if (session?.user) {
    return (
      <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-neutral-500">Přihlášeno</p>
        <h2 className="mt-3 text-2xl font-black text-neutral-950">
          {session.user.name || session.user.email || "Uživatel"}
        </h2>
        <p className="mt-2 text-sm leading-6 text-neutral-600">
          Účet je připravený pro historii, situace a budoucí Stripe platby.
        </p>
        <button
          type="button"
          onClick={() => void signOut()}
          className="mt-5 rounded-2xl bg-neutral-950 px-5 py-3 text-sm font-bold text-white hover:bg-neutral-800"
        >
          Odhlásit
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-bold uppercase tracking-[0.25em] text-neutral-500">Účet</p>
      <h2 className="mt-3 text-2xl font-black text-neutral-950">
        Přihlas se a ulož si NoDrama účet
      </h2>
      <p className="mt-2 text-sm leading-6 text-neutral-600">
        Login je základ pro situace, historii odpovědí, Stripe zákazníka a návrat uživatele.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => void signIn("google")}
          className="rounded-2xl bg-neutral-950 px-5 py-3 text-sm font-bold text-white hover:bg-neutral-800"
        >
          Pokračovat přes Google
        </button>
        <button
          type="button"
          onClick={() => void signIn("email")}
          className="rounded-2xl border border-neutral-300 px-5 py-3 text-sm font-bold text-neutral-950 hover:bg-neutral-50"
        >
          Přihlásit e-mailem
        </button>
      </div>
    </div>
  );
}
