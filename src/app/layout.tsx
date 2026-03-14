import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/layout/Header/Navbar";
import ChatBot from "@/components/chat/ChatBot";
import { Footer } from "@/components/layout/Footer/Footer";
import CookieConsent from "@/components/common/CookieConsent";

const inter = Inter({ subsets: ["latin"], display: "swap" });

const siteUrl = "https://myperfecttrips.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MyPerfectTrips | Manchester's Premier Travel Agency",
    template: "%s | MyPerfectTrips",
  },
  applicationName: "MyPerfectTrips",
  description:
    "MyPerfectTrips is Manchester's premier travel agency specialising in Dubai packages, Turkey holidays, Schengen visa assistance, corporate travel and MICE. Book your dream holiday today.",
  keywords: [
    "MyPerfectTrips",
    "My Perfect Trips",
    "travel agency Manchester",
    "Dubai holiday packages",
    "Turkey travel packages",
    "Schengen visa Manchester",
    "corporate travel Manchester",
    "MICE travel UK",
    "holiday packages UK",
    "cheap flights Manchester",
    "bespoke holidays UK",
    "luxury travel deals",
    "travel consultancy Manchester",
    "visa assistance UK",
  ],
  authors: [{ name: "MyPerfectTrips", url: siteUrl }],
  creator: "MyPerfectTrips",
  publisher: "MyPerfectTrips",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: siteUrl,
    siteName: "MyPerfectTrips",
    title: "MyPerfectTrips | Manchester's Premier Travel Agency",
    description:
      "Manchester's premier travel agency for Dubai packages, Turkey holidays, Schengen visas, corporate travel & MICE. We handle the stress so you don't have to.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "MyPerfectTrips - Manchester's Premier Travel Agency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MyPerfectTrips | Manchester's Premier Travel Agency",
    description:
      "Manchester's premier travel agency for Dubai packages, Turkey holidays, Schengen visas, corporate travel & MICE.",
    images: ["/og-image.jpg"],
  },
  category: "travel",
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: "MyPerfectTrips",
  alternateName: "My Perfect Trips",
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  image: `${siteUrl}/og-image.jpg`,
  description:
    "Manchester's premier travel agency specialising in Dubai packages, Turkey holidays, Schengen visa assistance, corporate travel and MICE solutions.",
  telephone: "+447895910015",
  email: "hello@myperfecttrips.co.uk",
  address: {
    "@type": "PostalAddress",
    streetAddress: "4 Woodfield Rd",
    addressLocality: "Altrincham",
    addressRegion: "Greater Manchester",
    postalCode: "WA14 4EU",
    addressCountry: "GB",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 53.3838,
    longitude: -2.3508,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "10:00",
      closes: "16:00",
    },
  ],
  sameAs: ["https://wa.me/447895910015"],
  priceRange: "££",
  currenciesAccepted: "GBP",
  paymentAccepted: "Cash, Credit Card, Bank Transfer",
  areaServed: {
    "@type": "Country",
    name: "United Kingdom",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://admin.myperfecttrips.com" />
        <meta name="geo.region" content="GB-MAN" />
        <meta name="geo.placename" content="Manchester" />
        <meta name="geo.position" content="53.3838;-2.3508" />
        <meta name="ICBM" content="53.3838, -2.3508" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body className={inter.className}>
        <Navbar />
        <main>
          {children}
        </main>
        <CookieConsent />
        <ChatBot />
        <Footer />
      </body>
    </html>
  );
}