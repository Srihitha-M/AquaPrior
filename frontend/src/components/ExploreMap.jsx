
import { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./ExploreMap.css";

import { sectionCoordinates } from "../data/sectionCoordinates";

const formatNumber = (value) =>
  Number(value).toLocaleString("en-IN");

const normalize = (name) =>
  String(name ?? "").trim().toUpperCase();

function FitToAreas({ areas }) {
  const map = useMap();

  useEffect(() => {
    if (areas.length === 0) return;

    const points = areas.map((area) => area.coordinates);

    map.fitBounds(points, {
      padding: [45, 45],
      maxZoom: 12,
    });
  }, [areas, map]);

  return null;
}

export default function ExploreMap({ data, status }) {
  const [selectedArea, setSelectedArea] = useState(null);

  const areas = useMemo(() => {
    return (data?.areas ?? [])
      .filter((area) => sectionCoordinates[normalize(area.section)])
      .map((area) => ({
        ...area,
        coordinates: sectionCoordinates[normalize(area.section)],
      }));
  }, [data]);

  const activeArea =
    areas.find((area) => area.section === selectedArea) ??
    areas[0] ??
    null;

  return (
    <main className="map-page">
      <div className="container">
        <div className="map-page__heading">
          <div>
            <span className="map-page__eyebrow">
              GEOGRAPHIC EVIDENCE EXPLORER
            </span>
            <h1>Explore Hyderabad's water priorities.</h1>
            <p>
              Explore the locations behind the priority rankings.
              Select a marker to inspect its supporting evidence.
            </p>
          </div>

          <div className="map-page__count">
            <strong>{areas.length}</strong>
            <span>Mapped ranked areas</span>
          </div>
        </div>

        <div className="map-page__layout">
          <div className="map-page__map">
            <MapContainer
              center={[17.44, 78.39]}
              zoom={11}
              scrollWheelZoom={false}
              className="map-page__leaflet"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <FitToAreas areas={areas} />

              {areas.map((area) => (
                <CircleMarker
                  key={area.section}
                  center={area.coordinates}
                  radius={area.section === activeArea?.section ? 12 : 8}
                  pathOptions={{
                    color: "#ffffff",
                    weight: 2,
                    fillColor:
                      area.section === activeArea?.section
                        ? "#f0a34a"
                        : "#1768a8",
                    fillOpacity: 0.9,
                  }}
                  eventHandlers={{
                    click: () => setSelectedArea(area.section),
                  }}
                >
                  <Popup>
                    <strong>{area.section}</strong>
                    <div>
                      Rank #{area.rank} · Score{" "}
                      {Number(area.priority_score).toFixed(1)}
                    </div>
                    <div>
                      {formatNumber(area.bookings)} tanker bookings
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>

            <div className="map-page__map-footer">
              <span>● Blue: ranked area</span>
              <span>● Amber: selected area</span>
              <span>Locations from verified section coordinates</span>
            </div>
          </div>

          <aside className="map-page__details">
            <span className="map-page__eyebrow">
              SELECTED LOCATION
            </span>

            {activeArea ? (
              <>
                <h2>{activeArea.section}</h2>

                <div className="map-page__rank">
                  Rank #{activeArea.rank}
                </div>

                <div className="map-page__metric">
                  <span>Priority score</span>
                  <strong>
                    {Number(activeArea.priority_score).toFixed(2)}
                  </strong>
                </div>

                <div className="map-page__metric">
                  <span>Tanker bookings</span>
                  <strong>{formatNumber(activeArea.bookings)}</strong>
                </div>

                <div className="map-page__metric">
                  <span>Groundwater change (5 km median)</span>
                  <strong>
                    {activeArea.groundwater_change_m == null
                      ? "Not available"
                      : `${Number(
                          activeArea.groundwater_change_m
                        ).toFixed(2)} m`}
                  </strong>
                </div>

                <div className="map-page__metric">
                  <span>Trend reliability</span>
                  <strong>
                    {activeArea.trend_reliability ?? "Not available"}
                  </strong>
                </div>

                <div className="map-page__action">
                  <span>RECOMMENDED ACTION</span>
                  <p>
                    {activeArea.action ??
                      "Review local evidence before taking action."}
                  </p>
                </div>

                <p className="map-page__disclaimer">
                  This is a prototype investigation ranking,
                  not a validated scarcity prediction.
                </p>
              </>
            ) : (
              <p>
                {status === "loading"
                  ? "Loading mapped evidence..."
                  : "No mapped ranked areas are available."}
              </p>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
