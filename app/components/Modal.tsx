import { useState, useRef, useEffect } from "react";
import { useCountryStore } from "../store/countryStore";
import { Lightbulb } from "lucide-react";
import Image from "next/image";
import { GeminiRes } from "../types/CountryType";

export default function Modal({ data }: { data: string }) {
    const [geminiRes, setGeminiRes] = useState<GeminiRes | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const { clickedD, passport } = useCountryStore();

    const controllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        setGeminiRes(null);

        if (controllerRef.current) {
            controllerRef.current.abort();
        }
    }, [clickedD, passport]);

    const fetchGeminiRes = async () => {
        if (controllerRef.current) {
            controllerRef.current.abort();
        }

        const controller = new AbortController();
        controllerRef.current = controller;

        setLoading(true);

        try {
            const response = await fetch(
                `/api/gemini?country=${clickedD}&passport=${passport}`,
                { signal: controller.signal }
            );

            if (!response.ok) return;

            const data = await response.json();
            setGeminiRes(data);
        } catch (err: any) {
            if (err.name === "AbortError") return;
            console.error(err);
        }
        finally {
            setLoading(false);
        }
    };

    const paragraphs = data
        .split(/(?<=[.!?:])\s+/)
        .filter(Boolean);

    const geminis = geminiRes?.gemini_res
        ?.split(/(\*\*.*?\*\*)/g)
        .filter(Boolean);

    return (
        <dialog id="my_modal_1" className="modal">
            <div className="modal-box">
                <div className="flex justify-between">
                    <h3 className="font-bold text-lg">Vize Bilgisi</h3>
                    <button onClick={fetchGeminiRes} className={`btn btn-outline ${loading ? "loading" : ""}`} disabled={loading || clickedD === "Republic of Turkey" || (geminiRes ? true : false)}>
                        <Lightbulb />
                    </button>
                </div>

                <div className="py-4 text-center space-y-4">
                    {paragraphs.map((p, i) => (
                        <p key={i}>{p}</p>
                    ))}
                </div>

                {geminiRes && !loading && (
                    <>
                        <hr />
                        <div className="py-4 space-y-1">
                            {geminis?.map((p, i) => {
                                const isBold = p.startsWith("**") && p.endsWith("**");

                                return (
                                    <p key={i}>
                                        {isBold ? <strong>{p.slice(2, -2)}</strong> : p}
                                    </p>
                                );
                            })}
                        </div>
                        <div className="mt-4 text-slate-500 italic text-center">
                            Bu cevap <Image alt="Gemini" className="inline-flex bg-white border border-black p-1 rounded mx-1" height={64} width={64} src="https://upload.wikimedia.org/wikipedia/commons/d/d9/Google_Gemini_logo_2025.svg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original" /> tarafından üretildi.
                        </div>
                    </>
                )}

            </div>

            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    );
}