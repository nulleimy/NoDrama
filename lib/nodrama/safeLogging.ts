import type { GenerationEvent, GenerationEventLocale, GenerationEventSource } from "./generationEvents";
import type { ContextDetectionResult, ReplyQaResult, ReplyQaVerdict } from "./replyIntelligence";

type GenerationEventArgs = {
  id?: string;
  createdAt?: string;
  source: GenerationEventSource;
  locale: GenerationEventLocale;
  situation: string;
  selectors: GenerationEvent["selectors"];
  detectedContext?: ContextDetectionResult | GenerationEvent["detectedContext"] | null;
  replyIntelligence?: ReplyQaResult | Record<string, ReplyQaResult> | null;
  feedback?: GenerationEvent["feedback"];
  storage?: GenerationEvent["privacy"]["storage"];
};

const DEFAULT_PREVIEW_CHARS = 80;
const VERDICT_WEIGHT: Record<ReplyQaVerdict, number> = {
  pass: 0,
  rewrite: 1,
  reject: 2,
};

export function createSituationPreview(input: string, maxChars = DEFAULT_PREVIEW_CHARS): string {
  const limit = Math.max(12, maxChars);
  const normalized = input.replace(/\s+/g, " ").trim();
  if (normalized.length <= limit) return normalized;
  return `${normalized.slice(0, limit - 3).trimEnd()}...`;
}

export function createSituationHash(input: string): string {
  let hash = 0x811c9dc5;
  const normalized = input.replace(/\s+/g, " ").trim();

  for (let index = 0; index < normalized.length; index += 1) {
    hash ^= normalized.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }

  return `fnv1a32:${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function summarizeQa(
  replyIntelligence?: ReplyQaResult | Record<string, ReplyQaResult> | null
): GenerationEvent["qaSummary"] | undefined {
  if (!replyIntelligence) return undefined;

  const variants = isReplyQaResult(replyIntelligence)
    ? [replyIntelligence]
    : Object.values(replyIntelligence).filter(isReplyQaResult);

  if (!variants.length) return undefined;

  const forbiddenTermsHit = Array.from(
    new Set(variants.flatMap((variant) => variant.forbiddenTermsHit || []))
  );
  const worstVerdict = variants.reduce<ReplyQaVerdict | undefined>((worst, variant) => {
    if (!worst) return variant.verdict;
    return VERDICT_WEIGHT[variant.verdict] > VERDICT_WEIGHT[worst] ? variant.verdict : worst;
  }, undefined);

  return {
    worstVerdict,
    minContextFit: minNumber(variants.map((variant) => variant.contextFit)),
    minSendability: minNumber(variants.map((variant) => variant.sendability)),
    forbiddenTermsHit: forbiddenTermsHit.length ? forbiddenTermsHit : undefined,
  };
}

export function createGenerationEvent(args: GenerationEventArgs): GenerationEvent {
  return {
    id: args.id || createLocalEventId(),
    createdAt: args.createdAt || new Date().toISOString(),
    source: args.source,
    locale: args.locale,
    situationPreview: createSituationPreview(args.situation),
    situationHash: createSituationHash(args.situation),
    situationLength: args.situation.length,
    selectors: args.selectors,
    detectedContext: normalizeDetectedContext(args.detectedContext),
    qaSummary: summarizeQa(args.replyIntelligence),
    feedback: args.feedback,
    privacy: {
      storesFullSituation: false,
      storesGeneratedOutput: false,
      storage: args.storage || "none",
    },
  };
}

function createLocalEventId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function isReplyQaResult(value: unknown): value is ReplyQaResult {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<ReplyQaResult>;
  return (
    (candidate.verdict === "pass" ||
      candidate.verdict === "rewrite" ||
      candidate.verdict === "reject") &&
    typeof candidate.contextFit === "number" &&
    typeof candidate.sendability === "number"
  );
}

function minNumber(values: number[]) {
  const finite = values.filter((value) => Number.isFinite(value));
  return finite.length ? Math.min(...finite) : undefined;
}

function normalizeDetectedContext(
  detectedContext?: ContextDetectionResult | GenerationEvent["detectedContext"] | null
): GenerationEvent["detectedContext"] | undefined {
  if (!detectedContext) return undefined;

  return {
    domain: detectedContext.domain,
    scenarioFamily: detectedContext.scenarioFamily,
    relationshipSuggestion: detectedContext.relationshipSuggestion,
    strategySuggestion: detectedContext.strategySuggestion,
    channelSuggestion: detectedContext.channelSuggestion,
    toneSuggestion: detectedContext.toneSuggestion,
    confidence: detectedContext.confidence,
    warnings: detectedContext.warnings,
  };
}
