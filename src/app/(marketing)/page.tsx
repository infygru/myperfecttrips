import Hero from '@/components/sections/home/Hero'; 
import TrendingPackages from '@/components/sections/home/TrendingPackages'; 
import BudgetDestinations from '@/components/sections/home/BudgetDestinations'; 
import ClientStories from '@/components/sections/home/ClientStories';

// UPDATED: Use curly braces { WhyChooseUs }
import { WhyChooseUs } from '@/components/sections/home/WhyChooseUs'; 

export const dynamic = 'force-dynamic';

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