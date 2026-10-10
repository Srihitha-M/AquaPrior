
import "./EvidenceExplorer.css";

const number = (value) =>
  value === null || value === undefined
    ? "Not available"
    : Number(value).toLocaleString("en-IN");

const decimal = (value, digits = 2) =>
  value === null || value === undefined
    ? "Not available"
    : Number(value).toFixed(digits);

export default function EvidenceExplorer({ area }) {
  if (!area) {
    return (
      <aside className="evidence evidence--empty">
        <div className="evidence__empty-icon">◎</div>
        <span className="evidence__eyebrow">EVIDENCE EXPLORER</span>
        <h2>Select an area to investigate</h2>
        <p>
          Choose a ranked section on the left to examine its
          tanker demand, groundwater evidence, and investigation priority.
        </p>
      </aside>
    );
  }

  const change = area.groundwater_change_m;
  const changeText =
    change === null || change === undefined
      ? "Not available"
      : `${Number(change) > 0 ? "+" : ""}${decimal(change)} m`;

  return (
    <aside className="evidence">
      <div className="evidence__top">
        <span className="evidence__eyebrow">AREA EVIDENCE PROFILE</span>
        <span className="evidence__rank">RANK #{area.rank}</span>
      </div>

      <h2>{area.section}</h2>
      <p className="evidence__subtitle">
        A closer look at the evidence behind this investigation priority.
      </p>

      <div className="evidence__score">
        <div>
          <span>PRIORITY SCORE</span>
          <strong>{decimal(area.priority_score)}</strong>
        </div>
        <span className="evidence__score-caption">
          Relative ranking score, not a risk probability
        </span>
      </div>

      <div className="evidence__metrics">
        <div className="evidence__metric">
          <span>Tanker bookings</span>
          <strong>{number(area.bookings)}</strong>
        </div>

        <div className="evidence__metric">
          <span>Groundwater change (5 km median)</span>
          <strong>{changeText}</strong>
        </div>

        <div className="evidence__metric">
          <span>Nearby stations</span>
          <strong>{number(area.nearby_stations)}</strong>
        </div>

        <div className="evidence__metric">
          <span>Nearest station</span>
          <strong>
            {area.nearest_station_km == null
              ? "Not available"
              : `${decimal(area.nearest_station_km)} km`}
          </strong>
        </div>
      </div>

      <div className="evidence__section">
        <h3>Why this area ranks here</h3>

        <div className="evidence__factor">
          <span>Tanker demand score (60% weight)</span>
          <strong>{decimal(area.tanker_score)}</strong>
        </div>

        <div className="evidence__factor">
          <span>Groundwater score (40% weight)</span>
          <strong>{decimal(area.groundwater_score)}</strong>
        </div>

        <p className="evidence__note">
          The ranking combines tanker demand (60%) and nearby
          groundwater change (40%). Scores are comparative,
          not predictions.
        </p>
      </div>

      <div className="evidence__section">
        <h3>Evidence quality</h3>

        <div className="evidence__detail">
          <span>Station coverage</span>
          <strong>{area.station_coverage ?? "Not available"}</strong>
        </div>

        <div className="evidence__detail">
          <span>Trend reliability</span>
          <strong>{area.trend_reliability ?? "Not available"}</strong>
        </div>

        {area.radius_disagrees === true && (
          <p className="evidence__warning">
            Nearby-station results differ across search radii.
            Review this evidence before making decisions.
          </p>
        )}
      </div>

      <div className="evidence__action">
        <span>RECOMMENDED NEXT STEP</span>
        <p>{area.action || "Review local conditions before action."}</p>
      </div>

      <p className="evidence__disclaimer">
        Tanker demand and groundwater observations come from
        different time windows. Field verification is required.
      </p>
    </aside>
  );
}
