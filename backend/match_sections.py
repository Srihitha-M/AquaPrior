
import pandas as pd
import re
from pathlib import Path
from math import radians, sin, cos, sqrt, atan2

BASE_FOLDER = Path(__file__).resolve().parent.parent
DATA_FOLDER = BASE_FOLDER / "data"

RADIUS_KM = 5
MIN_READINGS = 60


def normalize_section(name):
    return re.sub(r"[^A-Z0-9]", "", str(name).upper())


def distance_km(lat1, lon1, lat2, lon2):
    earth_radius = 6371

    lat1, lon1, lat2, lon2 = map(
        radians, [lat1, lon1, lat2, lon2]
    )

    dlat = lat2 - lat1
    dlon = lon2 - lon1

    a = (
        sin(dlat / 2) ** 2
        + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
    )

    return earth_radius * 2 * atan2(
        sqrt(a), sqrt(1 - a)
    )


# 1. Load section coordinates and tanker data
coordinates = pd.read_csv(DATA_FOLDER / "section_coordinates.csv")
tanker = pd.read_csv(DATA_FOLDER / "tanker_current_2026.csv")

# Verified section-name aliases
coordinates["section"] = coordinates["section"].replace({
    "KPHB": "KPHB COLONY"
})

coordinates["match_key"] = coordinates["section"].apply(
    normalize_section
)
tanker["match_key"] = tanker["section"].apply(
    normalize_section
)

duplicates = tanker[
    tanker["match_key"].duplicated(keep=False)
]

if not duplicates.empty:
    print("WARNING: Ambiguous normalized tanker names:")
    print(
        duplicates[["section", "bookings", "match_key"]]
        .to_string(index=False)
    )

duplicate_keys = set(duplicates["match_key"])

safe_tanker = tanker[
    ~tanker["match_key"].isin(duplicate_keys)
].copy()

sections = safe_tanker.merge(
    coordinates,
    on="match_key",
    how="inner",
    suffixes=("_tanker", "_coordinate")
)

unmatched = coordinates[
    ~coordinates["match_key"].isin(
        set(safe_tanker["match_key"])
    )
]

print("\nCOORDINATE NAMES WITHOUT A SAFE TANKER MATCH")
print(
    unmatched[["section", "latitude", "longitude"]]
    .to_string(index=False)
    if not unmatched.empty
    else "None"
)


# 2. Load and clean groundwater readings
groundwater = pd.read_csv(
    DATA_FOLDER / "groundwater_2026.csv"
)

groundwater["date"] = pd.to_datetime(
    groundwater["Data Acquisition Time"],
    dayfirst=True,
    errors="coerce"
)

groundwater["level"] = pd.to_numeric(
    groundwater[
        "Groundwater Level Telemetry 6 Hourly (meter)"
    ],
    errors="coerce"
)

groundwater["Latitude"] = pd.to_numeric(
    groundwater["Latitude"], errors="coerce"
)

groundwater["Longitude"] = pd.to_numeric(
    groundwater["Longitude"], errors="coerce"
)

groundwater = groundwater[
    groundwater["District"].astype(str).str.upper().isin(
        ["HYDERABAD", "RANGA REDDY", "MEDCHAL"]
    )
].copy()

# Keep plausible readings within the project's existing range.
groundwater = groundwater[
    groundwater["level"].between(-60, 0)
].dropna(
    subset=[
        "Station", "Latitude", "Longitude", "date", "level"
    ]
).copy()

# Combine repeated readings for the same station and timestamp.
# Use the median so duplicates do not inflate the reading count.
groundwater = (
    groundwater
    .groupby(
        ["Station", "Latitude", "Longitude", "date"],
        as_index=False
    )
    .agg(
        level=("level", "median")
    )
)

latest_date = groundwater["date"].max()

recent = groundwater[
    groundwater["date"] >= latest_date - pd.Timedelta(days=30)
].copy()


# 3. Calculate a trend for each named station
station_trends = []

for (station, latitude, longitude), group in recent.groupby(
    ["Station", "Latitude", "Longitude"]
):
    group = group.sort_values("date")

    if len(group) < MIN_READINGS:
        continue

    if (
        group["date"].max()
        < latest_date - pd.Timedelta(days=3)
    ):
        continue

    first_days = group[
        group["date"]
        <= group["date"].min() + pd.Timedelta(days=6)
    ]

    last_days = group[
        group["date"]
        >= group["date"].max() - pd.Timedelta(days=6)
    ]

    if len(first_days) < 16 or len(last_days) < 16:
        continue

    station_trends.append({
        "Station": str(station),
        "latitude": latitude,
        "longitude": longitude,
        "change_m": (
            last_days["level"].median()
            - first_days["level"].median()
        ),
        "readings": len(group)
    })

