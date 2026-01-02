"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin, Clock, Star, Filter,
  ChevronDown, ArrowRight, X, Check,
  Plane, Coffee, Wifi, Car, Search
} from "lucide-react";
import { getAssetUrl } from "@/lib/directus/client";

import { useSearchParams } from "next/navigation";

export default function PackageList({ packages }: { packages: any[] }) {
  const searchParams = useSearchParams();

  // --- FILTERS STATE ---
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([199, 15000]);
  const [selectedStars, setSelectedStars] = useState<number[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // --- INITIALIZE FROM URL ---
  useEffect(() => {
    // 1. Search Query
    const query = searchParams.get("search");
    if (query) setSearchQuery(query);

    // 2. Budget
    const budget = searchParams.get("budget");
    if (budget) {
      if (budget === "£500 - £1000") setPriceRange([500, 1000]);
      else if (budget === "£1000 - £2000") setPriceRange([1000, 2000]);
      else if (budget === "£2000+") setPriceRange([2000, 15000]);
      // "Any Budget" or unknown values default to initial state [199, 15000]
    }

    // 3. Country (from Trending Destinations)
    const countryParam = searchParams.get("country");
    if (countryParam) {
      setSelectedCountries([countryParam]);
    }
  }, [searchParams]);

  // Lock body scroll when mobile filters are open
  useEffect(() => {
    if (showMobileFilters) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [showMobileFilters]);

  // --- FILTER LOGIC ---
  const uniqueAmenities = useMemo(() => {
    const allTags = packages.flatMap(p => p.tags || []);
    return Array.from(new Set(allTags));
  }, [packages]);

  const uniqueCountries = useMemo(() => {
    const allLocs = packages.map(p => p.location || "International");
    return Array.from(new Set(allLocs)).filter(Boolean);
  }, [packages]);

  const filteredPackages = packages.filter((pkg) => {
    const price = pkg.price || 0;
    const rating = pkg.rating || 0;
    const tags = pkg.tags || [];

    // Text Search Logic
    const matchesSearch = !searchQuery ||
      pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPrice = price >= priceRange[0] && price <= priceRange[1];
    const matchesStars = selectedStars.length === 0 || selectedStars.includes(Math.floor(rating));
    const matchesAmenities = selectedAmenities.length === 0 || selectedAmenities.every(a => tags.includes(a));
    const matchesCountry = selectedCountries.length === 0 || (pkg.location && selectedCountries.includes(pkg.location));

    return matchesSearch && matchesPrice && matchesStars && matchesAmenities && matchesCountry;
  });

  const toggleStar = (star: number) => {
    setSelectedStars(prev =>
      prev.includes(star) ? prev.filter(s => s !== star) : [...prev, star]
    );
  };

  const toggleCountry = (country: string) => {
    setSelectedCountries(prev =>
      prev.includes(country) ? prev.filter(c => c !== country) : [...prev, country]
    );
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen pt-8 pb-24">
      <div className="container mx-auto px-4 max-w-7xl">

        <div className="flex flex-col lg:flex-row gap-8">

          {/* --- MOBILE FILTER TOGGLE --- */}
          <button
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden w-full flex items-center justify-center gap-2 bg-white border border-slate-200 p-3 rounded-lg font-semibold text-slate-700 text-sm shadow-sm hover:bg-slate-50 transition-colors"
          >
            <Filter size={16} /> Filters & Sort
          </button>

          {/* --- SIDEBAR FILTERS --- */}
          {/* Mobile Overlay Backdrop */}
          {showMobileFilters && (
            <div
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] lg:hidden"
              onClick={() => setShowMobileFilters(false)}
            />
          )}

          {/* Sidebar Content */}
          <aside className={`
            fixed inset-y-0 left-0 z-[70] w-[85vw] max-w-[300px] bg-white p-6 shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-0 lg:w-64 lg:block lg:bg-transparent lg:p-0 lg:shadow-none lg:overflow-visible
            ${showMobileFilters ? "translate-x-0" : "-translate-x-full"}
          `}>

            <div className="h-full overflow-y-auto lg:h-auto lg:overflow-visible no-scrollbar">
              {/* Mobile Header */}
              <div className="lg:hidden flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-900">Refine Search</h2>
                <button onClick={() => setShowMobileFilters(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                  <X size={18} />
                </button>
              </div>

              <div className="bg-white lg:rounded-xl lg:shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] lg:border border-slate-200/60 p-5 space-y-7 lg:sticky lg:top-24">

                {/* PRICE FILTER */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Price Range</h3>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <span className="bg-slate-50 px-2 py-1 rounded border border-slate-100">£{priceRange[0]}</span>
                    <span className="text-slate-300">-</span>
                    <span className="bg-slate-50 px-2 py-1 rounded border border-slate-100">£{priceRange[1]}</span>
                  </div>
                  <input
                    type="range" min="199" max="15000" step="100"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-blue"
                  />
                </div>

                {/* COUNTRY FILTER */}
                <div className="space-y-3 pt-5 border-t border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Destinations</h3>
                  <div className="space-y-1 max-h-48 overflow-y-auto no-scrollbar">
                    {uniqueCountries.map((country: any) => (
                      <label key={country} className="flex items-center gap-3 cursor-pointer group hover:bg-slate-50 p-2 -mx-2 rounded-lg transition-colors">
                        <div className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-all ${selectedCountries.includes(country) ? "bg-brand-blue border-brand-blue" : "border-slate-300 bg-white"}`}>
                          {selectedCountries.includes(country) && <Check size={10} className="text-white" />}
                        </div>
                        <input type="checkbox" className="hidden" onChange={() => toggleCountry(country)} checked={selectedCountries.includes(country)} />
                        <span className="text-sm text-slate-600 font-medium group-hover:text-slate-900 transition-colors">{country}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* STAR RATING */}
                <div className="space-y-3 pt-5 border-t border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Star Rating</h3>
                  <div className="space-y-1">
                    {[5, 4, 3].map((star) => (
                      <label key={star} className="flex items-center gap-3 cursor-pointer group hover:bg-slate-50 p-2 -mx-2 rounded-lg transition-colors">
                        <div className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-all ${selectedStars.includes(star) ? "bg-brand-blue border-brand-blue" : "border-slate-300 bg-white"}`}>
                          {selectedStars.includes(star) && <Check size={10} className="text-white" />}
                        </div>
                        <input type="checkbox" className="hidden" onChange={() => toggleStar(star)} checked={selectedStars.includes(star)} />
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: star }).map((_, i) => (
                            <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* FEATURES */}
                <div className="space-y-3 pt-5 border-t border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Amenities</h3>
                  <div className="space-y-0.5">
                    {uniqueAmenities.slice(0, 8).map((amenity: any) => (
                      <label key={amenity} className="flex items-center gap-3 cursor-pointer group hover:bg-slate-50 p-2 -mx-2 rounded-lg transition-colors">
                        <div className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-all ${selectedAmenities.includes(amenity) ? "bg-brand-blue border-brand-blue" : "border-slate-300 bg-white"}`}>
                          {selectedAmenities.includes(amenity) && <Check size={10} className="text-white" />}
                        </div>
                        <input type="checkbox" className="hidden" onChange={() => toggleAmenity(amenity)} checked={selectedAmenities.includes(amenity)} />
                        <span className="text-sm text-slate-600 font-medium group-hover:text-slate-900 transition-colors">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setPriceRange([199, 15000]);
                    setSelectedStars([]);
                    setSelectedAmenities([]);
                    setSelectedCountries([]);
                  }}
                  className="w-full py-2.5 text-xs font-bold text-slate-400 hover:text-brand-blue hover:bg-blue-50 rounded-lg transition-all border border-transparent hover:border-blue-100"
                >
                  Clear Filters
                </button>

              </div>
            </div>
          </aside>

          {/* --- MAIN CONTENT (HORIZONTAL CARDS) --- */}
          <main className="flex-1 space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h2 className="text-sm font-semibold text-slate-500">
                Found <span className="text-slate-900 font-bold">{filteredPackages.length}</span> itineraries
                {searchQuery && (
                  <span className="ml-2 text-xs font-medium text-slate-400">
                    matching "{searchQuery}"
                  </span>
                )}
              </h2>
              <div className="hidden md:flex items-center gap-3 text-sm text-slate-500">
                <span className="font-medium">Sort by</span>
                <div className="relative">
                  <select className="appearance-none bg-white border border-slate-200 text-slate-700 py-1.5 pl-3 pr-8 rounded-md font-medium text-sm focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue cursor-pointer">
                    <option>Recommended</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {filteredPackages.map((pkg) => {
                const imageId = typeof pkg.image === 'object' ? pkg.image?.id : pkg.image;
                const imgUrl = imageId ? getAssetUrl(imageId) : "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800";

                return (
                  <div
                    key={pkg.id}
                    className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-brand-blue/30 transition-all duration-300 flex flex-col md:flex-row"
                  >
                    {/* IMAGE SECTION */}
                    <div className="relative w-full md:w-64 lg:w-72 h-48 md:h-auto shrink-0 overflow-hidden bg-slate-100">
                      <Image
                        src={imgUrl}
                        alt={pkg.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {/* Subtle Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    {/* CONTENT SECTION */}
                    <div className="flex-1 p-5 md:p-6 flex flex-col border-r border-slate-50">
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wide">Excellent Value</span>
                        </div>

                        <Link href={`/packages/${pkg.slug}`}>
                          <h3 className="text-xl font-bold text-slate-800 group-hover:text-brand-blue transition-colors leading-tight mb-2">
                            {pkg.title}
                          </h3>
                        </Link>

                        <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                          <div className="flex items-center gap-1">
                            {Array.from({ length: Math.floor(pkg.rating || 5) }).map((_, i) => (
                              <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin size={14} className="text-slate-400" />
                            <span className="font-medium">{pkg.location || "Global"}</span>
                          </div>
                        </div>
                      </div>

                      {/* INCLUSIONS */}
                      <div className="flex flex-wrap gap-2 mb-3 mt-auto">
                        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 rounded-md text-[11px] font-semibold text-slate-600 border border-slate-100">
                          <Clock size={12} className="text-slate-400" /> {pkg.duration_days} Days
                        </span>
                        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 rounded-md text-[11px] font-semibold text-slate-600 border border-slate-100">
                          <Plane size={12} className="text-slate-400" /> Flights
                        </span>
                        {pkg.tags?.slice(0, 2).map((tag: any) => (
                          <span key={tag} className="px-2.5 py-1 bg-blue-50/50 text-brand-blue rounded-md text-[11px] font-semibold border border-blue-50">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* PRICE/ACTION SECTION */}
                    <div className="w-full md:w-60 bg-slate-50/50 p-5 md:p-6 flex flex-col justify-center items-center md:items-end border-t md:border-t-0 md:border-l border-slate-100 text-center md:text-right">
                      <div className="mb-0.5 text-xs text-slate-400 font-medium">Seven nights from</div>

                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-sm font-semibold text-slate-400 line-through">£{Math.round(pkg.price * 1.2)}</span>
                        <span className="text-3xl font-bold text-slate-900">£{pkg.price}</span>
                      </div>

                      <Link href={`/packages/${pkg.slug}`} className="w-full">
                        <button className="w-full py-3 bg-brand-blue hover:bg-brand-blue-hover text-white rounded-lg font-semibold text-sm shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                          View Details <ArrowRight size={16} />
                        </button>
                      </Link>

                      <p className="mt-4 text-[10px] text-slate-500 font-medium flex items-center gap-1.5">
                        <Check size={12} className="text-emerald-500" /> Free Cancellation
                      </p>
                    </div>

                  </div>
                );
              })}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}