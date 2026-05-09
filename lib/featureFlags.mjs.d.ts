import type { NoDramaFeatureFlagEnv, NoDramaFeatureFlags } from "./featureFlags";

export function getNoDramaFeatureFlags(
  env?: NoDramaFeatureFlagEnv
): NoDramaFeatureFlags;

export function isGenerationLimitBypassed(
  env?: NoDramaFeatureFlagEnv
): boolean;
