
import pandas as pd
import numpy as np

TANKER_FILE = r"D:\AquaPrior_Final\data\tanker_current_2026.csv"
GROUNDWATER_FILE = r"D:\AquaPrior_Final\data\section_groundwater_matches.csv"

MIN_BOOKINGS = 100

tanker = pd.read_csv(TANKER_FILE)
groundwater = pd.read_csv(GROUNDWATER_FILE)

if "rank" in tanker.columns:
    tanker = tanker.drop(columns=["rank"])

groundwater = groundwater[
    ["section", "nearby_stations", "median_change_m", "evidence"]
]

data = tanker.merge(groundwater, on="section", how="left")
data = data.rename(columns={"evidence": "evidence_level"})

def groundwater_score(change):
    if pd.isna(change):
        return np.nan
    if change <= -1.0:
        return 100.0
    if change >= 0.5:
        return 0.0
    return (-change + 0.5) / 1.5 * 100

data["groundwater_score"] = data["median_change_m"].apply(
    groundwater_score
)

eligible = (
    (data["bookings"] >= MIN_BOOKINGS)
    & data["groundwater_score"].notna()
)

# Method A: Current scoring
data["current_tanker_score"] = (
    data["bookings"] / data["bookings"].max() * 100
)

data["current_priority"] = np.nan
data.loc[eligible, "current_priority"] = (
    0.60 * data.loc[eligible, "current_tanker_score"]
    + 0.40 * data.loc[eligible, "groundwater_score"]
)

# Method B: Percentile-based tanker scoring
data["percentile_tanker_score"] = (
    data["bookings"].rank(pct=True) * 100
)

data["percentile_priority"] = np.nan
data.loc[eligible, "percentile_priority"] = (
    0.60 * data.loc[eligible, "percentile_tanker_score"]
    + 0.40 * data.loc[eligible, "groundwater_score"]
)

current = (
    data.loc[eligible]
    .sort_values("current_priority", ascending=False)
    .head(20)
    [["section", "bookings", "groundwater_score", "current_priority"]]
    .reset_index(drop=True)
)

percentile = (
    data.loc[eligible]
    .sort_values("percentile_priority", ascending=False)
    .head(20)
    [["section", "bookings", "groundwater_score", "percentile_priority"]]
    .reset_index(drop=True)
)

current.insert(0, "current_rank", range(1, len(current) + 1))
percentile.insert(0, "percentile_rank", range(1, len(percentile) + 1))

current = current.rename(columns={
    "section": "current_section",
    "bookings": "current_bookings",
    "groundwater_score": "current_groundwater_score"
})

percentile = percentile.rename(columns={
    "section": "percentile_section",
    "bookings": "percentile_bookings",
    "groundwater_score": "percentile_groundwater_score"
})

comparison = pd.concat([current, percentile], axis=1)

output = r"D:\AquaPrior_Final\data\scoring_comparison.csv"
comparison.to_csv(output, index=False)

print("\nAquaPrior scoring comparison")
print("----------------------------")
print("Eligible sections:", int(eligible.sum()))
print("\nTop 20 side-by-side comparison:")
print(comparison.to_string(index=False))
print("\nSaved comparison to:", output)