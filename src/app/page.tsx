import Hero from '@/components/sections/home/Hero';
import TrendingPackages from '@/components/sections/home/TrendingPackages';
import BudgetDestinations from '@/components/sections/home/BudgetDestinations';
import ClientStories from '@/components/sections/home/ClientStories';

// UPDATED: Use curly braces { WhyChooseUs }
import { WhyChooseUs } from '@/components/sections/home/WhyChooseUs';

export const dynamic = 'force-dynamic';

import ScrollAnimation from '@/components/ui/ScrollAnimation';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Hero />

      <ScrollAnimation>
        <TrendingPackages />
      </ScrollAnimation>

      <ScrollAnimation>
        <BudgetDestinations />
      </ScrollAnimation>

      <ScrollAnimation>
        <ClientStories />
      </ScrollAnimation>

      <ScrollAnimation>
        <WhyChooseUs />
      </ScrollAnimation>
    </div>
  );
}