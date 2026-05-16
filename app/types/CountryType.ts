export type Country = {
    cca2: string;
    name: {
        common: string;
        official: string;
    };
    translations?: {
        tur?: {
            common?: string;
            official?: string;
        };
    };
    flags: {
        svg: string;
    }
};

export type CountryInfo = {
    name: string;
    extract: string;
}

export type VisaInfo = {
    name: string;
    passport: number;
    visa_info: string;
}