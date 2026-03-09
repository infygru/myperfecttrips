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
          SECTION 2: CONTENT & SIDEBAR
          ────────────────────────────────────────────────────────── */}
            <section className="container-inner -mt-8 relative z-20">
                <div className="flex flex-col gap-10 lg:flex-row">

                    {/* Main Content (Left) */}
                    <div className="flex-1 space-y-12 rounded-[2.5rem] bg-white p-8 sm:p-12 shadow-sm border border-stone-200">

                        {/* Itinerary */}
                        <div>
                            <div className="mb-8 flex items-center gap-4">
                                <h2 className="font-serif text-3xl font-medium text-brand-950">Detailed Itinerary</h2>
                                <div className="h-px flex-1 bg-stone-100" />
                            </div>

                            <div
                                className="prose prose-lg prose-stone max-w-none hover:prose-a:text-brand-700 prose-headings:font-serif prose-headings:font-medium prose-p:leading-relaxed prose-li:marker:text-gold-500"
                                dangerouslySetInnerHTML={{
                                    __html: pkg.itinerary || "<p class='italic text-stone-500'>Please contact us for the day-by-day breakdown of this premium package.</p>"
                                }}
                            />
                        </div>

                        {/* Inclusions & Exclusions */}
                        {(pkg.inclusions || pkg.exclusions) && (
                            <div>
                                <div className="mb-8 flex items-center gap-4">
                                    <h2 className="font-serif text-3xl font-medium text-brand-950">What&apos;s Included</h2>
                                    <div className="h-px flex-1 bg-stone-100" />
                                </div>

                                <div className="grid gap-6 md:grid-cols-2">
                                    {pkg.inclusions && (
                                        <div className="rounded-3xl bg-brand-50 p-8 border border-brand-100">
                                            <h3 className="mb-4 flex items-center gap-2 font-serif text-xl font-medium text-brand-900">
                                                <CheckCircle2 className="h-5 w-5 text-brand-600" /> Inclusions
                                            </h3>
                                            <div
                                                className="prose prose-sm prose-stone max-w-none prose-ul:pl-0 prose-li:flex prose-li:items-start prose-li:gap-2 prose-li:before:content-['✓'] prose-li:before:text-brand-600"
                                                dangerouslySetInnerHTML={{ __html: pkg.inclusions }}
                                            />
                                        </div>
                                    )}
                                    {pkg.exclusions && (
                                        <div className="rounded-3xl bg-stone-50 p-8 border border-stone-200">
                                            <h3 className="mb-4 flex items-center gap-2 font-serif text-xl font-medium text-stone-900">
                                                <ArrowRight className="h-5 w-5 text-stone-400" /> Exclusions
                                            </h3>
                                            <div
                                                className="prose prose-sm prose-stone max-w-none prose-ul:pl-0 prose-li:flex prose-li:items-start prose-li:gap-2 prose-li:before:content-['-'] prose-li:before:text-stone-400"
                                                dangerouslySetInnerHTML={{ __html: pkg.exclusions }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Customise Lead Form */}
                        <div className="rounded-3xl bg-brand-950 p-8 sm:p-12 text-white border border-brand-900 relative overflow-hidden">
                            <div className="absolute top-0 right-0 -m-16 h-48 w-48 rounded-full bg-gold-500/10 blur-2xl" />
                            <div className="relative z-10">
                                <h3 className="mb-2 font-serif text-3xl font-medium">Tailor this Journey</h3>
                                <p className="mb-10 text-stone-400 font-light max-w-lg">
                                    Want to upgrade your stay, add private transfers, or extend your trip? Request a custom quote below.
                                </p>
                                <LeadForm prefilledPackage={pkg.title} />
                            </div>
                        </div>

                    </div>

                    {/* Sticky Sidebar (Right) */}
                    <aside className="hidden w-full lg:block lg:w-[340px] shrink-0">
                        <div className="sticky top-28 overflow-hidden rounded-[2.5rem] bg-white border border-stone-200 shadow-xl shadow-stone-200/50">

                            {/* Header */}
                            <div className="bg-brand-950 p-8 text-center text-white relative">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-800 to-transparent opacity-40" />
                                <div className="relative z-10">
                                    <p className="text-xs font-bold uppercase tracking-widest text-gold-400 mb-2">Pricing</p>
                                    <div className="flex items-center justify-center gap-2 mb-1">
                                        <span className="font-serif text-5xl font-medium tracking-tight">
                                            {pkg.price ? `₹${Number(pkg.price).toLocaleString("en-IN")}` : "On Request"}
                                        </span>
                                    </div>
                                    {pkg.price && <p className="text-sm text-brand-100/70">per person</p>}
                                </div>
                            </div>

                            {/* Body */}
                            <div className="p-8">
                                <ul className="mb-8 space-y-4 text-sm font-medium text-stone-600">
                                    {["Premium vetted accommodations", "Dedicated trip manager", "24/7 on-trip assistance", "Seamless transfers"].map((text) => (
                                        <li key={text} className="flex items-start gap-3">
                                            <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-600" />
                                            <span className="leading-snug">{text}</span>
                                        </li>
                                    ))}
                                </ul>

                                <a href="tel:+919876543210" className="btn-gold w-full py-4 text-base mb-4">
                                    <Smartphone className="h-5 w-5 mr-1" /> Speak to an Expert
                                </a>
                                <Link href="#contact-form" className="btn-outline w-full py-4 text-base">
                                    Request Callback
                                </Link>
                            </div>

                            {/* Trust Footer */}
                            <div className="bg-stone-50 border-t border-stone-100 p-6 flex items-center justify-center gap-3">
                                <Shield className="h-5 w-5 text-brand-700" />
                                <span className="text-xs font-bold uppercase tracking-widest text-brand-900">Secure & Protected</span>
                            </div>

                        </div>
                    </aside>

                </div>
            </section>
        </main>
    );
}
