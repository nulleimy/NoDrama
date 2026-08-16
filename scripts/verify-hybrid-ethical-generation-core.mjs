import { readFileSync } from "node:fs";

const files = {
  env: readFileSync(".env.example", "utf8"),
  route: readFileSync("app/api/generate/route.ts", "utf8"),
  mode: readFileSync("lib/ai/generationMode.ts", "utf8"),
  provider: readFileSync("lib/ai/openaiResponsesProvider.ts", "utf8"),
  hybrid: readFileSync("lib/ai/hybridGeneration.ts", "utf8"),
};

const checks = [
  [
    "deterministic generation remains the default",
    /NODRAMA_GENERATION_MODE=phrase/.test(files.env) &&
      /NODRAMA_GENERATION_MODE\s*\?\?\s*"phrase"/.test(files.mode),
  ],
  [
    "OpenAI secret is server-side placeholder only",
    /^OPENAI_API_KEY=$/m.test(files.env) &&
      !/^NEXT_PUBLIC_OPENAI_API_KEY=/m.test(files.env),
  ],
  [
    "generate route uses hybrid orchestrator",
    files.route.includes("generateHybridEthicalReply") &&
      files.route.includes("await generateHybridEthicalReply"),
  ],
  [
    "hybrid orchestration preserves deterministic fallback",
    files.hybrid.includes("generatePhraseEngineReply") &&
      files.hybrid.includes("withFallbackMeta"),
  ],
  [
    "provider output is re-checked by Reply Intelligence QA",
    files.hybrid.includes("runReplyQa") &&
      files.hybrid.includes('qa.verdict === "reject"'),
  ],
  [
    "provider request disables response storage",
    files.provider.includes("store: false"),
  ],
  [
    "provider uses Responses API",
    files.provider.includes("https://api.openai.com/v1/responses"),
  ],
  [
    "provider uses strict structured four-variant output",
    files.provider.includes('type: "json_schema"') &&
      files.provider.includes("strict: true") &&
      files.provider.includes('"shortReply"') &&
      files.provider.includes('"naturalReply"') &&
      files.provider.includes('"strongReply"') &&
      files.provider.includes('"followUpReply"'),
  ],
  [
    "ethical prompt forbids invented facts and manipulation",
    files.provider.includes("Never invent illness") &&
      files.provider.includes("Never impersonate") &&
      files.provider.includes("Do not pressure, threaten, guilt-trip"),
  ],
  [
    "provider failure metadata does not include prompt or output bodies",
    !files.hybrid.includes("providerPrompt") &&
      !files.hybrid.includes("providerRawResponse"),
  ],
];

let failed = 0;

for (const [name, ok] of checks) {
  if (ok) {
    console.log(`OK: ${name}`);
  } else {
    failed += 1;
    console.error(`ERROR: ${name}`);
  }
}

if (failed > 0) {
  console.error(`Hybrid Ethical Generation Core verification failed: ${failed} check(s).`);
  process.exit(1);
}

console.log("OK: Hybrid Ethical Generation Core R1 verified");
