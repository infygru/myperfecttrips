import { notFound } from "next/navigation";
import { directus, getSiteSettings } from "@/lib/directus";
import { readItems } from "@directus/sdk";
import Image from "next/image";
import Link from "next/link";
import {
    MapPin, Clock, ArrowLeft, Phone, Mail,
    CheckCircle2, XCircle, Calendar, Users,
    Star, Shield, ChevronRight
} from "lucide-react";
import LeadForm from "@/components/LeadForm";
import DownloadItineraryButton from "@/components/DownloadItineraryButton";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
    const { slug } = await props.params;
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    try {
        const result = (await directus.request(
            readItems("packages" as any, { filter: { slug: { _eq: slug } } as any, limit: 1 })
        )) as any[];
        const pkg = result?.[0];
        
        if (pkg) {
            const destStr = pkg.destination || pkg.destinations?.join(", ") || "";
            const title = `${pkg.title} | ${destStr ? destStr + " " : ""}Holiday Package — IG Holidays`;
            const description = `Book ${pkg.title}${destStr ? " in " + destStr : ""} — ${pkg.duration_nights ? pkg.duration_nights + " nights / " + pkg.duration_days + " days" : "premium"} ${pkg.category ? pkg.category.toLowerCase() : "holiday"} package. Starting from ${pkg.price ? "₹" + Number(pkg.price).toLocaleString("en-IN") : "custom pricing"}. Customised itinerary, best price guarantee, 24/7 support. Book with IG Holidays.`;
            const canonicalUrl = `${baseUrl}/packages/${slug}`;
            const dUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://localhost:8055";
            const imageUrl = pkg.image ? `${dUrl}/assets/${pkg.image}` : undefined;

            return {
                title,
                description,
                keywords: [pkg.title, destStr, pkg.category, "holiday package", "tour package India", "IG Holidays"].filter(Boolean).join(", "),
                alternates: { canonical: canonicalUrl },
                openGraph: {
                    title,
                    description,
                    url: canonicalUrl,
                    type: "website",
                    images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630, alt: pkg.title }] : [],
                },
                twitter: {
                    card: "summary_large_image",
                    title,
                    description,
                    images: imageUrl ? [imageUrl] : [],
                },
            };
        }
    } catch { }

    return { 
        title: "Package Details | IG Holidays",
        alternates: {
            canonical: `${baseUrl}/packages/${slug}`,
        }
    };
}

