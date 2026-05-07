import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import Toggle from "./components/ThemeToggle";
import { Mail } from "lucide-react";

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

export default async function RootLayout({
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
      <body className="min-h-full flex flex-col overflow-hidden">
        <header>
          <nav className="navbar bg-base-300 shadow-sm border-b">
            <Link href={"/"}>
              <Image className="rounded-full border border-black" src="/YÖRÜK.svg" alt="Logo" width={64} height={64} />
            </Link>
          </nav>
        </header>
        <main className="flex-1 pb-20">
          {children}
        </main>
        <footer className="flex justify-between w-full sm:footer-horizontal footer-center bg-base-300 text-base-content p-4 fixed bottom-0 border-t">
          <Toggle />
          <div className="text-sm grid grid-cols-2">
            <Link
              className="mx-1 sm:mx-5 width-12"
              href={"https://www.youtube.com/@metamsa"}
            >
              <Image width={24} height={24} alt="YouTube full-color icon (2024)" src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/YouTube_full-color_icon_%282024%29.svg/960px-YouTube_full-color_icon_%282024%29.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail" />
            </Link>
            <Link className="mx-1 sm:mx-5 bg-white rounded-2xl" href={"https://github.com/MetaMsa"}>
              <Image width={24} height={24} alt="GitHub mark (2024)" src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Octicons-mark-github.svg/960px-Octicons-mark-github.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail" />
            </Link>
            <Link
              className="mx-1 sm:mx-5"
              href={"https://www.linkedin.com/in/mehmet-serhat-aslan-58272b28a"}
            >
              <img width={24} height={24} alt="in-signature" src="https://upload.wikimedia.org/wikipedia/commons/7/7e/LinkedIn_PNG16.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail_unscaled" />
            </Link>
            <Link
              className="mx-1 sm:mx-5"
              href={"mailto:mserhataslan@hotmail.com"}
            >
              <Mail width={24} height={24} />
            </Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
