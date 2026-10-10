
import { ChevronDown, ChevronUp } from "lucide-react";
import { titleCase, formatInt } from "../lib/format";
import "./PriorityCard.css";

export default function PriorityCard({
  area,
  selected,
  onSelect,
}) {
  const expanded = Boolean(selected);
  const score = Number(area.priority_score);

  return (
    <li className={"pc-item" + (expanded ? " is-open" : "")}>
      <div className="pcard">
        <div className="pcard__row">
          <span className="pcard__rank mono">
            {String(area.rank).padStart(2, "0")}
          </span>

          <div className="pcard__main">
            <strong className="pcard__name">
              {titleCase(area.section)}
            </strong>

            <span className="pcard__bookings">
              {formatInt(area.bookings)} tanker bookings
            </span>
            
<div className="pcard__signals" aria-label="Priority score components">
  {[
    {
      label: "Demand",
      value: area.tanker_score,
      className: "demand",
    },
    {
      label: "Groundwater",
      value: area.groundwater_score,
      className: "groundwater",
    },
  ].map((signal) => {
    const value = Number(signal.value);
    const valid =
      signal.value !== null &&
      signal.value !== undefined &&
      Number.isFinite(value);

    const width = valid
      ? Math.max(0, Math.min(100, value))
      : 0;

    return (
      <div className="pcard__signal" key={signal.label}>
        <div className="pcard__signal-label">
         <span>
  {signal.className === "demand"
    ? "Tanker demand score"
    : "Groundwater score"}
</span>

<strong>
  {valid ? `${value.toFixed(0)}/100` : "—"}
</strong>
        </div>

        <div
          className="pcard__signal-track"
          role="img"
          aria-label={`${signal.label} score: ${
            valid ? value.toFixed(1) : "not available"
          }`}
        >
          <div
            className={`pcard__signal-fill is-${signal.className}`}
            style={{ width: `${width}%` }}
          />
        </div>
      </div>
    );
  })}
</div>

          </div>

          <div className="pcard__score">
            <strong className="mono">
              {Number.isFinite(score)
                ? score.toFixed(1)
                : "—"}
            </strong>
            <span>Score</span>
          </div>

          <button
            type="button"
            className="pcard__why"
            aria-expanded={expanded}
            aria-label={`${
              expanded ? "Hide" : "Show"
            } evidence for ${titleCase(area.section)}`}
            onClick={() => onSelect(area.section)}
          >
            {expanded ? "Hide" : "Why?"}
            {expanded ? (
              <ChevronUp size={16} aria-hidden="true" />
            ) : (
              <ChevronDown size={16} aria-hidden="true" />
            )}
          </button>
        </div>

       
      </div>
    </li>
  );
}