station_summary = pd.DataFrame(station_trends)


# 4. Collapse identical coordinates into one mapped location.
# This prevents multiple station labels at the same coordinates
# from artificially increasing the location evidence count.
if not station_summary.empty:
    station_summary = (
        station_summary
        .groupby(
            ["latitude", "longitude"],
            as_index=False
        )
        .agg(
            Station=(
                "Station",
                lambda names: " / ".join(
                    sorted(set(names))
                )
            ),
            change_m=("change_m", "median"),
            readings=("readings", "max")
        )
    )


# 5. Match unique monitoring locations within 5 km
matches = []

for _, section in sections.iterrows():
    nearby = []
    nearby_distances = []

    for _, station in station_summary.iterrows():
        distance = distance_km(
            section["latitude"],
            section["longitude"],
            station["latitude"],
            station["longitude"]
        )

        if distance <= RADIUS_KM:
            nearby.append(station["change_m"])
            nearby_distances.append(distance)
    nearby_3km = [
        change
        for change, distance in zip(nearby, nearby_distances)
        if distance <= 3
    ]

    median_3km = (
        pd.Series(nearby_3km).median()
        if nearby_3km else None
    )
    location_count = len(nearby)

    median_change = (
        pd.Series(nearby).median()
        if nearby
        else None
    )

    if location_count == 0:
        evidence = "None"
    elif location_count <= 3:
        evidence = "Limited"
    elif location_count <= 7:
        evidence = "Moderate"
    else:
        evidence = "High"

    # Additional groundwater evidence details
    declining_locations = sum(
        1 for change in nearby if change < 0
    )

    min_change = min(nearby) if nearby else None
    max_change = max(nearby) if nearby else None

    # Spread of the middle 50% of nearby groundwater changes
    change_iqr = (
        pd.Series(nearby).quantile(0.75)
        - pd.Series(nearby).quantile(0.25)
        if nearby else None
    )

    # Agreement with the median trend direction
    if nearby and median_change != 0:
        agreeing = sum(
            1 for change in nearby
            if (change < 0) == (median_change < 0)
        )
        agreement_pct = agreeing / location_count * 100
    else:
        agreement_pct = None

    matches.append({
        "section": section["section_tanker"],
        "bookings": section["bookings"],
        "booking_share_pct": section["booking_share_pct"],
        # Counts unique monitoring coordinates, not station names.
        "nearby_stations": location_count,
                "n_3km": len(nearby_3km),
        "median_change_3km_m": (
            round(median_3km, 3)
            if median_3km is not None else None
        ),
        "radius_disagrees": (
            (median_3km < 0) != (median_change < 0)
            if median_3km is not None
            and median_change is not None
            else None
        ),
        "gw_window_start": (
            latest_date - pd.Timedelta(days=30)
        ).date().isoformat(),
        "gw_window_end": latest_date.date().isoformat(),
        "nearest_station_km": (
            round(min(nearby_distances), 2)
            if nearby_distances else None
        ),
        "change_iqr_m": (
            round(change_iqr, 3)
            if change_iqr is not None else None
        ),
        "agreement_pct": (
            round(agreement_pct, 1)
            if agreement_pct is not None else None
        ),
        "declining_locations": declining_locations,
        "min_change_m": (
            round(min_change, 3)
            if min_change is not None else None
        ),
        "max_change_m": (
            round(max_change, 3)
            if max_change is not None else None
        ),
        "median_change_m": (
            round(median_change, 3)
            if median_change is not None
            else None
        ),
        "evidence": evidence
    })


# 6. Save the matching results for the scoring script
result = pd.DataFrame(matches)

if not result.empty:
    result = result.sort_values(
        "bookings", ascending=False
    )

output_path = DATA_FOLDER / "section_groundwater_matches.csv"
result.to_csv(output_path, index=False)


# 7. Print the audit
print("\nAQUAPRIOR MATCHING AUDIT")
print("-----------------------")
print("Tanker period: June-August 2026")
print("Groundwater latest date:", latest_date)
print("Matching radius:", RADIUS_KM, "km")
print("Minimum readings per named station:", MIN_READINGS)
print(
    "Unique monitoring locations analysed:",
    len(station_summary)
)
print("Sections with coordinates:", len(coordinates))
print("Sections safely matched:", len(result))
print("\nNearby evidence counts unique coordinates.")
print(result.to_string(index=False))
print("\nSaved matching results to:")
print(output_path)
