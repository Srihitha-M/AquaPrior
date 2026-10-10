import { Layers, ListChecks, MapPinned, MapPinOff, Droplet } from "lucide-react";
import { DATASET_AUDIT, DATA_PERIODS } from "../config";
import { formatInt } from "../lib/format";
import "./DatasetSummary.css";

function buildStats(data, status) {
  // Live values come from the API response. Audit values come from config.js.
  const live = (pick) => {
    if (data) return { value: pick(data), state: "ready" };
    return { value: null, state: status === "error" ? "unavailable" : "loading" };
  };

  return [
    {
      id: "total",
      icon: Layers,
      label: "Total tanker sections",
      hint: "Sections with tanker bookings",
      source: "live",
      ...live((d) => d.total_tanker_sections),
    },
    {
      id: "eligible",
      icon: ListChecks,
      label: "Sections with 100+ bookings",
      hint: "Demand-eligible sections",
      source: "audit",
      value: DATASET_AUDIT.eligibleSections,
      state: "ready",
    },
    {
      id: "assessed",
      icon: MapPinned,
      label: "Assessed and ranked",
      hint: "Matched to groundwater monitoring evidence",
      source: "live",
      highlight: true,
      ...live((d) => d.available_priority_sections),
    },
    {
      id: "unassessed",
      icon: MapPinOff,
      label: "Without verified location coverage",
      hint: "Demand-eligible, but not ranked here",
      source: "audit",
      value: DATASET_AUDIT.unassessedEligibleSections,
      state: "ready",
    },
    {
      id: "bookings",
      icon: Droplet,
      label: "Tanker bookings",
      hint: DATA_PERIODS.tanker,
      source: "audit",
      value: DATASET_AUDIT.totalBookings,
      state: "ready",
    },
  ];
}

function StatValue({ value, state }) {
  if (state === "ready") return formatInt(value);
  if (state === "loading") {
    return (
      <>
        <span className="skeleton" aria-hidden="true" />
        <span className="sr-only">Loading</span>
      </>
    );
  }
  return (
    <>
      <span aria-hidden="true">—</span>
      <span className="sr-only">Unavailable</span>
    </>
  );
}

export default function DatasetSummary({ data, status }) {
  const stats = buildStats(data, status);

  return (
    <section className="summary" aria-labelledby="summary-title">
      <div className="container">
        <div className="summary__head">
          <h2 id="summary-title">Dataset at a glance</h2>
          <p className="summary__period">Tanker demand period: {DATA_PERIODS.tanker}</p>
        </div>

        <ul className="summary__grid">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <li
                key={s.id}
                className={
                  "stat stat--" + s.source + (s.highlight ? " stat--highlight" : "")
                }
                style={{ "--i": i }}
              >
                <Icon size={18} aria-hidden="true" className="stat__icon" />
                <span className="stat__value mono">
                  <StatValue value={s.value} state={s.state} />
                </span>
                <span className="stat__label">{s.label}</span>
                <span className="stat__hint">{s.hint}</span>
                <span className="stat__source">
                  {s.source === "live" ? "Live from API" : "Dataset audit"}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}