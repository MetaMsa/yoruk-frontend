"use client";

import { useState, useRef, useEffect } from "react";
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
  const [hoverAdmin, setHoverAdmin] = useState<string | null>(null);
  const [clickedD, setClickedD] = useState<string | null>((() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("clickedD") || "";
    }
    return "";
  })());
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [countryTranslation, setCountryTranslation] = useState<string>("");
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

  useEffect(() => {
    if (clickedD) {
      localStorage.setItem("clickedD", clickedD);
    }
  }, [clickedD]);

  const translationCache = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    const updateTranslation = async () => {
      const key = clickedD || "";
      if (!key) {
        setCountryTranslation("");
        return;
      }

      const cached = translationCache.current.get(key);
      if (cached) {
        setCountryTranslation(cached);
        return;
      }

      try {
        const translated = await translate(key, "tr");
        translationCache.current.set(key, translated);
        setCountryTranslation(translated);
      } catch {
        setCountryTranslation(key);
      }
    };

    updateTranslation();
  }, [clickedD]);

  const countryName = countryTranslation || clickedD || "";

  return (
    <div>
      <Globe
        ref={globeRef}
        polygonsData={countries.features}
        polygonCapColor={(d: any) => {
          if (d.properties.ADMIN === "Turkey") {
            return "rgba(227, 10, 23, 1)";
          }

          if (d.properties.ADMIN === clickedD) {
            return "rgb(0, 81, 255)";
          }

          if (d.properties.ADMIN === hoverAdmin) {
            return "rgba(59, 130, 246, 1)";
          }

          return "rgba(146, 121, 121, 1)";
        }}
        polygonStrokeColor={() => "#ffffff"}
        polygonSideColor={() => "rgba(0,0,0,0.15)"}
        polygonAltitude={(d: any) =>
          d.properties.ADMIN === hoverAdmin ? 0.05 : 0
        }
        onPolygonHover={(polygon: any) => {
          if (!polygon || polygon.properties.ADMIN === "Antarctica") {
            setHoverAdmin(null);
            return;
          }

          setHoverAdmin(polygon.properties.ADMIN);
        }}
        onPolygonClick={async (polygon: any) => {
          setClickedD(polygon.properties.ADMIN);
          focusPolygon(polygon);

          setIsDrawerOpen(true);
        }}
        onGlobeReady={() => {
          if (!globeRef.current) return;

          const saved = localStorage.getItem("clickedD");
          if (saved) {
            const found = countries.features.find(
              f => f.properties?.ADMIN === saved
            );
            if (found) {
              setClickedD(found?.properties?.ADMIN);
              focusPolygon(found);
              setIsDrawerOpen(true);
            }
            return;
          }

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
        showGlobe={false}
        showAtmosphere={false}
        backgroundColor="rgba(0,0,0,0)"
      />
      {isDrawerOpen && (
        <Sidebar
          country={countryName}
          setIsDrawerOpen={setIsDrawerOpen}
          setClickedD={setClickedD}
        />
      )}
      <AltitudeToggle globeRef={globeRef} />
    </div>
  );
}