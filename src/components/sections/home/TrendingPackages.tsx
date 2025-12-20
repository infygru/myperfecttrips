import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, MapPin } from 'lucide-react';
import directus, { getAssetUrl } from '@/lib/directus/client';
import { readItems } from '@directus/sdk';

export default async function TrendingPackages() {
  let packages: any[] = [];
  
  try {
    // UPDATED: Removed 'sort' to bypass the permission error
    packages = await directus.request(readItems('Packages', {
      fields: ['*', 'image.*'],
      limit: 3,
    }));
  } catch (error: any) {
    console.error("❌ Error fetching Packages:", error.message || error);
  }

  // If no packages are found, hide section
  if (!packages || packages.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-4xl font-bold text-slate-900 mb-2">Find Your Perfect Trip</h2>
            <p className="text-slate-500 text-lg">Trending destinations this month</p>
          </div>
          <Link 
            href="/packages" 
            className="group flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors"
          >
            View All 
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg: any) => {
            const imgId = typeof pkg.image === 'object' ? pkg.image?.id : pkg.image;
            const imgUrl = imgId 
              ? getAssetUrl(imgId) 
              : "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80";

            return (
              <Link key={pkg.id} href={`/packages/${pkg.slug}`} className="group block">
                <div className="relative h-[500px] w-full rounded-[2rem] overflow-hidden shadow-lg transition-transform duration-500 hover:-translate-y-2">
                  
                  {/* IMAGE */}
                  <Image 
                    src={imgUrl} 
                    alt={pkg.title} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* OVERLAY */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90" />

                  {/* CONTENT */}
                  <div className="absolute bottom-0 left-0 w-full p-8">
                    
                    {/* Location */}
                    <div className="flex items-center gap-1 text-cyan-400 font-bold mb-2">
                      <MapPin className="w-4 h-4 fill-current" />
                      <span className="text-sm uppercase tracking-wide">{pkg.location || "Destination"}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-3xl font-bold text-white mb-6 leading-tight">
                      {pkg.title}
                    </h3>

                    {/* Details */}
                    <div className="flex items-end justify-between">
                      <div className="flex gap-2">
                        {/* Duration Badge */}
                        <span className="px-3 py-1 rounded-lg bg-white/20 backdrop-blur-md text-xs font-medium text-white border border-white/10">
                          {pkg.duration_days ? `${pkg.duration_days} Days` : '5 Days'}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="block text-xs text-slate-300 font-medium mb-1">From</span>
                        <span className="text-3xl font-bold text-cyan-400">£{pkg.price}</span>
                      </div>
                    </div>
                  </div>

                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}