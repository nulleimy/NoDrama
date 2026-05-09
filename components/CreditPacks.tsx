"use client";

import { trackEvent } from "@/lib/analytics/trackEvent";
import { useLang } from "@/components/i18n/LanguageProvider";
import { creditPacks } from "@/lib/monetization";

export function CreditPacks({ compact = false }: { compact?: boolean }) {
  const { lang } = useLang();
  const buyLabel = lang === "cs" ? "Koupit" : "Buy";
  const situationLabel = lang === "cs" ? "situace" : "situations";

  return (
    <div className={compact ? "grid gap-3" : "grid gap-3 md:grid-cols-3"}>
      {creditPacks.map((pack) => (
        <article
          key={pack.id}
          className="rounded-[1.6rem] border border-[#111218]/[0.08] bg-[#F8F9FB] p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#111218]/10"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-[#111218]">{pack.label}</h3>
              <p className="mt-1 text-2xl font-black tracking-normal text-[#111218]">
                {pack.price}
              </p>
            </div>
            {pack.badge ? (
              <span className="rounded-full bg-[#E8FFC2] px-3 py-1 text-xs font-black text-[#111218]">
                {pack.badge}
              </span>
            ) : null}
          </div>

          <p className="mt-3 text-sm leading-6 text-[#5F6673]">{pack.description}</p>
          <p className="mt-2 text-sm font-black text-[#111218]">
            {pack.credits} {situationLabel} · {pack.validity}
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
            className="mt-4 w-full rounded-full bg-[#111218] px-4 py-3 text-sm font-black text-white transition hover:bg-[#262B36] focus:outline-none focus:ring-4 focus:ring-[#B8FF4D]/35"
          >
            {buyLabel}
          </button>
        </article>
      ))}
    </div>
  );
}
