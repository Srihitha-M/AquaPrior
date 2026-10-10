
import { Minus, Plus } from "lucide-react";
import { MIN_CAPACITY, MAX_CAPACITY, CAPACITY_PRESETS } from "../config";
import "./CapacitySelector.css";

const clamp = (n) => Math.min(MAX_CAPACITY, Math.max(MIN_CAPACITY, n));

export default function CapacitySelector({ capacity, onChange, status, data }) {
  const pct = ((capacity - MIN_CAPACITY) / (MAX_CAPACITY - MIN_CAPACITY)) * 100;

  let statusText = "Loading ranking…";

  if (status === "error") {
    statusText = "Could not update the ranking.";
  } else if (data) {
    statusText =
      status === "loading"
        ? "Updating ranking…"
        : `Showing the top ${data.selected} of ${data.available_priority_sections} assessed sections`;
  }

  return (
    <section className="cap" aria-labelledby="cap-title">
      <h2 id="cap-title" className="cap__title">
        How many areas can your team investigate?
      </h2>

      <p className="cap__note">
        This is a number of areas, not a budget. No costs are estimated.
      </p>

      <div className="cap__display">
        <button
          type="button"
          className="cap__step"
          onClick={() => onChange(clamp(capacity - 1))}
          disabled={capacity <= MIN_CAPACITY}
          aria-label="Investigate one fewer area"
        >
          <Minus size={18} aria-hidden="true" />
        </button>

        <div className="cap__number" aria-hidden="true">
          <span className="cap__big mono">{capacity}</span>
          <span className="cap__unit">
            {capacity === 1 ? "area" : "areas"}
          </span>
        </div>

        <button
          type="button"
          className="cap__step"
          onClick={() => onChange(clamp(capacity + 1))}
          disabled={capacity >= MAX_CAPACITY}
          aria-label="Investigate one more area"
        >
          <Plus size={18} aria-hidden="true" />
        </button>
      </div>

      <input
        className="cap__range"
        type="range"
        min={MIN_CAPACITY}
        max={MAX_CAPACITY}
        value={capacity}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ "--pct": pct + "%" }}
        aria-label="Number of areas to investigate"
        aria-valuetext={`${capacity} ${capacity === 1 ? "area" : "areas"}`}
      />

      <div className="cap__scale" aria-hidden="true">
        <span>{MIN_CAPACITY}</span>
        <span>{MAX_CAPACITY}</span>
      </div>

      <div className="cap__presets" role="group" aria-label="Quick presets">
        <span className="cap__presets-label">Quick select</span>

        {CAPACITY_PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            className={"cap__preset" + (capacity === p ? " is-active" : "")}
            aria-pressed={capacity === p}
            onClick={() => onChange(p)}
          >
            {p}
          </button>
        ))}
      </div>

      <p
        className={"cap__status" + (status === "error" ? " is-error" : "")}
        role="status"
        aria-live="polite"
      >
        <span
          className={"cap__dot" + (status === "loading" ? " is-busy" : "")}
          aria-hidden="true"
        />
        {statusText}
      </p>
    </section>
  );
}
