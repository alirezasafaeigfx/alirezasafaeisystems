export function summarizeNetworkSmokeResults(results) {
  const targetResults = results.filter((result) => result.target);
  const scenarioFailures = results.filter((result) => !result.target && !result.ok).length;

  return {
    total: targetResults.length + scenarioFailures,
    failed: targetResults.filter((result) => !result.ok).length + scenarioFailures,
    scenarioFailures,
  };
}
