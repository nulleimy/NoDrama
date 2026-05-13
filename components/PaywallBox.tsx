"use client";

import { CreditPacks } from "@/components/CreditPacks";
import { trackEvent } from "@/lib/analytics/trackEvent";
import { upgradeCopy } from "@/lib/monetization";

export function PaywallBox({ onClose }: { onClose: () => void }) {
  return (
    <div className="mt-4 rounded-3xl border border-black bg-black p-5 text-white">
      <p className="text-sm font-bold uppercase tracking-[0.25em] text-neutral-400">
        Free limit vyčerpán
      </p>
      <h3 className="mt-3 text-2xl font-black">{upgradeCopy.headline}</h3>
      <p className="mt-3 text-sm leading-6 text-neutral-300">{upgradeCopy.subheadline}</p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <a
          className="rounded-2xl bg-white px-5 py-3 text-center text-sm font-bold text-black hover:bg-neutral-200"
          href="#pricing"
          onClick={() => {
            void trackEvent("plan_cta_clicked", {
              cta: "primary_pro",
              source: "paywall",
            });
          }}
        >
          {upgradeCopy.primaryCta}
        </a>
        <a
          className="rounded-2xl border border-white/20 px-5 py-3 text-center text-sm font-bold text-white hover:bg-white/10"
          href="#credit-packs"
          onClick={() => {
            void trackEvent("plan_cta_clicked", {
              cta: "secondary_credit_pack",
              source: "paywall",
            });
          }}
        >
          {upgradeCopy.secondaryCta}
        </a>
      </div>

      <div id="credit-packs" className="mt-5 rounded-2xl bg-white p-4 text-black">
        <CreditPacks compact />
      </div>

      <button
        className="mt-4 w-full rounded-2xl border border-white/20 px-5 py-3 text-sm font-bold text-white hover:bg-white/10"
        type="button"
        onClick={onClose}
      >
        Zatím zavřít
      </button>
    </div>
  );
}
