import { notFound } from "next/navigation";
import { directus } from "@/lib/directus";
import { readItems } from "@directus/sdk";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, ArrowLeft, Smartphone, Shield, ArrowRight, CheckCircle2, Compass } from "lucide-react";
import LeadForm from "@/components/LeadForm";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

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

            {/* ──────────────────────────────────────────────────────────
          SECTION 1: HERO
          ────────────────────────────────────────────────────────── */}
            <section className="relative h-[70vh] min-h-[500px] w-full bg-brand-950">
                {imgUrl ? (
                    <Image
                        src={imgUrl}
                        alt={pkg.title}
                        fill
                        className="object-cover opacity-80"
                        priority
                        unoptimized
                    />
                ) : (
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-800 to-brand-950 flex items-center justify-center opacity-80">
                        <Compass className="w-32 h-32 text-brand-900/40" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/40 to-transparent" />

                <div className="absolute bottom-0 left-0 w-full">
                    <div className="container-inner pb-12">
                        <Link
                            href="/packages"
                            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gold-400 transition-colors hover:text-gold-300"
                        >
                            <ArrowLeft className="h-4 w-4" /> Back to Packages
                        </Link>

                        <div className="flex flex-wrap items-end justify-between gap-6">
                            <div className="max-w-3xl">
                                {pkg.category && (
                                    <span className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md border border-white/20">
                                        {pkg.category}
                                    </span>
                                )}
                                <h1 className="mb-6 font-serif text-5xl font-medium text-white sm:text-6xl md:text-7xl tracking-tight leading-[1.1]">
                                    {pkg.title}
                                </h1>

                                <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-stone-300">
                                    {pkg.duration_nights && (
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-5 w-5 text-gold-400" />
                                            <span>{pkg.duration_nights}N / {pkg.duration_days}D</span>
                                        </div>
                                    )}
                                    {pkg.destinations?.length > 0 && (
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-5 w-5 text-gold-400" />
                                            <span>{pkg.destinations.join(" · ")}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Mobile quick price (Desktop price is in sidebar) */}
                            <div className="lg:hidden rounded-2xl bg-white/10 p-6 backdrop-blur-md border border-white/20">
                                <p className="text-xs font-medium text-stone-400 uppercase tracking-widest mb-1">Starting from</p>
                                <p className="font-serif text-3xl font-bold text-white mb-4">
                                    {pkg.price ? `₹${Number(pkg.price).toLocaleString("en-IN")}` : "On Request"}
                                </p>
                                <a href="tel:+919876543210" className="btn-gold w-full">Call to Book</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ──────────────────────────────────────────────────────────
          SECTION 2: STICKY PAGE NAVIGATION
          ────────────────────────────────────────────────────────── */}
            <div className="sticky top-[72px] z-40 w-full border-b border-stone-200 bg-white shadow-sm">
                <div className="container-inner flex items-center overflow-x-auto scrollbar-hide py-3 md:py-0">
                    <div className="flex gap-8 text-sm font-bold uppercase tracking-wider text-stone-500 whitespace-nowrap px-2">
                        <a href="#overview" className="border-b-2 border-transparent md:py-4 text-brand-950 transition-colors hover:text-brand-700 hover:border-brand-700">Trip Overview</a>
                        <a href="#itinerary" className="border-b-2 border-transparent md:py-4 transition-colors hover:text-brand-700 hover:border-brand-700">Daily Itinerary</a>
                        <a href="#details" className="border-b-2 border-transparent md:py-4 transition-colors hover:text-brand-700 hover:border-brand-700">Package Details</a>
                        <a href="#customise" className="border-b-2 border-transparent md:py-4 transition-colors hover:text-brand-700 hover:border-brand-700">Customise</a>
                    </div>
                </div>
            </div>

            {/* ──────────────────────────────────────────────────────────
          SECTION 3: CONTENT & SIDEBAR
          ────────────────────────────────────────────────────────── */}
            <section className="container-inner mt-12 mb-24 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

                    {/* Main Content (Left) */}
                    <div className="lg:col-span-8 w-full min-w-0 space-y-16">

                        {/* Trip Overview */}
                        <div id="overview" className="scroll-mt-32 rounded-3xl bg-white p-8 sm:p-12 shadow-sm border border-stone-100">
                            <h2 className="mb-6 font-serif text-3xl font-medium text-brand-950">Trip Overview</h2>
                            {pkg.description ? (
                                <div className="prose prose-lg prose-stone max-w-none text-stone-600 font-light leading-relaxed" dangerouslySetInnerHTML={{ __html: pkg.description }} />
                            ) : (
                                <p className="text-lg text-stone-600 font-light leading-relaxed">
                                    Embark on a spectacular {pkg.duration_days}-day journey through {pkg.destinations?.join(", ") || "some of the world's finest destinations"}. This premium {pkg.category} package has been curated to offer an unforgettable blend of culture, relaxation, and luxury. Let IGHolidays handle every detail of your {pkg.title}.
                                </p>
                            )}
                        </div>

                        {/* Itinerary */}
                        <div id="itinerary" className="scroll-mt-32 rounded-3xl bg-white p-8 sm:p-12 shadow-sm border border-stone-100">
                            <div className="mb-8 flex items-center gap-4">
                                <h2 className="font-serif text-3xl font-medium text-brand-950">Daily Itinerary</h2>
                                <div className="h-px flex-1 bg-brand-100" />
                            </div>

                            <div
                                className="prose prose-lg prose-stone max-w-none hover:prose-a:text-brand-700 prose-headings:font-serif prose-headings:font-medium prose-headings:text-2xl prose-headings:text-brand-900 prose-p:leading-relaxed prose-li:marker:text-gold-500"
                                dangerouslySetInnerHTML={{
                                    __html: pkg.itinerary || "<p class='italic text-stone-500'>Please contact us for the day-by-day breakdown of this premium package.</p>"
                                }}
                            />
                        </div>

                        {/* Package Details (Inclusions/Exclusions) */}
                        <div id="details" className="scroll-mt-32">
                            <h2 className="mb-6 font-serif text-3xl font-medium text-brand-950">Package Details</h2>
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="rounded-3xl bg-brand-50 p-8 border border-brand-100 h-full">
                                    <h3 className="mb-6 flex items-center gap-3 font-serif text-2xl font-medium text-brand-900 border-b border-brand-200/50 pb-4">
                                        <CheckCircle2 className="h-6 w-6 text-brand-600" /> What's Included
                                    </h3>
                                    {pkg.inclusions ? (
                                        <div
                                            className="prose prose-sm prose-stone max-w-none prose-ul:pl-0 prose-li:flex prose-li:items-start prose-li:gap-3 prose-li:before:content-['✓'] prose-li:before:text-brand-600 prose-li:before:font-bold prose-li:before:-ml-4 prose-ul:list-image-none"
                                            dangerouslySetInnerHTML={{ __html: pkg.inclusions }}
                                        />
                                    ) : (
                                        <ul className="space-y-4 text-stone-700">
                                            <li className="flex gap-3"><CheckCircle2 className="h-5 w-5 text-brand-600 shrink-0" /> Premium Acclamations</li>
                                            <li className="flex gap-3"><CheckCircle2 className="h-5 w-5 text-brand-600 shrink-0" /> Daily Breakfast & Select Meals</li>
                                            <li className="flex gap-3"><CheckCircle2 className="h-5 w-5 text-brand-600 shrink-0" /> Airport Transfers</li>
                                            <li className="flex gap-3"><CheckCircle2 className="h-5 w-5 text-brand-600 shrink-0" /> Local Guided Tours</li>
                                        </ul>
                                    )}
                                </div>

                                <div className="rounded-3xl bg-stone-50 p-8 border border-stone-200 h-full">
                                    <h3 className="mb-6 flex items-center gap-3 font-serif text-2xl font-medium text-stone-900 border-b border-stone-200 pb-4">
                                        <ArrowRight className="h-6 w-6 text-stone-400" /> What's Excluded
                                    </h3>
                                    {pkg.exclusions ? (
                                        <div
                                            className="prose prose-sm prose-stone max-w-none prose-ul:pl-0 prose-li:flex prose-li:items-start prose-li:gap-3 prose-li:before:content-['-'] prose-li:before:text-stone-400 prose-li:before:font-bold prose-li:before:-ml-4 prose-ul:list-image-none"
                                            dangerouslySetInnerHTML={{ __html: pkg.exclusions }}
                                        />
                                    ) : (
                                        <ul className="space-y-4 text-stone-600">
                                            <li className="flex gap-3"><ArrowRight className="h-5 w-5 text-stone-400 shrink-0" /> International Flights</li>
                                            <li className="flex gap-3"><ArrowRight className="h-5 w-5 text-stone-400 shrink-0" /> Visa Fees</li>
                                            <li className="flex gap-3"><ArrowRight className="h-5 w-5 text-stone-400 shrink-0" /> Personal Expenses</li>
                                            <li className="flex gap-3"><ArrowRight className="h-5 w-5 text-stone-400 shrink-0" /> Travel Insurance</li>
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Customise Lead Form */}
                        <div id="customise" className="scroll-mt-32 rounded-[2.5rem] bg-brand-950 p-10 sm:p-14 text-white border border-brand-900 relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 right-0 -m-16 h-64 w-64 rounded-full bg-gold-500/10 blur-[80px]" />
                            <div className="absolute bottom-0 left-0 -m-16 h-64 w-64 rounded-full bg-emerald-500/20 blur-[80px]" />
                            <div className="relative z-10">
                                <h3 className="mb-4 font-serif text-4xl font-medium">Bespoke Adjustments</h3>
                                <p className="mb-10 text-stone-300 font-light text-lg max-w-xl">
                                    Every journey is unique. Connect with our experts to add premium transfers, extend your stay, or secure exclusive upgrades for the {pkg.title}.
                                </p>
                                <LeadForm prefilledPackage={pkg.title} />
                            </div>
                        </div>

                    </div>

                    {/* Sticky Sidebar (Right) */}
                    <div className="lg:col-span-4 w-full relative lg:sticky lg:top-[120px] self-start">
                        <aside className="overflow-hidden rounded-[2.5rem] bg-white border border-stone-200 shadow-xl shadow-stone-200/50">

                            {/* Header */}
                            <div className="bg-brand-950 p-10 text-center text-white relative">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-800 to-transparent opacity-40" />
                                <div className="relative z-10">
                                    <p className="text-xs font-bold uppercase tracking-widest text-gold-400 mb-3">Starting Price</p>
                                    <div className="flex flex-col items-center justify-center gap-1 mb-2">
                                        <span className="font-serif text-5xl font-medium tracking-tight">
                                            {pkg.price ? `₹${Number(pkg.price).toLocaleString("en-IN")}` : "On Request"}
                                        </span>
                                    </div>
                                    <p className="text-sm text-brand-100/70">{pkg.price ? "per person (taxes extra)" : "Contact for custom quote"}</p>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="p-8">
                                <ul className="mb-10 space-y-5 text-stone-600">
                                    <li className="flex items-start gap-4">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-brand-700 shrink-0">
                                            <Clock className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-wider text-brand-900 mb-0.5">Duration</p>
                                            <p className="text-sm leading-snug">{pkg.duration_nights} Nights / {pkg.duration_days} Days</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-brand-700 shrink-0">
                                            <MapPin className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-wider text-brand-900 mb-0.5">Destinations</p>
                                            <p className="text-sm leading-snug">{pkg.destinations?.join(", ") || "Multiple Cities"}</p>
                                        </div>
                                    </li>
                                </ul>

                                <a href="tel:+919876543210" className="btn-gold w-full py-4 text-base mb-4 shadow-lg shadow-gold-500/20">
                                    <Smartphone className="h-5 w-5 mr-1" /> Call to Book
                                </a>
                                <a href="#customise" className="btn-outline w-full py-4 text-base">
                                    Request a Callback
                                </a>
                            </div>

                            {/* Booking Support */}
                            <div className="bg-stone-50 p-8 text-center text-sm text-stone-600">
                                <Shield className="mx-auto mb-3 h-6 w-6 text-brand-400" />
                                <strong className="block text-brand-950">Secure & Protected</strong>
                                Book with confidence. We are a verified premium travel agency.
                            </div>
                        </aside>
                    </div>
                </div>
            </section>
        </main>
    );
}
