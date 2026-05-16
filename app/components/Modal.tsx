import { useState, useRef } from "react";
import { useCountryStore } from "../store/countryStore";
import { Info } from "lucide-react";

export default function Modal({ data }: { data: string }) {
    const [geminiRes, setGeminiRes] = useState<string>("");
    const { clickedD, passport } = useCountryStore();

    const controllerRef = useRef<AbortController | null>(null);

    const fetchGeminiRes = async () => {
        if (controllerRef.current) {
            controllerRef.current.abort();
        }

        const controller = new AbortController();
        controllerRef.current = controller;

        try {
            const response = await fetch(
                `/api/gemini?country=${clickedD}&passport=${passport}`,
                { signal: controller.signal }
            );

            if (!response.ok) return;

            const text = await response.text();
            setGeminiRes(text);
        } catch (err: any) {
            if (err.name === "AbortError") return;
            console.error(err);
        }
    };

    return (
        <dialog id="my_modal_1" className="modal">
            <div className="modal-box">
                <div className="flex justify-between">
                    <h3 className="font-bold text-lg">Vize Bilgisi</h3>
                    <button onClick={fetchGeminiRes}>
                        <Info />
                    </button>
                </div>

                <p className="py-4 text-center">
                    {data ? data || "Vize bilgisi yükleniyor..." : "Viza bilgisi alınamadı."}
                </p>

                <p>{geminiRes}</p>
            </div>

            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    );
}