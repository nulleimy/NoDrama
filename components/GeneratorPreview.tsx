const sampleOutputs = [
  {
    label: "Krátká verze",
    text: "Dneska to bohužel nedám. Omlouvám se, ozvu se zítra.",
  },
  {
    label: "Přirozená verze",
    text: "Hele, dneska to nakonec nezvládnu. Nechci to lámat přes koleno a radši ti dávám vědět rovnou.",
  },
  {
    label: "Follow-up",
    text: "Je to trochu osobní, nechci to moc rozebírat. Díky, že to chápeš.",
  },
];

export function GeneratorPreview() {
  return (
    <section className="rounded-[2rem] border border-neutral-200 bg-white p-4 shadow-2xl shadow-neutral-200/70 md:p-6">
      <div className="rounded-3xl bg-neutral-950 p-5 text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
          Generator preview
        </p>
        <h2 className="mt-3 text-2xl font-semibold">Co potřebuješ říct bez dramatu?</h2>
        <textarea
          className="mt-5 min-h-28 w-full resize-none rounded-2xl border border-white/10 bg-white/10 p-4 text-sm text-white outline-none placeholder:text-neutral-400"
          defaultValue="Nechci dneska přijít na oslavu, ale nechci působit hnusně."
          aria-label="Ukázková situace"
          readOnly
        />
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {["Milý", "Asertivní", "WhatsApp"].map((item) => (
            <span
              key={item}
              className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-center text-xs font-medium"
            >
              {item}
            </span>
          ))}
        </div>
        <button
          className="mt-5 w-full rounded-2xl bg-white px-4 py-3 text-sm font-bold text-black"
          type="button"
        >
          Vygenerovat odpověď
        </button>
      </div>

      <div className="mt-4 grid gap-3">
        {sampleOutputs.map((output) => (
          <div key={output.label} className="rounded-2xl bg-neutral-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              {output.label}
            </p>
            <p className="mt-2 text-sm leading-6 text-neutral-800">{output.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
