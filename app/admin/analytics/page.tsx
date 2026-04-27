import { getAnalyticsSummary } from "@/lib/analytics/eventStore";

function StatCard({ label, value, suffix = "" }: { label: string; value: number; suffix?: string }) {
  return (
    <article className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-neutral-500">{label}</p>
      <p className="mt-3 text-4xl font-black tracking-tight text-neutral-950">{value}{suffix}</p>
    </article>
  );
}

export default async function AnalyticsPage() {
  const summary = await getAnalyticsSummary();

  return (
    <main className="min-h-screen bg-neutral-50 px-5 py-10 text-neutral-950">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-black">Analytics dashboard</h1>

        <section className="mt-8 grid gap-4 md:grid-cols-4">
          <StatCard label="Total events" value={summary.totalEvents} />
          <StatCard label="Generate" value={summary.counts.generate_clicked} />
          <StatCard label="Copies" value={summary.counts.copy_reply} />
          <StatCard label="Pack clicks" value={summary.counts.credit_pack_clicked} />
        </section>
      </div>
    </main>
  );
}
