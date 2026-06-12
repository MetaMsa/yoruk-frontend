export type Country = {
    codes: {
        alpha_2: string;
    }
    names: {
        common: string;
        official: string;
        translations?: {
            tur?: {
                common?: string;
                official?: string;
            };
        };
    };
    flag: {
        url_svg: string;
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

export type GeminiRes = {
    name: string;
    passport: string;
    gemini_res: string;
}