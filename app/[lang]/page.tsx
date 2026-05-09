"use client";

import { InteractiveGenerator } from "@/components/InteractiveGenerator";
import { PricingCards } from "@/components/PricingCards";
import { CreditPacks } from "@/components/CreditPacks";
import LanguageSwitch from "@/components/i18n/LanguageSwitch";
import { useLang } from "@/components/i18n/LanguageProvider";

const content = {
  cs: {
    nav: ["Jak to funguje", "Ceník", "FAQ"],
    cta: "Vyzkoušet zdarma",
    heroEyebrow: "Smart message helper",
    heroTitle: "Zprávy, které nechceš psát. Ale musíš je poslat.",
    heroText:
      "NoDrama mění nepříjemné situace v použitelné odpovědi. Lidsky, chytře a bez zbytečného dramatu.",
    secondaryCta: "Podívat se jak",
    trust: ["Chytrý tón", "Auto kontext", "Bez dramatu"],
    generatorEyebrow: "Vyzkoušej NoDrama",
    generatorTitle: "Napiš situaci. Dostaň odpověď, která zní jako ty.",
    generatorText:
      "Vyber tón, vztah, cíl a kanál. NoDrama složí několik verzí, které můžeš rovnou poslat nebo doladit.",
    useCasesEyebrow: "Situace",
    useCasesTitle: "Pro zprávy, které běžně odkládáš.",
    philosophyEyebrow: "Důvěra a hranice",
    philosophyTitle:
      "Neprodáváme falešná alibi. Pomáháme formulovat zprávy, které se těžko píšou.",
    philosophyText:
      "NoDrama nepíše podvody, falešné dokumenty ani manipulační scénáře. Pomáhá říct odmítnutí, omluvu, hranici nebo změnu plánu tak, aby zpráva byla jasná, bezpečná a lidská.",
    philosophyBullets: ["Bez falešných dokumentů", "Bez nátlaku", "Bez klinických soudů"],
    howEyebrow: "Jak to funguje",
    howTitle: "Rychlý proces bez přemýšlení nad každou větou.",
    pricingEyebrow: "Ceník",
    pricingTitle: "Když nevíš, co napsat, NoDrama to řekne za tebe.",
    pricingText:
      "1 situace = hotová odpověď + varianty tónu + rychlé doladění. Lidsky, stručně a bez průšvihu.",
    packsEyebrow: "Jednorázové balíčky",
    packsTitle: "Akutní chvíle bez subscription.",
    packsText:
      "SOS balíčky jsou pro momenty, kdy potřebuješ odpovědět hned a nechceš řešit měsíční plán.",
    faqEyebrow: "FAQ",
    faqTitle: "Krátké odpovědi před prvním použitím.",
    finalTitle: "Nechceš to psát složitě. Pošli to chytře.",
    finalText:
      "Začni jednou nepříjemnou zprávou. NoDrama ti vrátí verzi, kterou můžeš poslat s klidem.",
  },
  en: {
    nav: ["How it works", "Pricing", "FAQ"],
    cta: "Try it free",
    heroEyebrow: "Smart message helper",
    heroTitle: "Messages you don’t want to write — but still need to send.",
    heroText:
      "NoDrama turns awkward situations into usable replies. Human, smart, and without unnecessary drama.",
    secondaryCta: "See how it works",
    trust: ["Smart tone", "Auto context", "No drama"],
    generatorEyebrow: "Try NoDrama",
    generatorTitle: "Describe the situation. Get a reply that still sounds like you.",
    generatorText:
      "Choose tone, relationship, goal, and channel. NoDrama writes several versions you can send or quickly tune.",
    useCasesEyebrow: "Use cases",
    useCasesTitle: "For the messages you keep putting off.",
    philosophyEyebrow: "Trust and boundaries",
    philosophyTitle: "We don’t sell fake alibis. We help people phrase difficult messages.",
    philosophyText:
      "NoDrama does not write fraud, fake documents, or manipulative scripts. It helps with refusals, apologies, boundaries, and changed plans in a clear, safe, human way.",
    philosophyBullets: ["No fake documents", "No pressure scripts", "No clinical claims"],
    howEyebrow: "How it works",
    howTitle: "A fast process without overthinking every sentence.",
    pricingEyebrow: "Pricing",
    pricingTitle: "When you do not know what to write, NoDrama says it for you.",
    pricingText:
      "1 situation = a finished reply + tone variants + quick refinement. Human, concise, and lower-risk.",
    packsEyebrow: "One-time packs",
    packsTitle: "Urgent moments without a subscription.",
    packsText:
      "SOS packs are for moments when you need a reply now and do not want a monthly plan.",
    faqEyebrow: "FAQ",
    faqTitle: "Short answers before your first message.",
    finalTitle: "You don’t need to overthink the message. Send it smart.",
    finalText:
      "Start with one awkward message. NoDrama gives you a version you can send with more calm.",
  },
};

