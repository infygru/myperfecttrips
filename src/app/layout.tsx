import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Syne } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { directus } from "@/lib/directus";
import { readSingleton } from "@directus/sdk";
import type { DirectusSettings } from "@/types/settings";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = (await directus.request(
      readSingleton("site_settings" as any)
    )) as DirectusSettings;

    const dUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://localhost:8055";
    const faviconUrl = settings?.public_favicon
      ? `${dUrl}/assets/${settings.public_favicon}`
      : undefined;

    return {
      title: "IGHolidays | Premium Travel Agency in India & Luxury Tour Operator",
      description:
        "The leading travel agency in India specializing in bespoke international & domestic holiday packages, corporate MICE, and luxury travel planning.",
      icons: faviconUrl ? { icon: faviconUrl, apple: faviconUrl } : undefined,
    };
  } catch (err) {
    return {
      title: "IGHolidays | Premium Travel Agency in India & Luxury Tour Operator",
      description:
        "The leading travel agency in India specializing in bespoke international & domestic holiday packages, corporate MICE, and luxury travel planning.",
    };
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${jakarta.variable} ${syne.variable} scroll-smooth`}>
      <body className="flex min-h-screen flex-col bg-stone-50 antialiased font-sans">
        <Header />
        <div className="flex-1 w-full">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
