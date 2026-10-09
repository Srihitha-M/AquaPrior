import pandas as pd
import glob
import os
import re

files = [
    "data/tanker_2026/tankers_reports_2026_6.csv",
    "data/tanker_2026/tankers_reports_2026_7.csv",
    "data/tanker_2026/tankers_reports_2026_8.csv"
]

safe_map = {
    "BALAJI NAGAR": "BALAJINAGAR",
    "BALAJINAGAR": "BALAJINAGAR",
    "B.N.REDDY NAGAR": "BNREDDYNAGAR",
    "BN REDDY NAGAR": "BNREDDYNAGAR",
    "BOUDHA NAGAR": "BOUDHANAGAR",
    "BOUDHANAGAR": "BOUDHANAGAR",
    "GANDHI NAGAR": "GANDHINAGAR",
    "GANDHINAGAR": "GANDHINAGAR",
    "JAGATHGIRI GUTTA": "JAGATHGIRIGUTTA",
    "JAGATHGIRIGUTTA": "JAGATHGIRIGUTTA",
    "KISHAN BAGH": "KISHANBAGH",
    "KISHANBAGH": "KISHANBAGH",
    "PRAKASH NAGAR": "PRAKASHNAGAR",
    "PRAKASHNAGAR": "PRAKASHNAGAR",
    "SANTOSH NAGAR": "SANTOSHNAGAR",
    "SANTOSHNAGAR": "SANTOSHNAGAR",
    "SR NAGAR": "SRNAGAR",
    "S.R.NAGAR": "SRNAGAR",
    "TAPPA CHABUTRA": "TAPPACHABUTRA",
    "TAPPACHABUTRA": "TAPPACHABUTRA",
    "VENGAL RAO NAGAR": "VENGALRAONAGAR",
    "VENGALRAONAGAR": "VENGALRAONAGAR",
    "PRAGATHI NAGAR": "PRAGATHINAGAR",
    "PRAGATHINAGAR": "PRAGATHINAGAR"
}

frames = []

for file in files:
    df = pd.read_csv(file)

    df["section"] = (
        df["section"]
        .astype(str)
        .str.upper()
        .str.replace(r"\(OLD\)", "", regex=True)
        .str.replace(r"\(NEW\)", "", regex=True)
        .str.replace(r"\(DIV[^)]*\)", "", regex=True)
        .str.replace(r"\s+", " ", regex=True)
        .str.strip()
    )

    df["section"] = df["section"].replace(safe_map)

    frames.append(df)

data = pd.concat(frames, ignore_index=True)

result = (
    data.groupby("section", as_index=False)
    .agg(
        bookings=("noofbookings", "sum"),
        delivered=("delivered", "sum")
    )
)

total_bookings = result["bookings"].sum()

result["booking_share_pct"] = (
    result["bookings"] / total_bookings * 100
)

result = result.sort_values(
    "bookings",
    ascending=False
).reset_index(drop=True)

result.insert(0, "rank", result.index + 1)

output = "data/tanker_current_2026.csv"
result.to_csv(output, index=False)

print("Current tanker dataset created")
print(f"Months: June-August 2026")
print(f"Raw rows: {len(data)}")
print(f"Clean sections: {len(result)}")
print(f"Total bookings: {total_bookings:,}")
print(f"Total delivered: {result['delivered'].sum():,}")

print("\nTop 30 sections:")
print(
    result.head(30)[
        ["rank", "section", "bookings", "booking_share_pct"]
    ].to_string(index=False)
)

print(f"\nSaved to: {output}")