import { PassportType } from "./PassportType";

export type CountryStore = {
    clickedD: string | null;
    setClickedD: (value: string | null) => void;

    passport: PassportType;
    setPassport: (value: PassportType) => void;
}