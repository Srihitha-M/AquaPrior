
import PriorityCard from "./PriorityCard";
import "./PriorityList.css";

export default function PriorityList({
  areas,
  status,
  selected,
  onSelect
}) {
  // Show loading placeholders while the first API request runs.
  if (!areas) {
    return (
      <ul
        className="plist"
        aria-busy="true"
        aria-label="Loading ranked areas"
      >
        {[0, 1, 2].map((n) => (
          <li key={n} className="plist__skeleton" />
        ))}
      </ul>
    );
  }

  if (areas.length === 0) {
    return (
      <div className="plist__empty">
        <strong>No areas returned</strong>
        <span>
          The API responded, but the ranking list was empty.
        </span>
      </div>
    );
  }

  return (
    <ul
      className={
        "plist" + (status === "loading" ? " is-updating" : "")
      }
      aria-label="Ranked areas to investigate"
    >
      {areas.map((area, i) => (
        <PriorityCard
          key={area.section}
          area={area}
          index={i}
          selected={selected === area.section}
          onSelect={onSelect}
        />
      ))}
    </ul>
  );
}
