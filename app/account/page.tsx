import Link from "next/link";

import { CreditStatusCard } from "@/components/CreditStatusCard";
import { UserSessionCard } from "@/components/UserSessionCard";

export default function AccountPage() {
  return (
    <main className="min-h-screen bg-neutral-50 px-5 py-10 text-neutral-950">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-neutral-500">NoDrama</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight">Stav účtu / Account dashboard</h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-neutral-600">
          Tohle je MVP přehled bez fake billingu: jasně vidíš, co je dostupné teď, co je lokální jen v prohlížeči a
          co je zatím plán. This MVP dashboard is intentionally honest: what works now, what stays local in your
          browser, and what is still planned.
        </p>

        <section className="mt-8 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black tracking-tight">1) Stav účtu / Account status</h2>
          <p className="mt-3 text-sm leading-7 text-neutral-700">
            Login supports account continuity and a clean return experience, while Memory Lane remains local-first
            unless explicit sync is added later.
          </p>
          <div className="mt-4 grid gap-4">
            <UserSessionCard />
          </div>
        </section>

        <section className="mt-4 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black tracking-tight">2) Situace / Credits</h2>
          <p className="mt-3 text-sm leading-7 text-neutral-700">
            V NoDrama je jednotka účtování situace (ne počet interních generací). 1 situation is the billing unit, not
            raw model generations behind the scenes.
          </p>
          <div className="mt-4">
            <CreditStatusCard />
          </div>
        </section>

        <section className="mt-4 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black tracking-tight">3) Memory Lane privacy note</h2>
          <p className="mt-3 text-sm leading-7 text-neutral-700">
            Memory Lane je local-first: data zůstávají v tomto prohlížeči, dokud je nesmažeš nebo neexportuješ. Memory
            Lane is browser-local by default; no automatic cloud sync is added in this MVP unless explicit opt-in sync
            appears in a future release.
          </p>
        </section>

        <section className="mt-4 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black tracking-tight">4) Billing placeholder</h2>
          <p className="mt-3 text-sm leading-7 text-neutral-700">
            Platební infrastruktura je zatím placeholder. Billing is intentionally a placeholder right now: no Stripe
            onboarding flow, no fake subscription state, and no hidden payment backend here.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-neutral-800"
            >
              Zpět do generátoru / Back to generator
            </Link>
            <Link
              href="/#pricing"
              className="inline-flex items-center justify-center rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-sm font-bold text-neutral-900 transition hover:bg-neutral-100"
            >
              Ceník situací / See pricing
            </Link>
          </div>
        </section>


        <section className="mt-4 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black tracking-tight">5) Next steps / Upcoming features</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-neutral-700">
            <li>Transparentnější timeline pro account + credit UX / more transparent account and credit UX timeline.</li>
            <li>Volitelné sync funkce jen s explicitním souhlasem / optional sync only with explicit opt-in.</li>
            <li>Jasnější billing přechod až ve chvíli, kdy bude opravdu aktivní / real billing only when truly live.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
