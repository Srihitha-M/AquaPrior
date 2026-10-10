
// Turns real API data into understandable evidence flags.
export function describeEvidence(area) {
  const flags = [];

  if (area.radius_disagrees) {
    flags.push("3 km and 5 km groundwater trends disagree");
  }

  const reliability = String(
    area.trend_reliability || ""
  ).toLowerCase();

  if (
    reliability.includes("mixed") ||
    reliability.includes("limited")
  ) {
    flags.push(`Trend reliability: ${area.trend_reliability}`);
  }

  const coverage = String(area.station_coverage || "");

  if (coverage && coverage.toLowerCase() !== "high") {
    flags.push(`${coverage} monitoring coverage nearby`);
  }

  return {
    flags,
    level: flags.length > 0 ? "caution" : "steady",
    label:
      flags.length > 0
        ? "Check evidence"
        : "No conflicts flagged",
  };
}

// Calculate each signal's contribution to the priority score.
// Our prototype uses 60% tanker demand and 40% groundwater.
export function scoreParts(area) {
  const tanker = 0.6 * Number(area.tanker_score);
  const groundwater = 0.4 * Number(area.groundwater_score);

  return { tanker, groundwater };
}
