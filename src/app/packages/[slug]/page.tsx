import { notFound } from "next/navigation";
import { directus } from "@/lib/directus";
import { readItems } from "@directus/sdk";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, ArrowLeft, Smartphone, Shield, CheckCircle2, Compass, XCircle } from "lucide-react";
import LeadForm from "@/components/LeadForm";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
    const { slug } = await props.params;
    try {
        const result = (await directus.request(
            readItems("packages" as any, { filter: { slug: { _eq: slug } } as any, limit: 1 })
        )) as any[];
        const pkg = result?.[0];
        if (pkg) {
            return {
                title: `${pkg.title} | IG Holidays`,
                description: `Explore the ${pkg.title} package – a premium ${pkg.category || "holiday"} journey across ${pkg.destinations?.join(", ") || "handpicked destinations"}.`,
            };
        }
    } catch { }
    return { title: "Package Details | IG Holidays" };
}

export default async function PackageDetailPage(props: Props) {
    const { slug } = await props.params;

    let pkg: any;
    try {
        const result = (await directus.request(
            readItems("packages" as any, { filter: { slug: { _eq: slug } } as any, limit: 1 })
        )) as any[];
        if (!result?.length) return notFound();
        pkg = result[0];
    } catch {
        return notFound();
    }

    const dUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://localhost:8055";
    const imgUrl = pkg.image ? `${dUrl}/assets/${pkg.image}` : null;

    return (
        <main className="min-h-screen bg-stone-50 pb-24">

            {/* ── HERO ── */}
            <section className="relative h-[75vh] min-h-[520px] w-full bg-brand-950">
                {imgUrl ? (
                    <Image
                        src={imgUrl}
                        alt={pkg.title}
                        fill
                        className="object-cover opacity-60"
                        priority
                        unoptimized
                    />
                ) : (
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-800 to-brand-950 flex items-center justify-center">
                        <Compass className="w-32 h-32 text-brand-800" />
                    </div>
                )}
                {/* Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/20 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-brand-950/60 to-transparent" />

                {/* Back button */}
                <div className="absolute top-24 left-0 right-0 container-inner">
                    <Link
                        href="/packages"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-gold-400 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" /> Back to Packages
                    </Link>
                </div>

                {/* Title block */}
                <div className="absolute bottom-0 left-0 right-0 container-inner pb-12">
                    <div className="max-w-3xl">
                        {pkg.category && (
                            <span className="mb-4 inline-block rounded-full bg-gold-500/20 backdrop-blur-sm border border-gold-400/30 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-gold-300">
                                {pkg.category}
                            </span>
                        )}
                        <h1 className="mb-5 font-serif text-5xl sm:text-6xl lg:text-7xl font-medium text-white tracking-tight leading-[1.05]">
                            {pkg.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-stone-300">
                            {pkg.duration_nights && (
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-gold-400" />
                                    <span>{pkg.duration_nights}N / {pkg.duration_days}D</span>
                                </div>
                            )}
                            {pkg.destinations?.length > 0 && (
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-gold-400" />
                                    <span>{pkg.destinations.join(" · ")}</span>
                                </div>
                            )}
                            {pkg.price && (
                                <div className="font-serif text-2xl font-bold text-white">
                                    ₹{Number(pkg.price).toLocaleString("en-IN")}
                                    <span className="ml-2 text-sm font-sans font-normal text-stone-400">/ person</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── STICKY NAV ── */}
            <div className="sticky top-[72px] z-40 w-full border-b border-stone-200 bg-white/95 backdrop-blur-sm shadow-sm">
                <div className="container-inner flex items-center overflow-x-auto scrollbar-hide py-0 justify-between">
                    <div className="flex gap-8 text-xs font-bold uppercase tracking-wider text-stone-500 whitespace-nowrap">
                        <a href="#overview" className="py-4 transition-colors hover:text-brand-700 hover:border-b-2 hover:border-brand-700">Overview</a>
                        <a href="#itinerary" className="py-4 transition-colors hover:text-brand-700 hover:border-b-2 hover:border-brand-700">Itinerary</a>
                        <a href="#details" className="py-4 transition-colors hover:text-brand-700 hover:border-b-2 hover:border-brand-700">Details</a>
                        <a href="#customise" className="py-4 transition-colors hover:text-brand-700 hover:border-b-2 hover:border-brand-700">Customise</a>
                    </div>
                    {/* Mobile quick book */}
                    <a href="#customise" className="lg:hidden btn-gold text-xs py-2 px-4 flex-shrink-0">
                        Book Now
                    </a>
                </div>
            </div>

            {/* ── CONTENT + SIDEBAR ── */}
            <section className="container-inner mt-10 mb-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

                    {/* ── Left: Main Content ── */}
                    <div className="lg:col-span-8 w-full space-y-10">

                        {/* Overview */}
                        <div id="overview" className="scroll-mt-32 rounded-2xl bg-white p-8 sm:p-12 shadow-sm border border-stone-100">
                            <h2 className="mb-6 font-serif text-3xl font-medium text-brand-950 border-b border-stone-100 pb-5">Trip Overview</h2>
                            {pkg.description ? (
                                <div className="prose prose-lg prose-stone max-w-none text-stone-600 font-light leading-relaxed" dangerouslySetInnerHTML={{ __html: pkg.description }} />
                            ) : (
                                <p className="text-lg text-stone-500 font-light leading-relaxed italic">
                                    Embark on a spectacular {pkg.duration_days}-day journey through {pkg.destinations?.join(", ") || "some of the world's finest destinations"}.
                                    This premium {pkg.category || ""} package has been curated to offer an unforgettable blend of culture, relaxation, and luxury.
                                </p>
                            )}
                        </div>

                        {/* Itinerary */}
                        <div id="itinerary" className="scroll-mt-32 rounded-2xl bg-white p-8 sm:p-12 shadow-sm border border-stone-100">
                            <h2 className="mb-8 font-serif text-3xl font-medium text-brand-950 border-b border-stone-100 pb-5">Daily Itinerary</h2>
                            <div
                                className="prose prose-lg prose-stone max-w-none prose-headings:font-serif prose-headings:font-medium prose-headings:text-brand-900 prose-headings:text-2xl prose-p:leading-relaxed prose-li:marker:text-gold-500"
                                dangerouslySetInnerHTML={{
                                    __html: pkg.itinerary || "<p class='italic text-stone-400 text-base'>Please contact us for the day-by-day breakdown of this premium package.</p>"
                                }}
                            />
                        </div>

                        {/* Inclusions / Exclusions */}
                        <div id="details" className="scroll-mt-32">
                            <h2 className="mb-6 font-serif text-3xl font-medium text-brand-950">Package Details</h2>
                            <div className="grid gap-5 md:grid-cols-2">
                                {/* Inclusions */}
                                <div className="rounded-2xl bg-emerald-50 p-7 border border-emerald-100">
                                    <h3 className="mb-5 flex items-center gap-3 font-serif text-xl font-medium text-emerald-900 border-b border-emerald-100 pb-4">
                                        <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                                        What&apos;s Included
                                    </h3>
                                    {pkg.inclusions ? (
                                        <div className="prose prose-sm prose-stone max-w-none" dangerouslySetInnerHTML={{ __html: pkg.inclusions }} />
                                    ) : (
                                        <ul className="space-y-3 text-sm text-emerald-800">
                                            {["Premium Accommodations", "Daily Breakfast & Select Meals", "Airport Transfers", "Local Guided Tours"].map(i => (
                                                <li key={i} className="flex items-center gap-2">
                                                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                                                    {i}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                                {/* Exclusions */}
                                <div className="rounded-2xl bg-stone-50 p-7 border border-stone-200">
                                    <h3 className="mb-5 flex items-center gap-3 font-serif text-xl font-medium text-stone-800 border-b border-stone-200 pb-4">
                                        <XCircle className="h-5 w-5 text-stone-400 shrink-0" />
                                        What&apos;s Excluded
                                    </h3>
                                    {pkg.exclusions ? (
                                        <div className="prose prose-sm prose-stone max-w-none" dangerouslySetInnerHTML={{ __html: pkg.exclusions }} />
                                    ) : (
                                        <ul className="space-y-3 text-sm text-stone-600">
                                            {["International Flights", "Visa Fees", "Personal Expenses", "Travel Insurance"].map(i => (
                                                <li key={i} className="flex items-center gap-2">
                                                    <XCircle className="h-4 w-4 text-stone-300 shrink-0" />
                                                    {i}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Lead Form */}
                        <div id="customise" className="scroll-mt-32 rounded-[2rem] bg-brand-950 p-10 sm:p-14 text-white relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 right-0 -m-16 h-64 w-64 rounded-full bg-gold-500/10 blur-[80px]" />
                            <div className="absolute bottom-0 left-0 -m-16 h-64 w-64 rounded-full bg-brand-600/20 blur-[80px]" />
                            <div className="relative z-10">
                                <h3 className="mb-3 font-serif text-4xl font-medium">Customise This Package</h3>
                                <p className="mb-10 text-stone-300 font-light text-base max-w-xl">
                                    Every traveller is unique. Tell us your preferences and we&apos;ll personalise the <strong className="text-white">{pkg.title}</strong> to perfection.
                                </p>
                                <LeadForm prefilledPackage={pkg.title} />
                            </div>
                        </div>

                    </div>

                    {/* ── Right: Sticky Sidebar ── */}
                    <div className="lg:col-span-4 lg:sticky lg:top-[120px] self-start">
                        <aside className="overflow-hidden rounded-2xl bg-white border border-stone-200 shadow-xl">

                            {/* Price header */}
                            <div className="bg-brand-950 p-8 text-center text-white relative">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-700 to-transparent opacity-30" />
                                <div className="relative z-10">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-gold-400 mb-2">Starting Price</p>
                                    <p className="font-serif text-5xl font-medium tracking-tight">
                                        {pkg.price ? `₹${Number(pkg.price).toLocaleString("en-IN")}` : "On Request"}
                                    </p>
                                    <p className="mt-1 text-xs text-brand-300">{pkg.price ? "per person (taxes extra)" : "Contact for custom quote"}</p>
                                </div>
                            </div>

                            {/* Trip details */}
                            <div className="divide-y divide-stone-100">
                                {pkg.duration_nights && (
                                    <div className="flex items-center gap-4 p-5">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-700 shrink-0">
                                            <Clock className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Duration</p>
                                            <p className="text-sm font-semibold text-brand-950">{pkg.duration_nights} Nights / {pkg.duration_days} Days</p>
                                        </div>
                                    </div>
                                )}
                                {pkg.destinations?.length > 0 && (
                                    <div className="flex items-center gap-4 p-5">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-700 shrink-0">
                                            <MapPin className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Destinations</p>
                                            <p className="text-sm font-semibold text-brand-950">{pkg.destinations.join(", ")}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* CTA Buttons */}
                            <div className="p-6 space-y-3">
                                <a href="tel:+919876543210" className="btn-gold w-full py-4 text-sm flex items-center justify-center gap-2 shadow-lg">
                                    <Smartphone className="h-4 w-4" /> Call to Book Now
                                </a>
                                <a href="#customise" className="btn-outline w-full py-4 text-sm">
                                    Request a Callback
                                </a>
                            </div>

                            {/* Trust badge */}
                            <div className="bg-stone-50 p-5 text-center text-xs text-stone-500 border-t border-stone-100">
                                <Shield className="mx-auto mb-2 h-5 w-5 text-brand-300" />
                                <strong className="block text-brand-950 mb-0.5">Secure &amp; Protected Booking</strong>
                                IG Holidays – an official brand of Infygru Private Limited
                            </div>
                        </aside>
                    </div>

                </div>
            </section>
        </main>
    );
}
