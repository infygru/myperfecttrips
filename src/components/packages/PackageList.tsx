"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, Filter, Star, RefreshCw, ChevronDown } from "lucide-react";
import { getAssetUrl } from "@/lib/directus/client";

const THEMES = ["All Themes", "Family", "Honeymoon", "Luxury", "Budget", "Nature"];

export default function PackageList({ packages }: { packages: any[] }) {
  // --- STATE ---
  const [maxBudget, setMaxBudget] = useState(5000);
  const [selectedTheme, setSelectedTheme] = useState("All Themes");
  const [selectedCountry, setSelectedCountry] = useState("All Countries");

  // --- DYNAMIC DATA ---
  // Extract unique countries from the packages list automatically
  const uniqueCountries = useMemo(() => {
    const countries = packages.map(p => p.location?.split(',').pop()?.trim() || "International");
    return ["All Countries", ...Array.from(new Set(countries))];
  }, [packages]);

  // --- FILTER LOGIC ---
  const filteredPackages = packages.filter((pkg) => {
    // 1. Price Check
    const matchesPrice = (pkg.price || 0) <= maxBudget;

    // 2. Theme Check
    const pkgTags = Array.isArray(pkg.tags) 
      ? pkg.tags.join(" ").toLowerCase() 
      : (pkg.tags || "").toLowerCase();
    const matchesTheme = selectedTheme === "All Themes" || 
                         pkgTags.includes(selectedTheme.toLowerCase()) || 
                         (pkg.category || "").toLowerCase().includes(selectedTheme.toLowerCase());

    // 3. Country Check
    const pkgCountry = pkg.location?.split(',').pop()?.trim() || "International";
    const matchesCountry = selectedCountry === "All Countries" || pkgCountry === selectedCountry;

    return matchesPrice && matchesTheme && matchesCountry;
  });

  // --- RESET FUNCTION ---
  const resetFilters = () => {
    setMaxBudget(5000);
    setSelectedTheme("All Themes");
    setSelectedCountry("All Countries");
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* --- LEFT SIDEBAR (FILTERS) --- */}
        <aside className="w-full lg:w-72 shrink-0 space-y-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-28">
            
            <div className="flex items-center gap-2 mb-6 text-slate-900 font-bold text-lg border-b border-slate-100 pb-4">
              <Filter className="w-5 h-5 text-blue-600" />
              Filters
            </div>

            {/* Price Filter */}
            <div className="mb-8">
              <div className="flex justify-between text-sm font-bold text-slate-700 mb-3">
                <span>Max Budget</span>
                <span className="text-blue-600">£{maxBudget}</span>
              </div>
              <input
                type="range" min="500" max="10000" step="100"
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
                <span>£500</span>
                <span>£10k+</span>
              </div>
            </div>

            {/* Country Filter (New) */}
            <div className="mb-8">
              <h4 className="font-bold text-slate-700 mb-3 text-sm uppercase tracking-wider">Destination</h4>
              <div className="relative">
                <select 
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-sm"
                >
                  {uniqueCountries.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Theme Filter (Radio Style) */}
            <div className="mb-8">
              <h4 className="font-bold text-slate-700 mb-3 text-sm uppercase tracking-wider">Theme</h4>
              <div className="space-y-3">
                {THEMES.map((theme) => (
                  <label key={theme} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${selectedTheme === theme ? 'border-blue-600' : 'border-slate-300 group-hover:border-blue-400'}`}>
                      {selectedTheme === theme && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                    </div>
                    <input
                      type="radio" name="theme" value={theme}
                      checked={selectedTheme === theme}
                      onChange={() => setSelectedTheme(theme)}
                      className="hidden"
                    />
                    <span className={`text-sm font-medium transition-colors ${selectedTheme === theme ? 'text-blue-900' : 'text-slate-600 group-hover:text-blue-600'}`}>
                      {theme}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Reset Button */}
            <button 
              onClick={resetFilters}
              className="w-full py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Reset Filters
            </button>

          </div>
        </aside>

        {/* --- MAIN CONTENT (LIST) --- */}
        <main className="flex-1">
          <p className="text-slate-500 mb-6 text-sm font-medium">
            Showing {filteredPackages.length} results
          </p>

          <div className="space-y-6">
            {filteredPackages.map((pkg) => {
              const imgId = typeof pkg.image === 'object' ? pkg.image?.id : pkg.image;
              const imgUrl = imgId ? getAssetUrl(imgId) : "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80";

              return (
                // WRAPPED IN LINK: Makes the entire card clickable
                <Link 
                  href={`/packages/${pkg.slug}`} 
                  key={pkg.id} 
                  className="block bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 group overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row h-full">
                    
                    {/* Image Section */}
                    <div className="relative w-full md:w-80 h-64 md:h-auto shrink-0">
                      <Image 
                        src={imgUrl} 
                        alt={pkg.title} 
                        fill 
                        className="object-cover transition-transform duration-700 group-hover:scale-105" 
                      />
                      {/* Rating Badge */}
                      {pkg.rating && (
                         <div className="absolute top-4 left-4 bg-white/95 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm text-slate-800">
                             <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> {pkg.rating}
                         </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 p-6 flex flex-col relative">
                      
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                            {pkg.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-4 text-slate-500 text-sm mb-3">
                              <span className="flex items-center gap-1.5 font-medium">
                                <MapPin className="w-4 h-4 text-blue-500" /> 
                                {pkg.location || "International"}
                              </span>
                              <span className="flex items-center gap-1.5 font-medium">
                                <Clock className="w-4 h-4 text-blue-500" /> 
                                {pkg.duration || "5"} Days
                              </span>
                          </div>
                        </div>

                        {/* Price Top Right */}
                        <div className="text-right shrink-0 ml-4">
                           <div className="text-3xl font-bold text-blue-600">£{pkg.price}</div>
                           <div className="text-xs text-slate-400 font-medium uppercase tracking-wide">per person</div>
                        </div>
                      </div>

                      <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2 border-t border-slate-50 pt-3 mt-1">
                          {pkg.description || "Experience the perfect getaway with our curated itinerary designed for relaxation and adventure."}
                      </p>

                      {/* Bottom Row: Tags & Button */}
                      <div className="mt-auto flex items-center justify-between">
                          {/* Tags */}
                          <div className="flex gap-2 flex-wrap">
                              {Array.isArray(pkg.tags) && pkg.tags.slice(0, 3).map((t: string, i: number) => (
                                  <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[11px] font-bold rounded-md uppercase tracking-wide border border-slate-200">
                                      {t}
                                  </span>
                              ))}
                          </div>

                          {/* Fake Button (Visual Only since whole card is Link) */}
                          <div className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold text-sm shadow-lg shadow-blue-500/30 group-hover:bg-blue-700 transition-colors">
                              View Details
                          </div>
                      </div>

                    </div>
                  </div>
                </Link>
              );
            })}

            {/* Empty State */}
            {filteredPackages.length === 0 && (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Filter className="w-8 h-8 text-slate-300" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">No packages found</h3>
                    <p className="text-slate-500 text-sm mb-6">Try adjusting your filters or search criteria.</p>
                    <button 
                      onClick={resetFilters}
                      className="text-blue-600 font-bold hover:underline"
                    >
                      Clear all filters
                    </button>
                </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}