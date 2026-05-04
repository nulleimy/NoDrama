type LimitBypassEnv = Record<string, string | undefined> & {
  NODRAMA_TEST_MODE?: string;
  NODRAMA_DISABLE_FREE_LIMIT?: string;
};

export function isLocalGenerationLimitBypassed(
  env: LimitBypassEnv = process.env
) {
  return (
    env.NODRAMA_TEST_MODE === "true" ||
    env.NODRAMA_DISABLE_FREE_LIMIT === "true"
  );
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
