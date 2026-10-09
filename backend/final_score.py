
import pandas as pd
import numpy as np
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent
DATA = BASE / "data"

TANKER_FILE = DATA / "tanker_current_2026.csv"
GROUNDWATER_FILE = DATA / "section_groundwater_matches.csv"
COORDINATES_FILE = DATA / "section_coordinates.csv"
OUTPUT_FILE = DATA / "final_priority_scores.csv"

MIN_BOOKINGS = 100

# Load data
tanker = pd.read_csv(TANKER_FILE)
groundwater = pd.read_csv(GROUNDWATER_FILE)
coordinates = pd.read_csv(COORDINATES_FILE)

if "rank" in tanker.columns:
    tanker = tanker.drop(columns=["rank"])

# Check that section names are unique
assert tanker["section"].is_unique, "Duplicate tanker sections"
assert groundwater["section"].is_unique, "Duplicate groundwater sections"

# Keep groundwater evidence and reliability fields
groundwater = groundwater[
    [
        "section",
        "nearby_stations",
        "n_3km",
        "median_change_3km_m",
        "radius_disagrees",
        "gw_window_start",
        "gw_window_end",
        "nearest_station_km",
        "change_iqr_m",
        "agreement_pct",
        "declining_locations",
        "min_change_m",
        "max_change_m",
        "median_change_m",
        "evidence",
    ]
]

data = tanker.merge(groundwater, on="section", how="left")

data = data.rename(
    columns={"evidence": "station_coverage"}
)

# Demand rank includes ALL tanker sections
data["demand_rank"] = (
    data["bookings"]
    .rank(method="min", ascending=False)
    .astype(int)
)

# Which sections have verified location matches?
coordinate_names = set(
    coordinates["section"].replace({
        "KPHB": "KPHB COLONY"
    })
)

data["has_coordinates"] = data["section"].isin(
    coordinate_names
)

# Tanker score
max_bookings = data["bookings"].max()
data["tanker_score"] = (
    data["bookings"] / max_bookings * 100
)

# Preserve our existing groundwater scoring formula
def calculate_groundwater_score(change):
    if pd.isna(change):
        return np.nan
    if change <= -1.0:
        return 100.0
    if change >= 0.5:
        return 0.0
    return (-change + 0.5) / 1.5 * 100


data["groundwater_score"] = data[
    "median_change_m"
].apply(calculate_groundwater_score)

# Prototype reliability labels
def get_trend_reliability(row):
    count = row["nearby_stations"]
    distance = row["nearest_station_km"]
    agreement = row["agreement_pct"]
    median = row["median_change_m"]
    iqr = row["change_iqr_m"]

    if pd.isna(count) or count == 0:
        return "No evidence"

    if count < 5 or pd.isna(distance) or distance > 3:
        return "Limited evidence"

    if (
        pd.notna(agreement)
        and agreement >= 70
        and pd.notna(median)
        and pd.notna(iqr)
        and (
            abs(median) >= iqr
            or abs(median) >= 0.5
        )
    ):
        return "Strong agreement"

    return "Mixed evidence"


data["trend_reliability"] = data.apply(
    get_trend_reliability, axis=1
)

# Eligibility
data["demand_eligible"] = (
    data["bookings"] >= MIN_BOOKINGS
)

data["groundwater_evidence"] = (
    data["groundwater_score"].notna()
)

high_tanker_cutoff = data["bookings"].quantile(0.90)

data["high_tanker"] = (
    data["bookings"] >= high_tanker_cutoff
)

eligible = (
    data["demand_eligible"]
    & data["groundwater_evidence"]
)

# Existing 60/40 ranking, unchanged
data["priority_score"] = np.nan

data.loc[eligible, "priority_score"] = (
    0.60 * data.loc[eligible, "tanker_score"]
    + 0.40 * data.loc[eligible, "groundwater_score"]
)

# Cautious screening suggestions, not confirmed interventions
def get_action(row):
    if not row["demand_eligible"]:
        return "Low-demand / monitor"

    if not row["has_coordinates"]:
        return "Not assessed (no location data)"

    if not row["groundwater_evidence"]:
        return "Not assessed (no groundwater evidence)"

    if (
        row["radius_disagrees"] == True
        or row["trend_reliability"] != "Strong agreement"
    ):
        return "Review supply and groundwater evidence"

    if (
        row["high_tanker"]
        and row["median_change_m"] <= -0.5
    ):
        return "Investigate recharge feasibility"

    if row["high_tanker"]:
        return "Review tanker supply"

    if row["median_change_m"] <= -0.5:
        return "Investigate groundwater decline"

    return "Monitor"


data["action"] = data.apply(get_action, axis=1)

# Rank assessed sections only
data["priority_rank"] = pd.Series(
    pd.NA, index=data.index, dtype="Int64"
)

ranked = data[
    data["priority_score"].notna()
].sort_values(
    ["priority_score", "section"],
    ascending=[False, True]
)

data.loc[ranked.index, "priority_rank"] = range(
    1, len(ranked) + 1
)

data["ranking_group"] = data[
    "priority_score"
].notna()

data = data.sort_values(
    ["ranking_group", "priority_score", "section"],
    ascending=[False, False, True]
).drop(columns=["ranking_group"])

data.to_csv(OUTPUT_FILE, index=False)

# Audit
print("\nAquaPrior final scoring complete")
print("--------------------------------")
print("Total tanker sections:", len(data))
print("Demand-eligible sections:", data["demand_eligible"].sum())
print("Assessed and ranked sections:", eligible.sum())
print(
    "Eligible sections without coordinates:",
    (data["demand_eligible"] & ~data["has_coordinates"]).sum()
)
print(
    "Radius disagreements:",
    data["radius_disagrees"].fillna(False).astype(bool).sum()
)
print("Tanker period: June-August 2026")
print("Groundwater window: September 2-October 2, 2026")
print("Ranking: 60% tanker demand + 40% regional groundwater")
print("\nPRIORITY AMONG ASSESSED SECTIONS")
print(
    data[data["priority_rank"].notna()][
        [
            "priority_rank",
            "section",
            "bookings",
            "priority_score",
            "trend_reliability",
            "radius_disagrees",
            "action",
        ]
    ].head(23).to_string(index=False)
)
print("\nSaved to:", OUTPUT_FILE)
