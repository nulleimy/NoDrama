"use client";

import { trackEvent } from "@/lib/analytics/trackEvent";
import { creditPacks } from "@/lib/monetization";

function formatSituationCount(count: number) {
  if (count === 1) return "1 situace";
  if (count >= 2 && count <= 4) return `${count} situace`;
  return `${count} situací`;
}

export function CreditPacks({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "grid gap-3" : "grid gap-3 md:grid-cols-3"}>
      {creditPacks.map((pack) => (
        <article
          key={pack.id}
          className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-neutral-950">{pack.label}</h3>
              <p className="mt-1 text-2xl font-black tracking-tight text-neutral-950">
                {pack.price}
              </p>
              <p className="mt-1 text-sm font-semibold text-neutral-600">
                {formatSituationCount(pack.credits)}
              </p>
            </div>
            {pack.badge ? (
              <span className="rounded-full bg-neutral-950 px-3 py-1 text-xs font-bold text-white">
                {pack.badge}
              </span>
            ) : null}
          </div>

          <p className="mt-3 text-sm leading-6 text-neutral-600">{pack.description}</p>
          <p className="mt-2 text-xs font-bold uppercase tracking-wide text-neutral-500">
            Platí {pack.validForDays} dní
          </p>

          <button
            type="button"
            onClick={() => {
              void trackEvent("credit_pack_clicked", {
                packId: pack.id,
                price: pack.price,
                credits: pack.credits,
              });
            }}
            className="mt-4 w-full rounded-xl bg-neutral-950 px-4 py-3 text-sm font-bold text-white hover:bg-neutral-800"
          >
            Koupit
          </button>
        </article>
      ))}
    </div>
  );
}
