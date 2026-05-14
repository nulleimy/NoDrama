import Link from "next/link";

import { AuthButtons } from "@/components/AuthButtons";
import { CreditStatusCard } from "@/components/CreditStatusCard";

const nextSteps = [
  {
    title: "Historie situací / Situation history",
    description:
      "Přehled dříve řešených situací bez slibování cloudové synchronizace. / A clearer view of past situations without promising cloud sync.",
  },
  {
    title: "Bezpečnější export / Safer export",
    description:
      "Lepší kontrola nad tím, co si stáhneš z Memory Lane. / More control over what you export from Memory Lane.",
  },
  {
    title: "Volitelná synchronizace / Optional sync",
    description:
      "Až pokud ji výslovně zapneme jako samostatnou funkci. / Only if it is explicitly added as a separate future feature.",
  },
];

export default function AccountPage() {
  return (
    <main className="min-h-screen bg-[#F7F8F1] px-5 py-10 text-[#111218]">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#5F6673]">NoDrama</p>
        <div className="mt-3 grid gap-5 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
          <div>
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
              Účet / Account
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-[#5F6673]">
              MVP dashboard pro přihlášení, zůstatek situací a jasné hranice soukromí.
              NoDrama zatím nepředstírá plné billing centrum. / MVP dashboard for sign-in,
              situation balance, and clear privacy boundaries. NoDrama does not pretend to
              be a full billing center yet.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link
              href="/cs#generator"
              className="inline-flex min-h-11 items-center rounded-lg bg-[#111218] px-5 py-3 text-sm font-black text-white transition hover:bg-[#2A2D34]"
            >
              Otevřít generátor / Open generator
            </Link>
            <Link
              href="/cs#pricing"
              className="inline-flex min-h-11 items-center rounded-lg border border-[#C9D2BF] bg-white px-5 py-3 text-sm font-black text-[#111218] transition hover:bg-[#EEF2E7]"
            >
              Ceník / Pricing
            </Link>
          </div>
        </div>

        <section aria-labelledby="account-status" className="mt-8">
          <div className="rounded-lg border border-[#DDE4D4] bg-white p-5 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#5F6673]">
              Stav účtu / Account status
            </p>
            <h2 id="account-status" className="mt-3 text-2xl font-black tracking-tight">
              Přihlášení a návrat k účtu / Sign-in and account return
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[#5F6673]">
              Přihlášení pomáhá udržet účet připravený pro budoucí funkce, ale nemění
              lokální-first model Memory Lane. / Signing in keeps the account ready for
              future features, but it does not change the local-first Memory Lane model.
            </p>
            <div className="mt-5">
              <AuthButtons />
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <section aria-labelledby="credits-status" className="rounded-lg border border-[#DDE4D4] bg-white p-5 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#5F6673]">
              Situace / Credits
            </p>
            <h2 id="credits-status" className="mt-3 text-2xl font-black tracking-tight">
              Zůstatek dostupných situací / Available situation balance
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#5F6673]">
              Platební jednotka je situace, ne syrový počet generování. Jedna situace
              znamená dokončenou odpověď s užitečnými variantami a doladěním tónu. /
              The billing unit is a situation, not raw generation count. One situation
              means a finished reply with useful variants and tone refinement.
            </p>
            <div className="mt-5">
              <CreditStatusCard />
            </div>
          </section>

          <section aria-labelledby="memory-lane-privacy" className="rounded-lg border border-[#DDE4D4] bg-white p-5 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#5F6673]">
              Memory Lane
            </p>
            <h2 id="memory-lane-privacy" className="mt-3 text-2xl font-black tracking-tight">
              Soukromí lokálně v prohlížeči / Browser-local privacy
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#5F6673]">
              Memory Lane je local-first: uložené situace zůstávají lokálně v tomto
              prohlížeči, pokud budoucí synchronizace nebude výslovně přidaná a zapnutá.
              / Memory Lane is local-first: saved situations stay browser-local unless
              future sync is explicitly added and enabled.
            </p>
            <p className="mt-4 rounded-lg border border-[#DDE4D4] bg-[#F7F8F1] p-4 text-sm font-bold leading-6 text-[#2A2D34]">
              Žádná automatická cloudová historie v MVP. / No automatic cloud history in the MVP.
            </p>
          </section>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section aria-labelledby="billing-placeholder" className="rounded-lg border border-[#DDE4D4] bg-white p-5 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#5F6673]">
              Billing
            </p>
            <h2 id="billing-placeholder" className="mt-3 text-2xl font-black tracking-tight">
              Placeholder bez reálných plateb / Placeholder without real billing
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#5F6673]">
              Tady bude později přehled nákupů a účtenek. Teď tu není žádné aktivní
              předplatné, žádný platební checkout a žádný falešný stav tarifu. /
              Purchases and receipts can live here later. For now there is no active
              subscription, no payment checkout, and no fake plan state.
            </p>
            <Link
              href="/cs#pricing"
              className="mt-5 inline-flex min-h-11 items-center rounded-lg border border-[#C9D2BF] px-5 py-3 text-sm font-black text-[#111218] transition hover:bg-[#EEF2E7]"
            >
              Zobrazit ceník / View pricing
            </Link>
          </section>

          <section aria-labelledby="next-steps" className="rounded-lg border border-[#DDE4D4] bg-white p-5 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#5F6673]">
              Další kroky / Next steps
            </p>
            <h2 id="next-steps" className="mt-3 text-2xl font-black tracking-tight">
              Co dává smysl přidat dál / Upcoming features
            </h2>
            <div className="mt-5 grid gap-3">
              {nextSteps.map((step) => (
                <article key={step.title} className="rounded-lg border border-[#E4E9DB] bg-[#FAFBF7] p-4">
                  <h3 className="text-sm font-black text-[#111218]">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#5F6673]">{step.description}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
