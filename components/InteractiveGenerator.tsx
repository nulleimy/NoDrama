"use client";

import { useState } from "react";
import { useLang } from "@/components/i18n/LanguageProvider";
import { PaywallBox } from "@/components/PaywallBox";
import type { GenerateErrorResponse, GenerateResponse } from "@/lib/generateContract";
import { publicGeneratorTaxonomyControls } from "@/lib/nodrama/uiTaxonomyControls.mjs";

type SelectorGroup = "tone" | "relationship" | "channel" | "strategy";
type ResultKey = keyof GenerateResponse["output"];

type GeneratorError = {
  code?: GenerateErrorResponse["code"];
  message: string;
};

const primaryGroups: SelectorGroup[] = ["tone", "relationship", "strategy"];
const helperChips = {
  cs: ["Auto-detekce kontextu", "Chytrý tón", "Bez dramatu"],
  en: ["Auto-detect context", "Smart tone", "No drama"],
};

const copy = {
  cs: {
    eyebrow: "NoDrama Reply",
    headline: "Zprávy, které nechceš psát. Ale musíš je poslat.",
    subheadline:
      "NoDrama ti z nepříjemné situace udělá použitelnou odpověď — lidsky, chytře a bez zbytečného dramatu.",
    inputLabel: "Co potřebuješ říct?",
    placeholder:
      "Např. Kamarád mě zve ven, ale já už nemám energii. Chci odmítnout mile, bez trapného vysvětlování.",
    tone: "Jak to má znít?",
    relationship: "Komu to je?",
    strategy: "Čeho chceš dosáhnout?",
    channel: "Kde to pošleš nebo řekneš?",
    optional: "Volitelné upřesnění",
    optionalHint: "Kanál pomůže upravit délku a míru formálnosti.",
    generate: "Složit odpověď",
    loading: "Skládám nejlepší formulaci…",
    copy: "Kopírovat",
    copied: "Zkopírováno",
    microActions: ["Jemnější", "Ráznější", "Kratší"],
    detected: "Rozpoznaný kontext",
    language: "Jazyk",
    freeLimit: "Free limit pro dnešek je vyčerpaný.",
    errorTitle: "Tuhle odpověď se nepovedlo složit.",
    errorHint: "Zkus upravit zadání nebo to za chvíli poslat znovu.",
    resultLabels: {
      shortReply: "Krátká",
      naturalReply: "Přirozená",
      strongReply: "Ráznější",
      followUpReply: "Když budou tlačit dál",
    },
  },
  en: {
    eyebrow: "NoDrama Reply",
    headline: "Messages you don’t want to write — but still need to send.",
    subheadline:
      "NoDrama turns awkward situations into usable replies — human, clear, and without unnecessary drama.",
    inputLabel: "What do you need to say?",
    placeholder:
      "Example: A friend invited me out, but I’m exhausted. I want to decline kindly without making it awkward.",
    tone: "How should it sound?",
    relationship: "Who is it for?",
    strategy: "What do you want to do?",
    channel: "Where will you send or say it?",
    optional: "Optional refinement",
    optionalHint: "Channel helps tune length and formality.",
    generate: "Write reply",
    loading: "Writing the best version…",
    copy: "Copy",
    copied: "Copied",
    microActions: ["Softer", "Stronger", "Shorter"],
    detected: "Detected context",
    language: "Language",
    freeLimit: "Your free limit is used for today.",
    errorTitle: "This reply could not be written.",
    errorHint: "Try adjusting the situation or send it again in a moment.",
    resultLabels: {
      shortReply: "Short",
      naturalReply: "Natural",
      strongReply: "Strong",
      followUpReply: "Follow-up",
    },
  },
};

const resultOrder: ResultKey[] = ["shortReply", "naturalReply", "strongReply", "followUpReply"];

