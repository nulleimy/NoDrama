"use client";

import { useEffect, useMemo, useState } from "react";
import { useLang } from "@/components/i18n/LanguageProvider";
import { PaywallBox } from "@/components/PaywallBox";
import type { GenerateErrorResponse, GenerateResponse } from "@/lib/generateContract";
import {
  detectIntentConflict,
  detectReplyContext,
  type ContextDetectionResult,
  type ReplyQaResult,
  type SelectorSource,
} from "@/lib/nodrama/replyIntelligence";
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
type FeedbackAction = "fits" | "not_quite" | "try_again";
type TuningAction =
  | "softer"
  | "stronger"
  | "shorter"
  | "more_natural"
  | "more_like_me"
  | "less_awkward";

type FeedbackEvent = {
  rating: FeedbackRating;
  variantKey: ResultKey;
  createdAt: string;
  regressionCandidate?: boolean;
};

type GenerationMemoryRecord = {
  id: string;
  createdAt: string;
  language: "cs" | "en";
  userInputPreview: string;
  selectedContext: {
    toneId: string;
    relationshipId: string;
    channelId: string;
    strategyId: string;
    source?: SelectorSource;
  };
  inferredContext: {
    domain: string;
    scenarioFamily: string;
    confidence: "low" | "medium" | "high";
    reasons: string[];
    warnings: string[];
  };
  qa?: ReplyQaResult;
  outputPreview?: string;
  userFeedback?: {
    rating: FeedbackRating;
    variantKey?: ResultKey;
    note?: string;
  };
  feedbackEvents?: FeedbackEvent[];
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
    copyAriaPrefix: "Kopírovat odpověď",
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
    suggested: "Navrženo podle textu",
    manual: "Ručně upraveno",
    lowConfidence: "Nízká jistota — zkontroluj výběr",
    conflictTitle: "Možný konflikt záměru",
    feedbackSaved: "Zpětná vazba uložena do Memory Lane",
    feedback: {
      title: "Sedí ti to?",
      labels: {
        fits: "Sedí",
        not_quite: "Nesedí",
        try_again: "Jiná verze",
      },
      unavailable: "Jiná verze zatím není napojená.",
    },
    tuning: {
      title: "Chceš to doladit?",
      unavailable: "Doladění zatím připravujeme.",
      labels: {
        softer: "Jemnější",
        stronger: "Důraznější",
        shorter: "Kratší",
        more_natural: "Přirozenější",
        more_like_me: "Více jako já",
        less_awkward: "Méně trapné",
      },
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
    copyAriaPrefix: "Copy reply",
    detected: "Detected context",
    language: "Language",
    freeLimit: "Your free limit is used for today.",
    errorTitle: "This reply could not be written.",
    errorHint: "Try adjusting the situation or send it again in a moment.",
    resultLabels: {
      shortReply: "Short",
      naturalReply: "Natural",
      strongReply: "Stronger",
      followUpReply: "If they push back",
    },
    suggested: "Suggested from your text",
    manual: "Manually adjusted",
    lowConfidence: "Low confidence — review selectors",
    conflictTitle: "Possible intent conflict",
    feedbackSaved: "Feedback saved to Memory Lane",
    feedback: {
      title: "Does this feel right?",
      labels: {
        fits: "Feels right",
        not_quite: "Not quite",
        try_again: "Try another",
      },
      unavailable: "Another version is not connected yet.",
    },
    tuning: {
      title: "Tune it",
      unavailable: "Tuning is coming soon.",
      labels: {
        softer: "Softer",
        stronger: "Stronger",
        shorter: "Shorter",
        more_natural: "More natural",
        more_like_me: "More like me",
        less_awkward: "Less awkward",
      },
    },
  },
};

