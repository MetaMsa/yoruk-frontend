import { CircleX } from "lucide-react";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface CountryInfo {
    name: string;
    extract: string;
}

export default function Sidebar({ country, setIsDrawerOpen, setClickedD, setCountryName }: { country: string, setIsDrawerOpen: Dispatch<SetStateAction<boolean>>, setClickedD: Dispatch<any>, setCountryName: Dispatch<SetStateAction<string>> }) {
    const [countryInfo, setCountryInfo] = useState<CountryInfo | null>(null);
    const [passport, setPassport] = useState<string>(() => {
        try {
            return localStorage.getItem("passport") || "Ordinary";
        } catch {
            return "Ordinary";
        }
    });

    useEffect(() => {
        const fetchCountryInfo = async () => {
            const response = await fetch(`/api/country/${country}`)
            const data = await response.json()
            setCountryInfo(data);
        };

        fetchCountryInfo();

        localStorage.setItem("passport", passport);
    }, [country, passport]);

    return (
        <aside
            className="bg-white dark:bg-neutral-900 border-r border-slate-300 dark:border-neutral-700 w-full h-full fixed top-0 right-0 max-w-66 py-30 px-4">

            <div className="flex justify-end">
                <button className="btn btn-ghost" onClick={() => {
                    setIsDrawerOpen(false);
                    setClickedD(null);
                    setCountryName("");
                }}>
                    <CircleX />
                </button>
            </div>

            <nav aria-label="Primary sidebar navigation">
                <ul className="space-y-1">
                    <li>
                        {countryInfo?.name}
                    </li>
                </ul>

                <div className="mt-6 text-xs">
                    <ul className="mt-2 space-y-0.5 h-20 truncate text-wrap text-slate-800 dark:text-slate-400 font-medium">
                        <li>
                            {countryInfo?.extract}
                        </li>
                    </ul>
                    <p className="text-sm text-slate-600 dark:text-slate-500">
                        <a href={`https://tr.wikipedia.org/wiki/${countryInfo?.name}`} target="_blank" rel="noopener noreferrer" className="link link-hover">Daha Fazla Bilgi</a>
                    </p>
                </div>

                <div className="my-5">Pasaport Türü</div>

                <div className="flex justify-between my-5">
                    <button onClick={() => {setPassport("Ordinary")}}>
                        <Image className={`${passport === "Ordinary" ? "ring-2 ring-blue-500" : ""}`} width={50} height={50} key={"Ordinary"} alt="Turkish Ordinary Passport" src="https://upload.wikimedia.org/wikipedia/commons/1/1b/Turkish_Passport.svg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original" />
                    </button>
                    <button onClick={() => {setPassport("Special")}}>
                        <Image className={`${passport === "Special" ? "ring-2 ring-blue-500" : ""}`} width={50} height={50} key={"Special"} alt="Turkish Special Passport" src="https://upload.wikimedia.org/wikipedia/commons/b/b7/Turkish_Passport_%28special%29.svg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original" />
                    </button>
                    <button onClick={() => {setPassport("Service")}}>
                        <Image className={`${passport === "Service" ? "ring-2 ring-blue-500" : ""}`} width={50} height={50} key={"Service"} alt="Turkish Service Passport" src="https://upload.wikimedia.org/wikipedia/commons/8/8d/Turkish_Passport_%28service%29.svg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original" />
                    </button>
                    <button onClick={() => {setPassport("Diplomatic")}}>
                        <Image className={`${passport === "Diplomatic" ? "ring-2 ring-blue-500" : ""}`} width={50} height={50} key={"Diplomatic"} alt="Turkish Diplomatic Passport" src="https://upload.wikimedia.org/wikipedia/commons/3/31/Turkish_Passport_%28diplomatic%29.svg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original" />
                    </button>
                </div>

                <button className="btn btn-primary w-full">
                    Gönder
                </button>

                <div className="mt-3 text-xs text-slate-600 dark:text-slate-500">
                    * Pasaport türünüzü seçtikten sonra "Gönder" butonuna basarak vize durumunuzu görebilirsiniz.
                </div>
            </nav>
        </aside>
    )
}