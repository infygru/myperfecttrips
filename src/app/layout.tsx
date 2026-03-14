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

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  "@id": `${process.env.NEXT_PUBLIC_SITE_URL || "https://igholidays.com"}/#organization`,
  name: "IG Holidays",
  alternateName: "IGHolidays",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://igholidays.com",
  logo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://igholidays.com"}/logo.png`,
  description: "India's trusted travel agency specializing in luxury international and domestic holiday packages, honeymoon tours, corporate MICE, and group travel.",
  foundingDate: "2020",
  legalName: "Infygru Private Limited",
  address: {
    "@type": "PostalAddress",
    addressRegion: "Tamil Nadu",
    addressCountry: "IN",
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+91-8807709919",
      contactType: "customer service",
      availableLanguage: ["English", "Tamil", "Hindi"],
    },
  ],
  sameAs: [
    "https://www.instagram.com/igholidays",
    "https://www.facebook.com/igholidays",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${jakarta.variable} ${syne.variable} scroll-smooth`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
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
