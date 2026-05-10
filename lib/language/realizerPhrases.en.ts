import type { RealizerFamily, RealizerSlot } from "./realizerPhrases.cs";

export type EnglishRealizerSlots = Record<RealizerSlot, string[]>;

type EnglishPhraseInput = {
  family: RealizerFamily;
  toneId: string;
  channelId: string;
  formal: boolean;
};

export function getEnglishRealizerSlots(input: EnglishPhraseInput): EnglishRealizerSlots {
  const base = slotsByFamily(input.family, input.formal);

  return {
    opener: decorateOpeners(base.opener, input),
    reason: base.reason,
    boundary: decorateBoundaries(base.boundary, input),
    softener: decorateSofteners(base.softener, input),
    nextStep: decorateNextSteps(base.nextStep, input),
    closing: decorateClosings(base.closing, input),
    pressureFollowUp: base.pressureFollowUp,
  };
}

function slotsByFamily(family: RealizerFamily, formal: boolean): EnglishRealizerSlots {
  if (family === "repair") {
    return {
      opener: formal ? ["I’m sorry.", "Thank you for flagging this."] : ["I’m sorry.", "You’re right to call this out."],
      reason: [
        "I don’t want to talk around it or bury the point in explanations.",
        "The useful thing now is to name it clearly and repair it with a concrete next step.",
      ],
      boundary: [
        "This is on my side.",
        "I’m taking responsibility for it.",
        "I need to repair the impact rather than add more tension.",
      ],
      softener: ["Thank you for your patience.", "I appreciate you keeping this direct."],
      nextStep: [
        "I’ll send a clear next step.",
        "I’ll set a realistic path forward and stick to it.",
      ],
      closing: formal ? ["Thank you for understanding."] : ["Thanks."],
      pressureFollowUp: [
        "I understand you want more detail, but I don’t want to hide behind explanations. The important part now is the fix.",
        "I hear you. I don’t want to over-explain it; I want to own the tone and do better.",
      ],
    };
  }

  if (family === "delay" || family === "work") {
    return {
      opener: formal ? ["Thank you for your message.", "Hi,"] : ["Thanks for the message.", "Quick update:"],
      reason: [
        "I don’t want to confirm timing that would not be realistic.",
        "To avoid sending something half-finished, I need to reset the expectation.",
      ],
      boundary: [
        "I need to move this.",
        "I can’t promise the original timing now.",
        "I’m not going to confirm an unrealistic deadline.",
      ],
      softener: ["I understand this may affect the plan.", "Thank you for understanding."],
      nextStep: [
        "I’ll send a realistic next timing.",
        "I’ll confirm what is done and when the next step will land.",
      ],
      closing: formal ? ["Thank you for understanding."] : ["I’ll update you soon."],
      pressureFollowUp: [
        "I understand the urgency, but I don’t want to give an inaccurate promise. I’ll confirm a timing I can actually meet.",
        "I know this is time-sensitive, but I don’t want to promise something that would slip again. I’ll send a realistic timing.",
      ],
    };
  }

  if (family === "negotiate") {
    return {
      opener: formal ? ["I understand the request.", "Thank you for the context."] : ["I get what’s needed.", "I understand what you’re asking for."],
      reason: [
        "In this scope, it would not be a realistic commitment.",
        "For this to work, one of the terms needs to change.",
      ],
      boundary: [
        "I can’t confirm it under the current terms.",
        "I can move forward if we adjust the scope, timing, or priority.",
        "Without a scope change, it would set the wrong expectation.",
      ],
      softener: [
        "I want the result to stay useful.",
        "I’m not trying to block progress; I want to make it realistic.",
      ],
      nextStep: [
        "I suggest we confirm the priority first and adjust the brief from there.",
        "Let’s choose what matters most right now.",
      ],
      closing: formal ? ["Thank you."] : ["Then I can commit clearly."],
      pressureFollowUp: [
        "I understand you want an answer now, but without confirmed scope I’d be promising something unrealistic.",
        "I get that you want a quick yes, but I need the scope or timing adjusted before I can commit.",
      ],
    };
  }

  if (family === "money_refuse_loan") {
    return {
      opener: formal ? ["I understand the request.", "Thank you for being direct about this."] : ["I get why you’re asking.", "I understand this is difficult."],
      reason: [
        "I don’t want to mix lending money into our relationship.",
        "I need to keep a clear boundary around money right now.",
      ],
      boundary: [
        "I’m not going to lend money right now.",
        "I can’t promise a loan.",
        "My answer on this is no.",
      ],
      softener: [
        "I don’t want this to create tension between us.",
        "I’m saying it directly so there is no false expectation.",
      ],
      nextStep: [
        "I’m going to leave it there.",
        "Please take this as a clear answer.",
      ],
      closing: formal ? ["Thank you for understanding."] : ["Thanks for understanding."],
      pressureFollowUp: [
        "I understand this is uncomfortable, but I’m not going to lend money. I don’t want to keep reopening it.",
        "I get that you wanted a different answer, but I’m not lending money. I don’t want this to complicate things between us.",
      ],
    };
  }

  if (family === "clarify") {
    return {
      opener: formal ? ["Before I answer,", "To answer accurately,"] : ["Before I answer,", "I want to clarify this first."],
      reason: [
        "I don’t want to respond to an assumption.",
        "I need to understand exactly what you need from me right now.",
      ],
      boundary: [
        "I can’t agree without a clear expectation.",
        "I need the request to be specific first.",
        "I don’t want to say yes to something unclear.",
      ],
      softener: ["A short clarification is enough.", "A specific answer would help."],
      nextStep: [
        formal
          ? "Could you confirm the exact expectation?"
          : "Can you be a bit more specific about what you need from me?",
        "Please clarify the concrete ask.",
      ],
      closing: ["Thanks."],
      pressureFollowUp: [
        "I understand, but I don’t want to respond to an assumption. I need the request to be clear first.",
        "I hear you, but I don’t want to guess what you mean. Please make the ask specific first.",
      ],
    };
  }

  if (family === "redirect" || family === "exit") {
    return {
      opener: formal ? ["I understand.", "Noted."] : ["I get it.", "I’m going to pause here."],
      reason: [
        "This conversation is not helping us resolve it constructively.",
        "I don’t want to add more tension or handle this in the wrong channel.",
      ],
      boundary: [
        "I’m not continuing this here.",
        "I’m going to end this conversation now.",
        "I don’t want to keep handling this in this channel.",
      ],
      softener: ["Let’s keep this practical.", "I don’t want to escalate it further."],
      nextStep: [
        "Please use the appropriate channel.",
        "I’ll come back to this when it can be handled calmly.",
      ],
      closing: formal ? ["Thank you for respecting that."] : ["Thanks for respecting that."],
      pressureFollowUp: [
        "I understand, but I’m not continuing here. Let’s return to it only in the right channel and calmly.",
        "I get it, but I’m not continuing this thread. I’ll come back to it only if we can keep it calm.",
      ],
    };
  }

  return {
    opener: formal ? ["Thank you for the invitation.", "Thank you for thinking of me."] : ["Thanks for inviting me.", "Hey, thanks for asking."],
    reason: [
      "I don’t want to make up a reason or drag this out.",
      "I’d rather say it clearly so there is no false expectation.",
    ],
    boundary: [
      "I’m going to sit this one out.",
      "I can’t take this on right now.",
      "My answer this time is no.",
    ],
    softener: ["I appreciate you thinking of me.", "Thanks for reaching out."],
    nextStep: [
      "I’m going to leave it there this time.",
      "I won’t join this time.",
    ],
    closing: formal ? ["Thank you for understanding."] : ["Thanks for understanding."],
    pressureFollowUp: [
      "I understand you wanted a different answer, but I’m not changing my decision.",
      "I get that you’d like a yes, but I’m keeping my answer as it is.",
    ],
  };
}

