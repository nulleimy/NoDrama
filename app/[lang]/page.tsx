"use client";

import { CreditPacks } from "@/components/CreditPacks";
import { InteractiveGenerator } from "@/components/InteractiveGenerator";
import { PricingCards } from "@/components/PricingCards";
import { useLang } from "@/components/i18n/LanguageProvider";

const stats = {
  cs: [
    ["7", "běžných situací připravených hned"],
    ["4", "varianty odpovědi na jednu zprávu"],
    ["0", "diagnóz, manipulace a falešných výmluv"],
  ],
  en: [
    ["7", "common situations ready fast"],
    ["4", "reply variants per message"],
    ["0", "diagnosis, manipulation, or fake excuses"],
  ],
};

const testimonials = {
  cs: [
    "Pomohlo mi odmítnout pozvání normálně, bez románu a bez pocitu viny.",
    "Konečně zpráva klientovi, která není ani moc tvrdá, ani omluvná.",
    "Používám to, když vím, co chci říct, ale nevím, jak to napsat lidsky.",
  ],
  en: [
    "It helped me decline without writing a novel or sounding guilty.",
    "Finally, a client reply that was neither too harsh nor too apologetic.",
    "I use it when I know what I mean but cannot make it sound human.",
  ],
};

const useCases = {
  cs: [
    ["01", "Pracovní zpoždění", "Řekni realistický termín bez paniky."],
    ["02", "Milé odmítnutí", "Odmítni pozvání bez dlouhých výmluv."],
    ["03", "Hranice", "Nastav hranici jasně, ale bez tvrdého tónu."],
    ["04", "Omluva", "Převezmi odpovědnost a navrhni další krok."],
    ["05", "Trapné randění", "Zpomal nebo ukonči konverzaci lidsky."],
    ["06", "Rodinný tlak", "Nastav limit bez zbytečné eskalace."],
    ["07", "Přesměrování", "Vrať konverzaci k užitečnému tématu."],
  ],
  en: [
    ["01", "Work delays", "Share a realistic timeline without panic."],
    ["02", "Kind declines", "Say no without long excuses."],
    ["03", "Boundaries", "Be clear without sounding harsh."],
    ["04", "Apologies", "Take responsibility and suggest the next step."],
    ["05", "Awkward dating", "Slow down or end the conversation humanly."],
    ["06", "Family pressure", "Set a limit without unnecessary escalation."],
    ["07", "Redirects", "Bring the conversation back to something useful."],
  ],
};

const motifs = {
  cs: [
    "pes snědl úkol",
    "pes zamkl dítě venku",
    "veverka v komíně",
    "topící se rybička",
    "hrášek v nose",
  ],
  en: [
    "dog ate my homework",
    "dog locked child outside",
    "squirrel in chimney",
    "goldfish drowning",
    "pea stuck in nose",
  ],
};

