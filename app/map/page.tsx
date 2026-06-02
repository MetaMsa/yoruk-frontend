"use client";

import dynamic from "next/dynamic";
import { useCountryStore } from "../store/countryStore";

const Map = dynamic(() => import("./MapComponent"), {
  ssr: false,
});

export default function Page() {
  const { visitedCountries } = useCountryStore();

  return <Map visitedCountries={visitedCountries} />;
}