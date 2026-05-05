import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col fixed">
        <header className="z-10">
          <nav className="navbar bg-base-100 shadow-sm border-b">
            <Link href={"/"}>
              <Image className="rounded-full" src="/YÖRÜK.svg" alt="Logo" width={96} height={96} />
            </Link>
          </nav>
        </header>
        <main className="w-screen">
          {children}
        </main>
        <footer className="footer sm:footer-horizontal footer-center bg-base-300 text-base-content p-4 fixed bottom-0 border-t">
          <Link className="link link-hover" href="https://github.com/MetaMsa">Mehmet Serhat ASLAN</Link>
        </footer>
      </body>
    </html>
  );
}
