#!/usr/bin/env node
import assert from "node:assert/strict";

const baseUrl = process.env.NODRAMA_SMOKE_BASE_URL ?? "http://localhost:3000";
const url = new URL("/api/generate", baseUrl);

const response = await fetch(url, {
  method: "POST",
  headers: {
    "content-type": "application/json",
  },
  body: JSON.stringify({
    situation: "Smoke test only.",
    toneId: "neutral",
    relationshipId: "peer",
    channelId: "work_chat",
    strategyId: "clarify",
    locale: "en",
  }),
});

const body = await response.json().catch(() => null);

assert.ok(response.ok, `Expected 2xx from ${url}; received ${response.status}`);
assert.equal(body?.ok, true, "Expected generate response envelope with ok=true");
assert.equal(typeof body?.output?.shortReply, "string", "Expected shortReply output");
assert.equal(typeof body?.output?.naturalReply, "string", "Expected naturalReply output");
assert.equal(typeof body?.output?.strongReply, "string", "Expected strongReply output");
assert.equal(typeof body?.output?.followUpReply, "string", "Expected followUpReply output");

console.log(`Generate smoke check passed for ${url}`);
