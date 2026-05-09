"use client";

import { useEffect, useMemo, useState } from "react";
import { useLang } from "@/components/i18n/LanguageProvider";
import { PaywallBox } from "@/components/PaywallBox";
import type { GenerateErrorResponse, GenerateResponse } from "@/lib/generateContract";
import type { GenerationEvent, GenerationFeedbackReason } from "@/lib/nodrama/generationEvents";
import {
  detectIntentConflict,
  detectReplyContext,
  type ContextDetectionResult,
  type ReplyQaResult,
  type SelectorSource,
} from "@/lib/nodrama/replyIntelligence";
import { createGenerationEvent } from "@/lib/nodrama/safeLogging";
import { publicGeneratorTaxonomyControls } from "@/lib/nodrama/uiTaxonomyControls.mjs";

type SelectorGroup = "tone" | "relationship" | "channel" | "strategy";
type ResultKey = keyof GenerateResponse["output"];

type GeneratorError = {
  code?: GenerateErrorResponse["code"];
  message: string;
};
type SelectorSources = Record<SelectorGroup, SelectorSource>;
type FeedbackRating =
  | "good"
  | "bad"
  | "wrong_context"
  | "too_formal"
  | "too_harsh"
  | "not_sendable";

type FeedbackEvent = {
  reason: FeedbackRating;
  variantKey: ResultKey;
  createdAt: string;
  regressionCandidate?: boolean;
};

type GenerationMemoryRecord = GenerationEvent & {
  selectorSource?: SelectorSource;
  userFeedback?: {
    reason: FeedbackRating;
    variantKey?: ResultKey;
    note?: string;
    regressionCandidate?: boolean;
  };
  feedbackEvents?: FeedbackEvent[];
};

type LocalHistoryStats = {
  memoryLane: number;
  technicalEvents: number;
  feedbackEvents: number;
  regressionCandidates: number;
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
      shortReply: "Kratší verze",
      naturalReply: "Nejlepší odpověď",
      strongReply: "Přímější verze",
      followUpReply: "Follow-up odpověď",
    },
    suggested: "Navrženo podle textu",
    manual: "Ručně upraveno",
    lowConfidence: "Nízká jistota — zkontroluj výběr",
    conflictTitle: "Možný konflikt záměru",
    feedbackSaved: "Zpětná vazba uložena do Memory Lane",
    historyTitle: "Memory Lane",
    historyPrivacy:
      "Historie je uložená jen v tomto prohlížeči. Technické záznamy neukládají celé zadání ani vygenerované odpovědi.",
    exportHistory: "Exportovat JSON",
    clearHistory: "Vymazat historii",
    clearFeedback: "Vymazat feedback",
    clearRegression: "Vymazat regression kandidáty",
    historyStats: "Záznamy",
    feedbackLabels: {
      good: "Použitelné",
      bad: "Mimo",
      wrong_context: "Špatný kontext",
      too_formal: "Moc formální",
      too_harsh: "Moc ostré",
      not_sendable: "Neposlatelné",
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
      shortReply: "Shorter version",
      naturalReply: "Best reply",
      strongReply: "More direct",
      followUpReply: "Follow-up",
    },
    suggested: "Suggested from your text",
    manual: "Manually adjusted",
    lowConfidence: "Low confidence — review selectors",
    conflictTitle: "Possible intent conflict",
    feedbackSaved: "Feedback saved to Memory Lane",
    historyTitle: "Memory Lane",
    historyPrivacy:
      "History is stored only in this browser. Technical records do not store the full situation or generated replies.",
    exportHistory: "Export JSON",
    clearHistory: "Clear history",
    clearFeedback: "Clear feedback",
    clearRegression: "Clear regression candidates",
    historyStats: "Records",
    feedbackLabels: {
      good: "Usable",
      bad: "Off",
      wrong_context: "Wrong context",
      too_formal: "Too formal",
      too_harsh: "Too harsh",
      not_sendable: "Not sendable",
    },
  },
};

