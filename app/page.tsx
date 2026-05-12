"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
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

    const centered = centerMedian({
      type: "FeatureCollection",
      features: [selectedCountry],
    });

    const [lng, lat] = centered.geometry.coordinates;
    const polygonArea = area(selectedCountry);

    globeRef.current.pointOfView(
      {
        lat,
        lng,
        altitude: Math.max(
          0.6,
          Math.min(2.5, polygonArea / 1000000000000)
        ),
      },
      1500
    );
  }, [selectedCountry]);

  return (
    <div>
      <Globe
        ref={globeRef}
        polygonsData={countries.features}
        polygonCapColor={(d: any) => {
          if (d.properties.FORMAL_EN === "Republic of Turkey") {
            return "rgba(227, 10, 23, 1)";
          }

          if (d.properties.FORMAL_EN === clickedD) {
            return "rgb(0, 81, 255)";
          }

          if (d.properties.FORMAL_EN === hoverAdmin) {
            return "rgba(59, 130, 246, 1)";
          }

          return "rgba(146, 121, 121, 1)";
        }}
        polygonStrokeColor={() => "#ffffff"}
        polygonSideColor={() => "rgba(0,0,0,0.15)"}
        polygonAltitude={(d: any) =>
          d.properties.FORMAL_EN === hoverAdmin ? 0.05 : 0
        }
        onPolygonHover={(polygon: any) => {
          if (!polygon) {
            setHoverAdmin(null);
            return;
          }

          setHoverAdmin(polygon.properties.FORMAL_EN);
        }}
        onPolygonClick={(polygon: any) => {
          setClickedD(polygon.properties.FORMAL_EN);
        }}
        onGlobeReady={() => {
          if (!globeRef.current) return;

          const saved = localStorage.getItem("clickedD");

          if (!saved) {
            globeRef.current.pointOfView(
              {
                lat: 38.95432521212122,
                lng: 34.86702380303031,
                altitude: 1.8,
              },
              1500
            );
            return;
          }

          const found = countries.features.find(
            f => f.properties?.FORMAL_EN === saved
          );

          if (!found) {
            globeRef.current.pointOfView(
              {
                lat: 38.95432521212122,
                lng: 34.86702380303031,
                altitude: 1.8,
              },
              1500
            );
            return;
          }

          const centered = centerMedian({
            type: "FeatureCollection",
            features: [found],
          });

          const [lng, lat] = centered.geometry.coordinates;
          const polygonArea = area(found);

          setClickedD(found.properties?.FORMAL_EN);

          globeRef.current.pointOfView(
            {
              lat,
              lng,
              altitude: Math.max(0.6, Math.min(2.5, polygonArea / 1000000000000)),
            },
            1500
          );
        }}
        globeOffset={clickedD ? [-125, 0] : [0, 0]}
        showGlobe={false}
        showAtmosphere={false}
        backgroundColor="rgba(0,0,0,0)"
        labelRotation={100}
      />
      {clickedD && (
        <Sidebar
          official={selectedCountry?.properties?.FORMAL_EN}
          WB_A2={selectedCountry?.properties?.WB_A2}
        />
      )}
      <AltitudeToggle globeRef={globeRef} />
    </div>
  );
}