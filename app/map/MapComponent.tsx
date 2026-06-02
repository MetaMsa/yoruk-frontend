"use client";

import { useRef, useState } from "react";
import dataset from "@/dataset.json";
import html2canvas from 'html2canvas-pro';
import {
  ComposableMap,
  Geographies,
  Geography
} from '@vnedyalk0v/react19-simple-maps';

export default function MapComponent({ visitedCountries }: { visitedCountries: string[] }) {
  const mapRef = useRef<HTMLSpanElement | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const handleDownload = async () => {
    if (!mapRef.current) return;

    try {
      setIsCapturing(true);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const canvas = await html2canvas(mapRef.current, {
        backgroundColor: localStorage.getItem("theme") === "dark" ? "#1d232a" : "#ffffff"
      });

      const dataUrl = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "visited_countries.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Harita resmi yüklenirken bir hata oluştu:", error);
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div>
      <p className="text-center text-xs absolute top-32 left-0 right-0 z-500 bg-base-300 p-2 m-auto max-w-xl rounded shadow-sm opacity-80">
        Ziyaret Ettiğiniz ülkeleri kaydetmek için ülke menüsünden kayıt tuşuna basabilirsiniz. <br />
        Burada ziyaret ettiğiniz ülkeleri görebilir ve png formatında indirebilirsiniz.
      </p>

      <span ref={mapRef}>
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 100
          }}
          width={800}
          height={500}
        >
          <Geographies geography={dataset}>
            {({ geographies }) =>
              geographies.map((geo, index) => (
                <Geography  
                  key={index}
                  geography={geo}
                  style={{
                    default: { fill: visitedCountries.includes(geo.properties?.FORMAL_EN) ? "#FF0000" : "#cecece", outline: 'none' }
                  }}
                  pointerEvents={"none"}
                />
              ))
            }
          </Geographies>
        </ComposableMap>

        <p className="text-center text-xs absolute top-100 left-0 right-0 z-500 bg-base-300 p-2 m-auto w-fit rounded shadow-sm opacity-80">
          Ziyaret ettiğiniz ülkelerin sayısı: {visitedCountries.length} / {dataset.features.length}
        </p>
      </span>

      <button
        onClick={handleDownload}
        disabled={isCapturing}
        className="btn btn-sm btn-outline absolute top-125 left-0 right-0 w-fit m-auto z-500"
      >
        {isCapturing ? "Hazırlanıyor..." : "PNG Olarak İndir"}
      </button>
    </div>
  );
}