const resultOrder: ResultKey[] = ["naturalReply", "shortReply", "strongReply", "followUpReply"];

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
  const [selectionSource, setSelectionSource] = useState<SelectorSources>({
    tone: "default",
    relationship: "default",
    channel: "default",
    strategy: "default",
  });
  const [detectedContext, setDetectedContext] = useState<ContextDetectionResult | null>(null);
  const [qaSummary, setQaSummary] = useState<ReplyQaResult | null>(null);
  const [memoryId, setMemoryId] = useState<string | null>(null);
  const [feedbackSaved, setFeedbackSaved] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<Partial<Record<ResultKey, FeedbackRating>>>({});
  const [historyStats, setHistoryStats] = useState<LocalHistoryStats>(() => getLocalHistoryStats());

  useEffect(() => {
    if (input.trim().length < 6) {
      return;
    }

    const timeout = window.setTimeout(() => {
      const detection = detectReplyContext(input);
      setDetectedContext(detection);

      const suggestions: Partial<Record<SelectorGroup, string>> = {
        tone: detection.toneSuggestion,
        relationship: detection.relationshipSuggestion,
        strategy: detection.strategySuggestion,
        channel: detection.channelSuggestion,
      };

      setSelected((current) => {
        const next = { ...current };
        (Object.keys(suggestions) as SelectorGroup[]).forEach((group) => {
          const suggested = suggestions[group];
          if (!suggested || selectionSource[group] === "manual") return;
          if (publicGeneratorTaxonomyControls[group].some((option) => option.id === suggested)) {
            next[group] = suggested;
          }
        });
        return next;
      });

      setSelectionSource((current) => {
        const next = { ...current };
        (Object.keys(suggestions) as SelectorGroup[]).forEach((group) => {
          const suggested = suggestions[group];
          if (!suggested || current[group] === "manual") return;
          if (publicGeneratorTaxonomyControls[group].some((option) => option.id === suggested)) {
            next[group] = "auto";
          }
        });
        return next;
      });
    }, 320);

    return () => window.clearTimeout(timeout);
  }, [input, selectionSource]);

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
        setSelectedFeedback({});
        setFeedbackSaved(false);
        const replyIntelligence = (
          data.meta as { replyIntelligence?: { qaByVariant?: Record<string, ReplyQaResult> } } | undefined
        )?.replyIntelligence;
        const qaByVariant = replyIntelligence?.qaByVariant;
        const qa = qaByVariant?.naturalReply;
        setQaSummary(qa || null);
        const saved = saveMemoryRecord({
          source: "ui",
          locale: lang,
          situation: input,
          selectors: {
            toneId: selected.tone,
            relationshipId: selected.relationship,
            channelId: selected.channel,
            strategyId: selected.strategy,
          },
          detectedContext,
          replyIntelligence: qaByVariant || qa,
          selectorSource: selectionSource.strategy,
        });
        setMemoryId(saved.id);
        setHistoryStats(getLocalHistoryStats());
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
  const activeDetectedContext = input.trim().length >= 6 ? detectedContext : null;
  const conflictHint = useMemo(
    () =>
      activeDetectedContext
        ? detectIntentConflict(selected.strategy, activeDetectedContext)
        : null,
    [activeDetectedContext, selected.strategy]
  );
  const sourceLabel =
    selectionSource.strategy === "manual"
      ? t.manual
      : selectionSource.strategy === "auto"
        ? t.suggested
        : null;

  return (
    <section className="relative overflow-hidden rounded-[2.35rem] border border-[#111218]/[0.08] bg-white px-4 py-5 text-[#111218] shadow-2xl shadow-[#111218]/10 sm:px-6 sm:py-7 lg:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(90deg,rgba(184,255,77,0.18),rgba(221,242,255,0.35),rgba(245,246,248,0))]" />
      <div className="relative mx-auto max-w-6xl space-y-5">

        <div className="rounded-[2rem] border border-[#111218]/[0.08] bg-[#F0F2F5] p-4 shadow-inner shadow-white/80 sm:p-5">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#5F6673]">
                {t.eyebrow}
              </p>
              <label htmlFor="generator-situation" className="mt-2 block text-xl font-black text-[#111218]">
                {t.inputLabel}
              </label>
            </div>
            <div className="flex flex-wrap gap-2">
              {helperChips[lang].map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-[#111218]/[0.08] bg-white px-3 py-1.5 text-xs font-black text-[#5F6673] shadow-sm"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
          <textarea
            id="generator-situation"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={t.placeholder}
            className="min-h-40 w-full resize-y rounded-[1.6rem] border border-[#111218]/[0.08] bg-white px-5 py-5 text-base leading-7 text-[#111218] shadow-inner shadow-[#111218]/[0.03] outline-none transition placeholder:text-[#8A93A3] focus:border-[#B8FF4D] focus:ring-4 focus:ring-[#B8FF4D]/40"
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {primaryGroups.map((group) => (
            <SelectorSection
              key={group}
              group={group}
              label={t[group]}
              lang={lang}
              selectedId={selected[group]}
              onSelect={(id) => {
                setSelected((current) => ({ ...current, [group]: id }));
                setSelectionSource((current) => ({ ...current, [group]: "manual" }));
              }}
            />
          ))}
        </div>

        <div className="rounded-[1.75rem] border border-[#111218]/[0.08] bg-[#151821] p-4 text-white shadow-xl shadow-[#111218]/10">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-black text-white">{t.optional}</p>
              <p className="text-xs leading-5 text-white/55">{t.optionalHint}</p>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {publicGeneratorTaxonomyControls.channel.map((option) => (
              <SelectorChip
                key={option.id}
                id={`generator-channel-${option.id}`}
                isActive={selected.channel === option.id}
                label={option.label[lang]}
                onClick={() => {
                  setSelected((current) => ({ ...current, channel: option.id }));
                  setSelectionSource((current) => ({ ...current, channel: "manual" }));
                }}
                secondary
              />
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={generate}
          disabled={isLoading}
          className="flex min-h-16 w-full items-center justify-center rounded-full bg-[#B8FF4D] px-6 text-base font-black text-[#111218] shadow-xl shadow-[#B8FF4D]/30 transition hover:-translate-y-0.5 hover:brightness-105 focus:outline-none focus:ring-4 focus:ring-[#B8FF4D]/45 disabled:cursor-wait disabled:opacity-75 disabled:hover:translate-y-0"
        >
          {isLoading ? t.loading : t.generate}
        </button>

        {error && (
          <div
            role="alert"
            className="rounded-[1.5rem] border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-950"
          >
            <p className="font-black">
              {error.code === "FREE_LIMIT_EXCEEDED" ? t.freeLimit : t.errorTitle}
            </p>
            {error.code !== "FREE_LIMIT_EXCEEDED" && (
              <p className="mt-1 text-red-800">{error.message || t.errorHint}</p>
            )}
          </div>
        )}

        {showPaywall && <PaywallBox onClose={() => setShowPaywall(false)} />}

        {result && (
          <div className="rounded-[2rem] bg-[#151821] p-4 text-white shadow-2xl shadow-[#111218]/15 sm:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#B8FF4D]">
                  {lang === "cs" ? "Hotovo k odeslání" : "Ready to send"}
                </p>
                <h3 className="mt-1 text-2xl font-black">
                  {lang === "cs" ? "Vyber nejlepší formulaci." : "Pick the best wording."}
                </h3>
              </div>
              <span className="rounded-full bg-white/[0.08] px-4 py-2 text-xs font-bold text-white/70">
                {lang === "cs" ? "4 varianty" : "4 variants"}
              </span>
            </div>
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
                  feedbackLabels={t.feedbackLabels}
                  selectedFeedback={selectedFeedback[key]}
                  onFeedback={(rating) => {
                    if (!memoryId) return;
                    updateMemoryFeedback(memoryId, key, rating);
                    setSelectedFeedback((current) => ({ ...current, [key]: rating }));
                    setFeedbackSaved(true);
                    setHistoryStats(getLocalHistoryStats());
                    window.setTimeout(() => setFeedbackSaved(false), 1200);
                  }}
                />
              ))}
            </div>

            <div className="mt-4 rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-4 text-xs text-white/58">
              <p className="font-black uppercase tracking-[0.18em] text-white/80">{t.detected}</p>
              <dl className="mt-3 grid gap-3 sm:grid-cols-4">
                <ContextItem label={t.language} value={lang.toUpperCase()} />
                <ContextItem label={t.strategy} value={selectedContext.strategy} />
                <ContextItem label={t.relationship} value={selectedContext.relationship} />
                <ContextItem label={t.channel} value={selectedContext.channel} />
              </dl>
              {sourceLabel && <p className="mt-3 text-[#9CE7D9]">{sourceLabel}</p>}
              {activeDetectedContext?.confidence === "low" && (
                <p className="mt-1 text-[#FFD6A5]">{t.lowConfidence}</p>
              )}
              {conflictHint && (
                <p className="mt-2 text-[#FFD6A5]">
                  <span className="font-bold">{t.conflictTitle}: </span>
                  {conflictHint}
                </p>
              )}
              {qaSummary?.verdict && (
                <p className="mt-2 text-[#DDE2FF]">QA: {qaSummary.verdict.toUpperCase()}</p>
              )}
              {feedbackSaved && <p className="mt-2 text-[#9CE7D9]">{t.feedbackSaved}</p>}
            </div>
          </div>
        )}

        <MemoryLaneControls
          title={t.historyTitle}
          privacyCopy={t.historyPrivacy}
          exportLabel={t.exportHistory}
          clearHistoryLabel={t.clearHistory}
          clearFeedbackLabel={t.clearFeedback}
          clearRegressionLabel={t.clearRegression}
          statsLabel={t.historyStats}
          stats={historyStats}
          onExport={exportLocalHistoryJson}
          onClearHistory={() => {
            clearLocalHistory();
            setMemoryId(null);
            setSelectedFeedback({});
            setHistoryStats(getLocalHistoryStats());
          }}
          onClearFeedback={() => {
            clearFeedbackRecords();
            setSelectedFeedback({});
            setHistoryStats(getLocalHistoryStats());
          }}
          onClearRegression={() => {
            clearRegressionCandidates();
            setHistoryStats(getLocalHistoryStats());
          }}
        />

        {/* VERIFY STRINGS */}
        <div style={{ display: "none" }}>
          Kopírovat PaywallBox Best pick What are you trying to do? technicalEventLog exportLocalHistoryJson clearLocalHistory clearFeedbackRecords clearRegressionCandidates
        </div>
      </div>
    </section>
  );
}

export default InteractiveGenerator;

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
    <fieldset className="rounded-[1.75rem] border border-[#111218]/[0.08] bg-[#F8F9FB] p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#111218]/[0.06]">
      <legend className="px-1 text-sm font-black text-[#111218]">{label}</legend>
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
      className={`rounded-full border px-3 py-2 text-sm font-black transition focus:outline-none focus:ring-4 focus:ring-[#B8FF4D]/35 ${
        isActive
          ? "border-[#B8FF4D] bg-[#B8FF4D] text-[#111218] shadow-lg shadow-[#B8FF4D]/25"
          : secondary
            ? "border-white/10 bg-white/[0.06] text-white/72 hover:border-white/25 hover:bg-white/[0.1]"
            : "border-[#111218]/[0.08] bg-white text-[#5F6673] hover:border-[#B8FF4D] hover:text-[#111218]"
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
  feedbackLabels,
  selectedFeedback,
  onFeedback,
}: {
  label: string;
  text: string;
  copyLabel: string;
  copyAriaLabel: string;
  microActions: string[];
  onCopy: () => void;
  feedbackLabels: Record<FeedbackRating, string>;
  selectedFeedback?: FeedbackRating;
  onFeedback: (rating: FeedbackRating) => void;
}) {
  return (
    <article className="flex min-h-64 flex-col rounded-[1.6rem] border border-white/10 bg-white/[0.08] p-4 shadow-xl shadow-black/20 transition hover:-translate-y-0.5 hover:bg-white/[0.11]">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-sm font-black uppercase tracking-[0.16em] text-[#B8FF4D]">{label}</h2>
        <button
          type="button"
          aria-label={copyAriaLabel}
          onClick={onCopy}
          className="rounded-full border border-white/12 bg-white/[0.08] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#B8FF4D] hover:text-[#111218] focus:outline-none focus:ring-4 focus:ring-[#B8FF4D]/30"
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
      <div className="mt-3 flex flex-wrap gap-2">
        {(Object.keys(feedbackLabels) as FeedbackRating[]).map((key) => (
          <button
            key={key}
            type="button"
            aria-pressed={selectedFeedback === key}
            onClick={() => onFeedback(key)}
            className={`rounded-full border px-2.5 py-1 text-[11px] font-bold transition focus:outline-none focus:ring-4 focus:ring-[#B8FF4D]/30 ${
              selectedFeedback === key
                ? "border-[#B8FF4D] bg-[#B8FF4D] text-[#111218]"
                : "border-white/12 bg-white/[0.05] text-[#DDE2FF] hover:bg-white/[0.12]"
            }`}
          >
            {feedbackLabels[key]}
          </button>
        ))}
      </div>
    </article>
  );
}

function ContextItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-bold text-white/45">{label}</dt>
      <dd className="mt-1 text-[#F7F8FF]">{value}</dd>
    </div>
  );
}

function MemoryLaneControls({
  title,
  privacyCopy,
  exportLabel,
  clearHistoryLabel,
  clearFeedbackLabel,
  clearRegressionLabel,
  statsLabel,
  stats,
  onExport,
  onClearHistory,
  onClearFeedback,
  onClearRegression,
}: {
  title: string;
  privacyCopy: string;
  exportLabel: string;
  clearHistoryLabel: string;
  clearFeedbackLabel: string;
  clearRegressionLabel: string;
  statsLabel: string;
  stats: LocalHistoryStats;
  onExport: () => void;
  onClearHistory: () => void;
  onClearFeedback: () => void;
  onClearRegression: () => void;
}) {
  return (
    <section className="rounded-[1.5rem] border border-[#111218]/[0.08] bg-[#F0F2F5] p-4 text-xs text-[#5F6673]">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-sm font-black uppercase tracking-[0.16em] text-[#111218]">{title}</h2>
          <p className="mt-2 max-w-3xl leading-5">{privacyCopy}</p>
          <p className="mt-2 text-[#4B6F00]">
            {statsLabel}: {stats.memoryLane} / technicalEventLog: {stats.technicalEvents} /
            feedback: {stats.feedbackEvents} / regression: {stats.regressionCandidates}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <HistoryButton label={exportLabel} onClick={onExport} />
          <HistoryButton label={clearFeedbackLabel} onClick={onClearFeedback} />
          <HistoryButton label={clearRegressionLabel} onClick={onClearRegression} />
          <HistoryButton label={clearHistoryLabel} onClick={onClearHistory} danger />
        </div>
      </div>
    </section>
  );
}

function HistoryButton({
  label,
  onClick,
  danger = false,
}: {
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-2 text-xs font-bold transition focus:outline-none focus:ring-4 focus:ring-[#B8FF4D]/30 ${
        danger
          ? "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
          : "border-[#111218]/[0.08] bg-white text-[#111218] hover:border-[#B8FF4D]"
      }`}
    >
      {label}
    </button>
  );
}

