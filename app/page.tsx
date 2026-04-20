"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import dataset from "@/dataset.json";

const Globe = dynamic(() => import("react-globe.gl"), {
  ssr: false,
  loading: () => <p>Harita Yükleniyor...</p>
});

interface CountryDetail {
  name: string;
  extract: string;
}

export default function Home() {
  const [countries] = useState<FeatureCollection<Geometry, GeoJsonProperties>>(
    (dataset as unknown) as FeatureCollection<Geometry, GeoJsonProperties>
  );

  const [hoverD, setHoverD] = useState<any>(null);
  const [labelContent, setLabelContent] = useState<CountryDetail | null>(null);
  const [loadingCountry, setLoadingCountry] = useState<string | null>(null);

  const countryDetail = async (country: string) => {
    setLoadingCountry(country);

    try {
      const res = await fetch(`/api/country/${country}`);
      const data = await res.json();

      if (hoverD?.properties?.ADMIN === country) {
        setLabelContent(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingCountry(null);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Globe
        polygonsData={countries.features}
        polygonCapColor={(d: any) =>
          d === hoverD
            ? "rgba(59, 130, 246, 0.9)"
            : "rgba(146, 121, 121, 0.7)"
        }
        polygonStrokeColor={() => "#ffffff"}
        polygonAltitude={(d: any) => (d === hoverD ? 0.05 : 0.01)}
        polygonLabel={(d: any) => `
          <div style="background:white;color:black;padding:8px;border-radius:8px;max-width:250px;">
            <b>
              ${
                loadingCountry === d.properties.ADMIN
                  ? "Yükleniyor..."
                  : d === hoverD && labelContent?.name
                    ? labelContent.name
                    : d.properties.ADMIN
              }
            </b>
            <br/>
            <span>
              ${
                d === hoverD &&
                loadingCountry !== d.properties.ADMIN &&
                labelContent?.extract
                  ? labelContent.extract
                  : ""
              }
            </span>
          </div>
        `}
        onPolygonHover={(polygon: any) => {
          setHoverD(polygon);

          if (polygon?.properties?.ADMIN) {
            countryDetail(polygon.properties.ADMIN);
          }
        }}
        onPolygonOut={() => {
          setHoverD(null);
          setLabelContent(null);
          setLoadingCountry(null);
        }}
      />
    </div>
  );
}