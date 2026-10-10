
import { Link } from "react-router-dom";
import "./Header.css";

const TOTAL_BOOKINGS = 712931;

export default function Header({ data }) {
  const areas = data?.areas ?? [];

  const bookings = data
    ? areas.reduce((sum, area) => sum + Number(area.bookings || 0), 0)
    : null;

  const share =
    bookings === null
      ? null
      : (bookings / TOTAL_BOOKINGS) * 100;

  return (
    <header className="hero">
      <div className="container hero__content">
        <div className="hero__body">
          <p className="eyebrow">
            HYDERABAD WATER INTELLIGENCE
          </p>

          <h1>
            Better water decisions
            <br />
            <span className="hl">begin with evidence.</span>
          </h1>

          <p className="lede">
            Discover where engineers should investigate first,
            understand the evidence behind every priority,
            and identify what needs verification next.
          </p>

          <div className="hero__actions">
            <Link to="/planner" className="hero__button">
              Explore Priorities <span aria-hidden="true">↗</span>
            </Link>

            <Link to="/explore" className="hero__secondary">
              Explore the Map <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="impact">
            <div className="impact__item">
              <strong>{data ? areas.length : "—"}</strong>
              <span>Areas selected</span>
            </div>

            <div className="impact__item">
              <strong>
                {bookings === null
                  ? "—"
                  : bookings.toLocaleString("en-IN")}
              </strong>
              <span>Selected tanker bookings</span>
            </div>

            <div className="impact__item">
              <strong>
                {share === null ? "—" : `${share.toFixed(1)}%`}
              </strong>
              <span>Share of all Jun–Aug bookings</span>
            </div>
          </div>
        </div>

       
<div className="hero__visual" aria-hidden="true">
  <div className="hero__orb hero__orb--outer" />
  <div className="hero__orb hero__orb--middle" />
  <div className="hero__orb hero__orb--inner" />

  <span className="hero__signature-dot" />

  <div className="hero__visual-label">
    DATA → EVIDENCE → ACTION
  </div>
</div>

      </div>
    </header>
  );
}
