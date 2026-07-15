import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import Toggle from "./components/ThemeToggle";
import { Mail, Map } from "lucide-react";
import SearchBar from "./components/SearchBar";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yörük: Seyahat Yardımcısı",
  description: "Yörük, seyahat planlamanızı kolaylaştıran, ülke bilgileri ve pasaport türlerine göre öneriler sunan bir uygulamadır.",
  keywords: "vize bilgileri, seyahat vizesi, vize gereksinimleri, ülke giriş şartları, pasaport vize kuralları, vizesiz ülkeler, seyahat kısıtlamaları, uluslararası seyahat bilgisi, ülke giriş koşulları, vize rehberi",
  robots: "index, follow",
  alternates: {
    canonical: `https://yoruk.benserhat.com`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          data-name="BMC-Widget"
          data-cfasync="false"
          src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js"
          data-id="benserhat"
          data-description="Support me on Buy me a coffee!"
          data-message="Dilerseniz bana destek olabilirsiniz."
          data-color="#BD5FFF50"
          data-position="Right"
          data-x_margin="10"
          data-y_margin="70"
          defer
        />
        <link rel="icon" type="image/x-icon" href="/YÖRÜK.svg" />
      </head>
      <body className="min-h-full flex flex-col overflow-hidden">
        <Analytics />
        <header>
          <nav className="flex justify-between navbar bg-base-300 shadow-sm border-b">
            <Link href="/">
              <Image
                className="rounded-full border border-black"
                src="/YÖRÜK.svg"
                alt="Logo"
                width={64}
                height={64}
              />
            </Link>
            <SearchBar />
          </nav>
        </header>
        <main className="my-auto">{children}</main>
        <footer className="flex justify-between w-full sm:footer-horizontal footer-center bg-base-300 text-base-content p-4 fixed bottom-0 border-t">
          <div className="flex text-xs gap-3">
            <Toggle />

            <Link href="/map" className="my-auto" aria-label="Ziyaret edilen ülkeler haritası">
              <Map />
            </Link>
          </div>
          <nav className="my-auto grid grid-cols-2 justify-center text-xs text-center">
            <Link
              className="link link-hover mx-auto"
              href="https://benserhat.com/"
            >
              Hakkımda
            </Link>
            <Link className="link link-hover mx-auto" href="/disclaimer">
              Sorumluluk Reddi
            </Link>
            <Link
              className="link link-hover mx-auto"
              href="https://benserhat.com/gdpr"
            >
              Gizlilik Politikası
            </Link>
            <Link className="link link-hover mx-auto" href="/methodology">
              Metodoloji
            </Link>
            <Link className="col-span-2 link link-hover mx-auto" href={process.env.BACKEND_URL!}>
              API
            </Link>
          </nav>
          <div className="text-sm grid grid-cols-2">
            <Link
              className="mx-1 sm:mx-5"
              href="https://www.youtube.com/@metamsa"
            >
              <Image width={24} height={24} alt="YouTube full-color icon (2024)" src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/YouTube_full-color_icon_%282024%29.svg/960px-YouTube_full-color_icon_%282024%29.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail" />
            </Link>
            <Link className="mx-1 sm:mx-5 bg-white rounded-2xl" href="https://github.com/MetaMsa">
              <Image width={24} height={24} alt="GitHub mark (2024)" src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Octicons-mark-github.svg/960px-Octicons-mark-github.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail" />
            </Link>
            <Link
              className="mx-1 sm:mx-5"
              href="https://www.linkedin.com/in/mehmet-serhat-aslan-58272b28a"
            >
              <Image width={24} height={24} alt="in-signature" src="https://upload.wikimedia.org/wikipedia/commons/7/7e/LinkedIn_PNG16.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail_unscaled" />
            </Link>
            <Link
              className="mx-1 sm:mx-5"
              href="mailto:mserhataslan@hotmail.com"
            >
              <Mail width={24} height={24} />
            </Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
