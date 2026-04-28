import { AuthButtons } from "@/components/AuthButtons";
import { CreditStatusCard } from "@/components/CreditStatusCard";

export default function AccountPage() {
  return (
    <main className="min-h-screen bg-neutral-50 px-5 py-10 text-neutral-950">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-neutral-500">
          NoDrama
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-tight">Účet</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-neutral-600">
          Přihlášení je připravené pro budoucí kredity, historii odpovědí a platby.
        </p>

        <div className="mt-8 grid gap-4">
          <AuthButtons />
          <CreditStatusCard />
        </div>
      </div>
    </main>
  );
}
