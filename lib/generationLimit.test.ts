import { afterEach, describe, expect, it, vi } from "vitest";

import {
  isLocalGenerationLimitBypassed,
  shouldBlockFreeGeneration,
} from "./generationLimit";

describe("generation limit", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("reads explicit feature-flag environments", () => {
    expect(
      isLocalGenerationLimitBypassed({
        NODRAMA_TEST_MODE: "true",
      })
    ).toBe(true);

    expect(
      isLocalGenerationLimitBypassed({
        NODRAMA_DISABLE_FREE_LIMIT: "true",
      })
    ).toBe(true);

    expect(isLocalGenerationLimitBypassed({})).toBe(false);
  });

  it("reads the process environment when no environment is supplied", () => {
    vi.stubEnv("NODRAMA_TEST_MODE", "true");

    expect(isLocalGenerationLimitBypassed()).toBe(true);
  });

  it("does not block when a credit was consumed", () => {
    expect(
      shouldBlockFreeGeneration({
        currentUsage: 100,
        creditConsumed: true,
        freeLimit: 2,
        limitBypassed: false,
      })
    ).toBe(false);
  });

  it("does not block when the limit is bypassed", () => {
    expect(
      shouldBlockFreeGeneration({
        currentUsage: 100,
        creditConsumed: false,
        freeLimit: 2,
        limitBypassed: true,
      })
    ).toBe(false);
  });

  it("allows usage below the free limit", () => {
    expect(
      shouldBlockFreeGeneration({
        currentUsage: 1,
        creditConsumed: false,
        freeLimit: 2,
        limitBypassed: false,
      })
    ).toBe(false);
  });

  it("blocks usage at and above the free limit", () => {
    expect(
      shouldBlockFreeGeneration({
        currentUsage: 2,
        creditConsumed: false,
        freeLimit: 2,
        limitBypassed: false,
      })
    ).toBe(true);

    expect(
      shouldBlockFreeGeneration({
        currentUsage: 3,
        creditConsumed: false,
        freeLimit: 2,
        limitBypassed: false,
      })
    ).toBe(true);
  });

  it("uses the process feature flags by default", () => {
    vi.stubEnv("NODRAMA_DISABLE_FREE_LIMIT", "true");

    expect(
      shouldBlockFreeGeneration({
        currentUsage: 2,
        creditConsumed: false,
        freeLimit: 2,
      })
    ).toBe(false);
  });
});
