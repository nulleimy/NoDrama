export type PublicGeneratorTaxonomyGroup =
  | "tone"
  | "relationship"
  | "channel"
  | "strategy";

export type PublicGeneratorTaxonomyOption = {
  id: string;
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