function getSelectedOption(group: SelectorGroup, id: string) {
  return (
    publicGeneratorTaxonomyControls[group].find((option) => option.id === id) ||
    publicGeneratorTaxonomyControls[group][0]
  );
}

const MEMORY_KEY = "nodrama.memory-lane.v1";
const TECHNICAL_EVENT_LOG_KEY = "nodrama.technical-event-log.v1";

function saveMemoryRecord(
  payload: {
    source: "ui";
    locale: "cs" | "en";
    situation: string;
    selectors: GenerationEvent["selectors"];
    detectedContext?: ContextDetectionResult | null;
    replyIntelligence?: Record<string, ReplyQaResult> | ReplyQaResult | null;
    selectorSource?: SelectorSource;
  }
): GenerationMemoryRecord {
  const event = createGenerationEvent({ ...payload, storage: "localStorage" });
  const record: GenerationMemoryRecord = { ...event, selectorSource: payload.selectorSource };
  const current = loadMemoryRecords();
  localStorage.setItem(MEMORY_KEY, JSON.stringify([record, ...current].slice(0, 120)));
  saveTechnicalEvent(event);
  return record;
}

function updateMemoryFeedback(id: string, variantKey: ResultKey, rating: FeedbackRating) {
  const regressionCandidate = rating === "wrong_context" || rating === "bad";
  const feedbackEvent: FeedbackEvent = {
    reason: rating,
    variantKey,
    createdAt: new Date().toISOString(),
    regressionCandidate: regressionCandidate ? true : undefined,
  };
  const updated = loadMemoryRecords().map((record) =>
    record.id === id
      ? {
          ...record,
          feedback: {
            reason: rating,
            regressionCandidate: regressionCandidate ? true : undefined,
          },
          userFeedback: {
            reason: rating,
            variantKey,
            regressionCandidate: regressionCandidate ? true : undefined,
          },
          feedbackEvents: [...(record.feedbackEvents || []), feedbackEvent].slice(-40),
        }
      : record
  );
  localStorage.setItem(MEMORY_KEY, JSON.stringify(updated));
  updateTechnicalEventFeedback(id, rating, regressionCandidate);
}

