import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Metodoloji",
    alternates: {
        canonical: `https://yoruk.benserhat.com/methodology`,
    },
};

export default function Page() {
    return (
        <div className="text-center bg-base-300 rounded-xl shadow p-3 mx-5 mb-30">
            <h2 className="mb-5">Metodoloji</h2>

            <p>
                Yörük, vize ve ülke bilgilerini açık kaynaklardan otomatik olarak toplayıp kullanıcıya sunar.

                Veriler Wikipedia ve benzeri açık kaynaklardan düzenli aralıklarla çekilir. Çekilen ham veri temizlenir, standart bir yapıya (JSON) dönüştürülür ve tutarlı hale getirilir.

                Backend tarafında bu veriler API üzerinden servis edilir ve gerektiğinde cache mekanizması ile hızlandırılır. Frontend ise bu verileri harita ve liste görünümleriyle kullanıcıya gösterir.

                Amaç, vize bilgilerini hızlı, anlaşılır ve güncel bir şekilde kullanıcıya sunmaktır.
            </p>
        </div>
    )
}