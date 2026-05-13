"use client";

import {
    CircleX,
    Loader2,
    AlertCircle,
    Share2
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
import type { CountryInfo, Country } from "../types/CountryType";
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

    return response.text();
}

export default function Sidebar({
    official
}: {
    official: string;
}) {
    const { clickedD, setClickedD } =
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
    const { passport, setPassport } =
        useCountryStore();

    const [visaData, setVisaData] =
        useState<string>("");
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

            const res = await fetch(`https://restcountries.com/v3.1/name/${official}`);

            if (!res.ok) return;

            const data: Country[] = await res.json();

            if (data[0].translations?.tur?.common === "Falkland (Malvina) Adaları") {
                data[0].translations.tur.common = "Falkland Adaları";
                data[0].translations.tur.official = "Falkland Adaları";
            }

            setTranslations({
                common: data[0].translations?.tur?.common || "",
                official: data[0].translations?.tur?.official || ""
            })

            setFlag(data[0].flags.svg);
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
    }, [translations.official]);

    const share = useCallback(async () => {
        const shareData = {
            title: "Yörük: Seyahat Yardımcısı",
            text:
                "Yörük Seyahat Yardımcısı'ndan " +
                PASSPORT_TYPES[PASSPORT_MAP[
                passport
                ]].label +
                " pasaportla gidebileceğimiz bir ülke keşfettim bir göz at:" +
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

    if (!translations.common) {
        return null;
    }

    return (
        <aside
            className="bg-base-100 border-l border-slate-300 dark:border-neutral-700 w-full h-full fixed top-0 right-0 max-w-64 z-50 overflow-y-auto shadow-2xl transition-transform"
            role="complementary"
        >
            <div className="p-4 mt-15">
                <div className="flex justify-between mb-3">
                    <button
                        className="p-2 hover:bg-base-200 rounded-full transition-colors group"
                        onClick={share}
                        aria-label="Kapat"
                    >
                        <Share2
                            size={24}
                            className="text-slate-500 group-hover:text-red-500 transition-colors"
                        />
                    </button>
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
                    <nav aria-label="Country Information">
                        <h2 className="text-xl font-bold mb-4 border-b pb-2 inline-flex gap-3 w-full">
                            <Image alt="flag" width={32} height={32} src={flag} className="h-10" />
                            {translations.common}
                        </h2>

                        <div className="text-xs leading-relaxed text-slate-800 dark:text-slate-400">
                            <p className="line-clamp-5 mb-3">
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

                        <hr className="my-1" />

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
                                    setVisaData(
                                        "Vize bilgisi alınamadı."
                                    );
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