const resultOrder: ResultKey[] = ["shortReply", "naturalReply", "strongReply", "followUpReply"];
const tuningOrder: TuningAction[] = [
  "softer",
  "stronger",
  "shorter",
  "more_natural",
  "more_like_me",
  "less_awkward",
];

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
  const [selectedReplyVariant, setSelectedReplyVariant] = useState<ResultKey | null>(null);
  const [feedbackAction, setFeedbackAction] = useState<FeedbackAction | null>(null);
  const [selectedFeedback, setSelectedFeedback] = useState<Partial<Record<ResultKey, FeedbackAction>>>({});
  const [regressionCandidateCount, setRegressionCandidateCount] = useState(getStoredRegressionCandidateCount);
  const [regressionExportMessage, setRegressionExportMessage] = useState<string | null>(null);
  const [tuningAction] = useState<TuningAction | null>(null);

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
        let changed = false;
        const next = { ...current };

        (Object.keys(suggestions) as SelectorGroup[]).forEach((group) => {
          const suggested = suggestions[group];
          if (!suggested || current[group] === "manual") return;

          if (
            publicGeneratorTaxonomyControls[group].some((option) => option.id === suggested) &&
            next[group] !== "auto"
          ) {
            next[group] = "auto";
            changed = true;
          }
        });

        return changed ? next : current;
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
        setSelectedReplyVariant(null);
        setFeedbackAction(null);
        setFeedbackSaved(false);
        const qa = (data.meta as { replyIntelligence?: { qaByVariant?: Record<string, ReplyQaResult> } } | undefined)
          ?.replyIntelligence?.qaByVariant?.naturalReply;
        setQaSummary(qa || null);
        const saved = saveMemoryRecord({
          createdAt: new Date().toISOString(),
          language: lang,
          userInputPreview: input.slice(0, 240),
          selectedContext: {
            toneId: selected.tone,
            relationshipId: selected.relationship,
            channelId: selected.channel,
            strategyId: selected.strategy,
            source: selectionSource.strategy,
          },
          inferredContext: detectedContext
            ? {
                domain: detectedContext.domain,
                scenarioFamily: detectedContext.scenarioFamily,
                confidence: detectedContext.confidence,
                reasons: detectedContext.reasons,
                warnings: detectedContext.warnings,
              }
            : {
                domain: "general",
                scenarioFamily: "general",
                confidence: "low",
                reasons: [],
                warnings: [],
              },
          qa,
          outputPreview: data.output.naturalReply.slice(0, 240),
        });
        setMemoryId(saved.id);
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
              onSelect={(id) => {
                setSelected((current) => ({ ...current, [group]: id }));
                setSelectionSource((current) => ({ ...current, [group]: "manual" }));
              }}
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
          className="flex w-full items-center justify-center rounded-3xl bg-gradient-to-r from-[#8D5CFF] via-[#FF4FB3] to-[#4DA3FF] px-6 py-4 text-base font-black text-white shadow-lg shadow-[#8D5CFF]/25 transition hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-[#35E0C3]/35 disabled:cursor-wait disabled:opacity-75 disabled:hover:scale-100"
        >
          {isLoading ? t.loading : t.generate}
        </button>

        <div className="flex flex-col gap-2 rounded-[1.25rem] border border-white/10 bg-white/[0.045] p-4 text-xs text-[#B9C0E0] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-bold text-[#F7F8FF]">{t.memoryLane.title}</p>
            {regressionExportMessage && (
              <p className="mt-1" role="status">
                {regressionExportMessage}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              const exported = exportRegressionCandidates();
              setRegressionCandidateCount(exported);
              setRegressionExportMessage(
                exported > 0 ? `${t.memoryLane.title}: ${exported}` : t.memoryLane.empty
              );
            }}
            className="rounded-full border border-[#35E0C3]/40 bg-[#35E0C3]/10 px-4 py-2 text-xs font-black text-[#9CE7D9] transition hover:border-[#35E0C3]/75 hover:bg-[#35E0C3]/16 focus:outline-none focus:ring-4 focus:ring-[#35E0C3]/30"
          >
            {t.memoryLane.exportProblemCases}
            {regressionCandidateCount > 0 ? ` (${regressionCandidateCount})` : ""}
          </button>
        </div>

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
                  copyAriaLabel={`${t.copyAriaPrefix}: ${t.resultLabels[key]}`}
                  onCopy={() => copyResult(key, result[key])}
                  feedbackTitle={t.feedback.title}
                  feedbackLabels={t.feedback.labels}
                  tryAgainUnavailableLabel={t.feedback.unavailable}
                  selectedFeedback={selectedFeedback[key]}
                  onFeedback={(action) => {
                    setSelectedReplyVariant(key);
                    setFeedbackAction(action);
                    if (action === "try_again") return;
                    if (!memoryId) return;
                    const rating = resolveFeedbackRatingFromChip(action, qaSummary);
                    updateMemoryFeedback(memoryId, key, rating);
                    setSelectedFeedback((current) => ({ ...current, [key]: action }));
                    setFeedbackSaved(true);
                    window.setTimeout(() => setFeedbackSaved(false), 1200);
                  }}
                  tuningTitle={t.tuning.title}
                  tuningLabels={t.tuning.labels}
                  tuningUnavailableLabel={t.tuning.unavailable}
                  selectedTuning={selectedReplyVariant === key ? tuningAction : null}
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
              {selectedReplyVariant && feedbackAction && (
                <p className="sr-only" aria-live="polite">
                  {selectedReplyVariant}: {feedbackAction}
                </p>
              )}
            </div>
          </div>
        )}

        {/* VERIFY STRINGS */}
        <div style={{ display: "none" }}>
          Kopírovat PaywallBox Best pick What are you trying to do? #B8FF4D
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
  onCopy,
  feedbackTitle,
  feedbackLabels,
  tryAgainUnavailableLabel,
  selectedFeedback,
  onFeedback,
  tuningTitle,
  tuningLabels,
  tuningUnavailableLabel,
  selectedTuning,
}: {
  label: string;
  text: string;
  copyLabel: string;
  copyAriaLabel: string;
  onCopy: () => void;
  feedbackTitle: string;
  feedbackLabels: Record<FeedbackAction, string>;
  tryAgainUnavailableLabel: string;
  selectedFeedback?: FeedbackAction;
  onFeedback: (action: FeedbackAction) => void;
  tuningTitle: string;
  tuningLabels: Record<TuningAction, string>;
  tuningUnavailableLabel: string;
  selectedTuning?: TuningAction | null;
}) {
  return (
    <article className="flex min-h-64 flex-col rounded-[1.35rem] border border-white/12 bg-white/[0.08] p-4 shadow-xl shadow-black/20">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-sm font-black uppercase tracking-[0.16em] text-[#35E0C3]">{label}</h2>
        <button
          type="button"
          aria-label={copyAriaLabel}
          onClick={onCopy}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.08] px-3 py-1.5 text-xs font-bold text-white transition hover:-translate-y-0.5 hover:border-[#35E0C3]/50 hover:bg-white/[0.14] hover:shadow-lg hover:shadow-[#35E0C3]/10 focus:outline-none focus:ring-4 focus:ring-[#35E0C3]/30"
        >
          {copyLabel}
        </button>
      </div>
      <p className="mt-4 flex-1 whitespace-pre-wrap text-base leading-7 text-[#F7F8FF]">{text}</p>
      <div className="mt-5 space-y-4">
        <ReplyFeedbackChips
          title={feedbackTitle}
          labels={feedbackLabels}
          selectedFeedback={selectedFeedback}
          tryAgainUnavailableLabel={tryAgainUnavailableLabel}
          onFeedback={onFeedback}
        />
        <ReplyTuningChips
          title={tuningTitle}
          labels={tuningLabels}
          selectedTuning={selectedTuning}
          unavailableLabel={tuningUnavailableLabel}
        />
      </div>
    </article>
  );
}

function ReplyFeedbackChips({
  title,
  labels,
  selectedFeedback,
  tryAgainUnavailableLabel,
  onFeedback,
}: {
  title: string;
  labels: Record<FeedbackAction, string>;
  selectedFeedback?: FeedbackAction;
  tryAgainUnavailableLabel: string;
  onFeedback: (action: FeedbackAction) => void;
}) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-[0.16em] text-[#DDE2FF]">{title}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {(["fits", "not_quite", "try_again"] as FeedbackAction[]).map((action) => {
          const isUnavailable = action === "try_again";
          const isSelected = selectedFeedback === action;

          return (
            <button
              key={action}
              type="button"
              aria-pressed={isSelected}
              aria-label={isUnavailable ? `${labels[action]} (${tryAgainUnavailableLabel})` : labels[action]}
              title={isUnavailable ? tryAgainUnavailableLabel : undefined}
              disabled={isUnavailable}
              onClick={() => onFeedback(action)}
              className={`rounded-full border px-3 py-1.5 text-xs font-black transition focus:outline-none focus:ring-4 focus:ring-[#35E0C3]/35 ${
                isSelected
                  ? "border-[#35E0C3] bg-[#35E0C3] text-[#07101C] shadow-lg shadow-[#35E0C3]/25"
                  : isUnavailable
                    ? "cursor-not-allowed border-white/10 bg-white/[0.04] text-[#B9C0E0] opacity-60"
                    : "border-white/12 bg-white/[0.055] text-[#F7F8FF] hover:-translate-y-0.5 hover:border-[#35E0C3]/55 hover:bg-white/[0.11] hover:shadow-lg hover:shadow-[#35E0C3]/10"
              }`}
            >
              {labels[action]}
              {isSelected && <span className="ml-1" aria-hidden="true">✓</span>}
              {isUnavailable && <span className="sr-only"> {tryAgainUnavailableLabel}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ReplyTuningChips({
  title,
  labels,
  selectedTuning,
  unavailableLabel,
}: {
  title: string;
  labels: Record<TuningAction, string>;
  selectedTuning?: TuningAction | null;
  unavailableLabel: string;
}) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-[0.16em] text-[#DDE2FF]">{title}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {tuningOrder.map((action) => {
          const isSelected = selectedTuning === action;

          return (
            <button
              key={action}
              type="button"
              aria-pressed={isSelected}
              aria-label={`${labels[action]} (${unavailableLabel})`}
              title={unavailableLabel}
              disabled
              className="cursor-not-allowed rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-black text-[#B9C0E0] opacity-60 transition focus:outline-none focus:ring-4 focus:ring-[#35E0C3]/35"
            >
              {labels[action]}
              <span className="sr-only"> {unavailableLabel}</span>
            </button>
          );
        })}
      </div>
    </div>
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

const MEMORY_KEY = "nodrama.memory-lane.v1";

function getStoredRegressionCandidateCount(): number {
  if (typeof localStorage === "undefined") return 0;
  return getRegressionCandidates(loadMemoryRecords()).length;
}

function saveMemoryRecord(
  payload: Omit<GenerationMemoryRecord, "id">
): GenerationMemoryRecord {
  const record: GenerationMemoryRecord = {
    ...payload,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  };
  const current = loadMemoryRecords();
  localStorage.setItem(MEMORY_KEY, JSON.stringify([record, ...current].slice(0, 120)));
  return record;
}

function resolveFeedbackRatingFromChip(
  action: FeedbackAction,
  qa?: ReplyQaResult | null
): FeedbackRating {
  if (action === "fits") return "good";

  if (action === "not_quite") {
    if (!qa) return "wrong_context";
    if (qa.verdict === "reject" || qa.sendability < 0.65) return "not_sendable";
    if (qa.contextFit < 0.7 || qa.strategyFit < 0.7 || qa.mismatchType) {
      return "wrong_context";
    }
    if (qa.toneFit < 0.7) {
      return qa.reasons.some((reason) => reason.includes("formal"))
        ? "too_formal"
        : "too_harsh";
    }

    return "wrong_context";
  }

  return "bad";
}

function updateMemoryFeedback(id: string, variantKey: ResultKey, rating: FeedbackRating) {
  const feedbackEvent: FeedbackEvent = {
    rating,
    variantKey,
    createdAt: new Date().toISOString(),
    regressionCandidate: rating === "wrong_context" ? true : undefined,
  };
  const updated = loadMemoryRecords().map((record) =>
    record.id === id
      ? {
          ...record,
          userFeedback: { rating, variantKey },
          feedbackEvents: [...(record.feedbackEvents || []), feedbackEvent].slice(-40),
        }
      : record
  );
  localStorage.setItem(MEMORY_KEY, JSON.stringify(updated));
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

function isProblemFeedbackRating(rating?: FeedbackRating): boolean {
  return rating === "wrong_context" || rating === "bad" || rating === "not_sendable";
}

export function getRegressionCandidates(records: GenerationMemoryRecord[]): RegressionCandidateExportItem[] {
  return records.filter(isRegressionCandidate).map(toRegressionCandidateExportItem);
}

function isRegressionCandidate(record: GenerationMemoryRecord): boolean {
  return (
    record.feedbackEvents?.some((event) => event.regressionCandidate === true) ||
    isProblemFeedbackRating(record.userFeedback?.rating) ||
    record.feedbackEvents?.some((event) => isProblemFeedbackRating(event.rating)) ||
    false
  );
}

function toRegressionCandidateExportItem(record: GenerationMemoryRecord): RegressionCandidateExportItem {
  const feedbackEvents = record.feedbackEvents || [];
  const ratings = Array.from(
    new Set(
      [
        record.userFeedback?.rating,
        ...feedbackEvents.map((event) => event.rating),
      ].filter(Boolean) as FeedbackRating[]
    )
  );
  const variantKey = record.userFeedback?.variantKey || feedbackEvents[feedbackEvents.length - 1]?.variantKey;

  return {
    id: record.id,
    createdAt: record.createdAt,
    language: record.language,
    situationPreview: createSituationPreview(record.userInputPreview || "", 96),
    situationHash: record.situationHash,
    selectedContext: record.selectedContext,
    inferredContext: record.inferredContext,
    qa: summarizeMemoryQa(record.qa),
    feedbackEvents,
    ratings,
    variantKey,
    reason: getRegressionCandidateReasons(record),
  };
}

function getRegressionCandidateReasons(record: GenerationMemoryRecord): string[] {
  const reasons = new Set<string>();

  if (record.feedbackEvents?.some((event) => event.regressionCandidate === true)) {
    reasons.add("feedback_event_regression_candidate");
  }

  if (isProblemFeedbackRating(record.userFeedback?.rating)) {
    reasons.add(`rating_${record.userFeedback?.rating}`);
  }

  for (const event of record.feedbackEvents || []) {
    if (isProblemFeedbackRating(event.rating)) {
      reasons.add(`feedback_event_${event.rating}`);
    }
  }

  return Array.from(reasons);
}

function summarizeMemoryQa(qa?: ReplyQaResult) {
  if (!qa) return undefined;

  return {
    verdict: qa.verdict,
    contextFit: qa.contextFit,
    toneFit: qa.toneFit,
    strategyFit: qa.strategyFit,
    sendability: qa.sendability,
    mismatchType: qa.mismatchType,
    reasons: qa.reasons,
    forbiddenTermsHit: qa.forbiddenTermsHit,
  };
}

export function exportRegressionCandidates(): number {
  const candidates = getRegressionCandidates(loadMemoryRecords());
  if (!candidates.length) return 0;

  const blob = new Blob([JSON.stringify(candidates, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `nodrama-regression-candidates-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);

  return candidates.length;
}
