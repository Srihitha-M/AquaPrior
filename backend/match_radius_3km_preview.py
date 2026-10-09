
import pandas as pd
import re
from pathlib import Path
from math import radians, sin, cos, sqrt, atan2

BASE_FOLDER = Path(__file__).resolve().parent.parent
DATA_FOLDER = BASE_FOLDER / "data"


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


# Load section coordinates and tanker demand
coordinates = pd.read_csv(DATA_FOLDER / "section_coordinates.csv")
tanker = pd.read_csv(DATA_FOLDER / "tanker_current_2026.csv")

coordinates["match_key"] = coordinates["section"].apply(normalize_section)
tanker["match_key"] = tanker["section"].apply(normalize_section)

# Avoid silently matching ambiguous duplicate tanker names
duplicates = tanker[tanker["match_key"].duplicated(keep=False)]

if not duplicates.empty:
    print("WARNING: Duplicate normalized tanker names:")
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

unmatched_coordinates = coordinates[
    ~coordinates["match_key"].isin(set(safe_tanker["match_key"]))
]

print("\nCOORDINATE NAMES WITHOUT A SAFE TANKER MATCH")
if unmatched_coordinates.empty:
    print("None")
else:
    print(
        unmatched_coordinates[
            ["section", "latitude", "longitude"]
        ].to_string(index=False)
    )

# Load and prepare groundwater readings
groundwater = pd.read_csv(DATA_FOLDER / "groundwater_2026.csv")

groundwater["date"] = pd.to_datetime(
    groundwater["Data Acquisition Time"],
    dayfirst=True,
    errors="coerce"
)
groundwater["level"] = pd.to_numeric(
    groundwater["Groundwater Level Telemetry 6 Hourly (meter)"],
    errors="coerce"
)

groundwater = groundwater[
    groundwater["District"].astype(str).str.upper().isin(
        ["HYDERABAD", "RANGA REDDY", "MEDCHAL"]
    )
].copy()

groundwater = groundwater[
    groundwater["level"].between(-60, 0)
].dropna(
    subset=["Station", "Latitude", "Longitude", "date", "level"]
).copy()

latest_date = groundwater["date"].max()
recent = groundwater[
    groundwater["date"] >= latest_date - pd.Timedelta(days=30)
].copy()

# Calculate each station's change using the existing method
station_trends = []

for (station, latitude, longitude), group in recent.groupby(
    ["Station", "Latitude", "Longitude"]
):
    group = group.sort_values("date")

    if len(group) < 60:
        continue

    if group["date"].max() < latest_date - pd.Timedelta(days=3):
        continue

    first_days = group[
        group["date"] <= group["date"].min() + pd.Timedelta(days=6)
    ]
    last_days = group[
        group["date"] >= group["date"].max() - pd.Timedelta(days=6)
    ]

    if first_days.empty or last_days.empty:
        continue

    station_trends.append({
        "Station": station,
        "latitude": latitude,
        "longitude": longitude,
        "change_m": (
            last_days["level"].median()
            - first_days["level"].median()
        ),
        "readings": len(group)
    })


# Treat identical coordinates as one mapped location.
# If several station records share a location, use their
# median trend so that location is not counted repeatedly.
station_summary = pd.DataFrame(station_trends)

if not station_summary.empty:
    station_summary = (
        station_summary
        .groupby(["latitude", "longitude"], as_index=False)
        .agg(
            Station=(
                "Station",
                lambda names: " / ".join(sorted(set(names)))
            ),
            change_m=("change_m", "median"),
            readings=("readings", "max")
        )
    )

print("\nMATCHING AUDIT")
print("--------------")
print("Tanker period: June-August 2026")
print("Groundwater latest date:", latest_date)
print("Physical groundwater stations analysed:", len(station_summary))
print("Sections with coordinates:", len(coordinates))
print("Sections safely matched:", len(sections))

# Inspect Kondapur's section coordinate and station locations
kondapur = sections[
    sections["section_tanker"].astype(str).str.upper() == "KONDAPUR"
]

if not kondapur.empty:
    section = kondapur.iloc[0]

    print("\nKONDAPUR SECTION COORDINATES")
    print(
        "Latitude:", section["latitude"],
        "| Longitude:", section["longitude"]
    )

    nearby_rows = []

    for _, station in station_summary.iterrows():
        distance = distance_km(
            section["latitude"],
            section["longitude"],
            station["latitude"],
            station["longitude"]
        )

        if distance <= 5:
            nearby_rows.append({
                "station": station["Station"],
                "station_latitude": station["latitude"],
                "station_longitude": station["longitude"],
                "distance_km": round(distance, 2),
                "change_m": round(station["change_m"], 3),
                "readings": station["readings"],
                "within_3km": distance <= 3
            })

    diagnostic = pd.DataFrame(nearby_rows)

    print("\nKONDAPUR STATIONS WITHIN 5 KM")
    if diagnostic.empty:
        print("No qualifying stations found.")
    else:
        print(
            diagnostic.sort_values("distance_km").to_string(index=False)
        )

# Compare 3 km and 5 km results for every safely matched section
comparison = []

for _, section in sections.iterrows():
    nearby_distances = []

    for _, station in station_summary.iterrows():
        distance = distance_km(
            section["latitude"],
            section["longitude"],
            station["latitude"],
            station["longitude"]
        )

        nearby_distances.append((distance, station["change_m"]))

    row = {
        "section": section["section_tanker"],
        "bookings": section["bookings"]
    }

    for radius in [3, 5]:
        values = [
            change for distance, change in nearby_distances
            if distance <= radius
        ]

        row[f"stations_{radius}km"] = len(values)
        row[f"median_{radius}km_m"] = (
            round(pd.Series(values).median(), 3)
            if values else None
        )

    comparison.append(row)

comparison_df = pd.DataFrame(comparison).sort_values(
    "bookings", ascending=False
)

print("\n3 KM VS 5 KM COMPARISON")
print("-----------------------")
print(comparison_df.to_string(index=False))

print("\nPREVIEW ONLY: No output CSV was written.")