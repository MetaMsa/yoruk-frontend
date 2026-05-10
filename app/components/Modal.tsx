import { CircleX } from "lucide-react";

export default function Modal({ data }: { data: string }) {
    return (
        <dialog id="my_modal_1" className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Vize Bilgisi</h3>
                <p className="py-4">{data || "Vize bilgisi yükleniyor..."}</p>
                <div className="modal-action">
                    <form method="dialog">
                        <button className="btn btn-ghost"><CircleX /></button>
                    </form>
                </div>
            </div>
        </dialog>
    );
}