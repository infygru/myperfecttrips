import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/layout/Header/Navbar";
import ChatBot from "@/components/chat/ChatBot";
import { Footer } from "@/components/layout/Footer/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MyPerfectTrips",
  description: "Manchester's premier travel consultancy",
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
        <ChatBot />
        <Footer />
      </body>
    </html>
  );
}