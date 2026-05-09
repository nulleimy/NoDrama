import { mkdir, writeFile } from "node:fs/promises";
import { createHash as createNodeHash, randomUUID } from "node:crypto";
import path from "node:path";

const API = process.env.NODRAMA_API ?? "http://localhost:3000/api/generate";
const WRITE_REPORT = process.argv.includes("--write-report");
const REPORT_PATH = path.join("data", "runtime", "smoke-results", "latest.json");

const basePayload = {
  locale: "cs",
  appLocale: "cs",
  requestLocale: "cs",
};

const scenarios = [
  // ============================================================
  // Tone tests
  // ============================================================
  {
    section: "Tone",
    label: "Neutral",
    situation: "Potřebuji odmítnout schůzku, ale nechci působit nepříjemně.",
    toneId: "neutral",
    relationshipId: "friend",
    channelId: "messenger_1to1",
    strategyId: "soft_decline",
  },
  {
    section: "Tone",
    label: "Soft",
    situation: "Kamarádka mě zve ven, ale jsem úplně vyčerpaná a nechci ji ranit.",
    toneId: "soft",
    relationshipId: "friend",
    channelId: "messenger_1to1",
    strategyId: "soft_decline",
  },
  {
    section: "Tone",
    label: "Assertive",
    situation: "Kolega po mně opakovaně chce práci navíc a já už to nechci dělat.",
    toneId: "assertive",
    relationshipId: "peer",
    channelId: "work_chat",
    strategyId: "hard_boundary",
  },
  {
    section: "Tone",
    label: "Formal",
    situation: "Potřebuji napsat klientovi, že termín dodání musíme posunout.",
    toneId: "formal",
    relationshipId: "client",
    channelId: "email",
    strategyId: "delay",
  },
  {
    section: "Tone",
    label: "Apologetic",
    situation: "Zapomněla jsem odpovědět na důležitou zprávu a chci se omluvit.",
    toneId: "apologetic",
    relationshipId: "friend",
    channelId: "messenger_1to1",
    strategyId: "repair",
  },
  {
    section: "Tone",
    label: "Warm",
    situation: "Chci odmítnout rodinnou návštěvu, ale zároveň dát najevo, že mi na nich záleží.",
    toneId: "warm",
    relationshipId: "family",
    channelId: "messenger_1to1",
    strategyId: "soft_decline",
  },
  {
    section: "Tone",
    label: "Concise",
    situation: "Potřebuji krátce říct, že dnes nepřijdu.",
    toneId: "concise",
    relationshipId: "friend",
    channelId: "messenger_1to1",
    strategyId: "soft_decline",
  },
  {
    section: "Tone",
    label: "Light / playful",
    situation: "Chci kamarádovi říct, že dneska nedorazím, ale odlehčeně a bez dramatu.",
    toneId: "playful",
    relationshipId: "close_friend",
    channelId: "messenger_1to1",
    strategyId: "soft_decline",
  },

  // ============================================================
  // Relationship tests
  // ============================================================
  {
    section: "Who is it for?",
    label: "Authority",
    situation: "Šéf mě pozval na narozeninovou oslavu, ale nechci jít.",
    toneId: "soft",
    relationshipId: "authority",
    channelId: "work_chat",
    strategyId: "soft_decline",
    forbidden: ["termín", "deadline", "dodat", "výstup", "posunout"],
  },
  {
    section: "Who is it for?",
    label: "Peer",
    situation: "Kolega chce, abych za něj vzala směnu, ale já nemůžu.",
    toneId: "neutral",
    relationshipId: "peer",
    channelId: "work_chat",
    strategyId: "soft_decline",
  },
  {
    section: "Who is it for?",
    label: "Client / customer",
    situation: "Klient chce extra úpravy zdarma, ale to už není v domluveném rozsahu.",
    toneId: "formal",
    relationshipId: "client",
    channelId: "email",
    strategyId: "negotiate",
  },
  {
    section: "Who is it for?",
    label: "Friend / acquaintance",
    situation: "Známý mě zve na akci, ale nechci se vymlouvat ani jít.",
    toneId: "neutral",
    relationshipId: "friend",
    channelId: "messenger_1to1",
    strategyId: "soft_decline",
  },
  {
    section: "Who is it for?",
    label: "Close friend",
    situation: "Blízká kamarádka chce pomoct se stěhováním, ale já na to nemám energii.",
    toneId: "warm",
    relationshipId: "close_friend",
    channelId: "messenger_1to1",
    strategyId: "soft_decline",
  },
  {
    section: "Who is it for?",
    label: "Partner / dating",
    situation: "Někdo z datingu mě tlačí do další schůzky, ale já necítím zájem pokračovat.",
    toneId: "soft",
    relationshipId: "partner",
    channelId: "social_dm",
    strategyId: "exit",
  },
  {
    section: "Who is it for?",
    label: "Family",
    situation: "Rodina mě tlačí na návštěvu, ale já potřebuji klid a nechci se hádat.",
    toneId: "warm",
    relationshipId: "family",
    channelId: "messenger_1to1",
    strategyId: "hard_boundary",
  },
  {
    section: "Who is it for?",
    label: "Stranger / public",
    situation: "Cizí člověk mi píše nevhodnou zprávu a chci slušně ukončit komunikaci.",
    toneId: "formal",
    relationshipId: "stranger_public",
    channelId: "social_dm",
    strategyId: "exit",
  },

  // ============================================================
  // Strategy tests
  // ============================================================
  {
    section: "What do you want to do?",
    label: "Buy time",
    situation: "Nestíhám odpovědět hned a potřebuji si získat čas bez slibování konkrétního výsledku.",
    toneId: "neutral",
    relationshipId: "friend",
    channelId: "messenger_1to1",
    strategyId: "delay",
  },
  {
    section: "What do you want to do?",
    label: "Decline kindly",
    situation: "Dostala jsem pozvání na akci, ale nechci jít a chci odmítnout hezky.",
    toneId: "soft",
    relationshipId: "friend",
    channelId: "messenger_1to1",
    strategyId: "soft_decline",
  },
  {
    section: "What do you want to do?",
    label: "Set a boundary",
    situation: "Někdo po mně pořád chce laskavosti a já potřebuji jasně nastavit hranici.",
    toneId: "assertive",
    relationshipId: "friend",
    channelId: "messenger_1to1",
    strategyId: "hard_boundary",
  },
  {
    section: "What do you want to do?",
    label: "Apologize / repair",
    situation: "Napsala jsem něco ostřejšího, než jsem chtěla, a potřebuji to napravit.",
    toneId: "apologetic",
    relationshipId: "friend",
    channelId: "messenger_1to1",
    strategyId: "repair",
  },
  {
    section: "What do you want to do?",
    label: "Clarify",
    situation: "Nerozumím přesně, co po mně druhá strana chce, a potřebuji si to ujasnit.",
    toneId: "neutral",
    relationshipId: "peer",
    channelId: "work_chat",
    strategyId: "clarify",
  },
  {
    section: "What do you want to do?",
    label: "Redirect",
    situation: "Nechci řešit osobní téma a potřebuji konverzaci převést jinam.",
    toneId: "neutral",
    relationshipId: "friend",
    channelId: "messenger_1to1",
    strategyId: "redirect",
  },
  {
    section: "What do you want to do?",
    label: "Negotiate terms",
    situation: "Klient chce práci navíc, ale potřebuji domluvit cenu nebo nový termín.",
    toneId: "formal",
    relationshipId: "client",
    channelId: "email",
    strategyId: "negotiate",
  },
  {
    section: "What do you want to do?",
    label: "Exit conversation",
    situation: "Konverzace se točí dokola a chci ji slušně ukončit.",
    toneId: "neutral",
    relationshipId: "friend",
    channelId: "messenger_1to1",
    strategyId: "exit",
  },
  {
    section: "What do you want to do?",
    label: "Optional refinement",
    situation: "Odpověď už mám, ale potřebuji ji zkrátit a udělat méně tvrdou.",
    toneId: "concise",
    relationshipId: "friend",
    channelId: "messenger_1to1",
    strategyId: "clarify",
  },

  // ============================================================
  // Channel tests
  // ============================================================
  {
    section: "Channel",
    label: "Private message",
    situation: "Chci soukromě napsat kamarádovi, že dnes nedorazím.",
    toneId: "neutral",
    relationshipId: "friend",
    channelId: "messenger_1to1",
    strategyId: "soft_decline",
  },
  {
    section: "Channel",
    label: "Group chat",
    situation: "Ve skupinovém chatu potřebuji napsat, že se akce nezúčastním.",
    toneId: "neutral",
    relationshipId: "friend",
    channelId: "group_chat",
    strategyId: "soft_decline",
  },
  {
    section: "Channel",
    label: "Email",
    situation: "Potřebuji formálně e-mailem požádat o prodloužení termínu.",
    toneId: "formal",
    relationshipId: "authority",
    channelId: "email",
    strategyId: "delay",
  },
  {
    section: "Channel",
    label: "Work chat",
    situation: "V pracovním chatu chci napsat, že úkol dokončím později než bylo plánováno.",
    toneId: "neutral",
    relationshipId: "peer",
    channelId: "work_chat",
    strategyId: "delay",
  },
  {
    section: "Channel",
    label: "Professional DM",
    situation: "Na LinkedIn mi někdo nabízí spolupráci, ale nechci pokračovat.",
    toneId: "formal",
    relationshipId: "stranger_public",
    channelId: "professional_dm",
    strategyId: "exit",
  },
  {
    section: "Channel",
    label: "Social DM",
    situation: "Na Instagramu mi někdo píše moc osobně a chci slušně ubrzdit konverzaci.",
    toneId: "soft",
    relationshipId: "stranger_public",
    channelId: "social_dm",
    strategyId: "hard_boundary",
  },
  {
    section: "Channel",
    label: "Phone / voice",
    situation: "Potřebuji si připravit krátkou větu, jak po telefonu odmítnout nabídku.",
    toneId: "concise",
    relationshipId: "stranger_public",
    channelId: "voice_call",
    strategyId: "soft_decline",
  },
  {
    section: "Channel",
    label: "Face to face",
    situation: "Potřebuji vědět, jak osobně říct, že se nechci účastnit oslavy.",
    toneId: "soft",
    relationshipId: "friend",
    channelId: "face_to_face",
    strategyId: "soft_decline",
  },

  // ============================================================
  // Core regression tests
  // ============================================================
  {
    section: "Regression",
    label: "Work social invitation guard",
    situation: "Šéf mě pozval na narozeninovou oslavu, ale nechci jít.",
    toneId: "soft",
    relationshipId: "authority",
    channelId: "work_chat",
    strategyId: "soft_decline",
    forbidden: ["termín", "deadline", "dodat", "výstup", "posunout"],
  },
  {
    section: "Regression",
    label: "School deadline extension",
    situation: "Nestíhám odevzdat slohovou práci, už jsem měla odklad a potřebuju dalších pět dní.",
    toneId: "formal",
    relationshipId: "authority",
    channelId: "email",
    strategyId: "delay",
  },
  {
    section: "Regression",
    label: "Money refuse loan",
    situation: "Kamarád si chce půjčit peníze a já nechci.",
    toneId: "assertive",
    relationshipId: "friend",
    channelId: "messenger_1to1",
    strategyId: "hard_boundary",
    forbidden: ["pozvání", "oslava", "přidám", "mysleli"],
  },
  {
    section: "Regression",
    label: "Client scope creep",
    situation: "Klient chce extra úpravy zdarma, ale to už není v domluveném rozsahu.",
    toneId: "formal",
    relationshipId: "client",
    channelId: "email",
    strategyId: "negotiate",
  },
];