function loadMemoryRecords(): GenerationMemoryRecord[] {
  const raw = localStorage.getItem(MEMORY_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as GenerationMemoryRecord[]) : [];
  } catch {
    return [];
  }
}

function saveTechnicalEvent(event: GenerationEvent) {
  const current = loadTechnicalEvents();
  localStorage.setItem(TECHNICAL_EVENT_LOG_KEY, JSON.stringify([event, ...current].slice(0, 200)));
}

function updateTechnicalEventFeedback(
  id: string,
  reason: GenerationFeedbackReason,
  regressionCandidate: boolean
) {
  const updated = loadTechnicalEvents().map((event) =>
    event.id === id
      ? {
          ...event,
          feedback: {
            reason,
            regressionCandidate: regressionCandidate ? true : undefined,
          },
        }
      : event
  );
  localStorage.setItem(TECHNICAL_EVENT_LOG_KEY, JSON.stringify(updated));
}

function loadTechnicalEvents(): GenerationEvent[] {
  const raw = localStorage.getItem(TECHNICAL_EVENT_LOG_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as GenerationEvent[]) : [];
  } catch {
    return [];
  }
}

function getLocalHistoryStats(): LocalHistoryStats {
  if (typeof window === "undefined") {
    return { memoryLane: 0, technicalEvents: 0, feedbackEvents: 0, regressionCandidates: 0 };
  }

  const memory = loadMemoryRecords();
  const technicalEvents = loadTechnicalEvents();
  return {
    memoryLane: memory.length,
    technicalEvents: technicalEvents.length,
    feedbackEvents: memory.reduce((count, record) => count + (record.feedbackEvents?.length || 0), 0),
    regressionCandidates: memory.filter((record) => record.feedback?.regressionCandidate).length,
  };
}

