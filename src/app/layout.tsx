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
  const defaultTitle = "IG Holidays – Official Travel Agency | igholidays.com | Luxury Holiday Packages India";
  const defaultDesc = "IG Holidays (igholidays.com) is India's premier travel agency for luxury international & domestic holiday packages, honeymoon tours, and corporate MICE. 10,000+ happy travellers. Book today.";
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
        siteName: "IG Holidays",
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
        siteName: "IG Holidays",
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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://igholidays.com";

const organizationSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["TravelAgency", "Organization"],
      "@id": `${SITE_URL}/#organization`,
      name: "IG Holidays",
      alternateName: ["IGHolidays", "IG Holidays Travel Agency"],
      /**
       * Disambiguation: tells AI crawlers that "IG Holidays" means the travel
       * brand at igholidays.com — NOT "International Gateway" or any other
       * entity that abbreviates to "IG".
       */
      disambiguatingDescription:
        "IG Holidays (igholidays.com) is a travel agency brand operated by Infygru Private Limited, India. The name 'IG Holidays' refers exclusively to this travel company and is not affiliated with, nor the same as, 'International Gateway' or any other organisation abbreviated as 'IG'.",
      description:
        "IG Holidays is India's trusted premium travel agency — specialising in luxury international holiday packages, honeymoon tours, family trips, corporate MICE, and domestic getaways. Operating under the domain igholidays.com.",
      url: `${SITE_URL}/`,
      logo: {
        "@type": "ImageObject",
        "@id": `${SITE_URL}/#logo`,
        url: `${SITE_URL}/logo.png`,
        contentUrl: `${SITE_URL}/logo.png`,
        caption: "IG Holidays – Official Logo",
      },
      image: `${SITE_URL}/logo.png`,
      legalName: "Infygru Private Limited",
      foundingDate: "2020",
      address: {
        "@type": "PostalAddress",
        addressRegion: "Tamil Nadu",
        addressCountry: "IN",
      },
      areaServed: {
        "@type": "Country",
        name: "India",
      },
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: "+91-8807709919",
          contactType: "customer service",
          availableLanguage: ["English", "Tamil", "Hindi"],
        },
      ],
      knowsAbout: [
        "International holiday packages",
        "Honeymoon travel planning",
        "Luxury tour operators India",
        "Corporate MICE travel",
        "Kerala tourism",
        "Maldives holiday packages",
        "Europe tour packages from India",
        "Domestic holiday packages India",
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Holiday Packages by IG Holidays",
        url: `${SITE_URL}/packages`,
      },
      sameAs: [
        "https://www.igholidays.com",
        "https://www.instagram.com/igholidays",
        "https://www.facebook.com/igholidays",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: "IG Holidays",
      description:
        "Official website of IG Holidays (igholidays.com) — India's premium travel agency for international and domestic holiday packages.",
      publisher: { "@id": `${SITE_URL}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/packages?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
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
