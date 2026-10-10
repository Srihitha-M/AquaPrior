
import { Minus, Plus, Info } from "lucide-react";
import {
  MIN_CAPACITY,
  MAX_CAPACITY,
  CAPACITY_PRESETS,
} from "../config";
import "./CapacitySelector.css";

const clamp = (n) =>
  Math.min(MAX_CAPACITY, Math.max(MIN_CAPACITY, n));

export default function CapacitySelector({
  capacity,
  onChange,
  status,
  data,
}) {
  const pct =
    ((capacity - MIN_CAPACITY) /
      Math.max(1, MAX_CAPACITY - MIN_CAPACITY)) *
    100;

  const isLoading = status === "loading";
  const isError = status === "error";

  const selectedCount = data?.selected ?? capacity;
  const assessedCount =
    data?.available_priority_sections ?? MAX_CAPACITY;

  return (
    <section className="cap" aria-labelledby="cap-title">
      <div className="cap__decor" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <div className="cap__content">
        <span className="cap__eyebrow">
          PRIORITY PLANNER
        </span>

<h2 id="cap-title" className="cap__title">
  How many areas can your team investigate?
</h2>

<p className="cap__intro">
  Choose based on your available time, people, and resources.
</p>

        <div className="cap__selection">
          <div className="cap__selection-top">
            <div className="cap__value">
              <span className="cap__value-number mono">
                {capacity}
              </span>
              <span className="cap__value-unit">
                {capacity === 1 ? "area" : "areas"}
              </span>
            </div>

            <div
              className="cap__steppers"
              role="group"
              aria-label="Adjust number of areas"
            >
              <button
                type="button"
                className="cap__step"
                onClick={() =>
                  onChange(clamp(capacity - 1))
                }
                disabled={capacity <= MIN_CAPACITY}
                aria-label="One fewer area"
              >
                <Minus size={19} aria-hidden="true" />
              </button>

              <button
                type="button"
                className="cap__step"
                onClick={() =>
                  onChange(clamp(capacity + 1))
                }
                disabled={capacity >= MAX_CAPACITY}
                aria-label="One more area"
              >
                <Plus size={19} aria-hidden="true" />
              </button>
            </div>
          </div>

          <input
            className="cap__range"
            type="range"
            min={MIN_CAPACITY}
            max={MAX_CAPACITY}
            step="1"
            value={capacity}
            onChange={(e) =>
              onChange(Number(e.target.value))
            }
            style={{ "--pct": `${pct}%` }}
            aria-label="How many areas can your team investigate?"
            aria-valuetext={`${capacity} ${
              capacity === 1 ? "area" : "areas"
            }`}
          />

          <div className="cap__ticks">
            

            {CAPACITY_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                className={
                  "cap__tick" +
                  (capacity === preset ? " is-active" : "")
                }
                style={{
                  left: `${
                    ((preset - MIN_CAPACITY) /
                      Math.max(
                        1,
                        MAX_CAPACITY - MIN_CAPACITY
                      )) *
                    100
                  }%`,
                }}
                aria-label={`Select ${preset} areas`}
                aria-pressed={capacity === preset}
                onClick={() => onChange(clamp(preset))}
              >
                {preset}
              </button>
            ))}

           
          </div>
<p className="cap__slider-hint">
  Choose between 1 and 23 assessed areas.
</p>
         
        </div>

       <div className="cap__footer">
  <p
    className={"cap__status" + (isError ? " is-error" : "")}
    role="status"
    aria-live="polite"
  >
    {isError
      ? "Couldn't update rankings. Please try again."
      : isLoading
      ? "Updating rankings…"
      : data
      ? `Showing your top ${data.selected} areas to investigate first.`
      : "Loading rankings…"}
  </p>

          <p className="cap__disclaimer">
            <Info size={15} aria-hidden="true" />
            <span>
              These are suggested investigation priorities,
              not confirmed water shortages or tanker allocations.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
