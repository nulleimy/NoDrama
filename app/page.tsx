import { GeneratorPreview } from "@/components/GeneratorPreview";
import { PricingCards } from "@/components/PricingCards";

const useCases = [
  "odmítnutí schůzky",
  "zpoždění",
  "pracovní omluva",
  "rodinné hranice",
  "klientský delay",
  "nepříjemný follow-up",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-950">
      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-10 md:grid-cols-[1fr_0.9fr] md:px-10 md:py-20">
        <div className="flex flex-col justify-center">
          <div className="inline-flex w-fit rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm">
            NoDrama Reply · AI komunikace bez trapna
          </div>

          <h1 className="mt-8 max-w-4xl text-5xl font-black tracking-tight md:text-7xl">
            Řekni ne. Posuň termín. Odpověz bez dramatu.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-650">
            NoDrama generuje krátké, přirozené a sociálně bezpečné odpovědi pro
            situace, kdy nechceš znít tvrdě, trapně nebo podezřele. Žádné
            velké lži. Jen čistá komunikace.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              className="rounded-2xl bg-black px-6 py-4 text-center text-sm font-bold text-white hover:bg-neutral-800"
              href="#generator"
            >
              Vyzkoušet preview
            </a>
            <a
              className="rounded-2xl border border-neutral-300 bg-white px-6 py-4 text-center text-sm font-bold text-neutral-950 hover:bg-neutral-100"
              href="#pricing"
            >
              Zobrazit ceny
            </a>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {useCases.map((item) => (
              <span
                key={item}
                className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-700"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div id="generator">
          <GeneratorPreview />
        </div>
      </section>

      <section className="border-y border-neutral-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-3 md:px-10">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-neutral-500">
              Product rules
            </p>
            <h2 className="mt-3 text-3xl font-bold">Ne výmluvy. Sociální navigace.</h2>
          </div>
          <p className="text-base leading-7 text-neutral-600">
            Produkt je postavený tak, aby pomáhal s odmítnutím, omluvou a
            nastavením hranic. Ne s podvody, falešnými dokumenty nebo
            manipulací.
          </p>
          <p className="text-base leading-7 text-neutral-600">
            Free plán je schválně přísný: 2 generace denně. Kdo má hodnotu,
            narazí na paywall rychle. Kdo ji nemá, nespálí nám API budget.
          </p>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-neutral-500">
            Pricing
          </p>
          <h2 className="mt-3 text-4xl font-black tracking-tight">
            Jednoduché limity. Žádné unlimited peklo.
          </h2>
          <p className="mt-4 text-lg leading-8 text-neutral-600">
            AI náklady jsou variabilní, takže pricing stojí na kreditech a fair-use
            limitech. Hlavní plán je Pro za 149 Kč měsíčně.
          </p>
        </div>
        <PricingCards />
      </section>
    </main>
  );
}
