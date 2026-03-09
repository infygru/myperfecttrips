import { unstable_noStore as noStore } from "next/cache";
import { directus } from "@/lib/directus";
import { readItems } from "@directus/sdk";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, ArrowRight, Compass, Filter } from "lucide-react";

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

    // Get unique categories for the filter
    const categories = ["All", ...Array.from(new Set(packages.map((p) => p.category).filter(Boolean)))];

    // Apply filter
    const filteredPackages =
        currentCategory === "All" ? packages : packages.filter((p) => p.category === currentCategory);

    return (
        <main className="min-h-screen bg-stone-50 pb-24">
            {/* Hero */}
            <section className="relative px-4 pt-8 sm:px-6 lg:px-8">
                <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center overflow-hidden rounded-[2.5rem] bg-brand-950 px-6 py-24 text-center sm:py-32 shadow-xl relative">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-brand-800 via-brand-950 to-brand-950 opacity-80" />
                    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-brand-950 to-transparent" />
                    <div className="relative z-10 max-w-3xl">
                        <span className="section-label !text-gold-400 before:!bg-gold-400/30 after:!bg-gold-400/30">
                            Curated Collection
                        </span>
                        <h1 className="mb-6 font-serif text-5xl font-medium text-white sm:text-6xl tracking-tight">
                            Extraordinary Journeys
                        </h1>
                        <p className="text-lg text-brand-100/80 leading-relaxed font-light">
                            Explore our handpicked selection of premium holiday packages, designed for those who seek the extraordinary.
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="container-inner mt-12">
                <div className="flex flex-col gap-10 lg:flex-row">
                    {/* Sticky Sidebar Filter (Desktop) */}
                    <aside className="w-full lg:w-64 shrink-0">
                        <div className="sticky top-28 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                            <div className="mb-4 flex items-center gap-2 font-serif text-lg font-semibold text-brand-950 border-b border-stone-100 pb-4">
                                <Filter className="h-5 w-5 text-gold-500" />
                                Categories
                            </div>
                            <nav className="flex flex-col gap-1.5">
                                {categories.map((cat) => {
                                    const isActive = currentCategory === cat;
                                    return (
                                        <Link
                                            key={cat}
                                            href={cat === "All" ? "/packages" : `/packages?category=${cat}`}
                                            className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${isActive
                                                    ? "bg-brand-50 text-brand-800 font-semibold"
                                                    : "text-stone-600 hover:bg-stone-50 hover:text-brand-700"
                                                }`}
                                        >
                                            {cat}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                    </aside>

                    {/* Package Grid */}
                    <div className="flex-1">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="font-serif text-2xl font-medium text-brand-950">
                                {currentCategory === "All" ? "All Packages" : `${currentCategory} Packages`}
                            </h2>
                            <p className="text-sm font-medium text-stone-500">
                                Showing {filteredPackages.length} results
                            </p>
                        </div>

                        {filteredPackages.length > 0 ? (
                            <div className="grid gap-8 sm:grid-cols-2">
                                {filteredPackages.map((pkg) => {
                                    const imgUrl = pkg.image ? `${dUrl}/assets/${pkg.image}` : null;
                                    return (
                                        <Link
                                            key={pkg.id}
                                            href={`/packages/${pkg.slug || pkg.id}`}
                                            className="group flex flex-col overflow-hidden rounded-[2rem] border border-stone-200 bg-white transition-all hover:-translate-y-1.5 hover:shadow-xl hover:border-stone-300"
                                        >
                                            <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-stone-100">
                                                {imgUrl ? (
                                                    <Image
                                                        src={imgUrl}
                                                        alt={pkg.title}
                                                        fill
                                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                        unoptimized
                                                    />
                                                ) : (
                                                    <Compass className="h-16 w-16 text-stone-300" />
                                                )}
                                                {pkg.category && (
                                                    <div className="absolute left-4 top-4 rounded-full bg-brand-950/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md">
                                                        {pkg.category}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex flex-1 flex-col p-6 sm:p-8">
                                                <div className="mb-4 flex flex-wrap items-center gap-4 text-xs font-medium text-stone-500">
                                                    {pkg.duration_nights && (
                                                        <span className="flex items-center gap-1.5">
                                                            <Clock className="h-4 w-4 text-brand-600" />
                                                            {pkg.duration_nights}N / {pkg.duration_days}D
                                                        </span>
                                                    )}
                                                    {pkg.destinations?.length > 0 && (
                                                        <span className="flex items-center gap-1.5">
                                                            <MapPin className="h-4 w-4 text-brand-600" />
                                                            {pkg.destinations.slice(0, 2).join(", ")}
                                                        </span>
                                                    )}
                                                </div>

                                                <h3 className="mb-4 font-serif text-2xl font-medium leading-tight text-brand-950 transition-colors group-hover:text-brand-700">
                                                    {pkg.title}
                                                </h3>

                                                <div className="mt-auto flex items-end justify-between border-t border-stone-100 pt-6">
                                                    <div>
                                                        <p className="text-xs font-medium text-stone-500 mb-0.5">Starting from</p>
                                                        {pkg.price ? (
                                                            <p className="font-serif text-2xl font-bold text-brand-900">
                                                                ₹{Number(pkg.price).toLocaleString("en-IN")}
                                                            </p>
                                                        ) : (
                                                            <p className="font-serif text-xl font-bold text-stone-800">
                                                                On Request
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-700 transition-colors group-hover:bg-brand-900 group-hover:text-white">
                                                        <ArrowRight className="h-5 w-5 -rotate-45 transition-transform group-hover:rotate-0" />
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
                                <p className="text-stone-500 max-w-sm">
                                    We couldn&apos;t find any packages in this category. Try selecting &quot;All&quot; to see everything we offer.
                                </p>
                                <Link href="/packages" className="btn-outline mt-6">
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
