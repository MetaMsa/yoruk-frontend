"use client";

import { useEffect, useState } from "react";
import { useCountryStore } from "../store/countryStore";
import { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import dataset from "@/dataset.json";
import type { Country } from "../types/CountryType";

const datasetCountries = (dataset as unknown) as FeatureCollection<Geometry, GeoJsonProperties>;

const features = datasetCountries.features;

const extract = (key: string) =>
    features
        .map((f) => f.properties?.[key])
        .filter((v): v is string => typeof v === "string");

const codes = {
    postal: extract("POSTAL"),
    fips10: extract("FIPS_10"),
    isoA2: extract("ISO_A2"),
    wbA2: extract("WB_A2"),
};

export default function SearchBar() {
    const [searchText, setSearchText] = useState("");
    const [open, setOpen] = useState(false);
    const [rawCountries, setRawCountries] = useState<Country[]>([]);

    const { setClickedD } = useCountryStore();

    const searchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value.toLowerCase());
    };

    useEffect(() => {
        if (!searchText) return;

        const controller = new AbortController();

        const fetchCountries = async () => {
            try {
                const res = await fetch(
                    `https://restcountries.com/v3.1/translation/${searchText}`,
                    { signal: controller.signal }
                );

                if (!res.ok) return;

                const data: Country[] = await res.json();

                const northernCyprus: Country = {
                    cca2: "CT",
                    name: {
                        common: "Northern Cyprus",
                        official: "Turkish Republic of Northern Cyprus"
                    },
                    translations: {
                        tur: {
                            common: "Kuzey Kıbrıs",
                            official: "Kuzey Kıbrıs Türk Cumhuriyeti"
                        }
                    },
                    flags: {
                        svg: "https://upload.wikimedia.org/wikipedia/commons/1/1e/Flag_of_the_Turkish_Republic_of_Northern_Cyprus.svg"
                    }
                };

                const enhancedData = [...data];

                if (
                    "kuzey kıbrıs".includes(searchText) ||
                    "kktc".includes(searchText) ||
                    "northern cyprus".includes(searchText) ||
                    "cyprus".includes(searchText)
                ) {
                    enhancedData.push(northernCyprus);
                }

                if (data[0].translations?.tur?.common === "Falkland (Malvina) Adaları") {
                    data[0].translations.tur.common = "Falkland Adaları";
                    data[0].translations.tur.official = "Falkland Adaları";
                }

                const filtered = enhancedData.filter((c) => {
                    const code = c.cca2?.toUpperCase();

                    return (
                        codes.postal.includes(code) ||
                        codes.fips10.includes(code) ||
                        codes.isoA2.includes(code) ||
                        codes.wbA2.includes(code)
                    );
                });

                setRawCountries(filtered);
            } catch (error: unknown) {
                if (!(error instanceof DOMException && error.name === "AbortError")) {
                    console.error(error);
                }
            }
        };

        fetchCountries();

        return () => controller.abort();
    }, [searchText]);

    const keyHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            const first = rawCountries[0];
            if (first) {
                setClickedD(first.name.official);
            }
        }
    };

    return (
        <div className={"relative z-80 me-5"}>
            <input
                onChange={searchHandler}
                onKeyDown={keyHandler}
                onFocus={() => setOpen(true)}
                onBlur={() => setOpen(false)}
                type="search"
                className="input border my-auto rounded-xl text-center w-full"
                placeholder="Ülke ara..."
            />

            {searchText && open && (
                <ul className="absolute left-0 right-0 mt-2 p-3 rounded-box bg-base-300 shadow max-h-60 sm:max-h-96 overflow-auto text-center text-xs sm:text-lg z-10">
                    {rawCountries.length === 0 ? (
                        <li className="py-2">
                            Ülke Bulunamadı
                        </li>
                    ) : (
                        rawCountries.map((country) => (
                            <li
                                key={country.name.official}
                                className="py-2 px-2"
                            >
                                <button
                                    className="link truncate max-w-40"
                                    onClick={() =>
                                        setClickedD(country.name.official)
                                    }
                                    onMouseDown={(e) => e.preventDefault()}
                                >
                                    {country.translations?.tur?.common ??
                                        country.name.common}
                                </button>
                            </li>
                        ))
                    )}
                </ul>
            )}
        </div>
    );
}