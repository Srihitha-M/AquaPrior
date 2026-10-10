
import { TriangleAlert, CircleCheck } from "lucide-react";
import { describeEvidence, scoreParts } from "../lib/evidence";
import { formatInt, formatMeters, titleCase } from "../lib/format";
import "./PriorityCard.css";

export default function PriorityCard({ area, index, selected, onSelect }) {
  const evidence = describeEvidence(area);
  const parts = scoreParts(area);
  const caution = evidence.level === "caution";

  const change = area.groundwater_change_m;
  const trend =
    change == null ? "unavailable" :
    change < 0 ? "declining" :
    change > 0 ? "rising" : "unchanged";

  return (
    <li className="pc-item" style={{ "--i": Math.min(index, 8) }}>
      <button
        type="button"
        className={"pcard" + (selected ? " is-selected" : "")}
        aria-pressed={selected}
        onClick={() => onSelect(area.section)}
      >
        <span className="pcard__rank mono" aria-label={`Rank ${area.rank}`}>
          {area.rank}
        </span>

        <span className="pcard__main">
          <span className="pcard__top">
            <span className="pcard__name">
              {titleCase(area.section)}
            </span>

            <span className="pcard__score mono">
              {Number(area.priority_score).toFixed(1)}
              <span className="pcard__score-label">
                priority score
              </span>
            </span>
          </span>

          <span
            className="pcard__bar"
            role="img"
            aria-label={`Score made of ${parts.tanker.toFixed(1)} from tanker demand and ${parts.groundwater.toFixed(1)} from groundwater trend`}
          >
            <span
              className="pcard__bar-t"
              style={{ width: parts.tanker + "%" }}
            />
            <span
              className="pcard__bar-g"
              style={{ width: parts.groundwater + "%" }}
            />
          </span>

          <span className="pcard__legend">
            <span>
              <i className="dot dot--t" />
              Tanker demand {parts.tanker.toFixed(1)}
            </span>
            <span>
              <i className="dot dot--g" />
              Groundwater {parts.groundwater.toFixed(1)}
            </span>
          </span>

          <span className="pcard__facts">
            <span>
              <strong className="mono">
                {formatInt(area.bookings)}
              </strong>{" "}
              tanker bookings
            </span>

            <span>
              Groundwater (5 km median){" "}
              <strong className="mono">
                {formatMeters(change)}
              </strong>{" "}
              {trend}
            </span>
          </span>

          <span className={"pcard__chip pcard__chip--" + evidence.level}>
            {caution ? (
              <TriangleAlert size={14} aria-hidden="true" />
            ) : (
              <CircleCheck size={14} aria-hidden="true" />
            )}

            <span>
              <strong>{evidence.label}</strong>
              {caution && (
                <span className="pcard__flag">
                  {" "}· {evidence.flags[0]}
                </span>
              )}
            </span>
          </span>
        </span>
      </button>
    </li>
  );
}
