"use client";

import {
    CircleX,
    Loader2,
    AlertCircle
} from "lucide-react";

import Image from "next/image";
import Link from "next/link";

import {
    Dispatch,
    SetStateAction,
    useEffect,
    useState,
    useRef,
    useCallback
} from "react";

import translate from "translate";

import Modal from "./Modal";

interface CountryInfo {
    name: string;
    extract: string;
}

type PassportType =
    | "Ordinary"
    | "Special"
    | "Service"
    | "Diplomatic";

interface TranslationState {
    name: string;
    nameLong: string;
    formalEn: string;
}

const PASSPORT_TYPES: {
    id: PassportType;
    label: string;
    src: string;
}[] = [
        {
            id: "Ordinary",
            label: "Umumi",
            src: "https://upload.wikimedia.org/wikipedia/commons/1/1b/Turkish_Passport.svg"
        },
        {
            id: "Special",
            label: "Hususi",
            src: "https://upload.wikimedia.org/wikipedia/commons/b/b7/Turkish_Passport_%28special%29.svg"
        },
        {
            id: "Service",
            label: "Hizmet",
            src: "https://upload.wikimedia.org/wikipedia/commons/8/8d/Turkish_Passport_%28service%29.svg"
        },
        {
            id: "Diplomatic",
            label: "Diplomatik",
            src: "https://upload.wikimedia.org/wikipedia/commons/3/31/Turkish_Passport_%28diplomatic%29.svg"
        }
    ];

const PASSPORT_MAP: Record<PassportType, number> = {
    Ordinary: 0,
    Special: 1,
    Service: 2,
    Diplomatic: 3
};

async function fetchVisaInfo({
    name,
    nameLong,
    formalEn,
    passportIndex
}: {
    name: string;
    nameLong: string;
    formalEn: string;
    passportIndex: number;
}) {
    const params = new URLSearchParams({
        name,
        nameLong,
        formalEn,
        passportIndex: passportIndex.toString()
    });

    const response = await fetch(`/api/visa?${params.toString()}`);

    if (!response.ok) {
        throw new Error("Vize bilgisi alınamadı.");
    }

    return response.text();
}

