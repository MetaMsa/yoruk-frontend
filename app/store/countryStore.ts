import { create } from "zustand";
import { CountryStore } from "../types/StoreType";
import { PassportType } from "../types/PassportType";

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
    }
}));