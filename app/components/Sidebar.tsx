"use client";

import { CircleX, Loader2, AlertCircle } from "lucide-react";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import translate from "translate";
import Modal from "./Modal";

interface CountryInfo {
    name: string;
    extract: string;
}

const PASSPORT_TYPES = [
    { id: "Ordinary", label: "Umuma Mahsus", src: "https://upload.wikimedia.org/wikipedia/commons/1/1b/Turkish_Passport.svg" },
    { id: "Special", label: "Hususi", src: "https://upload.wikimedia.org/wikipedia/commons/b/b7/Turkish_Passport_%28special%29.svg" },
    { id: "Service", label: "Hizmet", src: "https://upload.wikimedia.org/wikipedia/commons/8/8d/Turkish_Passport_%28service%29.svg" },
    { id: "Diplomatic", label: "Diplomatik", src: "https://upload.wikimedia.org/wikipedia/commons/3/31/Turkish_Passport_%28diplomatic%29.svg" },
];

const PASSPORT_MAP: Record<string, number> = {
    Ordinary: 0,
    Special: 1,
    Service: 2,
    Diplomatic: 3,
};

export async function fetchVisaInfo(trName: string, passportIndex: number) {
    const response = await fetch(`/api/visa?country=${encodeURIComponent(trName || "")}&passportIndex=${encodeURIComponent(passportIndex)}`);
    const data = await response.text();

    return data;
}

export default function Sidebar({
    clickedD,
    setIsDrawerOpen,
    setClickedD
}: {
    clickedD: string | null,
    setIsDrawerOpen: Dispatch<SetStateAction<boolean>>,
    setClickedD: Dispatch<string | null>
}) {
    const [countryInfo, setCountryInfo] = useState<CountryInfo | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [countryTranslation, setCountryTranslation] = useState<string>("");
    const [passport, setPassport] = useState<string>(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("passport") || "Ordinary";
        }
        return "Ordinary";
    });
    const [visaData, setVisaData] = useState<string>("");

    const translationCache = useRef<Map<string, string>>(new Map());

    useEffect(() => {
        const updateTranslation = async () => {
            const key = clickedD || "";
            if (!key) {
                setCountryTranslation("");
                return;
            }

            const cached = translationCache.current.get(key);
            if (cached) {
                setCountryTranslation(cached);
                return;
            }

            try {
                const translated = await translate(key, "tr");
                translationCache.current.set(key, translated);
                setCountryTranslation(translated);
            } catch {
                setCountryTranslation(key);
            }
        };

        updateTranslation();
    }, [clickedD]);

    useEffect(() => {
        localStorage.setItem("passport", passport);
    }, [passport]);

    useEffect(() => {
        if (!countryTranslation) return;

        const abortController = new AbortController();

        const fetchCountryInfo = async () => {
            setIsLoading(true);
            setError(false);
            try {
                const response = await fetch(`/api/country/${countryTranslation}`, { signal: abortController.signal });
                if (!response.ok) throw new Error("Veri alınamadı");
                const data = await response.json();
                setCountryInfo(data);
            } catch (err: any) {
                if (err.name !== 'AbortError') {
                    console.error("Fetch error:", err);
                    setCountryInfo(null);
                    setError(true);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchCountryInfo();
        return () => abortController.abort();
    }, [countryTranslation]);

    const closeSidebar = useCallback(() => {
        setIsDrawerOpen(false);
        setClickedD(null);
        localStorage.removeItem("clickedD");
    }, [setIsDrawerOpen, setClickedD]);

    if (!countryTranslation) return null;

    return (
        <aside
            className="bg-base-100 border-l border-slate-300 dark:border-neutral-700 w-full h-full fixed top-0 right-0 max-w-64 z-50 overflow-y-auto shadow-2xl transition-transform"
            role="complementary"
        >
            <div className="p-4">
                <div className="flex justify-end">
                    <button
                        className="p-2 hover:bg-base-100 rounded-full transition-colors group"
                        onClick={closeSidebar}
                        aria-label="Kapat"
                    >
                        <CircleX size={24} className="text-slate-500 group-hover:text-red-500 transition-colors" />
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex flex-col justify-center items-center h-64 gap-3">
                        <Loader2 className="animate-spin text-blue-500" size={32} />
                        <span className="text-sm text-slate-500">Yükleniyor...</span>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center p-6 text-center">
                        <AlertCircle className="text-amber-500 mb-2" />
                        <p className="text-sm text-slate-600">Ülke bilgisine ulaşılamadı.</p>
                    </div>
                ) : (
                    <nav aria-label="Country Information">
                        <h2 className="text-xl font-bold mb-4 border-b pb-2">{countryInfo?.name || countryTranslation}</h2>

                        <div className="text-xs leading-relaxed text-slate-800 dark:text-slate-400">
                            <p className="line-clamp-10 mb-3">
                                {countryInfo?.extract || "Bu ülke hakkında detaylı bilgi bulunmamaktadır."}
                            </p>
                            {countryInfo?.name && (
                                <Link
                                    href={`https://tr.wikipedia.org/wiki/${encodeURIComponent(countryInfo.name)}`}
                                    target="_blank"
                                    className="text-blue-500 font-medium hover:underline inline-flex items-center gap-1 mb-6"
                                >
                                    Daha Fazla Bilgi
                                </Link>
                            )}
                        </div>

                        <hr className="my-6 border-slate-200 dark:border-neutral-800" />

                        <div className="mb-4 font-semibold text-sm">Pasaport Türünüz</div>
                        <div className="grid grid-cols-4 gap-2 mb-6">
                            {PASSPORT_TYPES.map((type) => (
                                <button
                                    key={type.id}
                                    title={type.label}
                                    onClick={() => setPassport(type.id)}
                                    className={`relative flex flex-col items-center transition-all p-2 rounded-lg border-2 ${passport === type.id
                                        ? "border-base-500"
                                        : "border-transparent hover:border-base-300"
                                        }`}
                                >
                                    <Image
                                        width={36}
                                        height={50}
                                        alt={type.label}
                                        src={type.src}
                                        className="object-contain"
                                    />
                                    <span className="text-[8px] mt-1 truncate w-full text-center">{type.label}</span>
                                </button>
                            ))}
                        </div>

                        <button onClick={async () => {
                            const data = await fetchVisaInfo(countryTranslation, PASSPORT_MAP[passport]);
                            setVisaData(data);
                            const modal = document.getElementById('my_modal_1') as HTMLDialogElement | null;
                            modal?.showModal();
                        }}
                            className="btn btn-outline w-full active:scale-[0.98] font-medium py-2.5 px-4 rounded-lg transition-all shadow-md">
                            Vize Durumunu Sorgula
                        </button>

                        <p className="mt-4 text-[10px] text-slate-500 italic text-center">
                            * Seçtiğiniz pasaport türüne göre vize bilgileri gösterilecektir.
                        </p>
                    </nav>
                )}
            </div>
            <Modal data={visaData || ""} />
        </aside>
    );
}