function isEnabled(value) {
  return value === "true";
}

export function getNoDramaFeatureFlags(env = process.env) {
  return {
    testMode: isEnabled(env.NODRAMA_TEST_MODE),
    disableFreeLimit: isEnabled(env.NODRAMA_DISABLE_FREE_LIMIT),
    historyEnabled: isEnabled(env.NODRAMA_ENABLE_HISTORY),
    eventLoggingEnabled: isEnabled(env.NODRAMA_ENABLE_EVENT_LOGGING),
    cloudHistoryEnabled: isEnabled(env.NODRAMA_ENABLE_CLOUD_HISTORY),
    phraseRealizerEnabled: isEnabled(env.NODRAMA_ENABLE_PHRASE_REALIZER),
  };
}

export function isGenerationLimitBypassed(env = process.env) {
  const flags = getNoDramaFeatureFlags(env);
  return flags.testMode || flags.disableFreeLimit;
}
