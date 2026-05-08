"use client";

import { useEffect, useState } from "react";

type CreditStatusResponse = {
  ok: true;
  status: {
    userId: string;
    credits: number;
    hasCredits: boolean;
  };
};

export function CreditStatusCard() {
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    let active = true;

    fetch("/api/credits/status")
      .then((response) => response.json())
      .then((data: CreditStatusResponse) => {
        if (active && data.ok) {
          setCredits(data.status.credits);
        }
      })
      .catch(() => {
        if (active) {
          setCredits(null);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-bold uppercase tracking-[0.25em] text-neutral-500">Situace</p>
      <p className="mt-3 text-4xl font-black tracking-tight text-neutral-950">
        {credits === null ? "—" : credits}
      </p>
      <p className="mt-2 text-sm leading-6 text-neutral-600">
        Zůstatek koupených situací pro placené balíčky a budoucí Stripe checkout.
      </p>
    </div>
  );
}
