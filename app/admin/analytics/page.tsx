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
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-neutral-500">NoDrama Admin</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight">Analytics dashboard</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-neutral-600">
          Lokální MVP dashboard nad interními eventy. Bez externí analytiky, bez cookies navíc, bez placených služeb.
        </p>

        <section className="mt-8 grid gap-4 md:grid-cols-4">
          <StatCard label="Total events" value={summary.totalEvents} />
          <StatCard label="Generate" value={summary.counts.generate_clicked} />
          <StatCard label="Copies" value={summary.counts.copy_reply} />
          <StatCard label="Pack clicks" value={summary.counts.credit_pack_clicked} />
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <StatCard label="Generate → Success" value={summary.funnel.generateToSuccessRate} suffix="%" />
          <StatCard label="Success → Copy" value={summary.funnel.successToCopyRate} suffix="%" />
          <StatCard label="Paywall → Pack click" value={summary.funnel.paywallToCreditPackClickRate} suffix="%" />
        </section>

        <section className="mt-8 rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black">Event counts</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {Object.entries(summary.counts).map(([name, count]) => (
              <div key={name} className="flex items-center justify-between rounded-2xl bg-neutral-50 px-4 py-3">
                <span className="text-sm font-bold text-neutral-700">{name}</span>
                <span className="text-sm font-black">{count}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black">Recent events</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-200 text-xs uppercase tracking-wide text-neutral-500">
                  <th className="py-3 pr-4">Stored</th>
                  <th className="py-3 pr-4">Name</th>
                  <th className="py-3 pr-4">Path</th>
                  <th className="py-3 pr-4">Properties</th>
                </tr>
              </thead>
              <tbody>
                {summary.recentEvents.map((event, index) => (
                  <tr key={`${event.storedAt}-${index}`} className="border-b border-neutral-100">
                    <td className="py-3 pr-4 text-neutral-500">{event.storedAt}</td>
                    <td className="py-3 pr-4 font-bold">{event.name}</td>
                    <td className="py-3 pr-4 text-neutral-600">{event.path || "—"}</td>
                    <td className="py-3 pr-4 font-mono text-xs text-neutral-600">{JSON.stringify(event.properties || {})}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
