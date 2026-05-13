"use client";

import { trackEvent } from "@/lib/analytics/trackEvent";
import { creditPacks } from "@/lib/monetization";

export function CreditPacks({
  compact = false,
  lang = "cs",
}: {
  compact?: boolean;
  lang?: "cs" | "en";
}) {
  return (
    <div className={compact ? "grid gap-3" : "grid gap-3 md:grid-cols-3"}>
      {creditPacks.map((pack) => (
        <article
          key={pack.id}
          className="group rounded-[1.5rem] border border-[#241f18]/10 bg-[#fffdf7]/90 p-4 shadow-sm shadow-[#241f18]/5 transition duration-300 hover:-translate-y-1 hover:border-[#B8FF4D]/45 hover:shadow-xl hover:shadow-[#B8FF4D]/10"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-[#171816]">{pack.label}</h3>
              <p className="mt-1 text-2xl font-black tracking-tight text-[#171816]">
                {pack.price}
              </p>
            </div>
            {pack.badge ? (
              <span className="rounded-full bg-[#171816] px-3 py-1 text-xs font-bold text-white">
                {pack.badge}
              </span>
            ) : null}
          </div>

          <p className="mt-3 text-sm leading-6 text-[#645f54]">{pack.description}</p>
          <p className="mt-2 text-sm font-semibold text-[#171816]">
            {pack.credits} situace · {pack.validity}
          </p>

          <button
            type="button"
            disabled
            onClick={() => {
              void trackEvent("credit_pack_clicked", {
                packId: pack.id,
                price: pack.price,
                credits: pack.credits,
                disabled: true,
              });
            }}
            className="mt-4 w-full cursor-not-allowed rounded-full bg-[#171816]/60 px-4 py-3 text-sm font-bold text-white"
          >
            {lang === "cs" ? "Platby již brzy" : "Payments coming soon"}
          </button>
        </article>
      ))}
    </div>
  );
}
