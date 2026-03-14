import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Syne } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import AOSProvider from "@/components/AOSProvider";
import { directus, getSiteSettings } from "@/lib/directus";
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
  const defaultTitle = "IGHolidays | Premium Travel Agency in India & Luxury Tour Operator";
  const defaultDesc = "The leading travel agency in India specializing in bespoke international & domestic holiday packages, corporate MICE, and luxury travel planning.";
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  try {
    const settings = (await getSiteSettings()) as DirectusSettings;
    const dUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://localhost:8055";
    const faviconUrl = settings?.public_favicon
      ? `${dUrl}/assets/${settings.public_favicon}`
      : undefined;

    return {
      metadataBase: new URL(baseUrl),
      title: defaultTitle,
      description: defaultDesc,
      icons: faviconUrl ? { icon: faviconUrl, apple: faviconUrl } : undefined,
      openGraph: {
        title: defaultTitle,
        description: defaultDesc,
        url: baseUrl,
        siteName: "IGHolidays",
        type: "website",
        locale: "en_IN",
      },
      twitter: {
        card: "summary_large_image",
        title: defaultTitle,
        description: defaultDesc,
      },
      alternates: { canonical: baseUrl },
    };
  } catch {
    return {
      metadataBase: new URL(baseUrl),
      title: defaultTitle,
      description: defaultDesc,
      openGraph: {
        title: defaultTitle,
        description: defaultDesc,
        url: baseUrl,
        siteName: "IGHolidays",
        type: "website",
        locale: "en_IN",
      },
      twitter: {
        card: "summary_large_image",
        title: defaultTitle,
        description: defaultDesc,
      },
      alternates: { canonical: baseUrl },
    };
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${jakarta.variable} ${syne.variable} scroll-smooth`}>
      <body className="flex min-h-screen flex-col bg-stone-50 antialiased font-sans">
        <Header />
        <AOSProvider />
        <div className="flex-1 w-full">{children}</div>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
