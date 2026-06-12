"use client";

import {
    CircleX,
    Loader2,
    AlertCircle,
    Share2,
    Bookmark
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
    useEffect,
    useState,
    useCallback
} from "react";
import Modal from "./Modal";
import { useCountryStore } from "../store/countryStore";
import type { CountryInfo, Country, VisaInfo } from "../types/CountryType";
import { TranslationState } from "../types/TranslationType";
import { PassportType } from "../types/PassportType";

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
    common,
    official,
    passportIndex
}: {
    common: string;
    official: string;
    passportIndex: number;
}) {
    const params = new URLSearchParams({
        common,
        official,
        passportIndex: passportIndex.toString()
    });

    const response = await fetch(`/api/visa?${params.toString()}`);

    if (!response.ok) {
        throw new Error("Vize bilgisi alınamadı.");
    }

    return response.json();
}

export default function Sidebar({
    official
}: {
    official: string;
}) {
    const { clickedD, setClickedD, passport, setPassport, visitedCountries, setVisitedCountries } =
        useCountryStore();

    const [countryInfo, setCountryInfo] =
        useState<CountryInfo | null>(null);
    const [isCountryLoading, setIsCountryLoading] = useState(false);
    const [isVisaLoading, setIsVisaLoading] = useState(false);
    const [error, setError] =
        useState(false);
    const [translations, setTranslations] =
        useState<TranslationState>({
            common: "",
            official: ""
        });

    const [visaData, setVisaData] =
        useState<VisaInfo | null>(null);
    const [flag, setFlag] =
        useState<string>("");

    useEffect(() => {
        const fetchTranslation = async () => {
            if (official === "Turkish Republic of Northern Cyprus") {
                setTranslations({
                    common: "Kuzey Kıbrıs",
                    official: "Kuzey Kıbrıs Türk Cumhuriyeti"
                })
                setFlag("https://upload.wikimedia.org/wikipedia/commons/1/1e/Flag_of_the_Turkish_Republic_of_Northern_Cyprus.svg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original");

                return;
            }

            else if (official === "Republic of Korea") {
                setTranslations({
                    common: "Güney Kore",
                    official: "Kore Cumhuriyeti"
                })
                setFlag("https://flagcdn.com/kr.svg");

                return
            }

            else if (official === "Ireland") {
                setTranslations({
                    common: "İrlanda",
                    official: "İrlanda Cumhuriyeti"
                })
                setFlag("https://flagcdn.com/ie.svg");

                return;
            }

            const res = await fetch(`/api/restcountries/name/${official}`);

            if (!res.ok) return;

            const data: Country[] = await res.json();

            if (data[0].names.translations?.tur?.common === "Falkland (Malvina) Adaları") {
                data[0].names.translations.tur.common = "Falkland Adaları";
                data[0].names.translations.tur.official = "Falkland Adaları";
            }

            setTranslations({
                common: data[0].names.translations?.tur?.common || "",
                official: data[0].names.translations?.tur?.official || ""
            })

            setFlag(data[0].flag.url_svg);
        };

        fetchTranslation();
    }, [official]);

    useEffect(() => {
        if (!translations.common) return;

        const abortController =
            new AbortController();

        const fetchCountryInfo = async () => {
            setIsCountryLoading(true);
            setError(false);

            try {
                const response = await fetch(
                    `/api/country?official=${translations.official}&common=${translations.common}`,
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
            } catch (err: unknown) {
                if (err instanceof Error) {
                    if (err.name !== "AbortError") {
                        console.error(
                            "Fetch error:",
                            err
                        );

                        setCountryInfo(null);
                        setError(true);
                    }
                } else {
                    console.error("Fetch error:", err);
                    setCountryInfo(null);
                    setError(true);
                }
            } finally {
                setIsCountryLoading(false);
            }
        };

        fetchCountryInfo();

        return () => abortController.abort();
    }, [translations.official, translations.common]);

    const share = useCallback(async () => {
        const shareData = {
            title: "Yörük: Seyahat Yardımcısı",
            text:
                "Yörük Seyahat Yardımcısı'ndan " +
                PASSPORT_TYPES[PASSPORT_MAP[
                    passport
                ]].label +
                " pasaportla gidebileceğimiz bir ülke keşfettim göz at:" +
                ` ${process.env.NEXT_PUBLIC_SITE_URL}${encodeURIComponent(clickedD!)}/${encodeURIComponent(passport)}`,
        };
        if (navigator.share) {
            await navigator.share(shareData);
        } else {
            await navigator.clipboard.writeText(shareData.text);
            alert("Paylaşma desteklenmiyor, metin panoya kopyalandı.");
        }
    }, [clickedD, passport]);

    const closeSidebar = useCallback(() => {
        setClickedD(null);

        localStorage.removeItem("clickedD");
    }, [setClickedD]);

    const save = useCallback(() => {
        setVisitedCountries(clickedD!);
    }, [clickedD, setVisitedCountries]);

    if (!translations.common) {
        return null;
    }

    return (
        <aside
            className="bg-base-100 border-l border-slate-300 dark:border-neutral-700 w-full h-full fixed top-0 right-0 max-w-64 z-50 overflow-y-auto shadow-2xl transition-transform"
            role="complementary"
        >
            <div className="p-4 mt-20">
                <div className="flex justify-between mb-3">
                    <button
                        className="p-2 hover:bg-base-200 rounded-full transition-colors group"
                        onClick={share}
                        aria-label="Paylaş"
                        title="Paylaş"
                    >
                        <Share2
                            size={24}
                            className="text-slate-500 group-hover:text-red-500 transition-colors"
                        />
                    </button>
                    <button
                        className="p-2 hover:bg-base-200 rounded-full transition-colors group"
                        onClick={save}
                        aria-label="Kaydet"
                        title="Bu ülkeyi ziyaret ettim olarak kaydet"
                    >
                        <Bookmark
                            size={24}
                            className="text-slate-500 group-hover:text-red-500 transition-colors"
                            fill={visitedCountries.includes(clickedD!) ? "currentColor" : "none"}
                        />
                    </button>
                    <button
                        className="p-2 hover:bg-base-200 rounded-full transition-colors group"
                        onClick={closeSidebar}
                        aria-label="Kapat"
                        title="Kapat"
                    >
                        <CircleX
                            size={24}
                            className="text-slate-500 group-hover:text-red-500 transition-colors"
                        />
                    </button>
                </div>

                {isCountryLoading ? (
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
                    <nav aria-label="Ülke Bilgisi">
                        <h2 className="text-xl font-bold mb-4 mt-2 border-b pb-2 inline-flex gap-3 w-full">
                            {<Image alt="flag" width={32} height={8} src={flag} />}
                            {translations.common}
                        </h2>

                        <div className="text-xs leading-relaxed text-slate-800 dark:text-slate-400">
                            <p className="line-clamp-6 mb-3">
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

                        <hr className="mt-6 mb-3" />

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
                                        className={`relative flex flex-col items-center transition-all rounded-lg border-2 ${passport === type.id
                                            ? "border-base-500"
                                            : "border-transparent hover:border-base-300"
                                            }`}
                                    >
                                        <Image
                                            width={36}
                                            height={50}
                                            alt={type.label}
                                            src={type.src}
                                            className="object-contain m-2"
                                        />

                                        <span className="text-[8px] mt-1 w-full text-center">
                                            {type.label}
                                        </span>
                                    </button>
                                )
                            )}
                        </div>

                        <p className="my-4 text-[10px] text-slate-500 italic text-center">
                            * Seçtiğiniz pasaport türüne göre
                            vize bilgileri gösterilecektir.
                        </p>
                            
                        <button
                            onClick={async () => {
                                setIsVisaLoading(true);
                                try {
                                    const data =
                                        await fetchVisaInfo(
                                            {
                                                common: translations.common,
                                                official:
                                                    translations.official,
                                                passportIndex:
                                                    PASSPORT_MAP[
                                                    passport
                                                    ]
                                            }
                                        );

                                    setVisaData(data);
                                } catch {
                                    setVisaData(null);
                                }

                                setIsVisaLoading(false);
                                const modal =
                                    document.getElementById(
                                        "my_modal_1"
                                    ) as HTMLDialogElement | null;

                                modal?.showModal();
                            }}
                            className="btn btn-outline w-full active:scale-[0.98] font-medium py-2.5 px-4 rounded-lg transition-all shadow-md"
                            disabled={isVisaLoading}
                        >
                            {isVisaLoading ? <div className="loading"></div> : "Vize durumunu sorgula"}
                        </button>
                    </nav>
                )}
            </div>

            <Modal data={visaData?.visa_info || ""} />
        </aside>
    );
}