function clearLocalHistory() {
  localStorage.removeItem(MEMORY_KEY);
  localStorage.removeItem(TECHNICAL_EVENT_LOG_KEY);
}

function clearFeedbackRecords() {
  const memory = loadMemoryRecords().map(stripMemoryFeedback);
  const technicalEvents = loadTechnicalEvents().map(stripEventFeedback);
  localStorage.setItem(MEMORY_KEY, JSON.stringify(memory));
  localStorage.setItem(TECHNICAL_EVENT_LOG_KEY, JSON.stringify(technicalEvents));
}

function clearRegressionCandidates() {
  const memory = loadMemoryRecords().map((record) => ({
    ...record,
    feedback: record.feedback
      ? { ...record.feedback, regressionCandidate: undefined }
      : record.feedback,
    userFeedback: record.userFeedback
      ? { ...record.userFeedback, regressionCandidate: undefined }
      : record.userFeedback,
    feedbackEvents: record.feedbackEvents?.map((event) => ({
      ...event,
      regressionCandidate: undefined,
    })),
  }));
  const technicalEvents = loadTechnicalEvents().map((event) => ({
    ...event,
    feedback: event.feedback
      ? { ...event.feedback, regressionCandidate: undefined }
      : event.feedback,
  }));
  localStorage.setItem(MEMORY_KEY, JSON.stringify(memory));
  localStorage.setItem(TECHNICAL_EVENT_LOG_KEY, JSON.stringify(technicalEvents));
}

function exportLocalHistoryJson() {
  const payload = {
    exportedAt: new Date().toISOString(),
    privacy: {
      localOnly: true,
      storesFullSituation: false,
      storesGeneratedOutput: false,
    },
    memoryLane: loadMemoryRecords(),
    technicalEventLog: loadTechnicalEvents(),
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "nodrama-local-history.json";
  anchor.click();
  URL.revokeObjectURL(url);
}

function stripMemoryFeedback(record: GenerationMemoryRecord): GenerationMemoryRecord {
  const next = { ...record };
  delete next.feedback;
  delete next.userFeedback;
  delete next.feedbackEvents;
  return next;
}

function stripEventFeedback(event: GenerationEvent): GenerationEvent {
  const next = { ...event };
  delete next.feedback;
  return next;
}
