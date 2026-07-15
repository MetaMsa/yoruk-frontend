"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { Feature, FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import dataset from "@/dataset.json";
import centerMedian from "@turf/center-median";
import area from "@turf/area";
import Sidebar from "./components/Sidebar";
import AltitudeToggle from "./components/AltitudeToggle";
import { useCountryStore } from "./store/countryStore";
import { GlobeMethods } from "react-globe.gl";

const Globe = dynamic(() => import("react-globe.gl"), {
  ssr: false
});

const countries = (dataset as unknown) as FeatureCollection<Geometry, GeoJsonProperties>;
const DEFAULT_VIEW = { lat: 38.95, lng: 34.86, altitude: 1.8 };
const MIN_ALTITUDE = 0.6;
const MAX_ALTITUDE = 2.5;

function getCountryView(country: Feature<Geometry, GeoJsonProperties>) {
  const centered = centerMedian({
    type: "FeatureCollection",
    features: [country],
  });
  const [lng, lat] = centered.geometry.coordinates;

  return {
    lat,
    lng,
    altitude: Math.max(MIN_ALTITUDE, Math.min(MAX_ALTITUDE, area(country) / 1_000_000_000_000)),
  };
}

export default function Home() {
  const [hoverAdmin, setHoverAdmin] = useState<string | null>(null);
  const { clickedD, setClickedD } = useCountryStore();

  const globeRef = useRef<GlobeMethods | undefined>(undefined);

  const selectedCountry = useMemo(() => {
    return countries.features.find(
      f => f.properties?.FORMAL_EN === clickedD
    );
  }, [clickedD]);

  useEffect(() => {
    if (!globeRef.current || !selectedCountry) return;

    globeRef.current.pointOfView(getCountryView(selectedCountry), 1500);
  }, [selectedCountry]);

  return (
    <div>
      <Globe
        ref={globeRef}
        polygonsData={countries.features}
        polygonCapColor={(d) => {
          const country = d as Feature<Geometry, GeoJsonProperties>;
          const formalName = country.properties?.FORMAL_EN;

          if (formalName === "Republic of Türkiye") {
            return "rgba(227, 10, 23, 1)";
          }

          if (formalName === clickedD) {
            return "rgb(0, 81, 255)";
          }

          if (formalName === hoverAdmin) {
            return "rgba(59, 130, 246, 1)";
          }

          return "rgba(146, 121, 121, 1)";
        }}
        polygonStrokeColor={() => "#ffffff"}
        polygonSideColor={() => "rgba(0,0,0,0.15)"}
        polygonAltitude={(d) =>
          (d as Feature<Geometry, GeoJsonProperties>).properties?.FORMAL_EN === hoverAdmin ? 0.05 : 0
        }
        onPolygonHover={(polygon) => {
          if (!polygon) {
            setHoverAdmin(null);
            return;
          }

          setHoverAdmin((polygon as Feature<Geometry, GeoJsonProperties>).properties?.FORMAL_EN ?? null);
        }}
        onPolygonClick={(polygon) => {
          const formalName = (polygon as Feature<Geometry, GeoJsonProperties>).properties?.FORMAL_EN;
          if (formalName) setClickedD(formalName);
        }}
        onGlobeReady={() => {
          const saved = localStorage.getItem("clickedD");

          if (!saved) {
            requestAnimationFrame(() => {
              globeRef.current?.pointOfView(DEFAULT_VIEW, 1500);
            });
            return;
          }

          const found = countries.features.find(
            f => f.properties?.FORMAL_EN === saved
          );

          if (!found) {
            requestAnimationFrame(() => {
              globeRef.current?.pointOfView(DEFAULT_VIEW, 1500);
            });
            return;
          }

          if (found?.properties?.FORMAL_EN) {
            setClickedD(found.properties.FORMAL_EN);
          }

          requestAnimationFrame(() => {
            globeRef.current?.pointOfView(getCountryView(found), 1500);
          });
        }}
        globeOffset={clickedD ? [-125, 0] : [0, 0]}
        showGlobe={false}
        showAtmosphere={false}
        backgroundColor="rgba(0,0,0,0)"
        labelRotation={100}
        pointResolution={100}
      />
      {clickedD && (
        <Sidebar
          key={clickedD}
          official={clickedD}
        />
      )}
      <AltitudeToggle globeRef={globeRef} />
    </div>
  );
}
