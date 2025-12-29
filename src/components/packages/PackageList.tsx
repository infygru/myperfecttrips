"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  MapPin, Clock, Calendar, CreditCard, 
  ChevronRight, RefreshCw, Star, Filter,
  Tag, Search, ChevronDown
} from "lucide-react";
import { getAssetUrl } from "@/lib/directus/client";

export default function PackageList({ packages }: { packages: any[] }) {
  const [maxBudget, setMaxBudget] = useState(15000);
  const [selectedCountry, setSelectedCountry] = useState("All Countries");
  const [selectedDuration, setSelectedDuration] = useState("Any Duration");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [searchQuery, setSearchQuery] = useState("");

  const uniqueCountries = useMemo(() => {
    const countries = packages.map(p => p.destination?.name || p.location?.split(',').pop()?.trim() || "International");
    return ["All Countries", ...Array.from(new Set(countries))];
  }, [packages]);

  const uniqueCategories = useMemo(() => {
    const cats = packages.flatMap(p => p.tags || []);
    return ["All Categories", ...Array.from(new Set(cats))];
  }, [packages]);

  const filteredPackages = packages.filter((pkg) => {
    const price = pkg.price || 0;
    const duration = pkg.duration_days || 0;
    const pkgCountry = pkg.destination?.name || pkg.location?.split(',').pop()?.trim() || "International";
    const pkgTags = pkg.tags || [];
    
    const matchesPrice = price <= maxBudget;
    const matchesCountry = selectedCountry === "All Countries" || pkgCountry === selectedCountry;
    const matchesCategory = selectedCategory === "All Categories" || pkgTags.includes(selectedCategory);
    const matchesSearch = pkg.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesDuration = true;
    if (selectedDuration === "Short (1-5 Days)") matchesDuration = duration <= 5;
    else if (selectedDuration === "Medium (6-10 Days)") matchesDuration = duration > 5 && duration <= 10;
    else if (selectedDuration === "Long (11+ Days)") matchesDuration = duration > 10;

    return matchesPrice && matchesCountry && matchesDuration && matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-white min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6">
        
        {/* --- LIGHT HEADER --- */}
        <div className="mb-12 border-b border-slate-100 pb-8 flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="max-w-xl">
            <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-4">
              Explore <span className="text-blue-600 font-serif italic lowercase tracking-normal">journeys</span>
            </h1>
            <p className="text-slate-500 font-medium text-sm">Curated escapes from Manchester to the world.</p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text"
              placeholder="Search by destination..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold outline-none focus:border-blue-600 transition-all shadow-sm"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* --- LIGHT SIDEBAR FILTERS --- */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="sticky top-32 space-y-8 bg-white p-6 border border-slate-100 rounded-xl shadow-sm">
              <div className="flex items-center gap-2 text-slate-900 font-black uppercase text-[10px] tracking-widest border-b border-slate-50 pb-4">
                <Filter size={14} className="text-blue-600" /> Filter Selection
              </div>

              <LightThemedSelect label="Destination" icon={<MapPin size={14}/>} value={selectedCountry} options={uniqueCountries} onChange={setSelectedCountry} />
              <LightThemedSelect label="Travel Style" icon={<Tag size={14}/>} value={selectedCategory} options={uniqueCategories} onChange={setSelectedCategory} />
              <LightThemedSelect label="Duration" icon={<Calendar size={14}/>} value={selectedDuration} options={["Any Duration", "Short (1-5 Days)", "Medium (6-10 Days)", "Long (11+ Days)"]} onChange={setSelectedDuration} />

              <div className="space-y-4 pt-2">
                <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  <span className="text-blue-600">Max Budget</span>
                  <span className="text-slate-900">£{maxBudget}</span>
                </div>
                <input
                  type="range" min="500" max="15000" step="500"
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(Number(e.target.value))}
                  className="w-full h-1 bg-slate-100 rounded-full appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <button 
                onClick={() => { setMaxBudget(15000); setSelectedCountry("All Countries"); setSelectedDuration("Any Duration"); setSelectedCategory("All Categories"); setSearchQuery(""); }}
                className="w-full py-3.5 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 border border-slate-100 hover:border-blue-100 transition-all flex items-center justify-center gap-2 rounded-lg"
              >
                <RefreshCw size={12}/> Reset Filters
              </button>
            </div>
          </aside>

          {/* --- SOFT-BOXY CARDS WITH SUBTLE SHADOWS --- */}
          <main className="flex-1 space-y-6">
            {filteredPackages.map((pkg) => {
              const imageId = typeof pkg.image === 'object' ? pkg.image?.id : pkg.image;
              const imgUrl = imageId ? getAssetUrl(imageId) : "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800";
              
              return (
                <Link 
                  href={`/packages/${pkg.slug}`} 
                  key={pkg.id} 
                  className="group block bg-white border border-slate-100 rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] hover:shadow-[0_10px_30px_-5px_rgba(37,99,235,0.1)] transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row h-full">
                    <div className="relative w-full md:w-72 h-60 md:h-auto shrink-0 overflow-hidden rounded-t-xl md:rounded-l-xl md:rounded-tr-none">
                      <Image src={imgUrl} alt={pkg.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>

                    <div className="flex-1 p-7 flex flex-col justify-between">
                      <div className="space-y-5">
                        <div className="flex justify-between items-start">
                          <h2 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors tracking-tighter uppercase leading-none">
                            {pkg.title}
                          </h2>
                          <div className="text-right">
                             <p className="text-2xl font-black text-blue-600 leading-none">£{pkg.price}</p>
                             <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest mt-1">Starting From</p>
                          </div>
                        </div>

                        <div className="flex gap-6 py-1">
                          <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                            <MapPin size={13} className="text-blue-600" /> {pkg.destination?.name || "Global"}
                          </div>
                          <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                            <Clock size={13} className="text-blue-600" /> {pkg.duration_days} Days
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-50">
                        <div className="flex gap-2">
                           {pkg.tags?.slice(0, 2).map((t: string) => (
                             <span key={t} className="px-3 py-1 bg-slate-50 text-[8px] font-black uppercase tracking-widest text-slate-400 rounded-md">
                               {t}
                             </span>
                           ))}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase text-blue-600 group-hover:translate-x-1 transition-all">
                          Details <ChevronRight size={14} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </main>
        </div>
      </div>
    </div>
  );
}

// --- LIGHT THEMED SELECT ---
function LightThemedSelect({ label, icon, value, options, onChange }: any) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-2 relative">
      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
        {icon} {label}
      </label>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-white border border-slate-200 text-slate-700 px-4 py-3 rounded-lg text-[11px] font-bold transition-all hover:border-blue-600 focus:ring-1 focus:ring-blue-100 shadow-sm"
      >
        {value}
        <ChevronDown size={14} className={`text-blue-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 top-full left-0 w-full bg-white border border-slate-100 shadow-xl rounded-lg mt-1 overflow-hidden animate-in fade-in slide-in-from-top-1">
          {options.map((opt: string) => (
            <button
              key={opt}
              type="button"
              onClick={() => { onChange(opt); setIsOpen(false); }}
              className={`w-full text-left px-4 py-3 text-[10px] font-black uppercase transition-colors ${value === opt ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-blue-50 hover:text-blue-600'}`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}