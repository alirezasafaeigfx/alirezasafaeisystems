import { describe, expect, it } from "vitest";

import { summarizeNetworkSmokeResults } from "../../scripts/lib/network-smoke-summary.mjs";

describe("network smoke summary", () => {
  it("fails closed when a browser scenario cannot launch before target checks", () => {
    const summary = summarizeNetworkSmokeResults([
      {
        scenario: "direct-chromium",
        target: null,
        ok: false,
        launchError: "missing shared library",
      },
    ]);

    expect(summary).toEqual({ total: 1, failed: 1, scenarioFailures: 1 });
  });

  it("counts target checks and scenario failures without double counting", () => {
    const summary = summarizeNetworkSmokeResults([
      { scenario: "direct-chromium", target: "https://example.com", ok: true },
      { scenario: "direct-chromium", target: "https://example.org", ok: false },
      { scenario: "direct-firefox", target: null, ok: false, launchError: "failed" },
    ]);

    expect(summary).toEqual({ total: 3, failed: 2, scenarioFailures: 1 });
  });
});
