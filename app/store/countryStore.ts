import { create } from "zustand";
import { CountryStore } from "../types/StoreType";
import { PassportType } from "../types/PassportType";

function readVisitedCountries(): string[] {
    if (typeof window === "undefined") return [];

    try {
        const stored = JSON.parse(localStorage.getItem("visitedCountries") || "[]");
        return Array.isArray(stored) && stored.every((country) => typeof country === "string")
            ? stored
            : [];
    } catch {
        return [];
    }
}

export const useCountryStore = create<CountryStore>((set) => ({
    clickedD: null,

    setClickedD: (value) => {
        set({ clickedD: value });

        if (typeof window !== "undefined") {
            if (value) {
                localStorage.setItem("clickedD", value);
            } else {
                localStorage.removeItem("clickedD");
            }
        }
    },

    passport:
        typeof window !== "undefined"
            ? localStorage.getItem("passport") as PassportType || "Ordinary" as PassportType
            : "Ordinary" as PassportType,

    setPassport: (value) => {
        set({ passport: value });

        if (typeof window !== "undefined") {
            localStorage.setItem("passport", value || "Ordinary");
        }
    },

    visitedCountries: readVisitedCountries(),

    setVisitedCountries: (value: string) => {
        if (typeof window !== "undefined") {
            const currentCountries = readVisitedCountries();
            const updatedCountries = currentCountries.includes(value)
                ? currentCountries.filter((item: string) => item !== value)
                : [...currentCountries, value];
            localStorage.setItem("visitedCountries", JSON.stringify(updatedCountries));
            set({ visitedCountries: updatedCountries });
        }
    },
}));