export default function Home() {
  const { lang } = useLang();
  const isCs = lang === "cs";

  return (
    <main className="min-h-screen overflow-hidden bg-[#fbf7ef] text-[#171816]">
      <section className="relative px-4 pb-14 pt-4 sm:px-6 sm:pt-6 md:px-10">
        <GlowLayers />
        <ExcuseMotifs labels={motifs[lang]} />
        <div id="generator" className="relative mx-auto max-w-7xl">
          <InteractiveGenerator />
        </div>
      </section>

      <section className="relative border-y border-[#241f18]/10 bg-[#fffaf0] px-6 py-14 md:px-10">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          {stats[lang].map(([value, label]) => (
            <article
              key={label}
              className="rounded-[2rem] border border-[#241f18]/10 bg-white/70 p-6 shadow-sm shadow-[#241f18]/5 backdrop-blur transition hover:-translate-y-1 hover:border-[#B8FF4D]/45 hover:shadow-xl hover:shadow-[#B8FF4D]/10"
            >
              <p className="text-5xl font-black tracking-tight text-[#171816]">{value}</p>
              <p className="mt-3 text-sm font-bold uppercase tracking-[0.18em] text-[#645f54]">
                {label}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="relative bg-[#171816] px-6 py-16 text-[#fbf7ef] md:px-10">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(184,255,77,0.18),transparent_28%),radial-gradient(circle_at_86%_18%,rgba(185,169,255,0.18),transparent_30%)]"
        />
        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#B8FF4D]">
              {isCs ? "Běžné situace" : "Common situations"}
            </p>
            <h2 className="mt-4 max-w-2xl text-4xl font-black tracking-tight sm:text-5xl">
              {isCs
                ? "Na zprávy, které nechceš řešit hned."
                : "For messages you don’t want to handle right away."}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#d8d2c4]">
              {isCs
                ? "NoDrama vezme nepříjemný moment, vybere tón a vrátí odpověď, kterou můžeš opravdu poslat."
                : "NoDrama takes the awkward moment, chooses a tone, and gives you a reply you can actually send."}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {useCases[lang].map(([number, title, description]) => (
              <article
                key={title}
                className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-5 shadow-xl shadow-black/10 transition hover:-translate-y-1 hover:border-[#B8FF4D]/45 hover:bg-white/[0.085]"
              >
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#B8FF4D]">
                  {number}
                </p>
                <h3 className="mt-3 text-lg font-black text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#d8d2c4]">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative px-6 py-16 md:px-10">
        <GlowLayers compact />
        <div className="relative mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2.25rem] border border-[#241f18]/10 bg-[#fffdf7]/85 p-7 shadow-xl shadow-[#241f18]/5 backdrop-blur">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#667a15]">
              {isCs ? "Důvěra a bezpečí" : "Trust and AI"}
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-tight">
              {isCs ? "Ne výmluvy. Sociální navigace." : "Not excuses. Social navigation."}
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <TrustCard
                title={isCs ? "Bez falešných faktů" : "No fake facts"}
                text={
                  isCs
                    ? "Produkt pomáhá formulovat odmítnutí, omluvu, hranici nebo přesměrování. Ne vyrábět lež."
                    : "The product helps phrase a decline, apology, boundary, or redirect. It does not manufacture a lie."
                }
              />
              <TrustCard
                title={isCs ? "Ne klinické soudy" : "No clinical claims"}
                text={
                  isCs
                    ? "Výstupy jsou praktická komunikace, ne psychologická diagnóza druhého člověka."
                    : "Outputs are practical communication, not psychological diagnosis of another person."
                }
              />
            </div>
          </div>

          <div className="grid gap-4">
            {testimonials[lang].map((quote, index) => (
              <figure
                key={quote}
                className="rounded-[1.75rem] border border-[#241f18]/10 bg-white/75 p-5 shadow-sm shadow-[#241f18]/5 transition hover:-translate-y-1 hover:border-[#b9a9ff]/60"
              >
                <blockquote className="text-base font-semibold leading-7 text-[#2d2b25]">
                  “{quote}”
                </blockquote>
                <figcaption className="mt-4 text-xs font-black uppercase tracking-[0.22em] text-[#746d60]">
                  {isCs ? `Uživatelka ${index + 1}` : `User ${index + 1}`}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="relative px-6 py-16 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#667a15]">
              {isCs ? "Ceník" : "Pricing"}
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              {isCs
                ? "Když nevíš, co napsat, NoDrama to řekne za tebe."
                : "When you do not know what to write, NoDrama says it for you."}
            </h2>
            <p className="mt-4 text-lg leading-8 text-[#645f54]">
              {isCs
                ? "1 situace = hotová odpověď + varianty tónu + rychlé doladění. Lidsky, stručně a bez průšvihu."
                : "1 situation = a finished reply + tone variants + quick refinement. Human, concise and lower-risk."}
            </p>
          </div>

          <PricingCards lang={lang} />

          <div
            id="credit-packs"
            className="mt-12 overflow-hidden rounded-[2rem] border border-[#241f18]/10 bg-[#fffdf7]/85 p-6 shadow-xl shadow-[#241f18]/5"
          >
            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#667a15]">
              {isCs ? "Jednorázové balíčky" : "One-time reply packs"}
            </p>
            <h3 className="mt-3 text-3xl font-black tracking-tight">
              {isCs ? "Akutní chvíle bez subscription." : "Urgent moments without a subscription."}
            </h3>
            <p className="mt-3 max-w-2xl text-base leading-7 text-[#645f54]">
              {isCs
                ? "SOS balíčky jsou pro momenty, kdy potřebuješ méně trapně, víc lidsky a bez zbytečného vysvětlování odpovědět hned."
                : "SOS packs are for moments when you need a less awkward, more human reply without overexplaining."}
            </p>
            <div className="mt-6">
              <CreditPacks lang={lang} />
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-20 md:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 rounded-[2.5rem] bg-[#171816] p-8 text-[#fbf7ef] shadow-2xl shadow-[#241f18]/20 md:flex-row md:items-center md:justify-between md:p-10">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#B8FF4D]">
              {isCs ? "Hotovo bez dramatu" : "Done without drama"}
            </p>
            <h2 className="mt-3 max-w-3xl text-4xl font-black tracking-tight">
              {isCs
                ? "Pošli lepší zprávu dřív, než ji začneš desetkrát přepisovat."
                : "Send a better message before you rewrite it ten times."}
            </h2>
          </div>
          <a
            href="#generator"
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#B8FF4D] px-6 py-4 text-sm font-black text-[#171816] transition hover:-translate-y-1 hover:bg-[#d8ff8a] focus:outline-none focus:ring-4 focus:ring-[#B8FF4D]/35"
          >
            {isCs ? "Složit odpověď" : "Write reply"}
          </a>
        </div>
      </section>
    </main>
  );
}

function GlowLayers({ compact = false }: { compact?: boolean }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className={[
          "absolute rounded-full bg-[#B8FF4D]/30 blur-3xl",
          compact ? "left-[-8rem] top-10 h-48 w-48" : "left-[-7rem] top-2 h-72 w-72",
        ].join(" ")}
      />
      <div
        className={[
          "absolute rounded-full bg-[#b9a9ff]/35 blur-3xl",
          compact ? "right-[-7rem] top-20 h-56 w-56" : "right-[-8rem] top-24 h-80 w-80",
        ].join(" ")}
      />
    </div>
  );
}

function ExcuseMotifs({ labels }: { labels: string[] }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 mx-auto hidden max-w-7xl select-none lg:block"
    >
      {labels.map((label, index) => (
        <span
          key={label}
          className={[
            "absolute rounded-full border border-[#241f18]/10 bg-white/25 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#241f18]/25 backdrop-blur",
            index === 0 && "left-2 top-24 rotate-[-7deg]",
            index === 1 && "right-8 top-36 rotate-[6deg]",
            index === 2 && "left-16 top-[34rem] rotate-[5deg]",
            index === 3 && "right-20 top-[42rem] rotate-[-8deg]",
            index === 4 && "left-1/2 top-12 rotate-[4deg]",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {label}
        </span>
      ))}
    </div>
  );
}

function TrustCard({ title, text }: { title: string; text: string }) {
  return (
    <article className="rounded-[1.5rem] border border-[#241f18]/10 bg-[#fbf7ef]/70 p-5">
      <h3 className="text-lg font-black">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[#645f54]">{text}</p>
    </article>
  );
}
