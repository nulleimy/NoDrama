export type NoDramaFeatureFlagEnv = Record<string, string | undefined> & {
  NODRAMA_TEST_MODE?: string;
  NODRAMA_DISABLE_FREE_LIMIT?: string;
  NODRAMA_ENABLE_HISTORY?: string;
  NODRAMA_ENABLE_EVENT_LOGGING?: string;
  NODRAMA_ENABLE_CLOUD_HISTORY?: string;
  NODRAMA_ENABLE_PHRASE_REALIZER?: string;
};

export type NoDramaFeatureFlags = {
  testMode: boolean;
  disableFreeLimit: boolean;
  historyEnabled: boolean;
  eventLoggingEnabled: boolean;
  cloudHistoryEnabled: boolean;
  phraseRealizerEnabled: boolean;
};

import {
  getNoDramaFeatureFlags as getRuntimeNoDramaFeatureFlags,
  isGenerationLimitBypassed as isRuntimeGenerationLimitBypassed,
} from "./featureFlags.mjs";

export const getNoDramaFeatureFlags = getRuntimeNoDramaFeatureFlags as (
  env?: NoDramaFeatureFlagEnv
) => NoDramaFeatureFlags;

export const isGenerationLimitBypassed =
  isRuntimeGenerationLimitBypassed as (env?: NoDramaFeatureFlagEnv) => boolean;
