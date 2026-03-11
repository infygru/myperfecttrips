"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { SlidersHorizontal, ChevronDown, X, ListFilter } from "lucide-react";

interface Props {
    categories: string[];
    themes: string[];
    destinations: string[];
    currentCategory: string;
    currentTheme: string;
    currentDest: string;
    currentDuration: string;
    currentMaxPrice: string;
    maxPriceRange: number;
    activeFilters: number;
}

const durationOptions = [
    { value: "1-4", label: "1 – 4 Nights" },
    { value: "5-7", label: "5 – 7 Nights" },
    { value: "8-14", label: "8 – 14 Nights" },
    { value: "15+", label: "15+ Nights" },
];

const sortOptions = [
    { value: "default", label: "Recommended" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "duration-asc", label: "Duration: Short First" },
];

export default function PackagesFilter({
    categories,
    themes,
    destinations,
    currentCategory,
    currentTheme,
    currentDest,
    currentDuration,
    currentMaxPrice,
    maxPriceRange,
    activeFilters,
}: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [destOpen, setDestOpen] = useState(true);
    const [themeOpen, setThemeOpen] = useState(true);
    const [localPrice, setLocalPrice] = useState(currentMaxPrice || maxPriceRange.toString());

    function buildUrl(updates: Record<string, string>) {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([k, v]) => {
            if (v) params.set(k, v);
            else params.delete(k);
        });
        return `${pathname}?${params.toString()}`;
    }

    function navigate(updates: Record<string, string>) {
        router.push(buildUrl(updates));
    }

    const FilterContent = () => (
        <div className="space-y-6">
            {/* Price Range */}
            {maxPriceRange > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Max Price</h3>
                        <span className="text-xs font-semibold text-brand-950">₹{Number(localPrice).toLocaleString("en-IN")}</span>
                    </div>
                    <div className="px-2">
                        <input
                            type="range"
                            min="0"
                            max={maxPriceRange}
                            step="5000"
                            value={localPrice}
                            onChange={(e) => setLocalPrice(e.target.value)}
                            onMouseUp={() => navigate({ maxPrice: localPrice === maxPriceRange.toString() ? "" : localPrice })}
                            onTouchEnd={() => navigate({ maxPrice: localPrice === maxPriceRange.toString() ? "" : localPrice })}
                            className="w-full accent-brand-600 h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] font-medium text-stone-400 mt-2">
                            <span>₹0</span>
                            <span>₹{maxPriceRange.toLocaleString("en-IN")}</span>
                        </div>
                    </div>
                </div>
            )}
            
            {maxPriceRange > 0 && <div className="h-px bg-stone-100" />}

            {/* Category */}
            {categories.length > 0 && (
                <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-3">Category</h3>
                    <div className="space-y-1">
                        <button
                            onClick={() => navigate({ category: "" })}
                            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all font-medium ${!currentCategory ? "bg-brand-50 text-brand-900 font-semibold" : "text-stone-600 hover:bg-stone-100"}`}
                        >
                            All Categories
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => navigate({ category: cat === currentCategory ? "" : cat })}
                                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all font-medium flex items-center justify-between ${currentCategory === cat
                                    ? "bg-brand-50 text-brand-900 font-semibold"
                                    : "text-stone-600 hover:bg-stone-100"
                                    }`}
                            >
                                {cat}
                                {currentCategory === cat && <X className="h-3 w-3 text-brand-500 shrink-0" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {categories.length > 0 && <div className="h-px bg-stone-100" />}

            {/* Themes */}
            {themes.length > 0 && (
                <div>
                    <button
                        className="w-full flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-3"
                        onClick={() => setThemeOpen((v) => !v)}
                    >
                        Theme
                        <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${themeOpen ? "rotate-180" : ""}`} />
                    </button>
                    {themeOpen && (
                        <div className="space-y-1 max-h-48 overflow-y-auto pr-1 custom-scroll">
                            {themes.map((theme) => {
                                const isActive = currentTheme.includes(theme);
                                return (
                                    <button
                                        key={theme}
                                        onClick={() => {
                                            const themesArr = currentTheme ? currentTheme.split(',') : [];
                                            const newThemes = isActive 
                                                ? themesArr.filter(t => t !== theme)
                                                : [...themesArr, theme];
                                            navigate({ theme: newThemes.join(',') });
                                        }}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all font-medium flex items-center gap-3 ${
                                            isActive ? "bg-brand-50 text-brand-900 font-semibold" : "text-stone-600 hover:bg-stone-100"
                                        }`}
                                    >
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                                            isActive ? "bg-brand-600 border-brand-600" : "border-stone-300 bg-white"
                                        }`}>
                                            {isActive && <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 4.5L4 7L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                                        </div>
                                        <span className="truncate">{theme}</span>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {themes.length > 0 && <div className="h-px bg-stone-100" />}

            {/* Duration */}
            <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-3">Duration</h3>
                <div className="space-y-1">
                    {durationOptions.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => navigate({ duration: opt.value === currentDuration ? "" : opt.value })}
                            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all font-medium flex items-center justify-between ${currentDuration === opt.value
                                ? "bg-brand-50 text-brand-900 font-semibold"
                                : "text-stone-600 hover:bg-stone-100"
                                }`}
                        >
                            {opt.label}
                            {currentDuration === opt.value && <X className="h-3 w-3 text-brand-500 shrink-0" />}
                        </button>
                    ))}
                </div>
            </div>

            {/* Destinations */}
            {destinations.length > 0 && (
                <>
                    <div className="h-px bg-stone-100" />
                    <div>
                        <button
                            className="w-full flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-3"
                            onClick={() => setDestOpen((v) => !v)}
                        >
                            Destination
                            <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${destOpen ? "rotate-180" : ""}`} />
                        </button>
                        {destOpen && (
                            <div className="space-y-1 max-h-48 overflow-y-auto pr-1 custom-scroll">
                                {destinations.map((dest) => (
                                    <button
                                        key={dest}
                                        onClick={() => navigate({ destination: dest === currentDest ? "" : dest })}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all font-medium flex items-center justify-between ${currentDest === dest
                                            ? "bg-brand-50 text-brand-900 font-semibold"
                                            : "text-stone-600 hover:bg-stone-100"
                                            }`}
                                    >
                                        <span className="truncate">{dest}</span>
                                        {currentDest === dest && <X className="h-3 w-3 text-brand-500 shrink-0 ml-2" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Clear button */}
            {activeFilters > 0 && (
                <button
                    onClick={() => router.push("/packages")}
                    className="w-full text-center py-2.5 rounded-lg border border-red-200 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
                >
                    Clear all filters ({activeFilters})
                </button>
            )}
        </div>
    );

    return (
        <>
            {/* Mobile toggle */}
            <div className="lg:hidden w-full">
                <button
                    onClick={() => setMobileOpen((v) => !v)}
                    className="w-full flex items-center justify-between gap-2 rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-brand-950 shadow-sm"
                >
                    <span className="flex items-center gap-2">
                        <SlidersHorizontal className="h-4 w-4 text-brand-600" />
                        Filters &amp; Sort
                        {activeFilters > 0 && (
                            <span className="rounded-full bg-brand-950 text-white text-[10px] font-bold px-2 py-0.5">{activeFilters}</span>
                        )}
                    </span>
                    <ChevronDown className={`h-4 w-4 text-stone-400 transition-transform duration-200 ${mobileOpen ? "rotate-180" : ""}`} />
                </button>
                {mobileOpen && (
                    <div className="mt-2 rounded-2xl border border-stone-200 bg-white p-5 shadow-lg">
                        <FilterContent />
                    </div>
                )}
            </div>

            {/* Desktop sidebar */}
            <div className="hidden lg:block w-64 flex-shrink-0 sticky top-[88px] self-start">
                <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-serif text-lg font-medium text-brand-950 flex items-center gap-2">
                            <SlidersHorizontal className="h-4 w-4 text-brand-600" />
                            Filters
                        </h2>
                        {activeFilters > 0 && (
                            <span className="rounded-full bg-brand-950 text-white text-[10px] font-bold px-2.5 py-1">
                                {activeFilters} active
                            </span>
                        )}
                    </div>
                    <FilterContent />
                </div>
            </div>
        </>
    );
}
