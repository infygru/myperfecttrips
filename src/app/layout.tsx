import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Syne } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import LayoutShell from "@/components/LayoutShell";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import AOSProvider from "@/components/AOSProvider";
import NotificationBar from "@/components/NotificationBar";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { getSiteSettings, directus } from "@/lib/directus";
import { readItems } from "@directus/sdk";
import type { DirectusSettings } from "@/types/settings";
import PopupBanner from "@/components/PopupBanner";

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
  const defaultTitle = "My Perfect Trips – UK Travel Agency | Luxury Holiday Packages | myperfecttrips.com";
  const defaultDesc = "My Perfect Trips is a Manchester-based travel agency offering bespoke international holiday packages, honeymoon tours, family travel, and corporate trips. 10,000+ happy travellers. Book today.";
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
        siteName: "My Perfect Trips",
        type: "website",
        locale: "en_GB",
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
        siteName: "My Perfect Trips",
        type: "website",
        locale: "en_GB",
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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://myperfecttrips.com";

const organizationSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["TravelAgency", "Organization"],
      "@id": `${SITE_URL}/#organization`,
      name: "My Perfect Trips",
      alternateName: ["My Perfect Trips", "My Perfect Trips Travel Agency"],
      disambiguatingDescription:
        "My Perfect Trips (myperfecttrips.com) is a Manchester-based UK travel agency. The name 'My Perfect Trips' refers exclusively to this travel company.",
      description:
        "My Perfect Trips is a Manchester-based UK travel agency — specialising in luxury international holiday packages, honeymoon tours, family trips, and corporate travel. Operating under the domain myperfecttrips.com.",
      url: `${SITE_URL}/`,
      logo: {
        "@type": "ImageObject",
        "@id": `${SITE_URL}/#logo`,
        url: `${SITE_URL}/logo.png`,
        contentUrl: `${SITE_URL}/logo.png`,
        caption: "My Perfect Trips – Official Logo",
      },
      image: `${SITE_URL}/logo.png`,
      legalName: "My Perfect Trips Ltd",
      foundingDate: "2020",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Bartle House, 9 Oxford Court",
        addressLocality: "Manchester",
        addressRegion: "Greater Manchester",
        postalCode: "M2 3WQ",
        addressCountry: "GB",
      },
      areaServed: {
        "@type": "Country",
        name: "United Kingdom",
      },
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: "+44-7895910015",
          contactType: "customer service",
          availableLanguage: ["English"],
        },
      ],
      knowsAbout: [
        "International holiday packages",
        "Honeymoon travel planning",
        "Luxury tour operators UK",
        "Corporate MICE travel",
        "Kerala tourism",
        "Maldives holiday packages",
        "Europe tour packages from UK",
        "Holiday packages from Manchester",
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Holiday Packages by My Perfect Trips",
        url: `${SITE_URL}/packages`,
      },
      sameAs: [
        "https://www.myperfecttrips.com",
        "https://www.instagram.com/myperfecttrips",
        "https://www.facebook.com/myperfecttrips",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: "My Perfect Trips",
      description:
        "Official website of My Perfect Trips (myperfecttrips.com) — Manchester's trusted travel agency for international holiday packages and bespoke tours.",
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

async function getActivePopup(): Promise<{ imageUrl: string; linkUrl: string } | null> {
  try {
    const dUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
    const items = (await directus.request(
      readItems('site_popups' as any, {
        filter: { active: { _eq: true } },
        limit: 1,
        fields: ['image', 'link_url'] as any,
      })
    )) as any[];
    const item = items?.[0];
    if (!item?.image) return null;
    return { imageUrl: `${dUrl}/assets/${item.image}`, linkUrl: item.link_url || '/free-giveaway' };
  } catch {
    return null;
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const popup = await getActivePopup();
  return (
    <html lang="en" suppressHydrationWarning className={`${jakarta.variable} ${syne.variable} scroll-smooth`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="flex min-h-screen flex-col bg-stone-50 antialiased font-sans overflow-x-hidden">
        <GoogleAnalytics />
        {popup && <PopupBanner imageUrl={popup.imageUrl} linkUrl={popup.linkUrl} />}
        <AuthProvider>
          <LayoutShell
            notificationBar={<NotificationBar />}
            header={<Header />}
            footer={<Footer />}
            cookieBanner={<CookieBanner />}
            aosProvider={<AOSProvider />}
          >
            {children}
          </LayoutShell>
        </AuthProvider>
      </body>
    </html>
  );
}
