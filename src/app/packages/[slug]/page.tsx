import { notFound } from "next/navigation";
import { directus, getSiteSettings } from "@/lib/directus";
import { readItems } from "@directus/sdk";
import Image from "next/image";
import Link from "next/link";
import {
    MapPin, Clock, ArrowLeft, Phone,
    CheckCircle2, XCircle, Calendar, Users,
    Star, Shield, ChevronRight, Tag,
    CreditCard, Smartphone, Building2, Wallet,
    Utensils, Car, Compass, Moon,
} from "lucide-react";
import DownloadItineraryButton from "@/components/DownloadItineraryButton";
import ShareButtons from "@/components/ShareButtons";
import CustomJourneyDropdown from "@/components/CustomJourneyDropdown";
import { getActiveOffers } from "@/lib/offers";
import type { Metadata } from "next";

export const revalidate = 3600;

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
            const title = `${pkg.title} | ${destStr ? destStr + " " : ""}Holiday Package — My Perfect Trips`;
            const description = `Book ${pkg.title}${destStr ? " in " + destStr : ""} — ${pkg.duration_nights ? pkg.duration_nights + " nights / " + pkg.duration_days + " days" : "premium"} ${pkg.category ? pkg.category.toLowerCase() : "holiday"} package. Starting from ${pkg.price ? "₹" + Number(pkg.price).toLocaleString("en-IN") : "custom pricing"}. Customised itinerary, best price guarantee, 24/7 support. Book with My Perfect Trips.`;
            const canonicalUrl = `${baseUrl}/packages/${slug}`;
            const dUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://localhost:8055";
            const imageUrl = pkg.image ? `${dUrl}/assets/${pkg.image}` : undefined;

            return {
                title,
                description,
                keywords: [pkg.title, destStr, pkg.category, "holiday package", "tour package India", "My Perfect Trips"].filter(Boolean).join(", "),
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
        title: "Package Details | My Perfect Trips",
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
        if (!result?.length) {
            console.error(`[package detail] no package found for slug: "${slug}"`);
            return notFound();
        }
        pkg = result[0];
    } catch (err) {
        console.error(`[package detail] error fetching slug "${slug}":`, err);
        return notFound();
    }

    // Fetch related packages (same category, exclude current)
    try {
        const all = (await directus.request(readItems("packages" as any, { limit: 50 }))) as any[];
        relatedPackages = all
            .filter((p) => p.id !== pkg.id && (pkg.category ? p.category === pkg.category : true))
            .slice(0, 3);
    } catch { }

    // itinerary_days comes as an array via O2M relation
    let itineraryDays: any[] = [];
    if (Array.isArray(pkg.itinerary_days) && pkg.itinerary_days.length > 0) {
        itineraryDays = [...pkg.itinerary_days].sort((a: any, b: any) => (a.day_number ?? 0) - (b.day_number ?? 0));
    }

    const dUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://localhost:8055";
    const imgUrl = pkg.image ? `${dUrl}/assets/${pkg.image}` : null;
    const phone = "+91 8807709919";

    // Fetch site settings for logo + payment offers in parallel
    const [siteSettings, paymentOffers] = await Promise.all([
        getSiteSettings(),
        getActiveOffers(),
    ]);
    const logoUrl = (siteSettings?.logo || siteSettings?.project_logo)
        ? `${dUrl}/assets/${siteSettings.logo || siteSettings.project_logo}`
        : null;

    const OFFER_ICON: Record<string, React.ElementType> = {
        card: CreditCard, upi: Smartphone,
        netbanking: Building2, wallet: Wallet,
        emi: Calendar, all: Tag,
    };
    const OFFER_COLORS: Record<string, { bg: string; iconText: string; badge: string }> = {
        blue:   { bg: "bg-blue-50",    iconText: "text-blue-500",    badge: "bg-blue-100 text-blue-700" },
        purple: { bg: "bg-purple-50",  iconText: "text-purple-500",  badge: "bg-purple-100 text-purple-700" },
        green:  { bg: "bg-emerald-50", iconText: "text-emerald-500", badge: "bg-emerald-100 text-emerald-700" },
        orange: { bg: "bg-orange-50",  iconText: "text-orange-500",  badge: "bg-orange-100 text-orange-700" },
        amber:  { bg: "bg-amber-50",   iconText: "text-amber-500",   badge: "bg-amber-100 text-amber-700" },
    };

    const defaultInclusions = ["Handpicked Premium Accommodation", "Daily Breakfast & Select Meals", "All Airport & Hotel Transfers", "Expert Local Guides", "All Entry Permits & Tickets", "24/7 On-Trip Concierge Support"];
    const defaultExclusions = ["International / Domestic Flights", "Visa Fees & Documentation", "Personal & Shopping Expenses", "Travel Insurance", "Optional Activities & Tips", "Anything not mentioned in inclusions"];

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://myperfecttrips.com";
    const packageUrl = `${baseUrl}/packages/${pkg.slug}`;
    const destStr = pkg.destination || pkg.destinations?.join(", ") || "";
    const packageSchema = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: pkg.title,
        description: pkg.description
            ? pkg.description.replace(/<[^>]+>/g, "").slice(0, 300)
            : `${pkg.title} — ${pkg.duration_nights ? pkg.duration_nights + " nights / " + pkg.duration_days + " days" : "premium"} holiday package${destStr ? " in " + destStr : ""}.`,
        url: `${baseUrl}/packages/${pkg.slug}`,
        image: imgUrl || undefined,
        brand: { "@type": "Brand", name: "My Perfect Trips" },
        offers: pkg.price ? {
            "@type": "Offer",
            price: String(pkg.price),
            priceCurrency: "INR",
            availability: "https://schema.org/InStock",
            url: `${baseUrl}/packages/${pkg.slug}`,
        } : undefined,
    };

    return (
        <>
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(packageSchema) }}
        />
        <main className="min-h-screen bg-[#F8F7F4]">

            {/* ── CINEMATIC HERO ── */}
            <section className="relative h-[42vh] md:h-[50vh] min-h-[320px] md:min-h-[400px] w-full overflow-hidden bg-brand-950">
                {imgUrl ? (
                    <Image
                        src={imgUrl}
                        alt={pkg.title}
                        fill
                        className="object-cover"
                        priority
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
                        <ShareButtons url={packageUrl} title={pkg.title} />
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
                                <div className="border-b border-stone-100 px-8 py-5 flex items-center justify-between gap-4">
                                    <h2 className="font-serif text-2xl font-medium text-brand-950">Trip Overview</h2>
                                    <DownloadItineraryButton pkg={pkg} logoUrl={logoUrl} itineraryDays={itineraryDays} variant="overview" />
                                </div>
                                <div className="p-8">
                                    {/* What you get — value cards */}
                                    <div className="mb-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {[
                                            {
                                                icon: Moon,
                                                iconColor: "#8b5cf6",
                                                cardStyle: { background: "#f5f3ff", borderColor: "#ede9fe" },
                                                label: "Stay Duration",
                                                value: pkg.duration_nights ? `${pkg.duration_nights} Nights` : "Custom",
                                                sub: pkg.duration_days ? `${pkg.duration_days} Days Tour` : "Flexible",
                                            },
                                            {
                                                icon: MapPin,
                                                iconColor: "#f43f5e",
                                                cardStyle: { background: "#fff1f2", borderColor: "#ffe4e6" },
                                                label: "Destinations",
                                                value: pkg.destinations?.length
                                                    ? `${pkg.destinations.length} ${pkg.destinations.length === 1 ? "City" : "Cities"}`
                                                    : "Multiple",
                                                sub: pkg.destinations?.slice(0, 2).join(" · ") || "Handpicked spots",
                                            },
                                            {
                                                icon: Utensils,
                                                iconColor: "#10b981",
                                                cardStyle: { background: "#ecfdf5", borderColor: "#d1fae5" },
                                                label: "Meals",
                                                value: "Daily Breakfast",
                                                sub: "Select meals incl.",
                                            },
                                            {
                                                icon: Car,
                                                iconColor: "#f59e0b",
                                                cardStyle: { background: "#fffbeb", borderColor: "#fef3c7" },
                                                label: "Transfers",
                                                value: "All Included",
                                                sub: "Airport & hotel",
                                            },
                                            {
                                                icon: Compass,
                                                iconColor: "#0ea5e9",
                                                cardStyle: { background: "#f0f9ff", borderColor: "#e0f2fe" },
                                                label: "Guided Tour",
                                                value: "Expert Guide",
                                                sub: "Local knowledge",
                                            },
                                            {
                                                icon: Shield,
                                                iconColor: "#6366f1",
                                                cardStyle: { background: "#eef2ff", borderColor: "#e0e7ff" },
                                                label: "Support",
                                                value: "24/7 Concierge",
                                                sub: "On-trip helpline",
                                            },
                                        ].map(({ icon: Icon, iconColor, cardStyle, label, value, sub }) => (
                                            <div key={label} className="rounded-2xl border p-4" style={cardStyle}>
                                                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl shadow-sm" style={{ background: iconColor }}>
                                                    <Icon className="h-4 w-4" style={{ color: "#fff" }} />
                                                </div>
                                                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-0.5">{label}</p>
                                                <p className="text-sm font-bold text-brand-950 leading-tight">{value}</p>
                                                <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">{sub}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {pkg.description ? (
                                        pkg.description.trim().startsWith("<") ? (
                                            <div
                                                className="prose prose-stone max-w-none text-stone-600 leading-relaxed prose-p:text-stone-600 prose-p:leading-relaxed"
                                                dangerouslySetInnerHTML={{ __html: pkg.description }}
                                            />
                                        ) : (
                                            <p className="text-stone-600 leading-relaxed text-base whitespace-pre-line">{pkg.description}</p>
                                        )
                                    ) : (
                                        <p className="text-stone-600 leading-relaxed text-base">
                                            Embark on an extraordinary {pkg.duration_days}-day journey through{" "}
                                            {pkg.destinations?.join(", ") || "the world's most captivating destinations"}.
                                            This premium {pkg.category || "holiday"} package has been meticulously curated by our expert travel consultants to deliver an unforgettable blend of culture, leisure, and luxury.
                                            Every detail — from handpicked accommodations to curated experiences — is designed to exceed expectations.
                                        </p>
                                    )}

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
                                    <ol className="relative border-l-2 border-stone-100 space-y-0 ml-4">
                                        {itineraryDays.map((day: any, idx: number) => (
                                            <li key={day.id || idx} className="relative pl-8 pb-10 last:pb-0">
                                                {/* Timeline dot */}
                                                <span className="absolute -left-[18px] flex h-9 w-9 items-center justify-center rounded-full bg-brand-950 text-white text-[11px] font-bold ring-4 ring-white shadow-sm">
                                                    {day.day_number || idx + 1}
                                                </span>
                                                {/* Day header */}
                                                <div className="mb-3">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-gold-600 mb-0.5">Day {day.day_number || idx + 1}</p>
                                                    <div className="flex flex-wrap items-center gap-3">
                                                        <h3 className="font-serif text-lg font-medium text-brand-950">{day.title || `Day ${day.day_number || idx + 1}`}</h3>
                                                        {Array.isArray(day.meals) && day.meals.length > 0 && (
                                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                                                                {day.meals.join(" · ")}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                {/* Description */}
                                                {day.description ? (
                                                    day.description.trim().startsWith("<") ? (
                                                        <div
                                                            className="prose prose-stone prose-sm max-w-none text-stone-600 leading-relaxed prose-p:text-stone-600 mb-3"
                                                            dangerouslySetInnerHTML={{ __html: day.description }}
                                                        />
                                                    ) : (
                                                        <p className="text-stone-600 text-sm leading-relaxed whitespace-pre-line mb-3">{day.description}</p>
                                                    )
                                                ) : null}
                                                {/* Accommodation */}
                                                {day.accommodation && (
                                                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-stone-50 border border-stone-200 px-3 py-1.5 text-xs font-medium text-stone-700">
                                                        🏨 {day.accommodation}
                                                    </span>
                                                )}
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
                        {(() => {
                            // Parse either plain "one item per line" text OR legacy HTML (comma-separated inside <p> tags)
                            function parseList(raw: string): string[] {
                                if (!raw?.trim()) return [];
                                // Strip HTML tags from each line individually, preserving line breaks
                                const stripHtml = (s: string) =>
                                    s.replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&apos;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\s+/g, " ").trim();
                                // Split by newline first (new plain-text format); fall back to comma (legacy HTML)
                                const lines = raw.split(/\r?\n/);
                                if (lines.length > 1) {
                                    return lines.map(stripHtml).filter(Boolean);
                                }
                                // Single line — strip HTML then split by comma
                                return stripHtml(raw).split(",").map((s: string) => s.trim()).filter(Boolean);
                            }
                            const inclList = parseList(pkg.inclusions) || defaultInclusions;
                            const exclList = parseList(pkg.exclusions) || defaultExclusions;
                            if (!inclList.length) inclList.push(...defaultInclusions);
                            if (!exclList.length) exclList.push(...defaultExclusions);
                            return (
                                <div id="details" className="scroll-mt-28 grid sm:grid-cols-2 gap-5">
                                    {/* Inclusions */}
                                    <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 p-6 shadow-sm">
                                        <div className="flex items-center gap-3 mb-5">
                                            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500 shadow-sm shadow-emerald-200">
                                                <CheckCircle2 className="h-4 w-4 text-white" />
                                            </span>
                                            <h3 className="font-serif text-lg font-medium text-stone-900">What&apos;s Included</h3>
                                        </div>
                                        <ul className="divide-y divide-emerald-100/60">
                                            {inclList.map((item: string) => (
                                                <li key={item} className="flex items-start gap-3 py-2.5">
                                                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500">
                                                        <CheckCircle2 className="h-3 w-3 text-white" />
                                                    </span>
                                                    <span className="text-sm text-stone-700 leading-snug">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Exclusions */}
                                    <div className="rounded-2xl bg-white border border-stone-200 p-6 shadow-sm">
                                        <div className="flex items-center gap-3 mb-5">
                                            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 border border-rose-100 shadow-sm">
                                                <XCircle className="h-4 w-4 text-rose-400" />
                                            </span>
                                            <h3 className="font-serif text-lg font-medium text-stone-900">Not Included</h3>
                                        </div>
                                        <ul className="divide-y divide-stone-100">
                                            {exclList.map((item: string) => (
                                                <li key={item} className="flex items-start gap-3 py-2.5">
                                                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-50 border border-rose-100">
                                                        <XCircle className="h-3 w-3 text-rose-400" />
                                                    </span>
                                                    <span className="text-sm text-stone-500 leading-snug">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            );
                        })()}

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
                                                        <Image src={relImg} alt={rel.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
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

                        {/* ── PRIMARY BOOKING CARD ── */}
                        <div className="rounded-2xl overflow-hidden border border-stone-200 bg-white shadow-lg">

                            {/* Price header */}
                            <div className="bg-brand-950 px-6 pt-6 pb-5 text-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_var(--tw-gradient-stops))] from-brand-700/40 to-transparent" />
                                <div className="relative z-10">
                                    <p className="text-[9px] font-black uppercase tracking-[0.25em] text-gold-400 mb-1.5">Starting from</p>
                                    <p className="font-serif text-5xl font-medium text-white leading-none">
                                        {pkg.price ? `₹${Number(pkg.price).toLocaleString("en-IN")}` : "Custom"}
                                    </p>
                                    <p className="text-[11px] text-brand-400 mt-1.5">
                                        {pkg.price ? "per person · taxes extra" : "Contact us for pricing"}
                                    </p>
                                </div>
                            </div>

                            <div className="p-5 space-y-4">
                                {/* CTA */}
                                <Link
                                    href={`/checkout/${pkg.slug}`}
                                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-900 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-brand-800 active:scale-[0.98] transition-all"
                                >
                                    Book &amp; Pay Online →
                                </Link>

                                {/* Payment Offers */}
                                {paymentOffers.length > 0 && (
                                    <div className="rounded-xl border border-gold-200 overflow-hidden bg-gradient-to-b from-gold-50 to-amber-50/40">
                                        <div className="flex items-center gap-2 px-3.5 py-2.5 border-b border-gold-200/60">
                                            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gold-500">
                                                <Tag className="h-3 w-3 text-white" />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gold-700">Exclusive Offers</span>
                                            <span className="ml-auto text-[10px] font-bold text-gold-500">{paymentOffers.length} active</span>
                                        </div>
                                        <ul className="divide-y divide-gold-100/80">
                                            {paymentOffers.map((offer) => {
                                                const Icon = OFFER_ICON[offer.payment_method] ?? Tag;
                                                const c = OFFER_COLORS[offer.badge_color] ?? OFFER_COLORS.blue;
                                                return (
                                                    <li key={offer.id} className="flex items-center gap-3 px-3.5 py-3">
                                                        <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${c.bg}`}>
                                                            <Icon className={`h-3.5 w-3.5 ${c.iconText}`} />
                                                        </div>
                                                        <span className="flex-1 min-w-0 text-xs font-medium text-stone-700 leading-snug">{offer.title}</span>
                                                        <span className={`shrink-0 rounded-lg px-2 py-0.5 text-[10px] font-black ${c.badge}`}>
                                                            {offer.discount_label}
                                                        </span>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                        <p className="px-3.5 py-2 text-[10px] text-gold-600 font-medium border-t border-gold-100">
                                            Select matching method in Razorpay to redeem
                                        </p>
                                    </div>
                                )}

                                {/* Trust list */}
                                <div className="border-t border-stone-100 pt-4 space-y-2">
                                    {[
                                        { icon: CheckCircle2, text: "100% Customisable Itineraries", color: "text-emerald-500" },
                                        { icon: CheckCircle2, text: "Best Price Guarantee",           color: "text-emerald-500" },
                                        { icon: CheckCircle2, text: "24/7 On-Trip Support",           color: "text-emerald-500" },
                                        { icon: CheckCircle2, text: "No Hidden Charges",              color: "text-emerald-500" },
                                    ].map(({ icon: Icon, text, color }) => (
                                        <div key={text} className="flex items-center gap-2.5">
                                            <Icon className={`h-3.5 w-3.5 shrink-0 ${color}`} />
                                            <span className="text-xs text-stone-600">{text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Custom Journey */}
                        <CustomJourneyDropdown packageTitle={pkg.title} />

                        {/* Need Help */}
                        <div className="rounded-2xl bg-brand-50 border border-brand-100 p-5">
                            <h3 className="font-serif text-base font-medium text-brand-900 mb-1">Need Help?</h3>
                            <p className="text-xs text-brand-600 mb-3">Mon–Sat, 9 am to 6 pm</p>
                            <a
                                href={`tel:${phone}`}
                                className="inline-flex items-center gap-2 text-sm font-bold text-brand-800 hover:text-brand-950 transition-colors"
                            >
                                <Phone className="h-4 w-4" />
                                {phone}
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </main>
        </>
    );
}