function collectOutputText(output) {
  if (!output || typeof output !== "object") return "";
  return Object.values(output).filter(Boolean).join(" ");
}

function findForbiddenHits(text, forbidden = []) {
  const normalized = text.toLowerCase();
  return forbidden.filter((term) => normalized.includes(term.toLowerCase()));
}

function createPreview(input, maxChars = 80) {
  const normalized = String(input || "").replace(/\s+/g, " ").trim();
  if (normalized.length <= maxChars) return normalized;
  return `${normalized.slice(0, maxChars - 3).trimEnd()}...`;
}

function createHash(input) {
  return `sha256:${createNodeHash("sha256").update(String(input || "")).digest("hex")}`;
}

function summarizeQa(qa) {
  if (!qa || typeof qa !== "object") return undefined;

  const variants = Object.values(qa).filter(Boolean);
  if (!variants.length) return undefined;

  const verdictRank = { pass: 0, rewrite: 1, reject: 2 };
  const worstVerdict = variants.reduce((worst, variant) => {
    if (!variant?.verdict) return worst;
    if (!worst) return variant.verdict;
    return verdictRank[variant.verdict] > verdictRank[worst] ? variant.verdict : worst;
  }, undefined);
  const minContextFit = minFinite(variants.map((variant) => variant.contextFit));
  const minSendability = minFinite(variants.map((variant) => variant.sendability));
  const forbiddenTermsHit = Array.from(
    new Set(variants.flatMap((variant) => variant.forbiddenTermsHit || []))
  );

  return {
    worstVerdict,
    minContextFit,
    minSendability,
    forbiddenTermsHit: forbiddenTermsHit.length ? forbiddenTermsHit : undefined,
  };
}

