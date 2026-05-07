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

function isEnabled(value: string | undefined) {
  return value === "true";
}

export function getNoDramaFeatureFlags(
  env: NoDramaFeatureFlagEnv = process.env
): NoDramaFeatureFlags {
  return {
    testMode: isEnabled(env.NODRAMA_TEST_MODE),
    disableFreeLimit: isEnabled(env.NODRAMA_DISABLE_FREE_LIMIT),
    historyEnabled: isEnabled(env.NODRAMA_ENABLE_HISTORY),
    eventLoggingEnabled: isEnabled(env.NODRAMA_ENABLE_EVENT_LOGGING),
    cloudHistoryEnabled: isEnabled(env.NODRAMA_ENABLE_CLOUD_HISTORY),
    phraseRealizerEnabled: isEnabled(env.NODRAMA_ENABLE_PHRASE_REALIZER),
  };
}

export function isGenerationLimitBypassed(
  env: NoDramaFeatureFlagEnv = process.env
) {
  const flags = getNoDramaFeatureFlags(env);
  return flags.testMode || flags.disableFreeLimit;
}
