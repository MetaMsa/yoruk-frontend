"use client";

import { useEffect } from "react";
import { useCountryStore } from "../store/countryStore";
import { useRouter } from "next/navigation";
import { PassportType } from "../types/PassportType";

export default function Client({
    country,
    passport
}: {
    country: string;
    passport: string
}) {
    const { setClickedD, setPassport } = useCountryStore();
    const router = useRouter();

    useEffect(() => {
        setClickedD(country);
        setPassport(passport as PassportType);
        router.push("/");
    }, [country, router, setClickedD]);

    return null;
}