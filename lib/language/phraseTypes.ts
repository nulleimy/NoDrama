export type LanguageCode = "cs" | "en";

export type ReplyStyle =
  | "neutral"
  | "casual"
  | "formal"
  | "firm"
  | "funny"
  | "absurd";

export type ReplyIntent =
  | "decline"
  | "cancel"
  | "delay"
  | "reschedule"
  | "soft_exit"
  | "boundary"
  | "apology"
  | "follow_up"
  | "clarify"
  | "refuse_cost"
  | "refuse_scope"
  | "not_available";

export type ReplyChannel = "sms" | "whatsapp" | "email" | "slack";

export type SituationDomain =
  | "social"
  | "work"
  | "business"
  | "money"
  | "school"
  | "digital";

export type PublicRiskLevel = "low" | "medium";

export type SituationCategory = {
  id: string;
  label: string;
  domain: SituationDomain;
  intent: ReplyIntent;
  riskLevel: PublicRiskLevel;
  defaultStyle: ReplyStyle;
  allowedStyles: ReplyStyle[];
  recommendedChannels: ReplyChannel[];
  keywordsCs: string[];
  keywordsEn: string[];
  avoid: string[];
};

export type PhraseBankEntry = {
  id: string;
  language: LanguageCode;
  style: ReplyStyle;
  intent: ReplyIntent;
  channel: ReplyChannel[];
  text: string;
  intensity: 1 | 2 | 3;
  risk: PublicRiskLevel;
  tags: string[];
};