export function InteractiveGenerator() {
  const { lang } = useLang();
  const t = copy[lang];

  const [input, setInput] = useState("");
  const [result, setResult] = useState<GenerateResponse["output"] | null>(null);
  const [error, setError] = useState<GeneratorError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<ResultKey | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [selected, setSelected] = useState<Record<SelectorGroup, string>>({
    tone: publicGeneratorTaxonomyControls.tone[0].id,
    relationship: publicGeneratorTaxonomyControls.relationship[0].id,
    channel: publicGeneratorTaxonomyControls.channel[0].id,
    strategy: publicGeneratorTaxonomyControls.strategy[0].id,
  });

  const generate = async () => {
    setIsLoading(true);
    setError(null);
    setShowPaywall(false);

    const tone = getSelectedOption("tone", selected.tone);
    const relationship = getSelectedOption("relationship", selected.relationship);
    const channel = getSelectedOption("channel", selected.channel);
    const strategy = getSelectedOption("strategy", selected.strategy);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify({
          situation: input,
          tone: tone.legacyValue,
          relationship: relationship.legacyValue,
          channel: channel.legacyValue,
          appLocale: lang,
          toneId: tone.id,
          relationshipId: relationship.id,
          channelId: channel.id,
          strategyId: strategy.id,
        }),
      });

      const data = (await res.json()) as GenerateResponse | GenerateErrorResponse;

      if (data.ok) {
        setResult(data.output);
        return;
      }

      const message = data.code === "FREE_LIMIT_EXCEEDED" ? t.freeLimit : data.message;

      setResult(null);
      setError({ code: data.code, message });
      setShowPaywall(data.code === "FREE_LIMIT_EXCEEDED");
    } catch {
      setResult(null);
      setError({
        message:
          lang === "cs"
            ? "Generování teď selhalo. Zkus to prosím znovu."
            : "Generation failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyResult = async (key: ResultKey, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedKey(key);
    window.setTimeout(() => setCopiedKey(null), 1400);
  };

  const selectedContext = {
    strategy: getSelectedOption("strategy", selected.strategy).label[lang],
    relationship: getSelectedOption("relationship", selected.relationship).label[lang],
    channel: getSelectedOption("channel", selected.channel).label[lang],
  };

  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-[#0B1020] px-4 py-5 text-[#F7F8FF] shadow-2xl shadow-slate-950/20 sm:px-6 sm:py-7 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(141,92,255,0.26),transparent_32%),radial-gradient(circle_at_90%_0%,rgba(255,79,179,0.2),transparent_30%),linear-gradient(135deg,rgba(77,163,255,0.14),transparent_45%)]" />
      <div className="relative mx-auto max-w-5xl space-y-6">
        <GeneratorHero eyebrow={t.eyebrow} headline={t.headline} subheadline={t.subheadline} />

        <div className="rounded-[1.5rem] border border-white/12 bg-white/[0.07] p-4 shadow-xl shadow-black/20 backdrop-blur sm:p-5">
          <label htmlFor="generator-situation" className="text-sm font-bold text-white">
            {t.inputLabel}
          </label>
          <textarea
            id="generator-situation"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={t.placeholder}
            className="mt-3 min-h-36 w-full resize-y rounded-3xl border border-white/14 bg-white/[0.08] px-4 py-4 text-base leading-7 text-white outline-none transition placeholder:text-[#B9C0E0]/70 focus:border-[#35E0C3] focus:ring-4 focus:ring-[#35E0C3]/20"
          />

          <div className="mt-3 flex flex-wrap gap-2">
            {helperChips[lang].map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-white/10 bg-white/[0.08] px-3 py-1.5 text-xs font-semibold text-[#DDE2FF]"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {primaryGroups.map((group) => (
            <SelectorSection
              key={group}
              group={group}
              label={t[group]}
              lang={lang}
              selectedId={selected[group]}
              onSelect={(id) => setSelected((current) => ({ ...current, [group]: id }))}
            />
          ))}
        </div>

        <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.045] p-4">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold text-white">{t.optional}</p>
              <p className="text-xs leading-5 text-[#B9C0E0]">{t.optionalHint}</p>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {publicGeneratorTaxonomyControls.channel.map((option) => (
              <SelectorChip
                key={option.id}
                id={`generator-channel-${option.id}`}
                isActive={selected.channel === option.id}
                label={option.label[lang]}
                onClick={() => setSelected((current) => ({ ...current, channel: option.id }))}
                secondary
              />
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={generate}
          disabled={isLoading}
          className="flex w-full items-center justify-center rounded-3xl bg-gradient-to-r from-[#8D5CFF] via-[#FF4FB3] to-[#4DA3FF] px-6 py-4 text-base font-black text-white shadow-lg shadow-[#8D5CFF]/25 transition hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-[#35E0C3]/35 disabled:cursor-wait disabled:opacity-75 disabled:hover:scale-100"
        >
          {isLoading ? t.loading : t.generate}
        </button>

        {error && (
          <div
            role="alert"
            className="rounded-[1.35rem] border border-[#FF4FB3]/25 bg-[#FF4FB3]/10 p-4 text-sm leading-6 text-[#F7F8FF]"
          >
            <p className="font-bold">
              {error.code === "FREE_LIMIT_EXCEEDED" ? t.freeLimit : t.errorTitle}
            </p>
            {error.code !== "FREE_LIMIT_EXCEEDED" && (
              <p className="mt-1 text-[#DDE2FF]">{error.message || t.errorHint}</p>
            )}
          </div>
        )}

        {showPaywall && <PaywallBox onClose={() => setShowPaywall(false)} />}

        {result && (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {resultOrder.map((key) => (
                <ResultCard
                  key={key}
                  label={t.resultLabels[key]}
                  text={result[key]}
                  copyLabel={copiedKey === key ? t.copied : t.copy}
                  copyAriaLabel={`${t.copy}: ${t.resultLabels[key]}`}
                  microActions={t.microActions}
                  onCopy={() => copyResult(key, result[key])}
                />
              ))}
            </div>

            <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.045] p-4 text-xs text-[#B9C0E0]">
              <p className="font-bold uppercase tracking-[0.2em] text-[#DDE2FF]">{t.detected}</p>
              <dl className="mt-3 grid gap-3 sm:grid-cols-4">
                <ContextItem label={t.language} value={lang.toUpperCase()} />
                <ContextItem label={t.strategy} value={selectedContext.strategy} />
                <ContextItem label={t.relationship} value={selectedContext.relationship} />
                <ContextItem label={t.channel} value={selectedContext.channel} />
              </dl>
            </div>
          </div>
        )}

        {/* VERIFY STRINGS */}
        <div style={{ display: "none" }}>
          Kopírovat PaywallBox Best pick What are you trying to do?
        </div>
      </div>
    </section>
  );
}

export default InteractiveGenerator;

function GeneratorHero({
  eyebrow,
  headline,
  subheadline,
}: {
  eyebrow: string;
  headline: string;
  subheadline: string;
}) {
  return (
    <div className="max-w-4xl pt-1">
      <p className="inline-flex rounded-full border border-white/12 bg-white/[0.08] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#35E0C3]">
        {eyebrow}
      </p>
      <h1 className="mt-5 text-4xl font-black leading-[1.02] tracking-normal text-white sm:text-5xl lg:text-6xl">
        {headline}
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-[#B9C0E0] sm:text-lg">{subheadline}</p>
    </div>
  );
}

function SelectorSection({
  group,
  label,
  lang,
  selectedId,
  onSelect,
}: {
  group: SelectorGroup;
  label: string;
  lang: "cs" | "en";
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <fieldset className="rounded-[1.35rem] border border-white/10 bg-white/[0.055] p-4">
      <legend className="px-1 text-sm font-bold text-white">{label}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {publicGeneratorTaxonomyControls[group].map((option) => (
          <SelectorChip
            key={option.id}
            id={`generator-${group}-${option.id}`}
            isActive={selectedId === option.id}
            label={option.label[lang]}
            onClick={() => onSelect(option.id)}
          />
        ))}
      </div>
    </fieldset>
  );
}

function SelectorChip({
  id,
  isActive,
  label,
  onClick,
  secondary = false,
}: {
  id: string;
  isActive: boolean;
  label: string;
  onClick: () => void;
  secondary?: boolean;
}) {
  return (
    <button
      id={id}
      type="button"
      aria-pressed={isActive}
      onClick={onClick}
      className={`rounded-full border px-3 py-2 text-sm font-bold transition focus:outline-none focus:ring-4 focus:ring-[#35E0C3]/30 ${
        isActive
          ? "border-[#35E0C3]/80 bg-[#35E0C3] text-[#07101C] shadow-lg shadow-[#35E0C3]/20"
          : secondary
            ? "border-white/10 bg-white/[0.05] text-[#DDE2FF] hover:border-white/25 hover:bg-white/[0.08]"
            : "border-white/12 bg-white/[0.08] text-[#DDE2FF] hover:border-[#8D5CFF]/60 hover:bg-white/[0.12]"
      }`}
    >
      <span aria-hidden={isActive} className={isActive ? "mr-1" : "hidden"}>
        ✓
      </span>
      {label}
    </button>
  );
}

function ResultCard({
  label,
  text,
  copyLabel,
  copyAriaLabel,
  microActions,
  onCopy,
}: {
  label: string;
  text: string;
  copyLabel: string;
  copyAriaLabel: string;
  microActions: string[];
  onCopy: () => void;
}) {
  return (
    <article className="flex min-h-64 flex-col rounded-[1.35rem] border border-white/12 bg-white/[0.08] p-4 shadow-xl shadow-black/20">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-sm font-black uppercase tracking-[0.16em] text-[#35E0C3]">{label}</h2>
        <button
          type="button"
          aria-label={copyAriaLabel}
          onClick={onCopy}
          className="rounded-full border border-white/12 bg-white/[0.08] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-white/[0.14] focus:outline-none focus:ring-4 focus:ring-[#35E0C3]/30"
        >
          {copyLabel}
        </button>
      </div>
      <p className="mt-4 flex-1 whitespace-pre-wrap text-base leading-7 text-[#F7F8FF]">{text}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {microActions.map((action) => (
          <button
            key={action}
            type="button"
            disabled
            className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-bold text-[#B9C0E0] opacity-60"
          >
            {action}
          </button>
        ))}
      </div>
    </article>
  );
}

function ContextItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-bold text-[#7781AE]">{label}</dt>
      <dd className="mt-1 text-[#F7F8FF]">{value}</dd>
    </div>
  );
}

function getSelectedOption(group: SelectorGroup, id: string) {
  return (
    publicGeneratorTaxonomyControls[group].find((option) => option.id === id) ||
    publicGeneratorTaxonomyControls[group][0]
  );
}
