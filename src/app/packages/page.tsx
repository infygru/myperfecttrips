import { unstable_noStore as noStore } from "next/cache";
import { directus } from "@/lib/directus";
import { readItems } from "@directus/sdk";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, ArrowRight, Compass, ChevronRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Holiday Packages | IG Holidays – Premium Travel Agency",
    description: "Explore our handpicked collection of luxury holiday packages across India and the world. Customised itineraries for every traveller.",
};

export const dynamic = "force-dynamic";

export default async function PackagesPage(props: { searchParams: Promise<{ category?: string }> }) {
    noStore();
    const searchParams = await props.searchParams;
    const currentCategory = searchParams.category || "All";

    let packages: any[] = [];
    try {
        packages = (await directus.request(readItems("packages" as any, { limit: 100 }))) as any[];
    } catch { }

    const dUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://localhost:8055";

    const categories = ["All", ...Array.from(new Set(packages.map((p) => p.category).filter(Boolean)))];
    const filteredPackages =
        currentCategory === "All" ? packages : packages.filter((p) => p.category === currentCategory);

    return (
        <main className="min-h-screen bg-stone-50 pb-24">

            {/* ── HERO ── */}
            <section className="relative h-[45vh] min-h-[360px] w-full overflow-hidden bg-brand-950">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,_var(--tw-gradient-stops))] from-brand-700 via-brand-950 to-brand-950" />
                {/* Decorative grid */}
                <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
                <div className="absolute inset-0 flex flex-col items-start justify-end">
                    <div className="container-inner w-full pb-14">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                            <div>
                                <span className="section-label !text-gold-400 before:!bg-gold-400/30 after:!bg-gold-400/30 mb-4">
                                    Curated Collection
                                </span>
                                <h1 className="font-serif text-5xl sm:text-6xl font-medium text-white tracking-tight leading-none">
                                    Extraordinary<br /><em className="text-gold-400 not-italic">Journeys</em>
                                </h1>
                            </div>
                            <p className="text-stone-400 font-light max-w-xs text-sm leading-relaxed hidden sm:block">
                                Handpicked premium holiday packages designed for those who seek the extraordinary.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FILTER STRIP ── */}
            <div className="sticky top-[72px] z-30 w-full border-b border-stone-200 bg-white/95 backdrop-blur-sm shadow-sm">
                <div className="container-inner py-0">
                    <nav className="flex gap-1 overflow-x-auto scrollbar-hide py-3">
                        {categories.map((cat) => {
                            const isActive = currentCategory === cat;
                            return (
                                <Link
                                    key={cat}
                                    href={cat === "All" ? "/packages" : `/packages?category=${encodeURIComponent(cat)}`}
                                    className={`flex-shrink-0 rounded-full px-5 py-2 text-sm font-semibold transition-all ${isActive
                                        ? "bg-brand-950 text-white shadow-md"
                                        : "text-stone-600 bg-stone-100 hover:bg-stone-200"
                                        }`}
                                >
                                    {cat}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* ── PACKAGES GRID ── */}
            <section className="container-inner mt-10">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="font-serif text-2xl font-medium text-brand-950">
                        {currentCategory === "All" ? "All Packages" : `${currentCategory} Packages`}
                        <span className="ml-3 text-base font-sans font-normal text-stone-400">({filteredPackages.length})</span>
                    </h2>
                </div>

                {filteredPackages.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredPackages.map((pkg) => {
                            const imgUrl = pkg.image ? `${dUrl}/assets/${pkg.image}` : null;
                            return (
                                <Link
                                    key={pkg.id}
                                    href={`/packages/${pkg.slug || pkg.id}`}
                                    className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-stone-300/40"
                                >
                                    {/* Image */}
                                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-100">
                                        {imgUrl ? (
                                            <Image
                                                src={imgUrl}
                                                alt={pkg.title}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                unoptimized
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-800 to-brand-950">
                                                <Compass className="h-12 w-12 text-brand-700" />
                                            </div>
                                        )}
                                        {/* Gradient overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                                        {/* Category badge */}
                                        {pkg.category && (
                                            <div className="absolute top-3 left-3 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-950 shadow-sm">
                                                {pkg.category}
                                            </div>
                                        )}

                                        {/* Duration badge */}
                                        {pkg.duration_nights && (
                                            <div className="absolute bottom-3 right-3 rounded-full bg-brand-950/80 backdrop-blur-sm px-3 py-1 text-[11px] font-semibold text-white flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {pkg.duration_nights}N / {pkg.duration_days}D
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex flex-1 flex-col p-5">
                                        {pkg.destinations?.length > 0 && (
                                            <div className="flex items-center gap-1 text-xs text-stone-500 mb-2">
                                                <MapPin className="h-3 w-3 text-brand-500" />
                                                <span className="truncate">{pkg.destinations.slice(0, 3).join(" · ")}</span>
                                            </div>
                                        )}

                                        <h3 className="mb-3 font-serif text-xl font-medium leading-snug text-brand-950 group-hover:text-brand-700 transition-colors line-clamp-2">
                                            {pkg.title}
                                        </h3>

                                        <div className="mt-auto flex items-center justify-between border-t border-stone-100 pt-4">
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-0.5">Starting from</p>
                                                {pkg.price ? (
                                                    <p className="font-serif text-xl font-bold text-brand-900">
                                                        ₹{Number(pkg.price).toLocaleString("en-IN")}
                                                    </p>
                                                ) : (
                                                    <p className="font-serif text-lg font-bold text-stone-800">On Request</p>
                                                )}
                                            </div>
                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-700 transition-all group-hover:bg-brand-950 group-hover:text-white">
                                                <ChevronRight className="h-4 w-4" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex w-full flex-col items-center justify-center rounded-3xl border border-dashed border-stone-300 bg-white py-32 text-center">
                        <Compass className="mb-4 h-12 w-12 text-stone-300" />
                        <p className="text-xl font-medium text-stone-600 mb-2">No packages found</p>
                        <p className="text-stone-500 max-w-sm text-sm">
                            We couldn&apos;t find any packages in this category. Try selecting &quot;All&quot; to see everything we offer.
                        </p>
                        <Link href="/packages" className="btn-outline mt-6">
                            Clear Filters
                        </Link>
                    </div>
                )}
            </section>
        </main>
    );
}
