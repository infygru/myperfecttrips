"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, ChevronDown, Search } from "lucide-react";

interface Props {
    categories: string[];
    themes: string[];
    destinations: string[];
    packageTypes: string[];
    currentCategory: string;
    currentTheme: string;
    currentDest: string;
    currentDuration: string;
    currentMaxPrice: string;
    currentPackageType: string;
    maxPriceRange: number;
    activeFilters: number;
}

const DURATION_OPTIONS = [
    { value: "1-4", label: "1 – 4 Nights" },
    { value: "5-7", label: "5 – 7 Nights" },
    { value: "8-14", label: "8 – 14 Nights" },
    { value: "15+", label: "15+ Nights" },
];

function useOutsideClick(ref: React.RefObject<HTMLElement | null>, cb: () => void) {
    useEffect(() => {
        function handle(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) cb();
        }
        document.addEventListener("mousedown", handle);
        return () => document.removeEventListener("mousedown", handle);
    }, [ref, cb]);
}

// Reusable dropdown pill
function FilterDropdown({
    label,
    active,
    children,
}: {
    label: string;
    active: boolean;
    children: React.ReactNode;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    useOutsideClick(ref, () => setOpen(false));

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen((v) => !v)}
                className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                    active
                        ? "border-brand-950 bg-brand-950 text-white shadow-sm"
                        : "border-stone-200 bg-white text-stone-700 hover:border-stone-400"
                }`}
            >
                {label}
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
            </button>
            {open && (
                <div className="absolute top-full left-0 z-50 mt-2 min-w-[200px] rounded-2xl border border-stone-200 bg-white p-3 shadow-xl shadow-stone-200/50">
                    {children}
                </div>
            )}
        </div>
    );
}

export default function PackagesFilter({
    categories,
    themes,
    destinations,
    packageTypes,
    currentCategory,
    currentTheme,
    currentDest,
    currentDuration,
    currentMaxPrice,
    currentPackageType,
    maxPriceRange,
    activeFilters,
}: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [localPrice, setLocalPrice] = useState(currentMaxPrice || maxPriceRange.toString());
    const [mobileOpen, setMobileOpen] = useState(false);
    const [destSearch, setDestSearch] = useState("");

    function navigate(updates: Record<string, string>) {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([k, v]) => {
            if (v) params.set(k, v);
            else params.delete(k);
        });
        router.push(`${pathname}?${params.toString()}`);
    }

    function clearAll() { router.push("/packages"); }

    // Active filter chips data
    const activeChips: { label: string; onRemove: () => void }[] = [];
    if (currentPackageType) activeChips.push({ label: currentPackageType, onRemove: () => navigate({ package_type: "" }) });
    if (currentCategory) activeChips.push({ label: currentCategory, onRemove: () => navigate({ category: "" }) });
    if (currentDuration) {
        const d = DURATION_OPTIONS.find(o => o.value === currentDuration);
        if (d) activeChips.push({ label: d.label, onRemove: () => navigate({ duration: "" }) });
    }
    if (currentMaxPrice && currentMaxPrice !== maxPriceRange.toString()) {
        activeChips.push({ label: `Under £${Number(currentMaxPrice).toLocaleString("en-GB")}`, onRemove: () => navigate({ maxPrice: "" }) });
    }
    if (currentDest) activeChips.push({ label: currentDest, onRemove: () => navigate({ destination: "" }) });
    if (currentTheme) {
        currentTheme.split(",").forEach(t => {
            if (t) activeChips.push({ label: t, onRemove: () => {
                const remaining = currentTheme.split(",").filter(x => x !== t).join(",");
                navigate({ theme: remaining });
            }});
        });
    }

    const filteredDests = destinations.filter(d =>
        !destSearch || d.toLowerCase().includes(destSearch.toLowerCase())
    );

    return (
        <div className="w-full mb-2">
            {/* ── FILTER BAR ── */}
            <div className="flex items-center gap-2 flex-wrap">

                {/* Package Type Tabs */}
                {packageTypes.length > 0 && (
                    <div className="flex items-center gap-1 rounded-full border border-stone-200 bg-white p-1">
                        <button
                            onClick={() => navigate({ package_type: "" })}
                            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${!currentPackageType ? "bg-brand-950 text-white shadow-sm" : "text-stone-500 hover:text-stone-700"}`}
                        >
                            All
                        </button>
                        {packageTypes.map(pt => (
                            <button key={pt}
                                onClick={() => navigate({ package_type: pt === currentPackageType ? "" : pt })}
                                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all capitalize ${currentPackageType === pt ? "bg-brand-950 text-white shadow-sm" : "text-stone-500 hover:text-stone-700"}`}
                            >
                                {pt}
                            </button>
                        ))}
                    </div>
                )}

                {/* Divider */}
                <div className="hidden sm:block h-6 w-px bg-stone-200" />

                {/* Category dropdown */}
                {categories.length > 0 && (
                    <FilterDropdown label={currentCategory || "Category"} active={!!currentCategory}>
                        <div className="space-y-0.5">
                            <button onClick={() => navigate({ category: "" })}
                                className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${!currentCategory ? "bg-brand-50 text-brand-800 font-semibold" : "text-stone-600 hover:bg-stone-50"}`}>
                                All Categories
                            </button>
                            {categories.map(cat => (
                                <button key={cat}
                                    onClick={() => navigate({ category: cat === currentCategory ? "" : cat })}
                                    className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${currentCategory === cat ? "bg-brand-50 text-brand-800 font-semibold" : "text-stone-600 hover:bg-stone-50"}`}>
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </FilterDropdown>
                )}

                {/* Duration dropdown */}
                <FilterDropdown label={currentDuration ? (DURATION_OPTIONS.find(o => o.value === currentDuration)?.label ?? "Duration") : "Duration"} active={!!currentDuration}>
                    <div className="space-y-0.5">
                        <button onClick={() => navigate({ duration: "" })}
                            className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${!currentDuration ? "bg-brand-50 text-brand-800 font-semibold" : "text-stone-600 hover:bg-stone-50"}`}>
                            Any Duration
                        </button>
                        {DURATION_OPTIONS.map(opt => (
                            <button key={opt.value}
                                onClick={() => navigate({ duration: opt.value === currentDuration ? "" : opt.value })}
                                className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${currentDuration === opt.value ? "bg-brand-50 text-brand-800 font-semibold" : "text-stone-600 hover:bg-stone-50"}`}>
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </FilterDropdown>

                {/* Price dropdown */}
                {maxPriceRange > 0 && (
                    <FilterDropdown
                        label={currentMaxPrice && currentMaxPrice !== maxPriceRange.toString() ? `≤ £${Number(currentMaxPrice).toLocaleString("en-GB")}` : "Budget"}
                        active={!!(currentMaxPrice && currentMaxPrice !== maxPriceRange.toString())}
                    >
                        <div className="w-64 p-1">
                            <div className="flex items-center justify-between mb-3 px-1">
                                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Max Budget</span>
                                <span className="text-sm font-bold text-brand-950">£{Number(localPrice).toLocaleString("en-GB")}</span>
                            </div>
                            <input
                                type="range" min="0" max={maxPriceRange} step="5000"
                                value={localPrice}
                                onChange={e => setLocalPrice(e.target.value)}
                                onMouseUp={() => navigate({ maxPrice: localPrice === maxPriceRange.toString() ? "" : localPrice })}
                                onTouchEnd={() => navigate({ maxPrice: localPrice === maxPriceRange.toString() ? "" : localPrice })}
                                className="w-full accent-brand-600 h-1.5 rounded-full cursor-pointer"
                            />
                            <div className="flex justify-between text-[11px] text-stone-400 mt-1.5 px-1">
                                <span>£0</span>
                                <span>£{maxPriceRange.toLocaleString("en-GB")}</span>
                            </div>
                        </div>
                    </FilterDropdown>
                )}

                {/* Destination dropdown */}
                {destinations.length > 0 && (
                    <FilterDropdown label={currentDest || "Destination"} active={!!currentDest}>
                        <div className="w-56">
                            <div className="relative mb-2">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400 pointer-events-none" />
                                <input
                                    type="text" placeholder="Search..."
                                    value={destSearch}
                                    onChange={e => setDestSearch(e.target.value)}
                                    className="w-full rounded-lg border border-stone-200 py-1.5 pl-7 pr-3 text-sm outline-none focus:border-brand-400"
                                />
                            </div>
                            <div className="max-h-48 overflow-y-auto space-y-0.5">
                                <button onClick={() => { navigate({ destination: "" }); setDestSearch(""); }}
                                    className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${!currentDest ? "bg-brand-50 text-brand-800 font-semibold" : "text-stone-600 hover:bg-stone-50"}`}>
                                    All Destinations
                                </button>
                                {filteredDests.map(dest => (
                                    <button key={dest}
                                        onClick={() => { navigate({ destination: dest === currentDest ? "" : dest }); setDestSearch(""); }}
                                        className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${currentDest === dest ? "bg-brand-50 text-brand-800 font-semibold" : "text-stone-600 hover:bg-stone-50"}`}>
                                        {dest}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </FilterDropdown>
                )}

                {/* Theme dropdown */}
                {themes.length > 0 && (
                    <FilterDropdown label="Theme" active={!!currentTheme}>
                        <div className="w-52 max-h-60 overflow-y-auto space-y-0.5">
                            {themes.map(theme => {
                                const isActive = currentTheme.split(",").includes(theme);
                                return (
                                    <button key={theme}
                                        onClick={() => {
                                            const arr = currentTheme ? currentTheme.split(",").filter(Boolean) : [];
                                            const next = isActive ? arr.filter(t => t !== theme) : [...arr, theme];
                                            navigate({ theme: next.join(",") });
                                        }}
                                        className={`w-full text-left px-3 py-2 rounded-xl text-sm flex items-center gap-2.5 transition-colors ${isActive ? "bg-brand-50 text-brand-800 font-semibold" : "text-stone-600 hover:bg-stone-50"}`}>
                                        <span className={`flex-shrink-0 w-4 h-4 rounded border transition-colors flex items-center justify-center ${isActive ? "bg-brand-600 border-brand-600" : "border-stone-300"}`}>
                                            {isActive && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4.5L4 7L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                                        </span>
                                        {theme}
                                    </button>
                                );
                            })}
                        </div>
                    </FilterDropdown>
                )}

                {/* Clear all */}
                {activeFilters > 0 && (
                    <button onClick={clearAll}
                        className="flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors whitespace-nowrap">
                        <X className="h-3 w-3" />
                        Clear ({activeFilters})
                    </button>
                )}
            </div>

            {/* ── ACTIVE FILTER CHIPS ── */}
            {activeChips.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                    {activeChips.map((chip, i) => (
                        <span key={i}
                            className="inline-flex items-center gap-1.5 rounded-full bg-brand-950 text-white text-xs font-medium px-3 py-1.5">
                            {chip.label}
                            <button onClick={chip.onRemove} className="hover:text-stone-300 transition-colors">
                                <X className="h-3 w-3" />
                            </button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}
