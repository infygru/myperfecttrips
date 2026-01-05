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
        <section className="relative pt-32 pb-12 md:pt-48 md:pb-20 overflow-hidden flex items-center justify-center min-h-[400px]">

            {/* Background Image - RESTORED */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=2070&auto=format&fit=crop"
                    alt="Majestic Landscape"
                    className="w-full h-full object-cover object-center"
                />
                {/* Cinematic Overlays */}
                <div className="absolute inset-0 bg-black/50" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/60" />
            </div>

            <div className="container mx-auto px-4 relative z-10 text-center pt-12">

                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-[0.2em] mb-8 backdrop-blur-md shadow-lg">
                    <Globe size={12} className="text-sky-400" />
                    Curated Experiences
                </div>

                {/* Title */}
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 tracking-tight drop-shadow-2xl">
                    Find Your <span className="text-sky-400">Perfect Trip</span>
                </h1>

                {/* Description */}
                <p className="text-slate-200 text-lg md:text-2xl max-w-3xl mx-auto mb-10 font-medium leading-relaxed drop-shadow-lg">
                    From breathtaking landscapes to vibrant city escapes, discover packages crafted for the modern traveller.
                </p>

                {/* Search Bar Removed per request */}
            </div>
        </section>
    );
}
