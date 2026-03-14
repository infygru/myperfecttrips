import type { Metadata } from "next";
import Hero from '@/components/sections/home/Hero';
import TrendingPackages from '@/components/sections/home/TrendingPackages';
import BudgetDestinations from '@/components/sections/home/BudgetDestinations';
import ClientStories from '@/components/sections/home/ClientStories';

// UPDATED: Use curly braces { WhyChooseUs }
import { WhyChooseUs } from '@/components/sections/home/WhyChooseUs';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "MyPerfectTrips | Manchester's Premier Travel Agency",
  description:
    "Discover handpicked holiday packages to Dubai, Turkey, Europe and beyond. MyPerfectTrips — Manchester's trusted travel agency for flights, hotels, visas and bespoke holidays.",
  alternates: {
    canonical: "https://myperfecttrips.com",
  },
  openGraph: {
    title: "MyPerfectTrips | Manchester's Premier Travel Agency",
    description:
      "Handpicked Dubai & Turkey packages, Schengen visa assistance, corporate travel and MICE services from Manchester's premier travel consultancy.",
    url: "https://myperfecttrips.com",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Hero />
      <TrendingPackages />
      <BudgetDestinations />
      <ClientStories />
      <WhyChooseUs />
    </div>
  );
}