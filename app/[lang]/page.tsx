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
              ? "NoDrama pomáhá říct pravdu lidsky, stručně a bez průšvihu. Není to generátor falešných alibi ani nástroj na manipulaci."
              : "NoDrama helps you say the truth in a human, concise and safer way. It is not a fake-alibi generator or manipulation tool."}
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
              ? "Platíš za vyřešenou situaci, ne za klikání."
              : "Pay for a solved situation, not raw clicks."}
          </h2>
          <p className="mt-4 text-lg leading-8 text-neutral-600">
            {isCs
              ? "1 situace = hotová odpověď + varianty tónu + rychlé doladění. Hlavní plán je Pro za 149 Kč měsíčně."
              : "1 situation = finished reply + tone variants + quick tuning. The main plan is Pro for 149 CZK per month."}
          </p>
        </div>

        <PricingCards />

        <div id="credit-packs" className="mt-12 rounded-[2rem] border border-neutral-200 bg-white p-6">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-neutral-500">
            {isCs ? "Jednorázové balíčky" : "One-time packs"}
          </p>
          <h3 className="mt-3 text-3xl font-black tracking-tight">
            {isCs
              ? "SOS balíčky pro chvíle, kdy odpověď hoří."
              : "SOS packs for moments when the reply cannot wait."}
          </h3>
          <p className="mt-3 max-w-2xl text-base leading-7 text-neutral-600">
            {isCs
              ? "Jednorázové balíčky jsou určené pro akutní situace: méně trapně, víc lidsky a bez zbytečného vysvětlování."
              : "One-off packs are for urgent situations: less awkward, more human and without overexplaining."}
          </p>
          <div className="mt-6">
            <CreditPacks />
          </div>
        </div>
      </section>
    </main>
  );
}
