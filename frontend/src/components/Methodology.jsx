
import "./Methodology.css";

const coverage = [
  { number: "295", label: "Total tanker sections" },
  { number: "218", label: "Sections with enough tanker demand" },
  { number: "23", label: "Sections assessed with groundwater data" },
  { number: "195", label: "Sections awaiting location verification" },
];

const steps = [
  {
    number: "01",
    title: "Understand tanker demand",
    description:
      "Count tanker bookings to see which areas have requested more water tanker services.",
  },
  {
    number: "02",
    title: "Examine groundwater evidence",
    description:
      "Look at measurements from nearby groundwater stations and check how much evidence is available.",
  },
  {
    number: "03",
    title: "Calculate investigation priority",
    description:
      "Combine the two signals using a clear 60% demand and 40% groundwater scoring method.",
  },
  {
    number: "04",
    title: "Help people decide what to check",
    description:
      "Show ranked areas and supporting evidence so people can investigate further before taking action.",
  },
];

export default function Methodology() {
  return (
    <main className="method-page">
      <div className="container">

        {/* PAGE INTRODUCTION */}

        <header className="method-page__header">
          <span className="method-page__eyebrow">
            METHODOLOGY & TRANSPARENCY
          </span>

          <h1>How AquaPrior makes priorities explainable.</h1>

          <p>
            How do we decide which areas may need closer attention?
            AquaPrior combines water tanker booking records with
            nearby groundwater measurements to help identify
            areas worth investigating.
          </p>
        </header>

        {/* 01 — DATA COVERAGE */}

        <section className="method-page__section">
          <div className="method-page__section-heading">
            <span>01 / DATA COVERAGE</span>
            <h2>What data are we working with?</h2>
          </div>

          <div className="method-page__coverage">
            {coverage.map((item) => (
              <div
                className="method-page__coverage-card"
                key={item.label}
              >
                <strong>{item.number}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          <div className="method-page__note">
            <strong>Why aren't all 218 sections ranked?</strong>
            <br />
            Our records contain 295 tanker sections.
            Of these, 218 have at least 100 tanker bookings,
            making them eligible for further assessment.
            Only 23 currently have sufficient matched geographic
            and groundwater evidence for this analysis.
            The other 195 are not ignored — they appear in
            the Verification Queue, where their locations and
            nearby groundwater coverage can be checked.
            The remaining 77 sections fall below the
            100-booking threshold.
          </div>
        </section>

        {/* 02 — DATA SOURCES */}

        <section className="method-page__section">
          <div className="method-page__section-heading">
            <span>02 / DATA SOURCES</span>
            <h2>Where does our information come from?</h2>
          </div>

          <div className="method-page__sources">

            <article className="method-page__card">
              <span className="method-page__card-tag">
                WATER TANKER DEMAND
              </span>

              <h3>Tanker booking records</h3>

              <p>June – August 2026</p>

              <strong>712,931 recorded bookings</strong>

              <p>
                These records tell us how many tanker bookings
                were made across different sections.
                More bookings indicate greater recorded tanker
                demand, but do not automatically prove that
                an area has a water shortage.
              </p>
            </article>

            <article className="method-page__card">
              <span className="method-page__card-tag">
                GROUNDWATER EVIDENCE
              </span>

              <h3>Groundwater measurements</h3>

              <p>September 2 – October 2, 2026</p>

              <strong>Measurements from nearby stations</strong>

              <p>
                Groundwater is water found below the Earth's
                surface. Measuring stations help us understand
                how groundwater levels change.
                AquaPrior examines available observations
                near the assessed sections.
              </p>
            </article>

          </div>

          <div className="method-page__caution">
            <strong>Important: The dates are different</strong>

            <p>
              Tanker bookings and groundwater measurements
              come from different time periods that do not
              overlap. AquaPrior combines them for an
              exploratory comparison, not to prove that
              groundwater changes caused tanker demand
              or to predict real-time water shortages.
            </p>
          </div>
        </section>

        {/* 03 — PRIORITY SCORING */}

        <section className="method-page__section">
          <div className="method-page__section-heading">
            <span>03 / PRIORITY SCORING</span>
            <h2>How is an area's priority calculated?</h2>
          </div>

          <div className="method-page__formula">
            <span>RELATIVE INVESTIGATION PRIORITY</span>

            <div>
              <strong>60%</strong> Tanker demand score
              <b> + </b>
              <strong>40%</strong> Groundwater score
            </div>

            <p>
              In simple words: AquaPrior looks at two things —
              how many water tanker bookings an area has
              and what nearby groundwater measurements show.
              Tanker demand contributes 60% to the score,
              while groundwater evidence contributes 40%.
              Both scores are adjusted to a common scale
              before they are combined.
              The result helps compare which of the
              23 assessed sections may deserve investigation first.
            </p>
          </div>

          <div className="method-page__note">
            <strong>What does a higher score mean?</strong>
            <br />
            A higher score means higher relative investigation
            priority among the 23 assessed sections.
            It does not mean a confirmed water shortage,
            a percentage chance of scarcity, or a direct
            measurement of household water access.
          </div>
        </section>

        {/* 04 — UNDERSTANDING THE EVIDENCE */}

        <section className="method-page__section">
          <div className="method-page__section-heading">
            <span>04 / UNDERSTANDING THE EVIDENCE</span>
            <h2>Why does groundwater station distance matter?</h2>
          </div>

          <div className="method-page__limitations">

            <p>
              <strong>What is a groundwater station?</strong>
              <br />
              It is a location where groundwater levels
              are measured. These observations help us
              understand water conditions below the ground.
            </p>

            <p>
              <strong>Why compare 3 km and 5 km?</strong>
              <br />
              AquaPrior examines groundwater evidence from
              nearby stations within these distances.
              Comparing the two distances helps reveal
              whether the picture changes when a wider
              surrounding area is considered.
            </p>

            <p>
              <strong>What if there are very few nearby stations?</strong>
              <br />
              There may not be enough local measurements
              to represent the whole section confidently.
              AquaPrior shows station coverage so users
              can understand this limitation.
            </p>

            <p>
              <strong>What if the 3 km and 5 km results disagree?</strong>
              <br />
              This means the interpretation may depend
              on which nearby stations are included.
              It is a reason to investigate further,
              not proof that either result is correct.
            </p>

          </div>
        </section>

        {/* 05 — DECISION WORKFLOW */}

        <section className="method-page__section">
          <div className="method-page__section-heading">
            <span>05 / DECISION WORKFLOW</span>
            <h2>From information to investigation</h2>
          </div>

          <div className="method-page__steps">
            {steps.map((step) => (
              <article
                className="method-page__step"
                key={step.number}
              >
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </section>

        {/* 06 — VERIFICATION & SAFEGUARDS */}

        <section className="method-page__section">
          <div className="method-page__section-heading">
            <span>06 / VERIFICATION & SAFEGUARDS</span>
            <h2>What should users keep in mind?</h2>
          </div>

          <div className="method-page__limitations">

            <p>
              <strong>Unverified locations:</strong>
              {" "}
              The 195 sections awaiting verification
              are excluded from groundwater-based ranking
              until their locations and matching evidence
              can be checked.
            </p>

            <p>
              <strong>Verification urgency:</strong>
              {" "}
              The Verification Queue uses tanker booking
              counts to organize work:
              the highest-demand 20% are marked
              "Verify first", the next 30% "Verify next",
              and the remaining 50% "Routine".
              These labels indicate verification order,
              not confirmed water-scarcity risk.
            </p>

            <p>
              <strong>Limited groundwater coverage:</strong>
              {" "}
              Nearby measuring stations may not
              represent conditions across an entire section.
              Results should be interpreted with this
              uncertainty in mind.
            </p>

            <p>
              <strong>People make the final decisions:</strong>
              {" "}
              AquaPrior supports investigation.
              Field verification, local infrastructure
              knowledge, and updated data are needed
              before deciding where to allocate resources.
            </p>

          </div>
        </section>

        {/* CLOSING */}

        <div className="method-page__closing">
          <span>THE AQUAPRIOR PRINCIPLE</span>

          <h2>Prioritize. Examine. Verify.</h2>

          <p>
            Better water decisions begin with transparent
            evidence — and a clear understanding of
            what that evidence can and cannot prove.
          </p>
        </div>

      </div>
    </main>
  );
}
