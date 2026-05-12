import { create } from "zustand";

interface CountryStore {
    clickedD: string | null;
    setClickedD: (value: string | null) => void;
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
}));