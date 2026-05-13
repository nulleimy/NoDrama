"use client";

import { InteractiveGenerator } from "@/components/InteractiveGenerator";
import { PricingCards } from "@/components/PricingCards";
import { isStripeFoundationEnabled } from "@/lib/billing/stripeConfig";
import { CreditPacks } from "@/components/CreditPacks";
import { useLang } from "@/components/i18n/LanguageProvider";

const landingCopy = {
  cs: {
    absurd: {
      eyebrow: "Skutečný chaos",
      headline: "Život bývá absurdní. Tvoje odpověď nemusí.",
      subheadline:
        "Někdy je situace divná, trapná nebo těžko vysvětlitelná. NoDrama ti pomůže napsat zprávu, která zní lidsky, klidně a použitelně.",
      microLine: "Skutečný chaos. Lepší formulace.",
      cards: [
        "Pes mi zamkl syna venku.",
        "Do komína mi spadla veverka.",
        "Moje rybička se topila.",
        "Dítěti uvízl hrášek v nose.",
        "Pes snědl domácí úkol.",
      ],
    },
    useCases: {
      eyebrow: "Použití",
      headline: "Na zprávy, které nechceš řešit hned.",
      subheadline:
        "NoDrama pomáhá tam, kde nechceš mlžit, hádat se ani psát něco, čeho budeš za pět minut litovat.",
      cards: [
        ["Pracovní zpoždění", "Řekni realistický termín bez paniky."],
        ["Milé odmítnutí", "Odmítni pozvání bez dlouhých výmluv."],
        ["Hranice", "Nastav hranici jasně, ale bez tvrdého tónu."],
        ["Omluva", "Převezmi odpovědnost a navrhni další krok."],
        ["Trapné randění", "Zpomal nebo ukonči konverzaci lidsky."],
        ["Rodinný tlak", "Nastav limit bez zbytečné eskalace."],
        ["Přesměrování", "Vrať konverzaci k užitečnému tématu."],
      ],
    },
    trust: {
      eyebrow: "Důvěra a bezpečí",
      headline: "Chytrá formulace. Ne falešné alibi.",
      subheadline:
        "NoDrama nepíše falešné dokumenty ani manipulační scénáře. Pomáhá ti říct nepříjemné věci tak, aby zněly jasně, lidsky a bez zbytečného dramatu.",
      cards: [
        [
          "Soukromí jako základ",
          "Tvoje zprávy jsou tvoje. NoDrama je pomocník na formulaci, ne veřejný deník trapných situací.",
        ],
        [
          "Bez souzení",
          "Rušíš plán? Omlouváš se? Nastavuješ hranici? NoDrama pomáhá, nesoudí.",
        ],
        [
          "Lidský tón",
          "Nejde jen o správná slova. Jde o tón, který snižuje napětí a nezní roboticky.",
        ],
        [
          "Okamžitá jasnost",
          "Z nepříjemného „co mám napsat?“ udělá konkrétní zprávu, kterou můžeš použít.",
        ],
      ],
    },
  },
  en: {
    absurd: {
      eyebrow: "Real chaos",
      headline: "Life gets weird. Your reply doesn’t have to.",
      subheadline:
        "Some situations are awkward, chaotic, or hard to explain. NoDrama helps you write a reply that sounds human, calm, and usable.",
      microLine: "Real chaos. Better wording.",
      cards: [
        "My dog locked my son out of the house.",
        "A squirrel fell down my chimney.",
        "My goldfish was drowning.",
        "My kid got a pea stuck in his nose.",
        "The dog ate my homework.",
      ],
    },
    useCases: {
      eyebrow: "Use cases",
      headline: "For messages you don’t want to handle right away.",
      subheadline:
        "NoDrama helps when you don’t want to fake it, escalate it, or send something you’ll regret five minutes later.",
      cards: [
        ["Work delays", "Share a realistic timeline without panic."],
        ["Kind declines", "Say no without long excuses."],
        ["Boundaries", "Be clear without sounding harsh."],
        ["Apologies", "Take responsibility and suggest the next step."],
        ["Awkward dating", "Slow down or end the conversation humanly."],
        ["Family pressure", "Set a limit without unnecessary escalation."],
        ["Redirects", "Bring the conversation back to something useful."],
      ],
    },
    trust: {
      eyebrow: "Trust and AI",
      headline: "Smart wording. Not fake alibis.",
      subheadline:
        "NoDrama doesn’t create fake documents or manipulative scripts. It helps you say difficult things clearly, humanly, and without unnecessary drama.",
      cards: [
        [
          "Private by design",
          "Your messages are yours. NoDrama is a wording helper, not a public diary of awkward situations.",
        ],
        [
          "No judgment zone",
          "Canceling plans? Apologizing? Setting a boundary? NoDrama helps, not judges.",
        ],
        [
          "Human tone",
          "It’s not just about the right words. It’s about tone that reduces tension and doesn’t sound robotic.",
        ],
        [
          "Instant clarity",
          "It turns “what do I even say?” into a concrete message you can actually use.",
        ],
      ],
    },
  },
};

