
import { useMemo, useState } from "react";
import "./VerificationQueue.css";

export default function VerificationQueue({ sections = [] }) {
  const [search, setSearch] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState("all");

  // Rank sections by tanker bookings
  const rankedSections = useMemo(
    () => [...sections].sort((a, b) => b.bookings - a.bookings),
    [sections]
  );

  // Assign verification urgency based on relative demand
  const urgencyBySection = useMemo(() => {
    const total = rankedSections.length;
    const firstCutoff = Math.ceil(total * 0.2);
    const nextCutoff = Math.ceil(total * 0.5);

    return Object.fromEntries(
      rankedSections.map((item, index) => [
        item.section,
        index < firstCutoff
          ? "first"
          : index < nextCutoff
          ? "next"
          : "routine",
      ])
    );
  }, [rankedSections]);

  // Count sections in each category
  const counts = useMemo(() => {
    const total = rankedSections.length;
    const first = Math.ceil(total * 0.2);
    const next = Math.ceil(total * 0.5) - first;

    return {
      all: total,
      first,
      next,
      routine: total - first - next,
    };
  }, [rankedSections]);

  // Search and filter sections together
  const filtered = useMemo(() => {
    const normalize = (text) =>
      String(text).toLowerCase().replace(/[^a-z0-9]/g, "");

    return rankedSections.filter((item) => {
      const matchesSearch = normalize(item.section).includes(
        normalize(search)
      );

      const matchesUrgency =
        urgencyFilter === "all" ||
        urgencyBySection[item.section] === urgencyFilter;

      return matchesSearch && matchesUrgency;
    });
  }, [rankedSections, search, urgencyFilter, urgencyBySection]);

  const filters = [
    { value: "all", label: "All sections", count: counts.all },
    { value: "first", label: "Verify first", count: counts.first },
    { value: "next", label: "Verify next", count: counts.next },
    { value: "routine", label: "Routine", count: counts.routine },
  ];

  return (
    <main className="verification-page">
      <div className="container">
        <div className="verification-page__header">
          <span className="verification-page__eyebrow">
            DATA QUALITY & COVERAGE
          </span>

          <h1>Verification Queue</h1>

          <p>
            Not every high-demand section has sufficient geographic
            evidence to support a groundwater-based ranking.
            These sections need location verification before assessment.
          </p>
        </div>

        <div className="verification-page__stats">
          <div>
            <strong>{sections.length}</strong>
            <span>Awaiting location verification</span>
          </div>

          <div>
            <strong>23</strong>
            <span>Assessed with groundwater evidence</span>
          </div>

          <div>
            <strong>218</strong>
            <span>Demand-eligible sections</span>
          </div>
        </div>

        {/* Clickable verification urgency filters */}
        <div className="verification-page__filters">
          {filters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              className={`verification-page__filter ${
                urgencyFilter === filter.value ? "is-active" : ""
              }`}
              onClick={() => setUrgencyFilter(filter.value)}
              aria-pressed={urgencyFilter === filter.value}
            >
              {filter.label}
              <span>{filter.count}</span>
            </button>
          ))}
        </div>

        <div className="verification-page__content">
          <div className="verification-page__toolbar">
            <div>
              <h2>Sections requiring verification</h2>
              <p>
                Sorted by tanker demand, not groundwater priority.
              </p>
            </div>

            <input
              type="search"
              placeholder="Search section..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search unverified sections"
            />
          </div>

          {filtered.length > 0 ? (
            <div className="verification-page__table-wrap">
              <table className="verification-page__table">
                <thead>
                  <tr>
                    <th>Section</th>
                    <th>Tanker bookings</th>
                    <th>Verification urgency</th>
                    <th>Next step</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((item) => {
                    const urgency = urgencyBySection[item.section];

                    const urgencyLabel =
                      urgency === "first"
                        ? "Verify first"
                        : urgency === "next"
                        ? "Verify next"
                        : "Routine verification";

                    return (
                      <tr key={item.section}>
                        <td>
                          <strong>{item.section}</strong>
                        </td>

                        <td>
                          {Number(item.bookings).toLocaleString("en-IN")}
                        </td>

                        <td>
                          <span
                            className={`verification-page__urgency verification-page__urgency--${urgency}`}
                          >
                            {urgencyLabel}
                          </span>
                        </td>

                        <td>
                          Verify coordinates and groundwater coverage
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="verification-page__empty">
              {sections.length === 0
                ? "The verification dataset has not been connected yet."
                : "No sections match your search or selected filter."}
            </div>
          )}
        </div>

        <p className="verification-page__footnote">
          Verification urgency is based only on relative tanker
          booking demand: top 20% verify first, next 30% verify next,
          and remaining 50% routine. These categories are workflow
          suggestions, not confirmed groundwater scarcity or risk
          assessments. Sections remain excluded from the
          groundwater-based ranking until their geographic evidence
          can be confirmed.
        </p>
      </div>
    </main>
  );
}
