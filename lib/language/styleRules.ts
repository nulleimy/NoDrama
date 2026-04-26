import type { ReplyChannel, ReplyStyle, SituationDomain } from "@/lib/language/phraseTypes";

export type StyleRuleDecision = {
  allowed: boolean;
  reason?: string;
};

export function isStyleAllowedForDomain(style: ReplyStyle, domain: SituationDomain): StyleRuleDecision {
  if ((domain === "work" || domain === "business") && (style === "funny" || style === "absurd")) {
    return {
      allowed: false,
      reason: "Funny and absurd styles are disabled for work/business contexts by default.",
    };
  }

  if (domain === "money" && style === "absurd") {
    return {
      allowed: false,
      reason: "Absurd style is disabled for money contexts by default.",
    };
  }

  return { allowed: true };
}

export function isStyleAllowedForChannel(style: ReplyStyle, channel: ReplyChannel): StyleRuleDecision {
  if (channel === "email" && (style === "funny" || style === "absurd")) {
    return {
      allowed: false,
      reason: "Funny and absurd styles are disabled for email by default.",
    };
  }

  return { allowed: true };
}