function minFinite(values) {
  const finite = values.filter((value) => Number.isFinite(value));
  return finite.length ? Math.min(...finite) : undefined;
}

async function runScenario(scenario, index) {
  const payload = {
    ...basePayload,
    situation: scenario.situation,
    toneId: scenario.toneId,
    relationshipId: scenario.relationshipId,
    channelId: scenario.channelId,
    strategyId: scenario.strategyId,
  };

  const response = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const raw = await response.text();

  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error(`Invalid JSON response: ${raw.slice(0, 300)}`);
  }

  const outputText = collectOutputText(data.output);
  const forbiddenHits = findForbiddenHits(outputText, scenario.forbidden);

  const detected = data?.meta?.replyIntelligence?.detectedContext ?? null;
  const qa = data?.meta?.replyIntelligence?.qaByVariant ?? null;

  const qaVerdicts = qa
    ? Object.entries(qa).map(([key, value]) => `${key}:${value.verdict}`).join(", ")
    : "n/a";

  const ok = Boolean(data.ok) && forbiddenHits.length === 0;
  const qaSummary = summarizeQa(qa);
  const verdict = ok ? (qaSummary?.worstVerdict === "rewrite" ? "review" : "pass") : "fail";
  const reasons = qa
    ? Array.from(new Set(Object.values(qa).flatMap((value) => value?.reasons || [])))
    : [];

  console.log("");
  console.log("============================================================");
  console.log(`#${String(index + 1).padStart(2, "0")} ${scenario.section} / ${scenario.label}`);
  console.log("============================================================");
  console.log(`INPUT PREVIEW: ${createPreview(scenario.situation)}`);
  console.log(`INPUT HASH: ${createHash(scenario.situation)}`);
  console.log(`SELECTORS: tone=${scenario.toneId} relationship=${scenario.relationshipId} channel=${scenario.channelId} strategy=${scenario.strategyId}`);
  console.log(`HTTP: ${response.status}`);
  console.log(`OK: ${ok ? "PASS" : "FAIL"}`);
  console.log(`VERDICT: ${verdict.toUpperCase()}`);

  if (detected) {
    console.log(
      `DETECTED: domain=${detected.domain} scenario=${detected.scenarioFamily} relation=${detected.relationshipSuggestion} strategy=${detected.strategySuggestion} channel=${detected.channelSuggestion} confidence=${detected.confidence}`
    );
    if (detected.warnings?.length) {
      console.log(`WARNINGS: ${detected.warnings.join(", ")}`);
    }
  }

  console.log(`QA: ${qaVerdicts}`);

  if (forbiddenHits.length) {
    console.log(`FORBIDDEN HITS: ${forbiddenHits.join(", ")}`);
  }

  if (data.output) {
    console.log("OUTPUT PREVIEW.shortReply:", createPreview(data.output.shortReply));
    console.log("OUTPUT PREVIEW.naturalReply:", createPreview(data.output.naturalReply));
  } else {
    console.log("RAW:", raw.slice(0, 800));
  }

  return {
    ok,
    verdict,
    section: scenario.section,
    label: scenario.label,
    inputPreview: createPreview(scenario.situation),
    inputHash: createHash(scenario.situation),
    selectors: {
      toneId: scenario.toneId,
      relationshipId: scenario.relationshipId,
      channelId: scenario.channelId,
      strategyId: scenario.strategyId,
    },
    forbiddenHits,
    detected,
    qaSummary,
    reasons,
    requiredTermMisses: [],
  };
}

