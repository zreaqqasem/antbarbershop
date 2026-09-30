import type { Metadata, Viewport } from "next";
import {
  Geist,
  Geist_Mono,
  Pacifico,
  Sofia_Sans_Condensed,
  Hanken_Grotesk,
  Noto_Kufi_Arabic,
} from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "../components/LanguageProvider";
import Animations from "../components/Animations";

const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-pacifico",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const display = Sofia_Sans_Condensed({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

const body = Hanken_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

const arabic = Noto_Kufi_Arabic({
  subsets: ["arabic", "latin"],
  display: "swap",
  variable: "--font-arabic",
});

export const metadata: Metadata = {
  title: "A&T Barbershop | Classic Cuts & Fades in The Colony, TX",
  description:
    "Precision fades, classic scissor cuts and beard grooming in The Colony, Texas. Open seven days a week. English, Arabic and Spanish spoken.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning={true}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${pacifico.variable} ${display.variable} ${body.variable} ${arabic.variable} font-[family-name:var(--font-body)] bg-[#0B0B0C] text-[#F5F2EC] antialiased`}
      >
        <style
          dangerouslySetInnerHTML={{
            __html:
              'html[dir="rtl"] .rtl-font, html[dir="rtl"] .rtl-font * { font-family: var(--font-arabic); }',
          }}
        />
        <LanguageProvider>{children}</LanguageProvider>
        <Animations />
      </body>
    </html>
  );
}