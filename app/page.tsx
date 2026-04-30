"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import dataset from "@/dataset.json";
import { centerMedian, area } from "@turf/turf";
import Sidebar from "./components/Sidebar";
import AltitudeToggle from "./components/AltitudeToggle";
import translate from "translate";

const Globe = dynamic(() => import("react-globe.gl"), {
  ssr: false
});

export default function Home() {
  const [countries] = useState<FeatureCollection<Geometry, GeoJsonProperties>>(
    (dataset as unknown) as FeatureCollection<Geometry, GeoJsonProperties>
  );
  const [hoverD, setHoverD] = useState<any>(null);
  const [clickedD, setClickedD] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [countryName, setCountryName] = useState<string>("");

  const globeRef = useRef<any>(null);

  const focusPolygon = (feature: any) => {
    if (!globeRef.current) return;

    const centered = centerMedian(feature);
    const [lng, lat] = centered.geometry.coordinates;

    const polygonArea = area(feature);

    globeRef.current.pointOfView(
      {
        lat,
        lng,
        altitude: Math.max(0.6, Math.min(2.5, polygonArea / 1000000000000))
      },
      1500
    );
  };

  return (
    <div>
      <Globe
        ref={globeRef}
        polygonsData={countries.features}
        polygonCapColor={(d: any) => {
          if (d.properties.ADMIN === "Turkey") {
            return "rgba(227, 10, 23, 0.9)";
          }

          if (d === clickedD) {
            return "rgb(0, 81, 255)";
          }

          if (d === hoverD) {
            return "rgba(59, 130, 246, 0.9)";
          }

          return "rgba(146, 121, 121, 0.7)";
        }}
        polygonStrokeColor={() => "#ffffff"}
        polygonSideColor={() => "rgba(0,0,0,0.15)"}
        polygonAltitude={(d: any) => (d === hoverD ? 0.05 : 0.01)}
        onPolygonHover={(polygon: any) => {
          if (!polygon || polygon.properties.ADMIN === "Antarctica") {
            setHoverD(null);
            return;
          }

          setHoverD(polygon);
        }}
        onPolygonClick={async (polygon: any) => {
          setClickedD(polygon);
          focusPolygon(polygon);

          const translated = await translate(polygon.properties.ADMIN, "tr");
          setCountryName(translated);

          setIsDrawerOpen(true);
        }}
        onGlobeReady={() => {
          if (!globeRef.current) return;

          globeRef.current.pointOfView(
            {
              lat: 38.95432521212122,
              lng: 34.86702380303031,
              altitude: 1.8
            },
            1500
          )
        }}
        globeOffset={isDrawerOpen ? [-125, 0] : [0, 0]}
      />
      {isDrawerOpen && (
        <Sidebar
          country={countryName}
          setIsDrawerOpen={setIsDrawerOpen}
          setClickedD={setClickedD}
          setCountryName={setCountryName}
        />
      )}
      <AltitudeToggle globeRef={globeRef} />
    </div>
  );
}