const useCases = {
  cs: [
    ["Pracovní zpoždění", "Řekni realistický termín bez paniky."],
    ["Milé odmítnutí", "Odmítni pozvání bez dlouhých výmluv."],
    ["Hranice", "Buď jasný, aniž by zpráva působila zbytečně tvrdě."],
    ["Omluvy", "Převezmi odpovědnost a navrhni další krok."],
    ["Awkward dating", "Ukonči nebo zpomal konverzaci lidsky."],
    ["Rodinný tlak", "Nastav limit bez eskalace."],
    ["Přesměrování", "Vrať konverzaci k užitečnému tématu."],
  ],
  en: [
    ["Work delays", "Share realistic timing without panic."],
    ["Polite declines", "Say no without a long explanation."],
    ["Boundaries", "Be clear without sounding needlessly harsh."],
    ["Apologies", "Own the issue and suggest the next step."],
    ["Awkward dating", "End or slow a conversation humanly."],
    ["Family pressure", "Set a limit without escalating."],
    ["Redirects", "Move the conversation back to what matters."],
  ],
};

const steps = {
  cs: [
    ["Popiš situaci", "Napiš, co se děje a co nechceš přestřelit."],
    ["Dolaď kontext", "Tón, vztah, cíl a kanál nastavíš jedním klikem."],
    ["Nech to složit", "NoDrama najde použitelnou formulaci a bezpečně ji zjemní."],
    ["Zkopíruj a pošli", "Vyber nejlepší verzi nebo kratší follow-up."],
  ],
  en: [
    ["Describe the situation", "Write what happened and what you want to avoid."],
    ["Tune the context", "Tone, relationship, goal, and channel are one click away."],
    ["Generate the wording", "NoDrama composes a usable reply and keeps it safe."],
    ["Copy and send", "Pick the best version or a shorter follow-up."],
  ],
};

const faqs = {
  cs: [
    ["Je to na falešné výmluvy?", "Ne. NoDrama pomáhá formulovat pravdivé a bezpečné zprávy, ne vyrábět podvody."],
    ["Funguje česky i anglicky?", "Ano. Rozhraní i generování podporují češtinu a angličtinu."],
    ["Můžu zvolit tón a vztah?", "Ano. Vybereš tón, pro koho zpráva je, cíl i kanál."],
    ["Co je ve free plánu?", "2 situace zdarma a potom 1 situace týdně pro průběžné vyzkoušení."],
    ["Hodí se pro práci i osobní život?", "Ano. Nejlépe funguje pro odmítnutí, zpoždění, omluvy, hranice a vysvětlení."],
  ],
  en: [
    ["Is this for fake excuses?", "No. NoDrama helps phrase truthful, safer messages, not fabricate deception."],
    ["Does it work in Czech and English?", "Yes. The interface and generation support Czech and English."],
    ["Can I choose tone and relationship?", "Yes. You can select tone, recipient, goal, and channel."],
    ["What is included in free?", "2 free situations, then 1 situation per week for ongoing trial use."],
    ["Is it useful for work and personal messages?", "Yes. It is strongest for declines, delays, apologies, boundaries, and clarification."],
  ],
};

