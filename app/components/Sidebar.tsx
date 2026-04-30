import { CircleX } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface CountryInfo {
    name: string;
    extract: string;
}

export default function Sidebar({country, setIsDrawerOpen, setClickedD, setCountryName} : {country: string, setIsDrawerOpen: Dispatch<SetStateAction<boolean>>, setClickedD: Dispatch<any>, setCountryName: Dispatch<SetStateAction<string>>}) {
    const [countryInfo, setCountryInfo] = useState<CountryInfo | null>(null);

    useEffect(() => {
        const fetchCountryInfo = async () => {
            const response = await fetch(`/api/country/${country}`)
            const data = await response.json()
            setCountryInfo(data);
        };

        fetchCountryInfo();
    }, [country]);

    return (
        <aside
            className="bg-white dark:bg-neutral-900 border-r border-slate-300 dark:border-neutral-700 w-full h-full fixed top-0 right-0 max-w-66 py-30 px-4 overflow-auto">

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
            </nav>
        </aside>
    )
}