import { isGenerationLimitBypassed } from "./featureFlags.mjs";
import type { NoDramaFeatureFlagEnv } from "./featureFlags";

export function isLocalGenerationLimitBypassed(
  env: NoDramaFeatureFlagEnv = process.env
) {
  return (isGenerationLimitBypassed as (
    env?: NoDramaFeatureFlagEnv
  ) => boolean)(env);
}

export function shouldBlockFreeGeneration({
  currentUsage,
  creditConsumed,
  freeLimit,
  limitBypassed = isLocalGenerationLimitBypassed(),
}: {
  currentUsage: number;
  creditConsumed: boolean;
  freeLimit: number;
  limitBypassed?: boolean;
}) {
  if (creditConsumed || limitBypassed) return false;
  return Math.max(freeLimit - currentUsage, 0) <= 0;
}
