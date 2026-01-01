import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/layout/Header/Navbar";
import ChatBot from "@/components/chat/ChatBot";
import { Footer } from "@/components/layout/Footer/Footer";
import CookieConsent from "@/components/common/CookieConsent";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MyPerfectTrips | Manchester's Premier Travel Consultancy",
  description: "We are a dedicated travel team in Manchester. We handle the stress of visas, flights, and business travel so you don't have to.",
  openGraph: {
    title: "MyPerfectTrips | Manchester's Premier Travel Consultancy",
    description: "We are a dedicated travel team in Manchester. We handle the stress of visas, flights, and business travel so you don't have to.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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