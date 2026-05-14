"use client";

import { useEffect, useState } from "react";

type CreditStatusResponse = {
  ok: true;
  status: {
    userId: string;
    credits: number;
    hasCredits: boolean;
    accountMode?: "authenticated" | "anonymous";
    ledgerAvailable?: boolean;
  };
};

export function CreditStatusCard() {
  const [credits, setCredits] = useState<number | null>(null);
  const [accountMode, setAccountMode] = useState<"authenticated" | "anonymous" | null>(null);

  useEffect(() => {
    let active = true;

    fetch("/api/credits/status")
      .then((response) => response.json())
      .then((data: CreditStatusResponse) => {
        if (active && data.ok) {
          setCredits(data.status.credits);
          setAccountMode(data.status.accountMode ?? null);
        }
      })
      .catch(() => {
        if (active) {
          setCredits(null);
          setAccountMode(null);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-bold uppercase tracking-[0.25em] text-neutral-500">Situace</p>
      <p className="mt-3 text-4xl font-black tracking-tight text-neutral-950">{credits === null ? "—" : credits}</p>
      <p className="mt-2 text-sm leading-6 text-neutral-600">Zůstatek koupených situací pro placené balíčky a budoucí Stripe checkout.</p>
      <p className="mt-2 text-xs leading-6 text-neutral-500">
        {accountMode === "authenticated"
          ? "Credits are currently tied to your authenticated account (MVP file-backed ledger)."
          : "Anonymous/local mode is active. Credits remain local and are not cross-device synced in this MVP."}
      </p>
    </div>
  );
}
