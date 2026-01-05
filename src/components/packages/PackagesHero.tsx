"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, MapPin, Globe } from "lucide-react";

export default function PackagesHero() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(searchParams.get("search") || "");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams.toString());
        if (query) {
            params.set("search", query);
        } else {
            params.delete("search");
        }
        // Reset page to 1 if pagination exists, but for now just search
        router.push(`/packages?${params.toString()}`);
    };

    return (
        <section className="relative bg-slate-900 pt-32 pb-20 md:pt-40 md:pb-24 overflow-hidden">
            {/* Abstract Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0 100 C 20 0 50 0 100 100 Z" fill="url(#grad1)" />
                </svg>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
            </div>

            {/* Glow Effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-blue/20 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10 text-center">

                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-brand-light text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">
                    <Globe size={12} className="text-sky-400" />
                    Curated Global Itineraries
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
                    Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-brand-blue-hover">Next Adventure</span>
                </h1>

                {/* Description */}
                <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
                    From breathtaking landscapes to vibrant city escapes, discover packages crafted for the modern traveller.
                </p>

                {/* Hero Search Bar */}
                <div className="max-w-2xl mx-auto">
                    <form onSubmit={handleSearch} className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-brand-blue transition-colors" />
                        </div>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search by destination (e.g., Dubai, Europe)..."
                            className="block w-full pl-12 pr-4 py-4 bg-white rounded-2xl text-slate-900 placeholder:text-slate-400 font-bold focus:outline-none focus:ring-4 focus:ring-brand-blue/20 shadow-xl transition-all"
                        />
                        <button
                            type="submit"
                            className="absolute right-2 top-2 bottom-2 px-6 bg-brand-blue hover:bg-brand-blue-hover text-white rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-brand-blue/25"
                        >
                            Search
                        </button>
                    </form>

                    {/* Quick Tags */}
                    <div className="flex flex-wrap justify-center gap-2 mt-6 text-sm text-slate-400 font-medium">
                        <span>Popular:</span>
                        {["Dubai", "Europe", "Thailand", "Maldives"].map(tag => (
                            <button
                                key={tag}
                                onClick={() => {
                                    setQuery(tag);
                                    router.push(`/packages?search=${tag}`);
                                }}
                                className="text-slate-300 hover:text-white hover:underline decoration-brand-blue underline-offset-4 transition-all"
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