export default function Home() {
  const { lang } = useLang();
  const t = content[lang];

  return (
    <main className="min-h-screen overflow-hidden bg-[#F7F8F1] text-[#111218]">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_12%_4%,rgba(184,255,77,0.22),transparent_34%),radial-gradient(ellipse_at_88%_12%,rgba(217,204,255,0.28),transparent_32%),linear-gradient(180deg,#F7F8F1_0%,#F2F4EE_48%,#F7F8F1_100%)]" />

      <header className="sticky top-0 z-40 border-b border-[#111218]/[0.06] bg-[#F7F8F1]/86 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <a href="#top" className="flex items-center gap-2 font-black tracking-tight">
            <span className="grid size-9 place-items-center rounded-2xl bg-[#111218] text-sm text-[#B8FF4D] shadow-lg shadow-black/10">
              ND
            </span>
            <span className="text-xl">NoDrama</span>
          </a>
          <nav className="hidden items-center gap-6 text-sm font-bold text-[#5F6673] md:flex">
            <a className="transition hover:text-[#111218]" href="#how">
              {t.nav[0]}
            </a>
            <a className="transition hover:text-[#111218]" href="#pricing">
              {t.nav[1]}
            </a>
            <a className="transition hover:text-[#111218]" href="#faq">
              {t.nav[2]}
            </a>
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitch />
            <a
              href="#generator"
              className="hidden rounded-full bg-[#111218] px-5 py-3 text-sm font-black text-white shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-[#262B36] sm:inline-flex"
            >
              {t.cta}
            </a>
          </div>
        </div>
      </header>

      <section id="top" className="relative px-4 pb-12 pt-10 sm:px-6 lg:px-8 lg:pb-20 lg:pt-16">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.02fr_0.98fr]">
          <div>
            <p className="inline-flex rounded-full border border-[#111218]/10 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#5F6673] shadow-sm">
              {t.heroEyebrow}
            </p>
            <h1 className="mt-6 max-w-5xl text-5xl font-black leading-[0.98] tracking-normal text-[#111218] sm:text-6xl lg:text-7xl">
              {t.heroTitle}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5F6673] sm:text-xl">
              {t.heroText}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#generator"
                className="inline-flex min-h-14 items-center justify-center rounded-full bg-[#B8FF4D] px-7 text-base font-black text-[#111218] shadow-xl shadow-[#B8FF4D]/35 transition hover:-translate-y-0.5 hover:brightness-105"
              >
                {t.cta}
              </a>
              <a
                href="#how"
                className="inline-flex min-h-14 items-center justify-center rounded-full border border-[#111218]/10 bg-white px-7 text-base font-black text-[#111218] shadow-sm transition hover:-translate-y-0.5 hover:border-[#111218]/20"
              >
                {t.secondaryCta}
              </a>
            </div>
            <div className="mt-7 flex flex-wrap gap-2">
              {t.trust.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-[#111218]/10 bg-white/80 px-4 py-2 text-sm font-bold text-[#5F6673] shadow-sm"
                >
                  <span className="mr-2 text-[#7DC914]">•</span>
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative min-h-[28rem]">
            <div className="relative rounded-[2.2rem] border border-white/70 bg-[#151821] p-4 text-white shadow-2xl shadow-[#111218]/25 sm:p-5">
              <div className="rounded-[1.7rem] border border-white/10 bg-[#1B1F2A] p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#B8FF4D]">
                      NoDrama
                    </p>
                    <p className="mt-1 text-sm text-white/55">reply composer</p>
                  </div>
                  <span className="rounded-full bg-[#B8FF4D] px-3 py-1 text-xs font-black text-[#111218]">
                    live
                  </span>
                </div>
                <div className="mt-6 space-y-3">
                  <div className="ml-auto max-w-[82%] rounded-[1.25rem] bg-white/10 px-4 py-3 text-sm leading-6 text-white/75">
                    {lang === "cs"
                      ? "Kamarád mě zve ven, ale jsem úplně bez energie."
                      : "A friend invited me out, but I have no energy left."}
                  </div>
                  <div className="max-w-[88%] rounded-[1.25rem] bg-[#B8FF4D] px-4 py-3 text-sm font-semibold leading-6 text-[#111218] shadow-lg shadow-[#B8FF4D]/20">
                    {lang === "cs"
                      ? "Díky za pozvání. Dneska to vynechám, potřebuji dobít baterky. Ráda se domluvím jindy."
                      : "Thanks for inviting me. I’ll skip tonight because I need to recharge, but I’d be happy to plan another time."}
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-2">
                  {t.trust.map((item) => (
                    <div key={item} className="rounded-2xl bg-white/[0.06] px-3 py-3 text-xs font-bold text-white/70">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="generator" className="bg-[#151821] px-4 py-16 text-white shadow-2xl shadow-[#111218]/10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#B8FF4D]">
              {t.generatorEyebrow}
            </p>
            <h2 className="mt-3 text-4xl font-black leading-tight tracking-normal text-white sm:text-5xl">
              {t.generatorTitle}
            </h2>
            <p className="mt-4 text-lg leading-8 text-white/68">{t.generatorText}</p>
          </div>
          <InteractiveGenerator />
        </div>
      </section>

      <section className="bg-[#F7F8F1] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div className="max-w-3xl">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[#5F6673]">
                {t.useCasesEyebrow}
              </p>
              <h2 className="mt-3 text-4xl font-black leading-tight tracking-normal sm:text-5xl">
                {t.useCasesTitle}
              </h2>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {useCases[lang].map(([title, text], index) => {
              const dark = index === 2 || index === 5;
              return (
              <article
                key={title}
                className={[
                  "group min-h-44 rounded-[2rem] border p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl",
                  dark
                    ? "border-[#B8FF4D]/30 bg-[#151821] text-white hover:shadow-[#B8FF4D]/15"
                    : "border-[#111218]/[0.08] bg-white text-[#111218] hover:border-[#B8FF4D]/60 hover:shadow-[#B8FF4D]/15",
                ].join(" ")}
              >
                <span className="grid size-11 place-items-center rounded-2xl bg-[#B8FF4D] text-sm font-black text-[#111218] shadow-lg shadow-[#B8FF4D]/25 transition group-hover:scale-105">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 text-xl font-black">{title}</h3>
                <p className={["mt-3 text-sm leading-6", dark ? "text-white/66" : "text-[#5F6673]"].join(" ")}>
                  {text}
                </p>
              </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 rounded-[2.4rem] bg-[#151821] p-6 text-white shadow-2xl shadow-[#111218]/15 sm:p-8 lg:grid-cols-[0.95fr_1.05fr] lg:p-12">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#B8FF4D]">
              {t.philosophyEyebrow}
            </p>
            <h2 className="mt-4 text-4xl font-black leading-tight tracking-normal sm:text-5xl">
              {t.philosophyTitle}
            </h2>
          </div>
          <div className="self-end">
            <p className="text-lg leading-8 text-white/72">{t.philosophyText}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {t.philosophyBullets.map((item) => (
                <span key={item} className="rounded-full bg-white/[0.08] px-4 py-2 text-sm font-bold text-white/80">
                  <span className="mr-2 text-[#B8FF4D]">✓</span>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#5F6673]">
              {t.howEyebrow}
            </p>
            <h2 className="mt-3 text-4xl font-black leading-tight tracking-normal sm:text-5xl">
              {t.howTitle}
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {steps[lang].map(([title, text], index) => (
              <article key={title} className="rounded-[2rem] border border-[#111218]/[0.08] bg-white p-5 shadow-sm">
                <p className="text-sm font-black text-[#7DC914]">0{index + 1}</p>
                <h3 className="mt-4 text-xl font-black">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#5F6673]">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="bg-[#F2F4EE] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#5F6673]">
              {t.pricingEyebrow}
            </p>
            <h2 className="mt-3 text-4xl font-black leading-tight tracking-normal sm:text-5xl">
              {t.pricingTitle}
            </h2>
            <p className="mt-4 text-lg leading-8 text-[#5F6673]">{t.pricingText}</p>
          </div>
          <PricingCards />

          <div id="credit-packs" className="mt-8 rounded-[2rem] border border-[#111218]/[0.08] bg-white p-5 shadow-sm sm:p-6">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#5F6673]">
              {t.packsEyebrow}
            </p>
            <h3 className="mt-3 text-3xl font-black tracking-normal">{t.packsTitle}</h3>
            <p className="mt-3 max-w-2xl text-base leading-7 text-[#5F6673]">{t.packsText}</p>
            <div className="mt-6">
              <CreditPacks />
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#5F6673]">
              {t.faqEyebrow}
            </p>
            <h2 className="mt-3 text-4xl font-black leading-tight tracking-normal sm:text-5xl">
              {t.faqTitle}
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {faqs[lang].map(([question, answer]) => (
              <article key={question} className="rounded-[2rem] border border-[#111218]/[0.08] bg-white p-5 shadow-sm">
                <h3 className="text-lg font-black">{question}</h3>
                <p className="mt-3 text-base leading-7 text-[#5F6673]">{answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[2.5rem] border border-[#B8FF4D]/25 bg-[#151821] px-6 py-12 text-center text-white shadow-2xl shadow-[#111218]/20 sm:px-10 lg:py-16">
          <h2 className="mx-auto max-w-4xl text-4xl font-black leading-tight tracking-normal text-white sm:text-6xl">
            {t.finalTitle}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/68">{t.finalText}</p>
          <a
            href="#generator"
            className="mt-8 inline-flex min-h-14 items-center justify-center rounded-full bg-[#B8FF4D] px-8 text-base font-black text-[#111218] shadow-xl shadow-[#B8FF4D]/25 transition hover:-translate-y-0.5 hover:brightness-105"
          >
            {t.cta}
          </a>
        </div>
      </section>
    </main>
  );
}