export default function Home() {
  const { lang } = useLang();
  const isCs = lang === "cs";
  const billingEnabled = isStripeFoundationEnabled();
  const copy = landingCopy[lang];

  return (
    <main className="min-h-screen overflow-hidden bg-[#F7F8F1] text-[#111218]">
      <section className="relative px-4 py-4 sm:px-6 sm:py-6 md:px-10">
        <div className="ambient-glow pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(184,255,77,0.34),transparent_28%),radial-gradient(circle_at_82%_9%,rgba(217,204,255,0.5),transparent_32%),radial-gradient(circle_at_62%_32%,rgba(221,242,255,0.66),transparent_24%),linear-gradient(180deg,#151821_0%,#F7F8F1_82%)]" />
        <div id="generator" className="mx-auto max-w-7xl">
          <InteractiveGenerator />
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 md:px-10">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-[#D9E0D0] bg-[#F2F4EE]/90 px-5 py-10 shadow-[0_24px_80px_rgba(17,18,24,0.08)] sm:px-8 lg:px-10">
          <WatermarkMotif />
          <div className="relative grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="inline-flex rounded-full border border-[#A8F542]/50 bg-[#E8FFC2] px-3 py-1.5 text-xs font-black uppercase tracking-[0.22em] text-[#25310F]">
                {copy.absurd.eyebrow}
              </p>
              <h2 className="mt-5 max-w-3xl text-3xl font-black leading-tight tracking-normal text-[#111218] sm:text-5xl">
                {copy.absurd.headline}
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-[#5F6673] sm:text-lg">
                {copy.absurd.subheadline}
              </p>
            </div>
            <div className="relative">
              <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-[#5F6673]">
                {copy.absurd.microLine}
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {copy.absurd.cards.map((card, index) => (
                  <article
                    key={card}
                    className={[
                      "motion-card rounded-[1.35rem] border bg-white/[0.86] p-4 shadow-[0_16px_50px_rgba(17,18,24,0.08)] backdrop-blur",
                      index === 1 ? "sm:translate-y-5" : "",
                      index === 4 ? "sm:col-span-2 sm:mx-auto sm:w-2/3" : "",
                    ].join(" ")}
                  >
                    <p className="text-sm font-bold leading-6 text-[#111218]">“{card}”</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#5F6673]">
              {copy.useCases.eyebrow}
            </p>
            <h2 className="mt-4 text-3xl font-black leading-tight tracking-normal text-[#111218] sm:text-5xl">
              {copy.useCases.headline}
            </h2>
            <p className="mt-4 text-lg leading-8 text-[#5F6673]">{copy.useCases.subheadline}</p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {copy.useCases.cards.map(([title, description], index) => (
              <article
                key={title}
                className={[
                  "motion-card group min-h-48 rounded-[1.6rem] border p-5 shadow-[0_18px_55px_rgba(17,18,24,0.07)]",
                  index === 2 || index === 5
                    ? "border-[#2B3140] bg-[#151821] text-white"
                    : "border-[#DDE4D4] bg-white/90 text-[#111218]",
                  index === 6 ? "xl:col-span-2" : "",
                ].join(" ")}
              >
                <div
                  className={[
                    "flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-black shadow-lg transition",
                    index === 2 || index === 5
                      ? "bg-[#B8FF4D] text-[#111218] shadow-[#B8FF4D]/20"
                      : "bg-[#E8FFC2] text-[#25310F] shadow-[#B8FF4D]/20 group-hover:bg-[#B8FF4D]",
                  ].join(" ")}
                >
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h3 className="mt-5 text-xl font-black">{title}</h3>
                <p
                  className={[
                    "mt-3 text-sm leading-6",
                    index === 2 || index === 5 ? "text-[#D7DCE8]" : "text-[#5F6673]",
                  ].join(" ")}
                >
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 md:px-10">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#151821] px-5 py-12 text-white shadow-[0_28px_90px_rgba(17,18,24,0.28)] sm:px-8 lg:px-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_0%,rgba(184,255,77,0.22),transparent_28%),radial-gradient(circle_at_12%_20%,rgba(217,204,255,0.2),transparent_26%)]" />
          <div className="relative grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="inline-flex rounded-full border border-white/12 bg-white/[0.07] px-3 py-1.5 text-xs font-black uppercase tracking-[0.22em] text-[#B8FF4D]">
                {copy.trust.eyebrow}
              </p>
              <h2 className="mt-5 text-3xl font-black leading-tight tracking-normal sm:text-5xl">
                {copy.trust.headline}
              </h2>
              <p className="mt-4 text-base leading-8 text-[#D7DCE8]">{copy.trust.subheadline}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {copy.trust.cards.map(([title, description]) => (
                <article
                  key={title}
                  className="motion-card rounded-[1.5rem] border border-white/10 bg-white/[0.07] p-5 shadow-xl shadow-black/10 backdrop-blur"
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#B8FF4D] text-sm font-black text-[#111218]">
                    ✓
                  </span>
                  <h3 className="mt-4 text-lg font-black text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#D7DCE8]">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#5F6673]">
            {isCs ? "Ceník" : "Pricing"}
          </p>
          <h2 className="mt-3 text-4xl font-black tracking-tight">
            {isCs
              ? "Když nevíš, co napsat, NoDrama to řekne za tebe."
              : "When you do not know what to write, NoDrama says it for you."}
          </h2>
          <p className="mt-4 text-lg leading-8 text-[#5F6673]">
            {isCs
              ? "1 situace = hotová odpověď + varianty tónu + rychlé doladění. Lidsky, stručně a bez průšvihu."
              : "1 situation = a finished reply + tone variants + quick refinement. Human, concise and lower-risk."}
          </p>
        </div>

        <PricingCards lang={lang} billingEnabled={billingEnabled} />

        <div
          id="credit-packs"
          className="mt-12 rounded-[2rem] border border-[#DDE4D4] bg-white/[0.88] p-6 shadow-[0_18px_55px_rgba(17,18,24,0.06)]"
        >
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#5F6673]">
            {isCs ? "Jednorázové balíčky" : "One-time reply packs"}
          </p>
          <h3 className="mt-3 text-3xl font-black tracking-tight">
            {isCs ? "Akutní chvíle bez subscription." : "Urgent moments without a subscription."}
          </h3>
          <p className="mt-3 max-w-2xl text-base leading-7 text-[#5F6673]">
            {isCs
              ? "SOS balíčky jsou pro momenty, kdy potřebuješ méně trapně, víc lidsky a bez zbytečného vysvětlování odpovědět hned."
              : "SOS packs are for moments when you need a less awkward, more human reply without overexplaining."}
          </p>
          <div className="mt-6">
            <CreditPacks lang={lang} billingEnabled={billingEnabled} />
          </div>
        </div>
      </section>
    </main>
  );
}

function WatermarkMotif() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -right-10 -top-6 hidden h-64 w-64 rotate-6 opacity-[0.16] sm:block"
    >
      <div className="absolute left-10 top-12 h-28 w-36 rounded-[2rem] border-[3px] border-[#151821]" />
      <div className="absolute left-16 top-20 h-9 w-20 rounded-full border-[3px] border-[#151821]" />
      <div className="absolute left-28 top-4 h-20 w-20 rounded-full border-[3px] border-[#151821] bg-[#B8FF4D]/40" />
      <div className="absolute left-44 top-20 h-24 w-14 rounded-t-full border-[3px] border-[#151821]" />
      <div className="absolute left-7 top-36 h-16 w-28 rounded-[1.25rem] border-[3px] border-[#151821] bg-white/70" />
      <div className="absolute left-12 top-[10.5rem] h-2 w-16 rounded-full bg-[#151821]" />
      <div className="absolute left-12 top-[12.25rem] h-2 w-10 rounded-full bg-[#151821]" />
    </div>
  );
}

/*
VERIFY COPY ANCHORS — soft neon landing:
dog ate my homework
dog locked child outside
squirrel in chimney
goldfish drowning
pea stuck in nose
*/

