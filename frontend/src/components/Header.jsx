import { Droplets } from "lucide-react";
import ContourLines from "./ContourLines";
import "./Header.css";

export default function Header() {
  return (
    <header className="site-header">
      <ContourLines />
      <div className="container">
        <div className="site-header__bar">
          <div className="brand">
            <span className="brand__mark" aria-hidden="true">
              <Droplets size={20} strokeWidth={2} />
            </span>
            <span className="brand__name">AquaPrior</span>
            <span className="brand__tagline">Turning Water Data into Action.</span>
          </div>
          <span className="proto-tag">Decision-support prototype</span>
        </div>

        <div className="site-header__intro">
          <p className="eyebrow">Hyderabad · Water-resource prioritization</p>
          <h1>Where should a water-board engineer investigate first?</h1>
          
<p className="lede">
  Choose how many areas your team can investigate. AquaPrior ranks them
  by tanker demand and nearby groundwater trend, and shows how strong
  the evidence is.
</p>

        </div>
      </div>
    </header>
  );
}