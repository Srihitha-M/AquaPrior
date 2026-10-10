
import { useState } from "react";
import { usePriorities } from "./hooks/usePriorities";

import Header from "./components/Header";
import ScopeBanner from "./components/ScopeBanner";
import CapacitySelector from "./components/CapacitySelector";
import PriorityList from "./components/PriorityList";
import DatasetSummary from "./components/DatasetSummary";

import "./App.css";

export default function App() {
  const [capacity, setCapacity] = useState(5);
  const [selectedSection, setSelectedSection] = useState(null);

  const { status, data, error, retry } = usePriorities(capacity);

  return (
    <>
      <Header />

      <ScopeBanner
        assessed={data ? data.available_priority_sections : null}
      />

      <main className="container">
        <div className="workspace">
          <div className="workspace__left">
            <CapacitySelector
              capacity={capacity}
              onChange={setCapacity}
              status={status}
              data={data}
            />

            {status === "error" && (
              <div className="error-box" role="alert">
                <p style={{ margin: 0 }}>{error.message}</p>
                <button
                  type="button"
                  onClick={retry}
                  style={{ marginTop: 8 }}
                >
                  Try again
                </button>
              </div>
            )}

            <PriorityList
              areas={data ? data.areas : null}
              status={status}
              selected={selectedSection}
              onSelect={setSelectedSection}
            />
          </div>

          {/* Temporary until we build the evidence panel and map */}
          <div className="placeholder">
            <strong>
              {selectedSection
                ? `Selected: ${selectedSection}`
                : "Map and evidence panel"}
            </strong>
            <span>Arriving in Steps 6 and 7.</span>
          </div>
        </div>
      </main>

      <DatasetSummary data={data} status={status} />
    </>
  );
}
