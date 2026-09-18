import { describe, expect, it } from "vitest";

import {
  shouldFailNetworkSmoke,
  summarizeNetworkSmokeResults,
} from "../../scripts/lib/network-smoke-summary.mjs";

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

    expect(summary).toEqual(
      expect.objectContaining({
        total: 1,
        failed: 1,
        scenarioFailures: 1,
        aggregateAsdevVerdict: "FAIL",
      }),
    );
    expect(shouldFailNetworkSmoke(summary)).toBe(true);
  });

  it("counts target checks and scenario failures without double counting", () => {
    const summary = summarizeNetworkSmokeResults([
      { scenario: "direct-chromium", target: "https://example.com", ok: true },
      { scenario: "direct-chromium", target: "https://example.org", ok: false },
      { scenario: "direct-firefox", target: null, ok: false, launchError: "failed" },
    ]);

    expect(summary).toEqual(
      expect.objectContaining({ total: 3, failed: 2, scenarioFailures: 1 }),
    );
  });

  it("keeps an independent PersianToolbox CSP failure visible without failing ASDEV", () => {
    const summary = summarizeNetworkSmokeResults([
      {
        scenario: "direct-chromium",
        target: "https://alirezasafaeisystems.ir/",
        status: 200,
        ok: true,
        failureSummary: "none",
        artifacts: { harPath: "reports/asdev.har" },
      },
      {
        scenario: "direct-chromium",
        target: "https://audit.alirezasafaeisystems.ir/",
        status: 200,
        ok: true,
        failureSummary: "none",
        artifacts: { harPath: "reports/audit.har" },
      },
      {
        scenario: "direct-chromium",
        target: "https://persiantoolbox.ir/",
        status: 200,
        ok: false,
        failureSummary: "csp:2",
        cspViolations: ["blocked Google Tag Manager", "blocked gtag"],
        artifacts: { harPath: "reports/persiantoolbox.har" },
      },
    ]);

    expect(summary.aggregateAsdevVerdict).toBe("PASS");
    expect(shouldFailNetworkSmoke(summary)).toBe(false);
    expect(summary.targetVerdicts).toEqual([
      expect.objectContaining({
        targetName: "ASDEV",
        owningProduct: "alirezasafaeigfx/alirezasafaeisystems",
        observedStatus: "PASS",
        blocksAsdevRelease: false,
      }),
      expect.objectContaining({
        targetName: "Audit",
        owningProduct: "alirezasafaeigfx/auditsystems",
        observedStatus: "PASS",
        blocksAsdevRelease: false,
      }),
      expect.objectContaining({
        targetName: "PersianToolbox",
        owningProduct: "alirezasafaeigfx/persiantoolbox",
        observedStatus: "FAIL",
        failureCategory: "EXTERNAL_PAIRED_TARGET_CSP_FAILURE",
        blocksAsdevRelease: false,
        evidence: "reports/persiantoolbox.har",
      }),
    ]);
  });

  it("fails closed when a scenario does not contain an ASDEV measurement", () => {
    const summary = summarizeNetworkSmokeResults([
      {
        scenario: "direct-chromium",
        target: "https://audit.alirezasafaeisystems.ir/",
        status: 200,
        ok: true,
        failureSummary: "none",
      },
      {
        scenario: "direct-chromium",
        target: "https://persiantoolbox.ir/",
        status: 200,
        ok: true,
        failureSummary: "none",
      },
    ]);

    expect(summary.aggregateAsdevVerdict).toBe("FAIL");
    expect(shouldFailNetworkSmoke(summary)).toBe(true);
    expect(summary.targetVerdicts).toContainEqual(
      expect.objectContaining({
        targetName: "ASDEV",
        observedStatus: "UNMEASURED",
        failureCategory: "ASDEV_MEASUREMENT_UNAVAILABLE",
        blocksAsdevRelease: true,
      }),
    );
  });

  it("blocks ASDEV failures, ASDEV-originated link failures, and unclassified targets", () => {
    const cases = [
      {
        result: {
          scenario: "direct-chromium",
          target: "https://alirezasafaeisystems.ir/",
          ok: false,
          failureSummary: "http:500",
        },
        category: "ASDEV_TARGET_FAILURE",
      },
      {
        result: {
          scenario: "direct-chromium",
          target: "https://audit.alirezasafaeisystems.ir/",
          ok: false,
          failureSummary: "link-navigation-failed",
          failureCategory: "ASDEV_CROSS_SITE_LINK_FAILURE",
        },
        category: "ASDEV_CROSS_SITE_LINK_FAILURE",
      },
      {
        result: {
          scenario: "direct-chromium",
          target: "https://new-target.example/",
          ok: false,
          failureSummary: "http:503",
        },
        category: "UNCLASSIFIED_TARGET_RESULT",
      },
    ];

    for (const { result, category } of cases) {
      const summary = summarizeNetworkSmokeResults([
        {
          scenario: "direct-chromium",
          target: "https://alirezasafaeisystems.ir/",
          ok: true,
          failureSummary: "none",
        },
        result,
      ]);
      expect(shouldFailNetworkSmoke(summary)).toBe(true);
      expect(summary.targetVerdicts).toContainEqual(
        expect.objectContaining({ failureCategory: category, blocksAsdevRelease: true }),
      );
    }
  });

  it("reports a generic Audit degradation without failing an otherwise measured ASDEV candidate", () => {
    const summary = summarizeNetworkSmokeResults([
      {
        scenario: "enterprise-network-audit",
        target: "https://alirezasafaeisystems.ir/",
        ok: true,
        failureSummary: "none",
      },
      {
        scenario: "enterprise-network-audit",
        target: "https://audit.alirezasafaeisystems.ir/",
        ok: false,
        failureSummary: "ready:http:503",
      },
    ]);

    expect(shouldFailNetworkSmoke(summary)).toBe(false);
    expect(summary.targetVerdicts).toContainEqual(
      expect.objectContaining({
        targetName: "Audit",
        observedStatus: "FAIL",
        failureCategory: "EXTERNAL_PAIRED_TARGET_FAILURE",
        blocksAsdevRelease: false,
      }),
    );
  });
});