export default async function PackageDetailPage(props: Props) {
    const { slug } = await props.params;

    let pkg: any;
    let relatedPackages: any[] = [];

    try {
        const result = (await directus.request(
            readItems("packages" as any, { filter: { slug: { _eq: slug } } as any, limit: 1 })
        )) as any[];
        if (!result?.length) return notFound();
        pkg = result[0];
    } catch {
        return notFound();
    }

    // Fetch related packages (same category, exclude current)
    try {
        const all = (await directus.request(readItems("packages" as any, { limit: 50 }))) as any[];
        relatedPackages = all
            .filter((p) => p.id !== pkg.id && (pkg.category ? p.category === pkg.category : true))
            .slice(0, 3);
    } catch { }

    // Fetch day-by-day itinerary
    let itineraryDays: any[] = [];
    try {
        itineraryDays = (await directus.request(
            readItems("itinerary_days" as any, {
                filter: { package_id: { _eq: pkg.id } } as any,
                sort: ["day_number"] as any,
                limit: 100,
            })
        )) as any[];
    } catch {
        // collection may not exist yet - graceful fallback
    }

    const dUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://localhost:8055";
    const imgUrl = pkg.image ? `${dUrl}/assets/${pkg.image}` : null;
    const phone = "+91 8807709919";

    // Fetch site settings for logo
    const siteSettings = await getSiteSettings();
    const logoUrl = (siteSettings?.logo || siteSettings?.project_logo)
        ? `${dUrl}/assets/${siteSettings.logo || siteSettings.project_logo}`
        : null;

    const defaultInclusions = ["Handpicked Premium Accommodation", "Daily Breakfast & Select Meals", "All Airport & Hotel Transfers", "Expert Local Guides", "All Entry Permits & Tickets", "24/7 On-Trip Concierge Support"];
    const defaultExclusions = ["International / Domestic Flights", "Visa Fees & Documentation", "Personal & Shopping Expenses", "Travel Insurance", "Optional Activities & Tips", "Anything not mentioned in inclusions"];

    return (
        <main className="min-h-screen bg-[#F8F7F4]">

            {/* ── CINEMATIC HERO ── */}
            <section className="relative h-[50vh] md:h-[60vh] min-h-[380px] md:min-h-[480px] w-full overflow-hidden bg-brand-950">
                {imgUrl ? (
                    <Image
                        src={imgUrl}
                        alt={pkg.title}
                        fill
                        className="object-cover"
                        priority
                        unoptimized
                    />
                ) : (
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-700 to-brand-950" />
                )}
                {/* Rich gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/30 to-brand-950/20" />
                <div className="absolute inset-0 bg-gradient-to-r from-brand-950/80 via-brand-950/20 to-transparent" />

                {/* Back */}
                <div className="absolute top-0 left-0 right-0 pt-20 container-inner">
                    <Link
                        href="/packages"
                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/80 hover:text-gold-400 transition-colors group"
                    >
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        All Packages
                    </Link>
                </div>

                {/* Hero content */}
                <div className="absolute bottom-0 left-0 right-0 container-inner pb-16">
                    <div className="max-w-3xl">
                        {/* Category + rating */}
                        <div className="flex items-center flex-wrap gap-3 mb-5">
                            {pkg.category && (
                                <span className="rounded-full bg-gold-500/20 backdrop-blur-sm border border-gold-400/40 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-gold-300">
                                    {pkg.category}
                                </span>
                            )}
                            <span className="flex items-center gap-1 text-xs text-white/70 font-medium">
                                <Star className="h-3.5 w-3.5 fill-gold-400 text-gold-400" />
                                <Star className="h-3.5 w-3.5 fill-gold-400 text-gold-400" />
                                <Star className="h-3.5 w-3.5 fill-gold-400 text-gold-400" />
                                <Star className="h-3.5 w-3.5 fill-gold-400 text-gold-400" />
                                <Star className="h-3.5 w-3.5 fill-gold-400 text-gold-400" />
                                <span className="ml-1">Premium Package</span>
                            </span>
                        </div>

                        <h1 className="mb-4 font-serif text-4xl sm:text-5xl md:text-6xl font-medium text-white tracking-tight leading-[1.02]">
                            {pkg.title}
                        </h1>

                        {/* Quick facts strip */}
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                            {pkg.duration_nights && (
                                <div className="flex items-center gap-2 text-sm text-white/80">
                                    <Clock className="h-4 w-4 text-gold-400" />
                                    <span className="font-medium">{pkg.duration_nights} Nights / {pkg.duration_days} Days</span>
                                </div>
                            )}
                            {pkg.destinations?.length > 0 && (
                                <div className="flex items-center gap-2 text-sm text-white/80">
                                    <MapPin className="h-4 w-4 text-gold-400" />
                                    <span className="font-medium">{pkg.destinations.join(" · ")}</span>
                                </div>
                            )}
                            {pkg.price && (
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-white/50 font-medium">From</span>
                                    <span className="font-serif text-2xl font-semibold text-white">
                                        ₹{Number(pkg.price).toLocaleString("en-IN")}
                                    </span>
                                    <span className="text-xs text-white/50">/ person</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── STICKY BREADCRUMB + BOOK NOW ── */}
            <div className="sticky top-[72px] z-40 w-full bg-white border-b border-stone-200 shadow-sm">
                <div className="container-inner flex items-center justify-between gap-4 py-3">
                    <nav className="flex items-center gap-1 text-xs text-stone-500 overflow-x-auto whitespace-nowrap scrollbar-hide">
                        <Link href="/" className="hover:text-brand-700 transition-colors font-medium">Home</Link>
                        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-stone-300" />
                        <Link href="/packages" className="hover:text-brand-700 transition-colors font-medium">Packages</Link>
                        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-stone-300" />
                        <span className="text-brand-950 font-semibold truncate max-w-[200px]">{pkg.title}</span>
                    </nav>
                    <div className="flex items-center gap-3 shrink-0">
                        <DownloadItineraryButton pkg={pkg} logoUrl={logoUrl} itineraryDays={itineraryDays} variant="breadcrumb" />
                        <a
                            href={`tel:${phone}`}
                            className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:text-brand-900 transition-colors"
                        >
                            <Phone className="h-3.5 w-3.5" /> Call Us
                        </a>
                        <a
                            href="#enquire"
                            className="btn-gold text-xs py-2 px-5"
                        >
                            Book Now
                        </a>
                    </div>
                </div>
            </div>

            {/* ── MAIN CONTENT ── */}
            <div className="container-inner py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-start">

                    {/* ── LEFT COLUMN ── */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* Overview Card */}
                        {(pkg.description || pkg.duration_days) && (
                            <div id="overview" className="scroll-mt-28 bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
                                <div className="border-b border-stone-100 px-8 py-5">
                                    <h2 className="font-serif text-2xl font-medium text-brand-950">Trip Overview</h2>
                                </div>
                                <div className="p-8">
                                    {pkg.description ? (
                                        <div
                                            className="prose prose-stone max-w-none text-stone-600 leading-relaxed prose-p:text-stone-600 prose-p:leading-relaxed"
                                            dangerouslySetInnerHTML={{ __html: pkg.description }}
                                        />
                                    ) : (
                                        <p className="text-stone-600 leading-relaxed text-base">
                                            Embark on an extraordinary {pkg.duration_days}-day journey through{" "}
                                            {pkg.destinations?.join(", ") || "the world's most captivating destinations"}.
                                            This premium {pkg.category || "holiday"} package has been meticulously curated by our expert travel consultants to deliver an unforgettable blend of culture, leisure, and luxury.
                                            Every detail — from handpicked accommodations to curated experiences — is designed to exceed expectations.
                                        </p>
                                    )}

                                    {/* Highlights strip */}
                                    <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        {[
                                            { icon: Clock, label: "Duration", value: pkg.duration_nights ? `${pkg.duration_nights}N/${pkg.duration_days}D` : "Custom" },
                                            { icon: MapPin, label: "Destinations", value: pkg.destinations?.length ? `${pkg.destinations.length} Places` : "Multiple" },
                                            { icon: Users, label: "Group Size", value: "Flexible" },
                                            { icon: Calendar, label: "Availability", value: "All Year" },
                                        ].map(({ icon: Icon, label, value }) => (
                                            <div key={label} className="text-center bg-stone-50 rounded-xl p-4 border border-stone-100">
                                                <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                                                    <Icon className="h-4 w-4" />
                                                </div>
                                                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-0.5">{label}</p>
                                                <p className="text-sm font-semibold text-brand-950">{value}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Itinerary */}
                        <div id="itinerary" className="scroll-mt-28 bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
                            <div className="border-b border-stone-100 px-8 py-5">
                                <h2 className="font-serif text-2xl font-medium text-brand-950">Day-by-Day Itinerary</h2>
                            </div>
                            <div className="p-6 sm:p-8">
                                {itineraryDays.length > 0 ? (
                                    <ol className="relative border-l border-stone-200 space-y-0">
                                        {itineraryDays.map((day: any, idx: number) => (
                                            <li key={day.id || idx} className="mb-0 ml-6">
                                                {/* Timeline dot */}
                                                <span className="absolute -left-4 flex h-8 w-8 items-center justify-center rounded-full bg-brand-950 text-white text-[11px] font-bold ring-4 ring-white">
                                                    {day.day_number || idx + 1}
                                                </span>
                                                <details className="group pb-8" open={idx === 0}>
                                                    <summary className="flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 hover:bg-stone-50 transition-colors list-none">
                                                        <div className="flex-1">
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-gold-600 mb-0.5">Day {day.day_number || idx + 1}</p>
                                                            <h3 className="font-serif text-lg font-medium text-brand-950">{day.title || `Day ${day.day_number || idx + 1}`}</h3>
                                                        </div>
                                                        <div className="flex shrink-0 items-center gap-3">
                                                            {Array.isArray(day.meals) && day.meals.length > 0 && (
                                                                <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                                                                    {day.meals.join(" · ")}
                                                                </span>
                                                            )}
                                                            <Calendar className="h-4 w-4 text-stone-400 transition-transform duration-300 group-open:rotate-90" />
                                                        </div>
                                                    </summary>
                                                    <div className="px-4 pt-2 pb-2">
                                                        {day.description ? (
                                                            <div
                                                                className="prose prose-stone prose-sm max-w-none text-stone-600 leading-relaxed prose-p:text-stone-600"
                                                                dangerouslySetInnerHTML={{ __html: day.description }}
                                                            />
                                                        ) : null}
                                                        {day.accommodation && (
                                                            <div className="mt-3 flex items-center gap-2 text-xs font-medium text-stone-500">
                                                                <span className="inline-flex items-center gap-1.5 rounded-lg bg-stone-50 border border-stone-200 px-3 py-1.5">
                                                                    🏨 <span className="font-semibold text-stone-700">{day.accommodation}</span>
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </details>
                                            </li>
                                        ))}
                                    </ol>
                                ) : pkg.itinerary ? (
                                    <div
                                        className="prose prose-stone max-w-none prose-headings:font-serif prose-headings:text-brand-950 prose-headings:font-medium prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-p:text-stone-600 prose-p:leading-relaxed prose-li:text-stone-600 prose-li:leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: pkg.itinerary }}
                                    />
                                ) : (
                                    <div className="text-center py-12">
                                        <Calendar className="mx-auto h-12 w-12 text-stone-200 mb-4" />
                                        <p className="text-stone-500 text-base font-medium mb-2">Detailed itinerary available on request</p>
                                        <p className="text-stone-400 text-sm">Contact our travel experts for the full day-by-day plan tailored for you.</p>
                                        <a href="#enquire" className="btn-outline mt-5 inline-flex text-sm">Request Itinerary</a>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Inclusions & Exclusions */}
                        <div id="details" className="scroll-mt-28 grid sm:grid-cols-2 gap-5">
                            {/* Inclusions */}
                            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
                                <div className="bg-emerald-50 border-b border-emerald-100 px-6 py-4 flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
                                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                    </div>
                                    <h3 className="font-serif text-lg font-medium text-emerald-900">What&apos;s Included</h3>
                                </div>
                                <div className="p-6">
                                    {pkg.inclusions ? (
                                        <div className="prose prose-sm prose-stone max-w-none prose-li:text-stone-600" dangerouslySetInnerHTML={{ __html: pkg.inclusions }} />
                                    ) : (
                                        <ul className="space-y-3">
                                            {defaultInclusions.map((item) => (
                                                <li key={item} className="flex items-start gap-3 text-sm text-stone-600">
                                                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>

                            {/* Exclusions */}
                            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
                                <div className="bg-stone-50 border-b border-stone-200 px-6 py-4 flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100">
                                        <XCircle className="h-4 w-4 text-stone-400" />
                                    </div>
                                    <h3 className="font-serif text-lg font-medium text-stone-700">Not Included</h3>
                                </div>
                                <div className="p-6">
                                    {pkg.exclusions ? (
                                        <div className="prose prose-sm prose-stone max-w-none prose-li:text-stone-500" dangerouslySetInnerHTML={{ __html: pkg.exclusions }} />
                                    ) : (
                                        <ul className="space-y-3">
                                            {defaultExclusions.map((item) => (
                                                <li key={item} className="flex items-start gap-3 text-sm text-stone-500">
                                                    <XCircle className="h-4 w-4 text-stone-300 shrink-0 mt-0.5" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Enquiry Form */}
                        <div id="enquire" className="scroll-mt-28 bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
                            <div className="bg-brand-950 px-8 py-7 relative overflow-hidden">
                                <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-gold-400/10 blur-2xl" />
                                <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-brand-700/30 blur-2xl" />
                                <div className="relative z-10">
                                    <h2 className="font-serif text-3xl font-medium text-white mb-1">Customise This Journey</h2>
                                    <p className="text-stone-400 text-sm font-light">
                                        Tell us your preferences and we&apos;ll personalise <strong className="text-white">{pkg.title}</strong> just for you.
                                    </p>
                                </div>
                            </div>
                            <div className="p-8">
                                <LeadForm prefilledPackage={pkg.title} />
                            </div>
                        </div>

                        {/* Related Packages */}
                        {relatedPackages.length > 0 && (
                            <div>
                                <h2 className="font-serif text-2xl font-medium text-brand-950 mb-5">You May Also Like</h2>
                                <div className="grid sm:grid-cols-3 gap-4">
                                    {relatedPackages.map((rel) => {
                                        const relImg = rel.image ? `${dUrl}/assets/${rel.image}` : null;
                                        return (
                                            <Link
                                                key={rel.id}
                                                href={`/packages/${rel.slug || rel.id}`}
                                                className="group flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-white hover:shadow-md transition-all"
                                            >
                                                <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                                                    {relImg ? (
                                                        <Image src={relImg} alt={rel.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" unoptimized />
                                                    ) : (
                                                        <div className="absolute inset-0 bg-gradient-to-br from-brand-800 to-brand-950" />
                                                    )}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                                    {rel.duration_nights && (
                                                        <div className="absolute bottom-2 right-2 rounded-md bg-brand-950/80 px-2 py-0.5 text-[10px] font-medium text-white">
                                                            {rel.duration_nights}N/{rel.duration_days}D
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="p-4 flex-1 flex flex-col">
                                                    <h3 className="font-serif text-sm font-medium text-brand-950 line-clamp-2 group-hover:text-brand-700 transition-colors mb-auto">{rel.title}</h3>
                                                    {rel.price && (
                                                        <p className="mt-3 pt-3 border-t border-stone-100 text-sm font-semibold text-brand-900">
                                                            ₹{Number(rel.price).toLocaleString("en-IN")}
                                                        </p>
                                                    )}
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── RIGHT SIDEBAR ── */}
                    <div className="lg:col-span-4 lg:sticky lg:top-[112px] self-start space-y-4">

                        {/* Booking Card */}
                        <div className="rounded-2xl overflow-hidden border border-stone-200 bg-white shadow-lg">
                            {/* Price */}
                            <div className="bg-brand-950 p-7 text-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_var(--tw-gradient-stops))] from-brand-700/40 to-transparent" />
                                <div className="relative z-10">
                                    <p className="text-[9px] font-black uppercase tracking-[0.25em] text-gold-400 mb-2">Starting from</p>
                                    <p className="font-serif text-5xl font-medium text-white leading-none mb-1">
                                        {pkg.price ? `₹${Number(pkg.price).toLocaleString("en-IN")}` : "Custom"}
                                    </p>
                                    <p className="text-[11px] text-brand-400 mt-2">
                                        {pkg.price ? "per person · taxes extra" : "Contact us for pricing"}
                                    </p>
                                </div>
                            </div>

                            {/* Trip details grid */}
                            <div className="grid grid-cols-2 divide-x divide-y divide-stone-100 border-b border-stone-100">
                                {[
                                    { icon: Clock, label: "Duration", value: pkg.duration_nights ? `${pkg.duration_nights}N / ${pkg.duration_days}D` : "Custom" },
                                    { icon: MapPin, label: "Destinations", value: pkg.destinations?.length ? pkg.destinations.slice(0, 2).join(", ") : "Multiple" },
                                    { icon: Users, label: "Group Size", value: "Flexible" },
                                    { icon: Calendar, label: "Departure", value: "All Year" },
                                ].map(({ icon: Icon, label, value }) => (
                                    <div key={label} className="p-4 text-center">
                                        <Icon className="h-4 w-4 text-brand-600 mx-auto mb-1.5" />
                                        <p className="text-[9px] font-bold uppercase tracking-wider text-stone-400 mb-0.5">{label}</p>
                                        <p className="text-xs font-semibold text-brand-950 leading-tight">{value}</p>
                                    </div>
                                ))}
                            </div>

                            {/* CTAs */}
                            <div className="p-5 space-y-3">
                                <a href="#enquire" className="btn-gold w-full py-4 text-sm flex items-center justify-center gap-2 shadow-md">
                                    Enquire Now &amp; Get Quote
                                </a>
                                <a
                                    href={`tel:${phone}`}
                                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-brand-200 bg-brand-50 py-3.5 text-sm font-semibold text-brand-800 hover:bg-brand-100 transition-colors"
                                >
                                    <Phone className="h-4 w-4" /> Call Us Directly
                                </a>
                                <a
                                    href="mailto:info@igholidays.com"
                                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-transparent py-3.5 text-sm font-semibold text-stone-600 hover:bg-stone-50 transition-colors"
                                >
                                    <Mail className="h-4 w-4" /> info@igholidays.com
                                </a>
                                <DownloadItineraryButton pkg={pkg} logoUrl={logoUrl} itineraryDays={itineraryDays} variant="sidebar" />
                            </div>
                        </div>

                        {/* Trust block */}
                        <div className="rounded-2xl bg-white border border-stone-200 p-5 shadow-sm">
                            <h3 className="font-serif text-base font-medium text-brand-950 mb-4 flex items-center gap-2">
                                <Shield className="h-4 w-4 text-brand-600" />
                                Why Book With Us
                            </h3>
                            <ul className="space-y-3">
                                {[
                                    "100% Customisable Itineraries",
                                    "Best Price Guarantee",
                                    "24/7 On-Trip Support",
                                    "Trusted by 5,000+ Travellers",
                                    "No Hidden Charges",
                                ].map((item) => (
                                    <li key={item} className="flex items-center gap-2.5 text-sm text-stone-600">
                                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-4 pt-4 border-t border-stone-100 text-center">
                                <p className="text-[10px] text-stone-400 font-medium">
                                    IG Holidays — official brand of <strong className="text-stone-600">Infygru Private Limited</strong>
                                </p>
                            </div>
                        </div>

                        {/* Help box */}
                        <div className="rounded-2xl bg-brand-50 border border-brand-100 p-5">
                            <h3 className="font-serif text-base font-medium text-brand-900 mb-2">Need Help?</h3>
                            <p className="text-sm text-brand-700 mb-4 font-light">Our travel experts are available Mon–Sat, 9am to 6pm.</p>
                            <a
                                href={`tel:${phone}`}
                                className="text-sm font-bold text-brand-800 hover:text-brand-950 flex items-center gap-2 transition-colors"
                            >
                                <Phone className="h-4 w-4" />
                                {phone}
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}
