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