"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/analytics/trackEvent";
import { creditPacks } from "@/lib/monetization";

export function CreditPacks({ compact = false }: { compact?: boolean }) {
  const [activePackId, setActivePackId] = useState<string | null>(null);
  const [purchaseMessage, setPurchaseMessage] = useState<string | null>(null);

  async function handlePurchase(packId: string, price: string, credits: number) {
    setActivePackId(packId);
    setPurchaseMessage(null);

    void trackEvent("credit_pack_purchase_started", { packId, price, credits });

    try {
      const response = await fetch("/api/credits/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ packId }),
      });

      if (!response.ok) {
        throw new Error("Purchase request failed.");
      }

      setPurchaseMessage(`Hotovo: připsáno ${credits} kreditů.`);
      void trackEvent("credit_pack_purchase_success", { packId, price, credits });
    } catch {
      setPurchaseMessage("Nákup se nepovedl. Zkus to prosím znovu.");
      void trackEvent("credit_pack_purchase_failed", { packId, price, credits });
    } finally {
      setActivePackId(null);
    }
  }

  return (
    <div className="grid gap-3">
      {purchaseMessage ? (
        <p className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
          {purchaseMessage}
        </p>
      ) : null}

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
            </div>
            {pack.badge ? (
              <span className="rounded-full bg-neutral-950 px-3 py-1 text-xs font-bold text-white">
                {pack.badge}
              </span>
            ) : null}
          </div>

          <p className="mt-3 text-sm leading-6 text-neutral-600">{pack.description}</p>

          <button
            type="button"
            onClick={() => {
              void trackEvent("credit_pack_clicked", {
                packId: pack.id,
                price: pack.price,
                credits: pack.credits,
              });
              void handlePurchase(pack.id, pack.price, pack.credits);
            }}
            disabled={activePackId === pack.id}
            className="mt-4 w-full rounded-xl bg-neutral-950 px-4 py-3 text-sm font-bold text-white hover:bg-neutral-800"
          >
            {activePackId === pack.id ? "Zpracovávám…" : "Koupit"}
          </button>
        </article>
      ))}
      </div>
    </div>
  );
}
