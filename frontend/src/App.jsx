
import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";

import { usePriorities } from "./hooks/usePriorities";
import ExploreMap from "./components/ExploreMap";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import Methodology from "./components/Methodology";
import ScopeBanner from "./components/ScopeBanner";
import CapacitySelector from "./components/CapacitySelector";
import PriorityList from "./components/PriorityList";
import DatasetSummary from "./components/DatasetSummary";
import VerificationQueue from "./components/VerificationQueue";
import verificationData from "./data/verificationQueue.json";
import EvidenceExplorer from "./components/EvidenceExplorer";

import "./App.css";

function Planner({
  capacity,
  setCapacity,
  data,
  status,
  error,
  retry,
}) {
  const [selectedSection, setSelectedSection] = useState(null);

  const selectedArea =
    data?.areas?.find(
      (area) => area.section === selectedSection
    ) ?? null;

  const toggleEvidence = (section) => {
    setSelectedSection((current) =>
      current === section ? null : section
    );
  };

  return (
    <>
      <ScopeBanner
        assessed={data?.available_priority_sections ?? null}
      />

      <main className="container planner-page">
        <div className="planner-content">
          <div className="planner-selector">
            <CapacitySelector
              capacity={capacity}
              onChange={setCapacity}
              status={status}
              data={data}
            />
          </div>

          <div
            className={
              "planner-body" +
              (selectedArea ? " has-evidence" : "")
            }
          >
            <section
              className="planner-results"
              aria-labelledby="rankings-title"
            >
              <div className="planner-results__head">
                <h2 id="rankings-title">
                  Top areas to investigate
                </h2>

                <p>
                  {status === "loading"
                    ? "Updating rankings…"
                    : status === "error"
                    ? "Unable to refresh rankings."
                    : `${
                        data?.areas?.length ?? capacity
                      } selected · Ranked by tanker demand and groundwater evidence`}
                </p>

                <p className="planner-results__score-note">
                  The mini bars show relative component
                  scores (0–100). The ranking combines
                  tanker demand (60%) and groundwater
                  evidence (40%). Click Why? for details.
                </p>
              </div>

              {status === "error" && (
                <div className="error-box" role="alert">
                  <p>
                    {error?.message ??
                      "Could not load rankings."}
                  </p>

                  <button type="button" onClick={retry}>
                    Try again
                  </button>
                </div>
              )}

             

              <PriorityList
                areas={data?.areas ?? null}
                status={status}
                selected={selectedSection}
                onSelect={toggleEvidence}
              />

              {data?.areas?.length > 0 &&
                data.available_priority_sections >
                  data.areas.length && (
                  <p className="planner-results__remaining">
                    {data.available_priority_sections -
                      data.areas.length}{" "}
                    more assessed areas are outside this
                    selection.
                  </p>
                )}
            </section>

            {selectedArea && (
              <aside className="planner-evidence">
                <div className="planner-evidence__shell">
                  <div className="planner-evidence__header">
                    <span>WHY THIS AREA?</span>

                    <button
                      type="button"
                      className="planner-evidence__close"
                      onClick={() => setSelectedSection(null)}
                      aria-label="Close evidence panel"
                    >
                      ✕
                    </button>
                  </div>

                  <EvidenceExplorer area={selectedArea} />
                </div>
              </aside>
            )}
          </div>
        </div>
      </main>

      <DatasetSummary data={data} status={status} />
    </>
  );
}

function Home() {
  return (
    <>
      <Header />

      <section className="home-intro">
        <div className="container home-intro__content">
          <span className="home-intro__eyebrow">
            FROM INSIGHT TO ACTION
          </span>

          <h2>
            From water data to better decisions.
          </h2>

          <p>
            Turn tanker demand and groundwater evidence
            into clear investigation priorities — so
            engineers know where to focus, what to
            examine, and what to verify.
          </p>

          <Link to="/planner" className="home-intro__link">
            Explore priority rankings{" "}
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    </>
  );
}

export default function App() {
  const [capacity, setCapacity] = useState(5);

  const {
    status,
    data,
    error,
    retry,
  } = usePriorities(capacity);

  const {
    status: mapStatus,
    data: mapData,
  } = usePriorities(23);

  return (
    <>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/planner"
          element={
            <Planner
              capacity={capacity}
              setCapacity={setCapacity}
              data={data}
              status={status}
              error={error}
              retry={retry}
            />
          }
        />

        <Route
          path="/explore"
          element={
            <ExploreMap
              data={mapData}
              status={mapStatus}
            />
          }
        />

        <Route
          path="/verification"
          element={
            <VerificationQueue
              sections={verificationData}
            />
          }
        />

        <Route
          path="/methodology"
          element={<Methodology />}
        />
      </Routes>
    </>
  );
}
