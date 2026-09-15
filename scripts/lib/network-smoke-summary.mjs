import { NETWORK_SMOKE_TARGET_POLICY } from "./network-smoke-target-policy.mjs";

function isCspOnlyFailure(result) {
  const parts = String(result.failureSummary || "")
    .split("|")
    .map((part) => part.trim())
    .filter(Boolean);
  return parts.length > 0 && parts.every((part) => part.startsWith("csp:"));
}

function evidenceFor(result) {
  return result.artifacts?.harPath || result.artifacts?.screenshotPath || result.logReference || null;
}

function malformedVerdict(result, failureCategory) {
  return {
    targetName: result?.target || "UNMEASURED_SCENARIO",
    target: result?.target || null,
    owningProduct: "UNCLASSIFIED",
    observedStatus: "UNMEASURED",
    failureCategory,
    blockingPolicy: true,
    blocksAsdevRelease: true,
    evidence: evidenceFor(result || {}),
  };
}

function classifyTargetResult(result, policyByTarget) {
  if (!result || typeof result !== "object" || typeof result.ok !== "boolean") {
    return malformedVerdict(result, "MALFORMED_TARGET_RESULT");
  }
  if (!result.target) {
    return malformedVerdict(result, "ASDEV_MEASUREMENT_UNAVAILABLE");
  }

  const policy = policyByTarget.get(result.target);
  if (!policy) return malformedVerdict(result, "UNCLASSIFIED_TARGET_RESULT");

  let failureCategory = "NONE";
  if (!result.ok) {
    if (result.failureCategory === "ASDEV_CROSS_SITE_LINK_FAILURE") {
      failureCategory = "ASDEV_CROSS_SITE_LINK_FAILURE";
    } else if (policy.targetName === "PersianToolbox" && isCspOnlyFailure(result)) {
      failureCategory = "EXTERNAL_PAIRED_TARGET_CSP_FAILURE";
    } else if (policy.releaseRole === "ASDEV_OWNED") {
      failureCategory = "ASDEV_TARGET_FAILURE";
    } else {
      failureCategory = "EXTERNAL_PAIRED_TARGET_FAILURE";
    }
  }

  const crossSiteFailure = failureCategory === "ASDEV_CROSS_SITE_LINK_FAILURE";
  const blocksAsdevRelease = !result.ok && (policy.blocking || crossSiteFailure);
  return {
    targetName: policy.targetName,
    target: policy.target,
    owningProduct: policy.owningProduct,
    observedStatus: result.ok ? "PASS" : "FAIL",
    failureCategory,
    blockingPolicy: policy.blocking,
    blocksAsdevRelease,
    evidence: evidenceFor(result),
  };
}

export function summarizeNetworkSmokeResults(results) {
  const targetResults = results.filter((result) => result.target);
  const scenarioFailures = results.filter((result) => !result.target && !result.ok).length;

  const policyByTarget = new Map(
    NETWORK_SMOKE_TARGET_POLICY.map((policy) => [policy.target, policy]),
  );
  const targetVerdicts = results.map((result) => classifyTargetResult(result, policyByTarget));
  const asdevTarget = NETWORK_SMOKE_TARGET_POLICY.find((policy) => policy.releaseRole === "ASDEV_OWNED");
  const scenarios = new Set(results.map((result) => result.scenario).filter(Boolean));
  if (scenarios.size === 0) scenarios.add("UNMEASURED_SCENARIO");
  for (const scenario of scenarios) {
    const hasAsdevMeasurement = results.some(
      (result) => result.scenario === scenario && result.target === asdevTarget?.target,
    );
    if (!hasAsdevMeasurement) {
      targetVerdicts.push({
        targetName: asdevTarget?.targetName || "ASDEV",
        target: asdevTarget?.target || null,
        owningProduct: asdevTarget?.owningProduct || "alirezasafaeigfx/alirezasafaeisystems",
        observedStatus: "UNMEASURED",
        failureCategory: "ASDEV_MEASUREMENT_UNAVAILABLE",
        blockingPolicy: true,
        blocksAsdevRelease: true,
        evidence: `scenario:${scenario}`,
      });
    }
  }
  const aggregateAsdevVerdict = targetVerdicts.some((result) => result.blocksAsdevRelease)
    ? "FAIL"
    : "PASS";

  return {
    total: targetResults.length + scenarioFailures,
    failed: targetResults.filter((result) => !result.ok).length + scenarioFailures,
    scenarioFailures,
    targetVerdicts,
    aggregateAsdevVerdict,
  };
}

export function shouldFailNetworkSmoke(summary) {
  return summary.aggregateAsdevVerdict !== "PASS";
}
