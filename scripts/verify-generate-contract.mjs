import assert from "node:assert/strict";

const { generateRequestSchema } = await import("../lib/generateContract.ts");

function parseValid(name, payload) {
  const parsed = generateRequestSchema.safeParse(payload);

  if (!parsed.success) {
    console.error(parsed.error.flatten());
  }

  assert.equal(parsed.success, true, `${name} should validate`);
  return parsed.data;
}

function parseInvalid(name, payload) {
  const parsed = generateRequestSchema.safeParse(payload);
  assert.equal(parsed.success, false, `${name} should be rejected`);
}

const modern = parseValid("modern ID-only payload", {
  situation: "Nestíhám dodat výstup šéfovi na Slacku.",
  toneId: "formal",
  relationshipId: "authority",
  channelId: "work_chat",
  strategyId: "delay",
});

assert.equal(modern.tone, "Formální");
assert.equal(modern.relationship, "Práce");
assert.equal(modern.channel, "Slack");
assert.equal(modern.toneId, "formal");
assert.equal(modern.relationshipId, "authority");
assert.equal(modern.channelId, "work_chat");
assert.equal(modern.strategyId, "delay");

const legacy = parseValid("legacy-only payload", {
  situation: "Nestíhám dodat výstup šéfovi na Slacku.",
  tone: "Formální",
  relationship: "Práce",
  channel: "Slack",
});

assert.equal(legacy.tone, "Formální");
assert.equal(legacy.relationship, "Práce");
assert.equal(legacy.channel, "Slack");
assert.equal(legacy.toneId, undefined);

const mixed = parseValid("mixed payload", {
  situation: "Nestíhám dodat výstup šéfovi na Slacku.",
  tone: "Milý",
  relationshipId: "authority",
  channel: "Slack",
  strategyId: "delay",
});

assert.equal(mixed.tone, "Milý");
assert.equal(mixed.relationship, "Práce");
assert.equal(mixed.channel, "Slack");
assert.equal(mixed.relationshipId, "authority");

parseInvalid("invalid tone ID", {
  situation: "Nestíhám dodat výstup šéfovi na Slacku.",
  toneId: "bossy",
  relationshipId: "authority",
  channelId: "work_chat",
});

parseInvalid("invalid relationship ID", {
  situation: "Nestíhám dodat výstup šéfovi na Slacku.",
  toneId: "formal",
  relationshipId: "manager",
  channelId: "work_chat",
});

parseInvalid("missing tone selector", {
  situation: "Nestíhám dodat výstup šéfovi na Slacku.",
  relationshipId: "authority",
  channelId: "work_chat",
});

parseInvalid("invalid strategy ID", {
  situation: "Nestíhám dodat výstup šéfovi na Slacku.",
  toneId: "formal",
  relationshipId: "authority",
  channelId: "work_chat",
  strategyId: "stall",
});

console.log("✅ Generate contract verified");
