export type PublicGeneratorTaxonomyGroup =
  | "tone"
  | "relationship"
  | "channel"
  | "strategy";

export type PublicGeneratorToneId =
  | "neutral"
  | "soft"
  | "assertive"
  | "formal"
  | "apologetic"
  | "warm"
  | "concise"
  | "playful";

export type PublicGeneratorRelationshipId =
  | "authority"
  | "peer"
  | "client"
  | "friend"
  | "close_friend"
  | "partner"
  | "family"
  | "stranger_public";

export type PublicGeneratorChannelId =
  | "messenger_1to1"
  | "group_chat"
  | "email"
  | "work_chat"
  | "professional_dm"
  | "social_dm"
  | "voice_call"
  | "face_to_face";

export type PublicGeneratorStrategyId =
  | "delay"
  | "soft_decline"
  | "hard_boundary"
  | "redirect"
  | "repair"
  | "exit"
  | "negotiate"
  | "clarify";

export type PublicGeneratorTaxonomyId =
  | PublicGeneratorToneId
  | PublicGeneratorRelationshipId
  | PublicGeneratorChannelId
  | PublicGeneratorStrategyId;

export type PublicGeneratorTaxonomyOption = {
  id: PublicGeneratorTaxonomyId;
  label: {
    cs: string;
    en: string;
  };
  legacyValue: string;
};

export const publicGeneratorTaxonomyControls: Record<
  PublicGeneratorTaxonomyGroup,
  PublicGeneratorTaxonomyOption[]
>;

export const publicGeneratorTaxonomySourceIds: Record<
  PublicGeneratorTaxonomyGroup,
  string[]
>;
