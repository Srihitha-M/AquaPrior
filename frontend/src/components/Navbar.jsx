
import { NavLink } from "react-router-dom";
import "./Navbar.css";

const links = [
  { to: "/", label: "Home" },
  { to: "/explore", label: "Explore Map" },
  { to: "/planner", label: "Priority Planner" },
  { to: "/verification", label: "Verification Queue" },
  { to: "/methodology", label: "Methodology" },
];

export default function Navbar() {
  return (
    <nav className="navbar" aria-label="Main navigation">
      <div className="navbar__inner">

        {/* AQUAPRIOR BRAND */}
        <NavLink
          to="/"
          className="navbar__brand"
          aria-label="AquaPrior Home"
        >
          <span className="ap-mark" aria-hidden="true">
            <svg viewBox="0 0 48 48" fill="none">
              <circle
                cx="24"
                cy="21"
                r="12"
                stroke="currentColor"
                strokeWidth="5"
              />
              <circle
                cx="24"
                cy="40"
                r="3"
                fill="#A5D8FF"
              />
            </svg>
          </span>

          <span className="ap-brand-name">
            AquaPrior
          </span>
        </NavLink>

        {/* NAVIGATION LINKS */}
        <div className="navbar__links">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `navbar__link ${
                  isActive ? "navbar__link--active" : ""
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

      </div>
    </nav>
  );
}