export default function Sidebar({
    name,
    nameLong,
    formalEn,
    setClickedD
}: {
    name: string;
    nameLong: string;
    formalEn: string;
    setClickedD: Dispatch<string | null>;
}) {
    const [countryInfo, setCountryInfo] =
        useState<CountryInfo | null>(null);

    const [isLoading, setIsLoading] =
        useState(false);

    const [error, setError] =
        useState(false);

    const [translations, setTranslations] =
        useState<TranslationState>({
            name: "",
            nameLong: "",
            formalEn: ""
        });

    const [passport, setPassport] =
        useState<PassportType>(() => {
            if (typeof window !== "undefined") {
                return (
                    (localStorage.getItem("passport") as PassportType) ||
                    "Ordinary"
                );
            }

            return "Ordinary";
        });

    const [visaData, setVisaData] =
        useState<string>("");

    const translationNameCache =
        useRef<Map<string, string>>(new Map());

    const translationNameLongCache =
        useRef<Map<string, string>>(new Map());

    const translationFormalEnCache =
        useRef<Map<string, string>>(new Map());

    useEffect(() => {
        let cancelled = false;

        const updateTranslation = async () => {
            const nameKey = name || "";
            const nameLongKey = nameLong || "";
            const formalEnKey = formalEn || "";

            if (
                !nameKey ||
                !nameLongKey ||
                !formalEnKey
            ) {
                if (!cancelled) {
                    setTranslations({
                        name: nameKey,
                        nameLong: nameLongKey,
                        formalEn: formalEnKey
                    });
                }

                return;
            }

            try {
                let translatedName =
                    translationNameCache.current.get(nameKey);

                if (!translatedName) {
                    translatedName = await translate(
                        nameKey,
                        "tr"
                    );

                    translationNameCache.current.set(
                        nameKey,
                        translatedName
                    );
                }

                let translatedNameLong =
                    translationNameLongCache.current.get(
                        nameLongKey
                    );

                if (!translatedNameLong) {
                    translatedNameLong = await translate(
                        nameLongKey,
                        "tr"
                    );

                    translationNameLongCache.current.set(
                        nameLongKey,
                        translatedNameLong
                    );
                }

                let translatedFormalEn =
                    translationFormalEnCache.current.get(
                        formalEnKey
                    );

                if (!translatedFormalEn) {
                    translatedFormalEn = await translate(
                        formalEnKey,
                        "tr"
                    );

                    translationFormalEnCache.current.set(
                        formalEnKey,
                        translatedFormalEn
                    );
                }

                if (!cancelled) {
                    setTranslations({
                        name: translatedName,
                        nameLong: translatedNameLong,
                        formalEn: translatedFormalEn
                    });
                }
            } catch {
                if (!cancelled) {
                    setTranslations({
                        name: nameKey,
                        nameLong: nameLongKey,
                        formalEn: formalEnKey
                    });
                }
            }
        };

        updateTranslation();

        return () => {
            cancelled = true;
        };
    }, [name, nameLong, formalEn]);

    useEffect(() => {
        localStorage.setItem("passport", passport);
    }, [passport]);

    useEffect(() => {
        if (!translations.name) return;

        const abortController =
            new AbortController();

        const fetchCountryInfo = async () => {
            setIsLoading(true);
            setError(false);

            try {
                const response = await fetch(
                    `/api/country/${encodeURIComponent(
                        translations.name
                    )}`,
                    {
                        signal: abortController.signal
                    }
                );

                if (!response.ok) {
                    throw new Error(
                        "Ülke bilgisi alınamadı."
                    );
                }

                const data =
                    await response.json();

                setCountryInfo(data);
            } catch (err: any) {
                if (err.name !== "AbortError") {
                    console.error(
                        "Fetch error:",
                        err
                    );

                    setCountryInfo(null);
                    setError(true);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchCountryInfo();

        return () => abortController.abort();
    }, [translations.name]);

    const closeSidebar = useCallback(() => {
        setClickedD(null);

        localStorage.removeItem("clickedD");
    }, [setClickedD]);

    if (!translations.name) {
        return null;
    }

    return (
        <aside
            className="bg-base-100 border-l border-slate-300 dark:border-neutral-700 w-full h-full fixed top-0 right-0 max-w-64 z-50 overflow-y-auto shadow-2xl transition-transform"
            role="complementary"
        >
            <div className="p-4">
                <div className="flex justify-end">
                    <button
                        className="p-2 hover:bg-base-200 rounded-full transition-colors group"
                        onClick={closeSidebar}
                        aria-label="Kapat"
                    >
                        <CircleX
                            size={24}
                            className="text-slate-500 group-hover:text-red-500 transition-colors"
                        />
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex flex-col justify-center items-center h-64 gap-3">
                        <Loader2
                            className="animate-spin text-blue-500"
                            size={32}
                        />

                        <span className="text-sm text-slate-500">
                            Yükleniyor...
                        </span>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center p-6 text-center">
                        <AlertCircle className="text-amber-500 mb-2" />

                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Ülke bilgisine ulaşılamadı.
                        </p>
                    </div>
                ) : (
                    <nav aria-label="Country Information">
                        <h2 className="text-xl font-bold mb-4 border-b pb-2">
                            {countryInfo?.name ||
                                translations.name}
                        </h2>

                        <div className="text-xs leading-relaxed text-slate-800 dark:text-slate-400">
                            <p className="line-clamp-10 mb-3">
                                {countryInfo?.extract ||
                                    "Bu ülke hakkında detaylı bilgi bulunmamaktadır."}
                            </p>

                            {countryInfo?.name && (
                                <Link
                                    href={`https://tr.wikipedia.org/wiki/${encodeURIComponent(
                                        countryInfo.name
                                    )}`}
                                    target="_blank"
                                    className="text-blue-500 font-medium hover:underline inline-flex items-center gap-1 mb-6"
                                >
                                    Daha Fazla Bilgi
                                </Link>
                            )}
                        </div>

                        <hr className="my-6 border-slate-200 dark:border-neutral-800" />

                        <div className="mb-4 font-semibold text-sm">
                            Pasaport Türünüz
                        </div>

                        <div className="grid grid-cols-4 gap-2 mb-6">
                            {PASSPORT_TYPES.map(
                                (type) => (
                                    <button
                                        key={type.id}
                                        title={type.label}
                                        onClick={() =>
                                            setPassport(
                                                type.id
                                            )
                                        }
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

                                        <span className="text-[8px] mt-1 w-full text-center">
                                            {type.label}
                                        </span>
                                    </button>
                                )
                            )}
                        </div>

                        <button
                            onClick={async () => {
                                try {
                                    const data =
                                        await fetchVisaInfo(
                                            {
                                                name: translations.name,
                                                nameLong:
                                                    translations.nameLong,
                                                formalEn:
                                                    translations.formalEn,
                                                passportIndex:
                                                    PASSPORT_MAP[
                                                    passport
                                                    ]
                                            }
                                        );

                                    setVisaData(data);
                                } catch {
                                    setVisaData(
                                        "Vize bilgisi alınamadı."
                                    );
                                }

                                const modal =
                                    document.getElementById(
                                        "my_modal_1"
                                    ) as HTMLDialogElement | null;

                                modal?.showModal();
                            }}
                            className="btn btn-outline w-full active:scale-[0.98] font-medium py-2.5 px-4 rounded-lg transition-all shadow-md"
                        >
                            Vize durumunu sorgula
                        </button>

                        <p className="mt-4 text-[10px] text-slate-500 italic text-center">
                            * Seçtiğiniz pasaport türüne göre
                            vize bilgileri gösterilecektir.
                        </p>
                    </nav>
                )}
            </div>

            <Modal data={visaData} />
        </aside>
    );
}