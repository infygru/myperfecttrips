import { unstable_noStore as noStore } from "next/cache";
import { directus } from "@/lib/directus";
import { readItems } from "@directus/sdk";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, ChevronRight, Compass } from "lucide-react";
import type { Metadata } from "next";
import PackagesFilter from "@/components/PackagesFilter";
import SortSelect from "@/components/SortSelect";

export async function generateMetadata(): Promise<Metadata> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const title = "Holiday Packages | IG Holidays – Premium Travel Agency";
    const description = "Explore our handpicked collection of luxury holiday packages across India and the world. Customised itineraries for every traveller.";

    return {
        title,
        description,
        alternates: {
            canonical: `${baseUrl}/packages`,
        },
        openGraph: {
            title,
            description,
            url: `${baseUrl}/packages`,
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        }
    };
}

export const dynamic = "force-dynamic";

export default async function PackagesPage(props: {
    searchParams: Promise<{
        category?: string;
        theme?: string;
        destination?: string;
        duration?: string;
        sort?: string;
        maxPrice?: string;
        package_type?: string;
    }>;
}) {
    noStore();
    const sp = await props.searchParams;
    const currentCategory = sp.category || "";
    const currentTheme = sp.theme || "";
    const currentDest = sp.destination || "";
    const currentDuration = sp.duration || "";
    const currentSort = sp.sort || "default";
    const currentMaxPrice = sp.maxPrice || "";
    const currentPackageType = sp.package_type || "";

    let packages: any[] = [];
    try {
        packages = (await directus.request(readItems("packages" as any, { limit: 200 }))) as any[];
    } catch { }

    const dUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://localhost:8055";

    // Build filter options from data
    const categories = Array.from(new Set(packages.map((p) => p.category).filter(Boolean))).sort() as string[];
    // We treat 'category' as 'Theme' conceptually, or extract themes separately if there's a dedicated 'theme'/'themes' field
    // Directus has `themes` an array or `theme` as a comma separated string. Let's gracefully try both.
    const themes = Array.from(
        new Set(packages.flatMap((p) => {
            if (Array.isArray(p.themes)) return p.themes;
            if (typeof p.themes === 'string') return p.themes.split(',').map((t: string) => t.trim());
            if (p.theme) return [p.theme];
            return [];
        }).filter(Boolean))
    ).sort() as string[];
    
    // Calculate global max price for slider range
    const prices = packages.map(p => Number(p.price)).filter(p => !isNaN(p) && p > 0);
    const maxPriceRange = prices.length > 0 ? Math.ceil(Math.max(...prices) / 10000) * 10000 : 0;
    
    // Build destination list from both the new `destination` string field and legacy `destinations` array
    const allDestinations = Array.from(
        new Set([
            ...packages.flatMap((p) => (Array.isArray(p.destinations) ? p.destinations : [])),
            ...packages.map((p) => p.destination?.split(/[·,]/)[0]?.trim()).filter(Boolean),
        ])
    ).sort() as string[];

    // Filter
    let filtered = packages.filter((p) => {
        if (currentPackageType && p.package_type !== currentPackageType) return false;
        if (currentCategory && p.category !== currentCategory) return false;
        
        // Theme filter
        if (currentTheme) {
            const activeThemes = currentTheme.split(',');
            const packageThemes = [];
            if (Array.isArray(p.themes)) packageThemes.push(...p.themes);
            else if (typeof p.themes === 'string') packageThemes.push(...p.themes.split(',').map((t: string) => t.trim()));
            else if (p.theme) packageThemes.push(p.theme);
            
            // If the package has no themes but we are filtering by theme, exclude it.
            // If it has themes, it must include AT LEAST ONE of the active filtered themes.
            if (!packageThemes.length && activeThemes.length > 0) return false;
            
            const hasMatch = packageThemes.some((pt: string) => activeThemes.includes(pt));
            if (!hasMatch) return false;
        }

        if (currentDest) {
            const inArray = Array.isArray(p.destinations) && p.destinations.includes(currentDest);
            const inString = p.destination?.toLowerCase().includes(currentDest.toLowerCase());
            if (!inArray && !inString) return false;
        }
        
        if (currentMaxPrice) {
            const price = Number(p.price) || 0;
            if (price > Number(currentMaxPrice)) return false;
        }
        
        if (currentDuration) {
            const nights = Number(p.duration_nights) || 0;
            if (currentDuration === "1-4" && (nights < 1 || nights > 4)) return false;
            if (currentDuration === "5-7" && (nights < 5 || nights > 7)) return false;
            if (currentDuration === "8-14" && (nights < 8 || nights > 14)) return false;
            if (currentDuration === "15+" && nights < 15) return false;
        }
        return true;
    });

    // Sort
    if (currentSort === "price-asc") filtered = [...filtered].sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    if (currentSort === "price-desc") filtered = [...filtered].sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    if (currentSort === "duration-asc") filtered = [...filtered].sort((a, b) => (Number(a.duration_nights) || 0) - (Number(b.duration_nights) || 0));

    // Package types for filter
    const packageTypes = Array.from(new Set(packages.map((p) => p.package_type).filter(Boolean))).sort() as string[];

    const activeFilters = [currentCategory, currentTheme, currentDest, currentDuration, currentMaxPrice, currentPackageType].filter(Boolean).length;

    return (
        <main className="min-h-screen bg-[#F8F7F4] pb-24">

            {/* ── COMPACT PAGE HEADER ── */}
            <section className="bg-brand-950 pt-20 pb-7 border-b border-white/[0.06]">
                <div className="container-inner">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                        <div>
                            <p className="text-gold-400 text-[10px] font-bold uppercase tracking-[0.25em] mb-2 flex items-center gap-2">
                                <span className="h-px w-6 bg-gold-400" />
                                Curated Collection
                            </p>
                            <h1 className="font-serif text-3xl sm:text-4xl font-medium text-white">
                                Holiday <em className="text-gold-400 not-italic">Packages</em>
                            </h1>
                        </div>
                        <p className="text-stone-400 text-sm pb-1">
                            {packages.length} handpicked premium packages
                        </p>
                    </div>
                </div>
            </section>

            {/* ── MAIN CONTENT ── */}
            <section className="container-inner mt-6">

                {/* ── FILTER (full-width horizontal bar) ── */}
                <PackagesFilter
                    categories={categories}
                    themes={themes}
                    destinations={allDestinations}
                    packageTypes={packageTypes}
                    currentCategory={currentCategory}
                    currentTheme={currentTheme}
                    currentDest={currentDest}
                    currentDuration={currentDuration}
                    currentMaxPrice={currentMaxPrice}
                    currentPackageType={currentPackageType}
                    maxPriceRange={maxPriceRange}
                    activeFilters={activeFilters}
                />

                {/* ── RESULTS ── */}
                <div className="mt-6">
                    {/* Results bar */}
                    <div className="flex items-center justify-between mb-6 flex-wrap gap-4 border-b border-stone-200/50 pb-4">
                            <div className="flex items-center gap-3">
                                <p className="text-sm font-medium text-stone-600">
                                    Showing <strong className="text-brand-950 font-bold">{filtered.length}</strong>{" "}
                                    of <strong className="text-brand-950 font-bold">{packages.length}</strong> packages
                                </p>
                                {activeFilters > 0 && (
                                    <>
                                        <div className="h-4 w-px bg-stone-300"></div>
                                        <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 border border-brand-100/50 text-brand-700 text-xs font-bold px-2.5 py-0.5 shadow-sm">
                                            {activeFilters} filter{activeFilters > 1 ? "s" : ""} active
                                        </span>
                                        <Link href="/packages" className="text-xs font-semibold text-red-500 hover:text-red-700 hover:underline transition-colors ml-1">
                                            Clear all
                                        </Link>
                                    </>
                                )}
                            </div>
                            
                            {/* NEW SORT DROPDOWN */}
                            <div className="flex items-center gap-2 relative z-20">
                                <label htmlFor="sort-select" className="text-xs font-bold uppercase tracking-widest text-stone-400">Sort by:</label>
                                <div className="relative group">
                                    <SortSelect currentSort={currentSort} />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:text-brand-500 text-stone-400 transition-colors">
                                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {filtered.length > 0 ? (
                            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                                {filtered.map((pkg) => {
                                    const imgUrl = pkg.image ? `${dUrl}/assets/${pkg.image}` : null;
                                    return (
                                        <Link
                                            key={pkg.id}
                                            href={`/packages/${pkg.slug || pkg.id}`}
                                            className="group flex flex-col overflow-hidden rounded-2xl bg-white border border-stone-200/80 shadow-sm hover:shadow-xl hover:shadow-stone-200/60 transition-all duration-300 hover:-translate-y-0.5"
                                        >
                                            {/* Image */}
                                            <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                                                {imgUrl ? (
                                                    <Image
                                                        src={imgUrl}
                                                        alt={pkg.title}
                                                        fill
                                                        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                                                        unoptimized
                                                    />
                                                ) : (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-800 to-brand-950">
                                                        <Compass className="h-10 w-10 text-brand-700/40" />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

                                                {/* Badges top-left */}
                                                <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                                                    {pkg.category && (
                                                        <span className="rounded-md bg-white/90 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-950 shadow-sm">
                                                            {pkg.category}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Duration badge bottom-right */}
                                                {pkg.duration_nights && (
                                                    <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-md bg-brand-950/80 backdrop-blur-sm px-2.5 py-1 text-[11px] font-medium text-white">
                                                        <Clock className="h-3 w-3 text-gold-400 shrink-0" />
                                                        {pkg.duration_nights}N&nbsp;/&nbsp;{pkg.duration_days}D
                                                    </div>
                                                )}

                                                {/* Destinations bottom-left */}
                                                {pkg.destinations?.length > 0 && (
                                                    <div className="absolute bottom-3 left-3 flex items-center gap-1 text-[10px] font-medium text-white/90 max-w-[60%]">
                                                        <MapPin className="h-3 w-3 text-gold-400 shrink-0" />
                                                        <span className="truncate">{pkg.destinations.slice(0, 2).join(" · ")}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="flex flex-1 flex-col p-5">
                                                <h3 className="font-serif text-xl font-medium leading-snug text-brand-950 group-hover:text-brand-700 transition-colors line-clamp-2 mb-4">
                                                    {pkg.title}
                                                </h3>

                                                <div className="mt-auto flex items-center justify-between pt-4 border-t border-stone-100">
                                                    <div>
                                                        <p className="text-[9px] font-bold uppercase tracking-widest text-stone-400">Starting from</p>
                                                        {pkg.price ? (
                                                            <p className="font-serif text-xl font-semibold text-brand-900 leading-tight">
                                                                ₹{Number(pkg.price).toLocaleString("en-IN")}
                                                            </p>
                                                        ) : (
                                                            <p className="font-serif text-lg font-semibold text-stone-700">On Request</p>
                                                        )}
                                                    </div>
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-brand-700 transition-all group-hover:bg-brand-950 group-hover:text-white">
                                                        <ChevronRight className="h-4 w-4" />
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="flex w-full flex-col items-center justify-center rounded-3xl border border-dashed border-stone-300 bg-white py-32 text-center gap-4">
                                <Compass className="h-14 w-14 text-stone-200" />
                                <div>
                                    <p className="text-xl font-serif font-medium text-stone-700 mb-1">No packages found</p>
                                    <p className="text-stone-500 max-w-sm text-sm">Try adjusting your filters to explore more options.</p>
                                </div>
                                <Link href="/packages" className="btn-outline mt-2 text-sm">
                                    Clear Filters
                                </Link>
                            </div>
                        )}
                </div>
            </section>
        </main>
    );
}
