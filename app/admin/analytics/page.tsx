import { getAnalyticsSummary } from "@/lib/analytics/eventStore";

function StatCard({ label, value, suffix = "" }: { label: string; value: number; suffix?: string }) {
  return <article className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm"><p className="text-xs font-bold uppercase tracking-[0.25em] text-neutral-500">{label}</p><p className="mt-3 text-4xl font-black tracking-tight text-neutral-950">{value}{suffix}</p></article>;
}

export default async function AnalyticsPage() {
  const summary = await getAnalyticsSummary();
  return (
    <main className="min-h-screen bg-neutral-50 px-5 py-10 text-neutral-950"><div className="mx-auto max-w-6xl"><p className="text-sm font-bold uppercase tracking-[0.25em] text-neutral-500">NoDrama Admin</p><h1 className="mt-3 text-4xl font-black tracking-tight">Analytics dashboard</h1><p className="mt-3 max-w-2xl text-base leading-7 text-neutral-600">Metadata-only analytics. No full user situations stored. No generated replies stored by default.</p>
      {summary.totalEvents === 0 && <p className="mt-4 rounded-2xl bg-white p-4 text-sm text-neutral-600">No events collected yet. This dashboard only shows privacy-safe metadata aggregates.</p>}
      <section className="mt-8 grid gap-4 md:grid-cols-4"><StatCard label="Total events" value={summary.totalEvents} /><StatCard label="Generate attempts" value={summary.generateAttempts} /><StatCard label="Success rate" value={summary.successRate} suffix="%" /><StatCard label="Copy clicks" value={summary.copyClicks} /></section>
      <section className="mt-6 grid gap-4 md:grid-cols-4"><StatCard label="Wrong context" value={summary.wrongContextCount} /><StatCard label="Not sendable" value={summary.notSendableCount} /><StatCard label="Free limit hits" value={summary.freeLimitHits} /><StatCard label="Rate limited" value={summary.rateLimitHits} /></section>
      <section className="mt-8 rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm"><h2 className="text-xl font-black">Top scenario families</h2>{summary.topScenarioFamilies.length===0? <p className="mt-2 text-sm text-neutral-600">No scenario metadata yet.</p> : summary.topScenarioFamilies.map(([k,v])=><div key={k} className="mt-2 flex justify-between"><span>{k}</span><strong>{v}</strong></div>)}</section>
    </div></main>
  );
}