function decorateOpeners(openers: string[], input: EnglishPhraseInput): string[] {
  if (input.channelId === "voice_call" || input.channelId === "face_to_face") {
    return ["I’ll say this plainly.", "I want to say this calmly and clearly.", ...openers];
  }
  if (input.channelId === "work_chat") return ["Quick update:", "Short version:", ...openers];
  if (input.toneId === "playful") return ["Tiny reality check:", "Lightly tapping the brakes:", ...openers];
  if (input.toneId === "warm") return ["Thanks for talking this through.", ...openers];
  return openers;
}

function decorateBoundaries(boundaries: string[], input: EnglishPhraseInput): string[] {
  if (input.toneId === "assertive") {
    return [...boundaries, "I need this to be respected.", "I’m clear on this."];
  }
  if (input.toneId === "concise") return boundaries.slice(0, 2);
  return boundaries;
}

function decorateSofteners(softeners: string[], input: EnglishPhraseInput): string[] {
  if (input.toneId === "apologetic") return ["I’m sorry for the complication.", ...softeners];
  if (input.toneId === "soft") return ["I don’t want to create tension around this.", ...softeners];
  if (input.toneId === "playful") return ["No drama, just being realistic.", ...softeners];
  return softeners;
}

function decorateNextSteps(nextSteps: string[], input: EnglishPhraseInput): string[] {
  if (input.channelId === "email") return [...nextSteps, "I’ll put the next step in writing."];
  if (input.channelId === "group_chat") return [...nextSteps, "We can handle details outside the group if needed."];
  if (input.channelId === "professional_dm") return [...nextSteps, "I’ll send a concise next-step confirmation."];
  return nextSteps;
}

function decorateClosings(closings: string[], input: EnglishPhraseInput): string[] {
  if (input.channelId === "email") return [...closings, "Best,"];
  if (input.toneId === "concise") return closings.slice(0, 1);
  return closings;
}
