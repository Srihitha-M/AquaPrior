
import { Link } from "react-router-dom";
import "./Header.css";

export default function Header() {
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
            <span className="hl">
              begin with evidence.
            </span>
          </h1>

          <p className="lede">
            Discover where engineers should investigate first,
            understand the evidence behind every priority,
            and identify what needs verification next.
          </p>

          <div className="hero__actions">
            <Link to="/planner" className="hero__button">
              Explore Priorities{" "}
              <span aria-hidden="true">↗</span>
            </Link>

            <Link to="/explore" className="hero__secondary">
              Explore the Map{" "}
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="impact">
            <div className="impact__item">
              <strong>7,12,931</strong>
              <span>Tanker bookings analysed</span>
            </div>

            <div className="impact__item">
              <strong>295</strong>
              <span>Sections in the dataset</span>
            </div>

            <div className="impact__item">
              <strong>23</strong>
              <span>
                Sections assessed with groundwater evidence
              </span>
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
