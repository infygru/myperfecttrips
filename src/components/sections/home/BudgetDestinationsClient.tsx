"use client";

import { useState } from "react";
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Star } from 'lucide-react';
import { getAssetUrl } from '@/lib/directus/client';

// Define the Tabs
const categories = [
  { id: 'budget', label: 'Budget Friendly', keywords: ['budget', 'cheap', 'economy', 'saving'] },
  { id: 'luxury', label: 'Luxury Escapes', keywords: ['luxury', 'vip', 'premium', '5 star', 'five star'] },
  { id: 'honeymoon', label: 'Honeymoon', keywords: ['honeymoon', 'couples', 'romantic'] },
];

export default function BudgetDestinationsClient({ packages }: { packages: any[] }) {
  const [activeCategory, setActiveCategory] = useState('budget');

  // --- SMART FILTERING LOGIC ---
  const displayedPackages = packages.filter(pkg => {
    const currentCat = categories.find(c => c.id === activeCategory);
    if (!currentCat) return true; 

    const pkgTags = Array.isArray(pkg.tags) ? pkg.tags.join(' ').toLowerCase() : (pkg.tags || '').toLowerCase();
    const pkgCategory = (pkg.category || '').toLowerCase();
    const combinedData = `${pkgTags} ${pkgCategory}`;

    return currentCat.keywords.some(keyword => combinedData.includes(keyword));
  });

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        
        {/* HEADER & TABS */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">Budget Friendly Destinations</h2>
          
          <div className="inline-flex items-center bg-white rounded-full p-1.5 shadow-sm border border-slate-100 overflow-x-auto max-w-full">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* EMPTY STATE */}
        {displayedPackages.length === 0 && (
          <div className="text-center py-10 text-slate-400">
            <p>No packages found for "{categories.find(c => c.id === activeCategory)?.label}".</p>
          </div>
        )}

        {/* CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayedPackages.map((pkg) => {
             // Image Handling
             const imgId = typeof pkg.image === 'object' ? pkg.image?.id : pkg.image;
             const imgUrl = imgId ? getAssetUrl(imgId) : "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80";

             return (
              // LINK WRAPPER: Now the whole card is clickable
              <Link key={pkg.id} href={`/packages/${pkg.slug}`} className="group block h-full">
                <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col h-full">
                  
                  {/* IMAGE */}
                  <div className="relative h-64 overflow-hidden">
                    <Image 
                      src={imgUrl} 
                      alt={pkg.title} 
                      fill 
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Rating */}
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-2 py-1 rounded-lg shadow-sm flex items-center gap-1 text-xs font-bold text-slate-800">
                      <Star className="w-3 h-3 text-amber-500 fill-current" />
                      {pkg.rating || 4.5}
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {pkg.title}
                    </h3>
                    
                    {/* Tags Rendering */}
                    <div className="flex gap-2 mb-6 flex-wrap">
                      {Array.isArray(pkg.tags) && pkg.tags.slice(0, 3).map((tag: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider rounded-md">
                          {tag}
                        </span>
                      ))}
                      {!Array.isArray(pkg.tags) && pkg.category && (
                         <span className="px-3 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider rounded-md">
                           {pkg.category}
                         </span>
                      )}
                    </div>

                    {/* PRICE & LINK */}
                    <div className="mt-auto flex items-center justify-between border-t border-slate-50 pt-6">
                      <div className="text-2xl font-bold text-blue-600">
                        £{pkg.price}
                      </div>
                      <div className="flex items-center gap-1 text-sm font-bold text-blue-600 group-hover:text-blue-800 transition-colors">
                        View Deal 
                        <ChevronRight className="w-4 h-4" />
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