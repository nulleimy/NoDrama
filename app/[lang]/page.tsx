"use client";

import { InteractiveGenerator } from "@/components/InteractiveGenerator";
import { PricingCards } from "@/components/PricingCards";
import { CreditPacks } from "@/components/CreditPacks";
import { useLang } from "@/components/i18n/LanguageProvider";

export default function Home() {
  const { lang } = useLang();
  const isCs = lang === "cs";

  return (
    <main className="min-h-screen bg-[#F6F7FB] text-neutral-950">
      <section className="bg-[linear-gradient(180deg,#111827_0%,#F6F7FB_88%)] px-4 py-4 sm:px-6 sm:py-6 md:px-10">
        <div id="generator" className="mx-auto max-w-7xl">
          <InteractiveGenerator />
        </div>
      </section>

      <section className="border-y border-neutral-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-3 md:px-10">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-neutral-500">
              {isCs ? "Pravidla produktu" : "Product rules"}
            </p>
            <h2 className="mt-3 text-3xl font-bold">
              {isCs
                ? "Ne výmluvy. Sociální navigace."
                : "Not excuses. Social navigation."}
            </h2>
          </div>
          <p className="text-base leading-7 text-neutral-600">
            {isCs
              ? "Produkt je postavený tak, aby pomáhal s odmítnutím, omluvou a nastavením hranic. Ne s podvody, falešnými dokumenty nebo manipulací."
              : "The product is built to help with refusal, apology and setting boundaries. Not fraud, fake documents or manipulation."}
          </p>
          <p className="text-base leading-7 text-neutral-600">
            {isCs
              ? "Free plán je schválně přísný: 2 generace denně. Kdo má hodnotu, narazí na paywall rychle. Kdo ji nemá, nespálí nám API budget."
              : "The free plan is intentionally strict: 2 generations per day. People who feel the value reach the paywall quickly. People who do not will not burn API budget."}
          </p>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-neutral-500">
            {isCs ? "Ceník" : "Pricing"}
          </p>
          <h2 className="mt-3 text-4xl font-black tracking-tight">
            {isCs
              ? "Jednoduché limity. Žádné unlimited peklo."
              : "Simple limits. No unlimited nonsense."}
          </h2>
          <p className="mt-4 text-lg leading-8 text-neutral-600">
            {isCs
              ? "AI náklady jsou variabilní, takže pricing stojí na kreditech a fair-use limitech. Hlavní plán je Pro za 149 Kč měsíčně."
              : "AI costs are variable, so pricing is based on credits and fair-use limits. The main plan is Pro for 149 CZK per month."}
          </p>
        </div>

        <PricingCards />

        <div id="credit-packs" className="mt-12 rounded-[2rem] border border-neutral-200 bg-white p-6">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-neutral-500">
            {isCs ? "Jednorázové balíčky" : "One-time packs"}
          </p>
          <h3 className="mt-3 text-3xl font-black tracking-tight">
            {isCs
              ? "Nechceš subscription? Kup si jen odpovědi."
              : "No subscription? Just buy replies."}
          </h3>
          <p className="mt-3 max-w-2xl text-base leading-7 text-neutral-600">
            {isCs
              ? "Mikro balíčky jsou určené pro impulsní nákup přesně ve chvíli, kdy dojdou free odpovědi."
              : "Micro packs are made for impulse purchases exactly when free replies run out."}
          </p>
          <div className="mt-6">
            <CreditPacks />
          </div>
        </div>
      </section>
    </main>
  );
}
