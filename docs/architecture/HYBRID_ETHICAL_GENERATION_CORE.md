# Hybrid Ethical Generation Core R1

## Purpose

NoDrama keeps its deterministic phrase engine as the safety baseline and optional fallback, while adding an opt-in LLM generation layer for more natural handling of nuanced situations.

The hybrid layer must improve language quality without weakening NoDrama's existing anti-deception, scenario-routing, abuse-control, credit, and Reply Intelligence boundaries.

## Runtime flow

```text
validated GenerateRequest
        |
        v
existing deterministic phrase engine
(context + selectors + safe fallback + Reply Intelligence metadata)
        |
        +---- NODRAMA_GENERATION_MODE != hybrid ----> deterministic response
        |
        v
OpenAI Responses API (structured four-variant output, store=false)
        |
        v
existing Reply Intelligence QA
        |
        +---- provider/config/network/parse failure ----> deterministic fallback
        |
        +---- any QA reject ---------------------------> deterministic fallback
        |
        v
hybrid response
```

## Production-safe defaults

The default is deterministic generation:

```env
NODRAMA_GENERATION_MODE=phrase
```

Hybrid generation is activated only by an explicit server-side configuration:

```env
NODRAMA_GENERATION_MODE=hybrid
OPENAI_API_KEY=...
NODRAMA_OPENAI_MODEL=gpt-5.6
NODRAMA_OPENAI_TIMEOUT_MS=12000
```

`OPENAI_API_KEY` is server-side only and must never be exposed through a `NEXT_PUBLIC_*` variable or committed to the repository.

## Privacy boundary

Hybrid mode sends the user's situation plus a compact deterministic context to the configured external model provider. This is why hybrid mode is opt-in rather than the default.

The provider request sets `store: false`. NoDrama does not intentionally log the prompt, provider raw response, generated variants, or API key from the hybrid adapter. Runtime metadata may expose non-content operational fields such as provider model, response ID, fallback state, and failure class.

Application operators remain responsible for provider account data controls, retention configuration, regional requirements, privacy disclosures, and legal review before public commercial launch.

## Ethical generation contract

The provider instructions require:

- no invented illness, emergency, accident, death, appointment, evidence, credential, promise, or third-party blame;
- no impersonation or forged/official claims;
- no coercion, threats, guilt-tripping, blackmail, or manipulation;
- preservation of uncertainty instead of fabricated explanations;
- truthful redirection when the user asks for a fake excuse;
- respect for selected relationship, channel, strategy, tone, and detected scenario.

Provider output is not trusted by itself. Every generated variant is passed back through the existing deterministic `runReplyQa()` boundary.

## Fallback policy

The entire response falls back to the deterministic phrase engine when:

- hybrid mode is requested but provider configuration is missing;
- the provider request times out or fails at network/HTTP level;
- the provider response is not valid structured output;
- the response cannot be parsed into all four required variants;
- any generated variant receives a Reply Intelligence `reject` verdict.

A `rewrite` verdict may be processed by the existing deterministic `applyQaRewrite()` function before returning the hybrid response.

## Non-goals for R1

R1 does not:

- enable hybrid mode by default;
- remove or weaken the phrase engine;
- bypass rate limits, credits, abuse controls, or request validation;
- add prompt/history persistence;
- claim browser E2E, provider production readiness, or global release readiness;
- change billing or release/deploy workflow.

## Verification

`npm run verify` must execute `scripts/verify-hybrid-ethical-generation-core.mjs` and then complete the existing lint and production build gates.

A later runtime E2E slice must test hybrid mode with a dedicated non-production provider key and representative CS/EN scenarios. R1 deliberately keeps CI network-independent and does not require a real provider secret.
