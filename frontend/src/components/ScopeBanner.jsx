import { Info } from "lucide-react";
import "./ScopeBanner.css";

export default function ScopeBanner({ assessed }) {
  const scope = assessed
    ? `the ${assessed} sections with groundwater evidence`
    : "only sections with groundwater evidence";

  return (
    <div className="scope-banner" role="note">
      <div className="container scope-banner__inner">
        <Info
          size={18}
          aria-hidden="true"
          className="scope-banner__icon"
        />
        <p>
          <strong>
            Rankings cover {scope}, not all of Hyderabad.
          </strong>{" "}
          <span>
            The score is a prototype prioritization heuristic,
            not a validated measure of water scarcity.
          </span>
        </p>
      </div>
    </div>
  );
}