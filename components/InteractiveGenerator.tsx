"use client";

import { useState } from "react";
import { PaywallBox } from "@/components/PaywallBox";
import { trackEvent } from "@/lib/analytics/trackEvent";
import type { GenerateErrorResponse, GenerateResponse } from "@/lib/generateContract";

const DAILY_FREE_LIMIT = 2;

const tones = ["Milý", "Asertivní", "Formální", "Vtipný"];
const relationships = ["Kamarádi", "Práce", "Klient", "Škola"];
const channels = ["WhatsApp", "SMS", "E-mail", "Slack"];

type DemoGeneratorOutput = GenerateResponse["output"];

type GenerateMeta = {
  engine?: string;
  categoryLabel?: string;
  requestedStyle?: string;
  effectiveStyle?: string;
  fallbackUsed?: boolean;
  recommendedId?: string;
};

export function InteractiveGenerator() {
  const [situation, setSituation] = useState("Nechci dneska přijít na oslavu, ale nechci znít hnusně.");
  const [tone, setTone] = useState("Milý");
  const [relationship, setRelationship] = useState("Kamarádi");
  const [channel, setChannel] = useState("WhatsApp");
  const [usage, setUsage] = useState(0);
  const [output, setOutput] = useState<DemoGeneratorOutput | null>(null);
  const [meta, setMeta] = useState<GenerateMeta | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const remaining = Math.max(DAILY_FREE_LIMIT - usage, 0);

  async function handleCopy(label: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      await trackEvent("copy_reply", { label });
      setCopyStatus(`${label} zkopírováno`);
      window.setTimeout(() => setCopyStatus(null), 1800);
    } catch {
      setCopyStatus("Kopírování selhalo");
      window.setTimeout(() => setCopyStatus(null), 1800);
    }
  }

  async function handleGenerate() {
    setIsLoading(true);
    setErrorMessage(null);

    await trackEvent("generate_clicked", {
      tone,
      relationship,
      channel,
      situationLength: situation.length,
    });

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
        await trackEvent("generate_failed", {
          message: data.message || "unknown",
        });
        setErrorMessage(data.message || "Něco se pokazilo. Zkus to prosím znovu.");
        setShowPaywall(data.code === "FREE_LIMIT_EXCEEDED");
        return;
      }

      await trackEvent("generate_success", {
        remaining: data.remaining,
        limit: data.limit,
      });

      setUsage(DAILY_FREE_LIMIT - data.remaining);
      setOutput(data.output);
      setMeta((data.meta || null) as GenerateMeta | null);
      setShowPaywall(data.remaining <= 0);

      if (data.remaining <= 0) {
        await trackEvent("paywall_shown", { source: "generate_limit" });
      }
    } catch {
      await trackEvent("generate_failed", {
        message: "network_error",
      });
      setErrorMessage("Nepodařilo se spojit se serverem.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-xl shadow-neutral-200/60">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-neutral-500">
            Live demo
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-neutral-950">
            Zkus si odpověď
          </h2>
        </div>
        <div className="rounded-full bg-neutral-100 px-4 py-2 text-sm font-bold text-neutral-700">
          Zbývá dnes: {remaining}/{DAILY_FREE_LIMIT}
        </div>
      </div>

      <label className="mt-5 block text-sm font-bold text-neutral-800">
        Situace
        <textarea
          value={situation}
          onChange={(event) => setSituation(event.target.value)}
          className="mt-2 min-h-28 w-full rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm leading-6 outline-none ring-black/10 focus:ring-4"
        />
      </label>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <Select label="Tón" value={tone} values={tones} onChange={setTone} />
        <Select
          label="Vztah"
          value={relationship}
          values={relationships}
          onChange={setRelationship}
        />
        <Select label="Kanál" value={channel} values={channels} onChange={setChannel} />
      </div>

      <button
        type="button"
        onClick={handleGenerate}
        disabled={isLoading || situation.trim().length < 5}
        className="mt-5 w-full rounded-2xl bg-black px-6 py-4 text-sm font-black uppercase tracking-[0.2em] text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
      >
        {isLoading ? "Generuju..." : "Vygenerovat odpověď"}
      </button>

      {errorMessage ? (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
          {errorMessage}
        </div>
      ) : null}

      {output ? (
        <div className="mt-5 grid gap-3">
          {[
            ["Recommended", output.shortReply],
            ["Alternative", output.naturalReply],
            ["Firm option", output.strongReply],
            ["Follow-up", output.followUpReply],
          ].map(([label, text], index) => (
            <div
              key={label}
              className={[
                "rounded-2xl p-4",
                index === 0 ? "bg-black text-white" : "bg-neutral-50 text-neutral-950",
              ].join(" ")}
            >
              <div className="flex items-center justify-between gap-3">
                <p
                  className={[
                    "text-xs font-semibold uppercase tracking-wide",
                    index === 0 ? "text-neutral-300" : "text-neutral-500",
                  ].join(" ")}
                >
                  {label}
                </p>
                {index === 0 ? (
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-black">
                    Best pick
                  </span>
                ) : null}
              </div>
              <p
                className={[
                  "mt-2 text-sm leading-6",
                  index === 0 ? "text-white" : "text-neutral-800",
                ].join(" ")}
              >
                {text}
              </p>
              <button
                type="button"
                onClick={() => handleCopy(label, text)}
                className={[
                  "mt-4 rounded-xl px-4 py-2 text-xs font-bold transition",
                  index === 0
                    ? "bg-white text-black hover:bg-neutral-200"
                    : "bg-neutral-950 text-white hover:bg-neutral-800",
                ].join(" ")}
              >
                Kopírovat
              </button>
            </div>
          ))}
        </div>
      ) : null}

      {copyStatus ? (
        <div className="mt-4 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm font-bold text-green-700">
          {copyStatus}
        </div>
      ) : null}

      {meta ? (
        <div className="mt-4 rounded-2xl border border-neutral-200 bg-white p-4 text-xs leading-6 text-neutral-600">
          <span className="font-bold text-neutral-950">Engine:</span> {meta.engine || "phrase"}
          {meta.categoryLabel ? (
            <>
              {" "}
              · <span className="font-bold text-neutral-950">Kategorie:</span>{" "}
              {meta.categoryLabel}
            </>
          ) : null}
          {meta.effectiveStyle ? (
            <>
              {" "}
              · <span className="font-bold text-neutral-950">Styl:</span>{" "}
              {meta.effectiveStyle}
            </>
          ) : null}
          {meta.fallbackUsed ? <> · fallback použitý</> : null}
        </div>
      ) : null}

      {showPaywall ? (
        <PaywallBox
          onClose={() => {
            void trackEvent("paywall_closed", { source: "paywall_box" });
            setShowPaywall(false);
          }}
        />
      ) : null}
    </section>
  );
}

function Select({
  label,
  value,
  values,
  onChange,
}: {
  label: string;
  value: string;
  values: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-sm font-bold text-neutral-800">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 outline-none ring-black/10 focus:ring-4"
      >
        {values.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>
    </label>
  );
}
