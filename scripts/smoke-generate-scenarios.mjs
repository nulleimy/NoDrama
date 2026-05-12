#!/usr/bin/env node
import { createHash, randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const baseUrl = process.env.NODRAMA_SMOKE_BASE_URL ?? "http://localhost:3000";
const writeReport = process.argv.includes("--write-report");
const url = new URL("/api/generate", baseUrl);

const scenarios = [
  {
    id: "work_social_invitation",
    situation: "šéf mě pozval na narozeninovou oslavu ale nechci jít",
    selectors: {
      relationshipId: "authority",
      strategyId: "soft_decline",
      channelId: "work_chat",
      toneId: "soft",
    },
    expectDetected: ["work_social_invitation", "authority_social_decline"],
    requiredAny: ["pozvani", "pozvání", "oslavu", "oslava", "nepujdu", "nepůjdu", "vynecham", "vynechám"],
    forbidden: ["termín", "termin", "deadline", "dodat", "výstup", "vystup", "posunout"],
  },
  {
    id: "school_deadline_extension",
    situation:
      "nestíhám odevzdat slohovou práci, už jsem měla odklad a potřebuju dalších pět dní",
    selectors: {
      relationshipId: "authority",
      strategyId: "delay",
      channelId: "email",
      toneId: "apologetic",
    },
    expectDetected: ["school_deadline_extension", "work_deadline_delay"],
    requiredAny: ["odklad", "prodlouzeni", "prodloužení", "posunout", "termín", "termin", "čas", "cas"],
    forbidden: ["pozvani", "pozvání", "oslava", "pridam se", "přidám se"],
  },
  {
    id: "money_refuse_loan",
    situation: "kamarád si chce půjčit peníze a já nechci",
    selectors: {
      relationshipId: "friend",
      strategyId: "hard_boundary",
      channelId: "messenger_1to1",
      toneId: "assertive",
    },
    expectDetected: ["money_refuse_loan"],
    requiredAny: ["penize", "peníze", "pujcit", "půjčit", "pujcovat", "půjčovat", "nepujcim", "nepůjčím"],
    forbidden: ["pozvani", "pozvání", "oslava", "pridam se", "přidám se", "jste na me mysleli", "jste na mě mysleli"],
  },
  {
    id: "client_scope_negotiation",
    situation: "klient chce extra úpravy zdarma, ale to už není v domluveném rozsahu",
    selectors: {
      relationshipId: "client",
      strategyId: "negotiate_terms",
      channelId: "email",
      toneId: "formal",
    },
    expectDetected: ["client_scope_negotiation"],
    requiredAny: ["rozsah", "cena", "rozpocet", "rozpočet", "termín", "termin", "podmink", "podmínk"],
    forbidden: ["pozvani", "pozvání", "oslava", "vymluvu", "výmluvu"],
  },
  {
    id: "family_pressure_boundary",
    situation: "rodina mě tlačí na návštěvu, ale já potřebuji klid a nechci se hádat",
    selectors: {
      relationshipId: "family",
      strategyId: "hard_boundary",
      channelId: "private_message",
      toneId: "warm",
    },
    expectDetected: ["family_pressure_boundary"],
    requiredAny: ["neprijedu", "nepřijedu", "klid", "hranici", "rozhodnuti", "rozhodnutí", "nechci"],
    forbidden: ["vyhrozuju", "vyhrožuji", "ultimátum", "uz vas nechci videt", "už vás nechci vidět"],
  },
  {
    id: "dating_decline",
    situation: "někdo z datingu mě tlačí do další schůzky, ale já nechci pokračovat",
    selectors: {
      relationshipId: "dating",
      strategyId: "soft_decline",
      channelId: "social_dm",
      toneId: "warm",
    },
    expectEquivalent: ({ detected, contentDepth }) =>
      detected?.domain === "social" ||
      contentDepth?.scenarioCategory === "dating_clarity" ||
      contentDepth?.selectorMixing?.inferredDomain === "dating",
    requiredAny: ["nechci pokracovat", "nechci pokračovat", "setkavani", "setkávání", "schuzk", "schůzk", "dating"],
    forbidden: ["mozna nekdy", "možná někdy", "uvidime", "uvidíme"],
  },
  {
    id: "stranger_inappropriate_dm",
    situation: "cizí člověk mi píše nevhodnou zprávu a chci slušně ukončit komunikaci",
    selectors: {
      relationshipId: "stranger",
      strategyId: "exit_conversation",
      channelId: "social_dm",
      toneId: "assertive",
    },
    expectEquivalent: ({ detected, contentDepth }) =>
      detected?.domain === "social" ||
      detected?.domain === "public" ||
      contentDepth?.selectorMixing?.selectors?.relationship?.id === "stranger_public",
    requiredAny: ["ukoncuji", "ukončuji", "nebudu pokracovat", "nebudu pokračovat", "nepiste", "nepište"],
    forbidden: ["rad se pobavim", "rád se pobavím", "napis mi vic", "napiš mi víc", "muzeme to probrat", "můžeme to probrat"],
  },
  {
    id: "group_chat_decline",
    situation: "ve skupinovém chatu potřebuji napsat, že na akci nepřijdu",
    selectors: {
      relationshipId: "peer",
      strategyId: "decline_kindly",
      channelId: "group_chat",
      toneId: "concise",
    },
    expectDetected: ["social_invitation_decline", "general"],
    requiredAny: ["neprijdu", "nepřijdu", "nepujdu", "nepůjdu", "nedam", "nedám", "vynecham", "vynechám"],
    maxShortReplyLength: 120,
    forbidden: ["deadline", "termín", "termin", "dodat", "výstup", "vystup"],
  },
];

const results = [];
let failureCount = 0;

for (const scenario of scenarios) {
  const payload = {
    situation: scenario.situation,
    locale: "cs",
    appLocale: "cs",
    requestLocale: "cs",
    ...scenario.selectors,
  };
  const result = await runScenario(scenario, payload);
  results.push(result.report);

  if (result.errors.length > 0) {
    failureCount += 1;
    console.error(`FAIL ${scenario.id}`);
    for (const error of result.errors) console.error(`  - ${error}`);
  } else {
    console.log(`PASS ${scenario.id}`);
  }
}

if (writeReport) {
  await writeSmokeReport(results);
}

if (failureCount > 0) {
  throw new Error(`${failureCount} runtime smoke scenario(s) failed for ${url}`);
}

console.log(`Runtime generate smoke matrix passed for ${url}`);

async function runScenario(scenario, payload) {
  const errors = [];
  let response;
  let body = null;

  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    body = await response.json().catch(() => null);
  } catch (error) {
    errors.push(`Request failed: ${error.message}`);
  }

  if (response && !response.ok) {
    errors.push(`Expected HTTP 2xx, received ${response.status}`);
  }

  if (body?.ok !== true) {
    errors.push("Expected response body with ok=true");
  }

  for (const key of ["shortReply", "naturalReply", "strongReply", "followUpReply"]) {
    if (typeof body?.output?.[key] !== "string" || body.output[key].trim() === "") {
      errors.push(`Expected output.${key} to be a non-empty string`);
    }
  }

  const outputText = stringifyOutput(body?.output);
  const detected = body?.meta?.replyIntelligence?.detectedContext;
  const contentDepth = body?.meta?.contentDepth;
  const forbiddenHits = findHits(outputText, scenario.forbidden || []);
  const requiredHits = findHits(outputText, scenario.requiredAny || []);

  if (!body?.meta?.replyIntelligence) {
    errors.push("Expected meta.replyIntelligence");
  }

  if (!detected) {
    errors.push("Expected meta.replyIntelligence.detectedContext");
  }

  if (scenario.expectDetected?.length && detected) {
    const detectedOk = scenario.expectDetected.includes(detected.scenarioFamily);
    if (!detectedOk) {
      errors.push(
        `Expected detected scenario ${scenario.expectDetected.join(" or ")}, received ${detected.scenarioFamily}`
      );
    }
  }

  if (scenario.expectEquivalent && !scenario.expectEquivalent({ detected, contentDepth })) {
    errors.push("Expected detected context or content-depth metadata to match scenario equivalent");
  }

  if ((scenario.requiredAny || []).length > 0 && requiredHits.length === 0) {
    errors.push(`Expected output to include one of: ${scenario.requiredAny.join(", ")}`);
  }

  if (forbiddenHits.length > 0) {
    errors.push(`Forbidden vocabulary leaked: ${forbiddenHits.join(", ")}`);
  }

  if (
    scenario.maxShortReplyLength &&
    typeof body?.output?.shortReply === "string" &&
    body.output.shortReply.length > scenario.maxShortReplyLength
  ) {
    errors.push(
      `Expected shortReply length <= ${scenario.maxShortReplyLength}, received ${body.output.shortReply.length}`
    );
  }

  return {
    errors,
    report: {
      id: scenario.id,
      inputPreview: preview(payload.situation),
      inputHash: hashInput(payload.situation),
      ok: body?.ok === true,
      httpStatus: response?.status ?? null,
      detected: detected
        ? {
            scenarioFamily: detected.scenarioFamily,
            domain: detected.domain,
            confidence: detected.confidence,
          }
        : null,
      forbiddenHits,
      pass: errors.length === 0,
    },
  };
}

async function writeSmokeReport(results) {
  const repoRoot = path.dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
  const reportDir = path.join(repoRoot, "data", "runtime", "smoke-results");
  const reportPath = path.join(reportDir, "latest.json");
  const report = {
    runId: randomUUID(),
    createdAt: new Date().toISOString(),
    baseUrl,
    total: results.length,
    pass: results.filter((result) => result.pass).length,
    fail: results.filter((result) => !result.pass).length,
    scenarios: results,
  };

  await mkdir(reportDir, { recursive: true });
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log(`Wrote metadata-only smoke report to ${reportPath}`);
}

function stringifyOutput(output) {
  if (!output || typeof output !== "object") return "";
  return Object.values(output).filter((value) => typeof value === "string").join("\n");
}

function findHits(text, terms) {
  const normalized = normalizeText(text);
  return terms.filter((term) => normalized.includes(normalizeText(term)));
}

function normalizeText(text) {
  return String(text)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "");
}

function preview(text) {
  const normalized = text.replace(/\s+/g, " ").trim();
  return normalized.length > 72 ? `${normalized.slice(0, 69)}...` : normalized;
}

function hashInput(text) {
  return createHash("sha256").update(text).digest("hex");
}
