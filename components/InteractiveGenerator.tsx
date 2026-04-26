"use client";

import { useState } from "react";
import type { DemoGeneratorOutput } from "@/lib/demoGenerator";
import type { GenerateErrorResponse, GenerateResponse } from "@/lib/generateContract";

const tones = ["Milý", "Asertivní", "Formální", "Vtipný"];
const relationships = ["Kamarádi", "Práce", "Rodina", "Randění"];
const channels = ["WhatsApp", "SMS", "E-mail", "Slack"];

const DAILY_FREE_LIMIT = 2;

export function InteractiveGenerator() {
  const [situation, setSituation] = useState(
    "Nechci dneska přijít na oslavu, ale nechci působit hnusně."
  );
  const [tone, setTone] = useState("Milý");
  const [relationship, setRelationship] = useState("Kamarádi");
  const [channel, setChannel] = useState("WhatsApp");
  const [usage, setUsage] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [output, setOutput] = useState<DemoGeneratorOutput | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);

  const remaining = Math.max(DAILY_FREE_LIMIT - usage, 0);

  async function handleGenerate() {
    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          situation,
          tone,
          relationship,
          channel,
        }),
      });

      const data = (await response.json()) as GenerateResponse | GenerateErrorResponse;

      if (!data.ok) {
        if (data.code === "FREE_LIMIT_EXCEEDED") {
          setUsage(DAILY_FREE_LIMIT);
          setShowPaywall(true);
          return;
        }

        setErrorMessage(data.message);
        return;
      }

      setUsage(DAILY_FREE_LIMIT - data.remaining);
      setOutput(data.output);
      setShowPaywall(data.remaining <= 0);
    } catch {
      setErrorMessage("Nepovedlo se spojit se serverem. Zkus to prosím znovu.");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <section className="rounded-[2rem] border border-neutral-200 bg-white p-4 shadow-2xl shadow-neutral-200/70 md:p-6">
      <div className="rounded-3xl bg-neutral-950 p-5 text-white">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
            Live UX demo
          </p>
          <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold">
            Free zbývá: {remaining}/{DAILY_FREE_LIMIT}
          </span>
        </div>

        <h2 className="mt-3 text-2xl font-semibold">Co potřebuješ říct bez dramatu?</h2>

        <textarea
          className="mt-5 min-h-28 w-full resize-none rounded-2xl border border-white/10 bg-white/10 p-4 text-sm text-white outline-none placeholder:text-neutral-400"
          value={situation}
          onChange={(event) => setSituation(event.target.value)}
          placeholder="Popiš situaci..."
          aria-label="Situace"
        />

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <label className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
            Tón
            <select
              className="mt-2 w-full rounded-2xl border border-white/10 bg-neutral-900 p-3 text-sm text-white outline-none"
              value={tone}
              onChange={(event) => setTone(event.target.value)}
            >
              {tones.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
            Vztah
            <select
              className="mt-2 w-full rounded-2xl border border-white/10 bg-neutral-900 p-3 text-sm text-white outline-none"
              value={relationship}
              onChange={(event) => setRelationship(event.target.value)}
            >
              {relationships.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
            Kanál
            <select
              className="mt-2 w-full rounded-2xl border border-white/10 bg-neutral-900 p-3 text-sm text-white outline-none"
              value={channel}
              onChange={(event) => setChannel(event.target.value)}
            >
              {channels.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>

        <button
          className="mt-5 w-full rounded-2xl bg-white px-4 py-3 text-sm font-bold text-black transition hover:bg-neutral-200"
          type="button"
          onClick={handleGenerate}
        >
          {isGenerating ? "Generuju..." : "Vygenerovat odpověď"}
        </button>
      </div>

      {errorMessage ? (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {errorMessage}
        </div>
      ) : null}

      {output ? (
        <div className="mt-4 grid gap-3">
          {[
            ["Krátká verze", output.shortReply],
            ["Přirozená verze", output.naturalReply],
            ["Silnější hranice", output.strongReply],
            ["Follow-up", output.followUpReply],
          ].map(([label, text]) => (
            <div key={label} className="rounded-2xl bg-neutral-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                {label}
              </p>
              <p className="mt-2 text-sm leading-6 text-neutral-800">{text}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-2xl bg-neutral-50 p-4 text-sm leading-6 text-neutral-600">
          Tohle je zatím UX demo bez napojení na AI. Slouží k otestování flow,
          paywallu a hodnoty produktu před backendem.
        </div>
      )}

      {showPaywall ? (
        <div className="mt-4 rounded-3xl border border-black bg-black p-5 text-white">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-neutral-400">
            Free limit vyčerpán
          </p>
          <h3 className="mt-3 text-2xl font-bold">Chceš další odpovědi bez čekání?</h3>
          <p className="mt-3 text-sm leading-6 text-neutral-300">
            Free plán má schválně jen 2 generace denně. Pro odemkne follow-upy,
            všechny tóny a 500 generací měsíčně.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <a
              className="rounded-2xl bg-white px-5 py-3 text-center text-sm font-bold text-black hover:bg-neutral-200"
              href="#pricing"
            >
              Odemknout Pro
            </a>
            <button
              className="rounded-2xl border border-white/20 px-5 py-3 text-sm font-bold text-white hover:bg-white/10"
              type="button"
              onClick={() => setShowPaywall(false)}
            >
              Zatím zavřít
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
