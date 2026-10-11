
import "./DemandInsights.css";

const formatNumber = (value) =>
  Number(value).toLocaleString("en-IN");

export default function DemandInsights({ areas, status }) {
 console.log("CHART CHECK", {
  status,
  count: areas?.length,
});
    if (!areas?.length) return null;

  const bookings = areas.map((area) =>
    Math.max(0, Number(area.bookings) || 0)
  );

  const totalBookings = bookings.reduce(
    (sum, value) => sum + value,
    0
  );

  const scores = areas
    .map((area) => Number(area.priority_score))
    .filter(Number.isFinite);

  const averageScore = scores.length
    ? scores.reduce((sum, value) => sum + value, 0) /
      scores.length
    : null;

  const highestRanked = areas.reduce((best, area) =>
    !best || Number(area.rank) < Number(best.rank)
      ? area
      : best
  , null);

  const highestBookings =
    Number(highestRanked?.bookings) || 0;

  const highestShare = totalBookings
    ? (highestBookings / totalBookings) * 100
    : 0;

  const sorted = [...areas].sort(
    (a, b) => Number(a.rank) - Number(b.rank)
  );

  const shades = [
    "#24658f",
    "#3989b7",
    "#62a8d0",
    "#94c7e3",
    "#c8e3f2",
  ];

const topFive = sorted.slice(0, 5);

const otherBookings = sorted
  .slice(5)
  .reduce(
    (sum, area) =>
      sum + Math.max(0, Number(area.bookings) || 0),
    0
  );

const chartGroups = [
  ...topFive.map((area) => ({
    name: area.section,
    bookings: Math.max(0, Number(area.bookings) || 0),
  })),
  ...(otherBookings > 0
    ? [{ name: "Other selected areas", bookings: otherBookings }]
    : []),
];

  return (
    <section
      className="di"
      aria-label="Demand and priority insights"
      aria-busy={status === "loading"}
    >
      <div className="di__head">
        <div>
          <h3>Demand & Priority Insights</h3>
          <p>Across your selected investigation areas</p>
        </div>
        <span className="di__icon" aria-hidden="true">
          ◉
        </span>
      </div>

      <div className="di__stats">
        <div className="di__stat">
          <span>Selected-area bookings</span>
          <strong>{formatNumber(totalBookings)}</strong>
          <small>Recorded tanker bookings</small>
        </div>

        <div className="di__stat">
          <span>Average priority score</span>
          <strong>
            {averageScore === null
              ? "—"
              : averageScore.toFixed(1)}
          </strong>
          <small>Relative heuristic score</small>
        </div>
      </div>

      <div className="di__chart">
        <div className="di__chart-head">
          <h4>Demand distribution</h4>
          <span>{areas.length} selected areas</span>
        </div>

       

<div
  className="di__bar"
  role="img"
  aria-label={`Distribution of ${formatNumber(totalBookings)} tanker bookings across ${areas.length} selected areas`}
>
  {totalBookings > 0 &&
    chartGroups.map((group, index) => {
      const share =
        (group.bookings / totalBookings) * 100;

      return (
        <div
          key={group.name}
          className="di__segment"
          style={{
            width: `${share}%`,
            backgroundColor:
              index === 5
                ? "#d2e3ef"
                : shades[index],
          }}
          title={`${group.name}: ${formatNumber(group.bookings)} bookings (${share.toFixed(1)}%)`}
        />
      );
    })}
</div>



        <div className="di__summary">
          <span>Highest-ranked area's share</span>
          <strong>{highestShare.toFixed(1)}%</strong>
        </div>
      </div>

      <p className="di__footnote">
        Booking shares are calculated only among the currently
        selected areas. Priority scores are comparative, not
        validated measures of water scarcity.
      </p>
    </section>
  );
}