async function main() {
  console.log(`NoDrama CLI scenario smoke test`);
  console.log(`API: ${API}`);
  console.log(`TOTAL: ${scenarios.length}`);

  const runId = randomUUID();
  const createdAt = new Date().toISOString();
  const results = [];

  for (let i = 0; i < scenarios.length; i += 1) {
    try {
      results.push(await runScenario(scenarios[i], i));
    } catch (error) {
      console.log("");
      console.log("============================================================");
      console.log(`#${String(i + 1).padStart(2, "0")} ${scenarios[i].section} / ${scenarios[i].label}`);
      console.log("============================================================");
      console.log("OK: FAIL");
      console.log(`ERROR: ${error.message}`);
      results.push({
        ok: false,
        verdict: "fail",
        section: scenarios[i].section,
        label: scenarios[i].label,
        inputPreview: createPreview(scenarios[i].situation),
        inputHash: createHash(scenarios[i].situation),
        selectors: {
          toneId: scenarios[i].toneId,
          relationshipId: scenarios[i].relationshipId,
          channelId: scenarios[i].channelId,
          strategyId: scenarios[i].strategyId,
        },
        error: error.message,
        reasons: [error.message],
        forbiddenHits: [],
        requiredTermMisses: [],
      });
    }
  }

  const failed = results.filter((result) => !result.ok);
  const review = results.filter((result) => result.verdict === "review");
  const passed = results.filter((result) => result.verdict === "pass");
  const report = {
    runId,
    createdAt,
    apiBaseUrl: API,
    privacy: {
      storesFullSituation: false,
      storesGeneratedOutput: false,
      storage: "file",
    },
    totals: {
      total: results.length,
      pass: passed.length,
      fail: failed.length,
      review: review.length,
    },
    cases: results.map((result) => ({
      section: result.section,
      label: result.label,
      inputPreview: result.inputPreview,
      inputHash: result.inputHash,
      selectors: result.selectors,
      detectedContext: result.detected,
      qaSummary: result.qaSummary,
      verdict: result.verdict,
      reasons: result.reasons,
      forbiddenHits: result.forbiddenHits,
      requiredTermMisses: result.requiredTermMisses,
      error: result.error,
    })),
  };

  console.log("");
  console.log("============================================================");
  console.log("SUMMARY");
  console.log("============================================================");
  console.log(`PASS: ${passed.length}`);
  console.log(`FAIL: ${failed.length}`);
  console.log(`REVIEW: ${review.length}`);

  if (WRITE_REPORT) {
    await mkdir(path.dirname(REPORT_PATH), { recursive: true });
    await writeFile(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");
    console.log(`REPORT: ${REPORT_PATH}`);
  }

  if (failed.length) {
    console.log("");
    console.log("FAILED CASES:");
    for (const result of failed) {
      console.log(`- ${result.section} / ${result.label}`);
      if (result.error) console.log(`  error: ${result.error}`);
      if (result.forbiddenHits?.length) console.log(`  forbidden: ${result.forbiddenHits.join(", ")}`);
    }
    process.exitCode = 1;
  }
}

main();
