import { unstable_noStore as noStore } from "next/cache";
import { directus } from "@/lib/directus";
import { readItems } from "@directus/sdk";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, ChevronRight, Compass, SlidersHorizontal } from "lucide-react";
import type { Metadata } from "next";
import PackagesFilter from "@/components/PackagesFilter";

export const metadata: Metadata = {
    title: "Holiday Packages | IG Holidays – Premium Travel Agency",
    description: "Explore our handpicked collection of luxury holiday packages across India and the world. Customised itineraries for every traveller.",
};

export const dynamic = "force-dynamic";

export default async function PackagesPage(props: {
    searchParams: Promise<{
        category?: string;
        destination?: string;
        duration?: string;
        sort?: string;
    }>;
}) {
    noStore();
    const sp = await props.searchParams;
    const currentCategory = sp.category || "";
    const currentDest = sp.destination || "";
    const currentDuration = sp.duration || "";
    const currentSort = sp.sort || "default";

    let packages: any[] = [];
    try {
        packages = (await directus.request(readItems("packages" as any, { limit: 200 }))) as any[];
    } catch { }

    const dUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://localhost:8055";

    // Build filter options from data
    const categories = Array.from(new Set(packages.map((p) => p.category).filter(Boolean))).sort() as string[];
    const allDestinations = Array.from(
        new Set(packages.flatMap((p) => (Array.isArray(p.destinations) ? p.destinations : [])))
    ).sort() as string[];

    // Filter
    let filtered = packages.filter((p) => {
        if (currentCategory && p.category !== currentCategory) return false;
        if (currentDest && !(Array.isArray(p.destinations) && p.destinations.includes(currentDest))) return false;
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

    const activeFilters = [currentCategory, currentDest, currentDuration].filter(Boolean).length;

    return (
        <main className="min-h-screen bg-[#F8F7F4] pb-24">

            {/* ── HERO ── */}
            <section className="relative bg-brand-950 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_60%,_var(--tw-gradient-stops))] from-brand-700/60 via-brand-950 to-brand-950" />
                {/* subtle grid texture */}
                <div
                    className="absolute inset-0 opacity-[0.035]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Cpath d='M0 0h80v80H0z' fill='none'/%3E%3Cpath d='M0 0h1v80H0zM79 0h1v80H79zM0 0v1h80V0M0 79v1h80V79' stroke='%23fff' stroke-width='0.5'/%3E%3C/svg%3E")`
                    }}
                />
                <div className="container-inner relative z-10 py-24 pt-32">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div>
                            <p className="text-gold-400 text-xs font-bold uppercase tracking-[0.25em] mb-4 flex items-center gap-2">
                                <span className="inline-block h-px w-8 bg-gold-400" />
                                Curated Collection
                            </p>
                            <h1 className="font-serif text-6xl sm:text-7xl font-medium text-white tracking-tight leading-[0.95]">
                                Extraordinary<br />
                                <em className="text-gold-400 not-italic">Journeys</em>
                            </h1>
                        </div>
                        <div className="max-w-sm">
                            <p className="text-stone-400 font-light text-base leading-relaxed">
                                {packages.length} handpicked premium packages — from serene Kerala backwaters to the peaks of the Swiss Alps.
                            </p>
                        </div>
                    </div>
                </div>
                {/* wave divider */}
                <div className="relative h-16">
                    <svg viewBox="0 0 1440 64" className="absolute bottom-0 w-full h-16" preserveAspectRatio="none">
                        <path d="M0,64 L0,32 Q360,0 720,32 Q1080,64 1440,32 L1440,64 Z" fill="#F8F7F4" />
                    </svg>
                </div>
            </section>

            {/* ── MAIN CONTENT: SIDEBAR + GRID ── */}
            <section className="container-inner mt-2">
                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    {/* ── SIDEBAR FILTER (client component) ── */}
                    <PackagesFilter
                        categories={categories}
                        destinations={allDestinations}
                        currentCategory={currentCategory}
                        currentDest={currentDest}
                        currentDuration={currentDuration}
                        currentSort={currentSort}
                        activeFilters={activeFilters}
                    />

                    {/* ── RIGHT: RESULTS ── */}
                    <div className="flex-1 min-w-0">
                        {/* Results bar */}
                        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                            <p className="text-sm text-stone-500">
                                Showing <strong className="text-brand-950">{filtered.length}</strong>{" "}
                                of <strong className="text-brand-950">{packages.length}</strong> packages
                                {activeFilters > 0 && (
                                    <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-brand-100 text-brand-700 text-xs font-bold px-2.5 py-0.5">
                                        {activeFilters} filter{activeFilters > 1 ? "s" : ""} active
                                    </span>
                                )}
                            </p>
                            {activeFilters > 0 && (
                                <Link href="/packages" className="text-xs font-semibold text-brand-600 hover:text-brand-800 hover:underline transition-colors">
                                    Clear all filters ×
                                </Link>
                            )}
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
                </div>
            </section>
        </main>
    );
}
