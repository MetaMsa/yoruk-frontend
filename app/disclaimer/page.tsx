import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sorumluluk Reddi",
    alternates: {
        canonical: `https://yoruk.benserhat.com/disclaimer`,
    },
};

export default function Page() {
    return (
        <div className="text-center bg-base-300 rounded-xl shadow p-3 mx-5 mb-30">
            <h2 className="mb-5">Sorumluluk Reddi</h2>

            <p>
                Yörük platformunda sunulan tüm vize ve ülke bilgileri, kamuya açık kaynaklardan (ör. Wikipedia ve benzeri açık veri kaynakları) otomatik olarak derlenmektedir. Bu bilgiler yalnızca bilgilendirme amaçlıdır ve resmi, hukuki ya da diplomatik bir bağlayıcılığı yoktur.

                Veriler zaman içinde değişebilir, güncelliği veya doğruluğu garanti edilmez. Kullanıcıların seyahat planları veya resmi işlemleri için ilgili ülkenin konsoloslukları, büyükelçilikleri veya resmi devlet kaynaklarını kontrol etmeleri önerilir.

                Yörük, içerikteki bilgi hatalarından, eksikliklerden veya güncelliğini yitirmiş verilerden doğabilecek herhangi bir sonuçtan sorumlu tutulamaz.
            </p>
        </div>
    )
}