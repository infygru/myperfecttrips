import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, CheckCircle2, ChevronRight, ArrowRight, Phone } from "lucide-react";
import { servicesList, getServiceBySlug } from "@/lib/servicesData";
import ServiceLeadForm from "@/components/ServiceLeadForm";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
    return servicesList.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
    const { slug } = await props.params;
    const svc = getServiceBySlug(slug);
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://myperfecttrips.com";
    if (!svc) return { title: "Service Not Found | My Perfect Trips" };
    return {
        title: `${svc.title} in India | My Perfect Trips — ${svc.tagline}`,
        description: svc.seoDescription,
        keywords: svc.seoKeywords.join(", "),
        alternates: { canonical: `${baseUrl}/services/${slug}` },
        openGraph: {
            title: `${svc.title} | My Perfect Trips`,
            description: svc.seoDescription,
            url: `${baseUrl}/services/${slug}`,
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: `${svc.title} | My Perfect Trips`,
            description: svc.seoDescription,
        },
    };
}

export default async function ServiceDetailPage(props: Props) {
    const { slug } = await props.params;
    const svc = getServiceBySlug(slug);
    if (!svc) return notFound();

    const relatedServices = servicesList.filter((s) => svc.relatedSlugs.includes(s.slug));
    const accent = svc.accentColor;

    return (
        <main className="min-h-screen bg-[#F8F7F4]">

            {/* ══ HERO ════════════════════════════════════════════════════════ */}
            <section className="relative overflow-hidden" style={{ background: "#020617" }}>
                {/* Glow orbs */}
                <div className="absolute inset-0 pointer-events-none">
                    <div
                        className="absolute -top-24 -right-24 h-[480px] w-[480px] rounded-full blur-[120px] animate-pulse-glow opacity-30"
                        style={{ background: accent.hex }}
                    />
                    <div
                        className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full blur-[80px] animate-pulse-glow2 opacity-15"
                        style={{ background: accent.hex }}
                    />
                    <div
                        className="absolute inset-0 opacity-[0.02]"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='white' stroke-width='0.5'/%3E%3C/svg%3E")`,
                        }}
                    />
                </div>

                <div className="container-inner relative z-10 pt-24 pb-16">
                    {/* Breadcrumb */}
                    <nav className="hero-anim-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/30 mb-8">
                        <Link href="/services" className="hover:text-white/60 transition-colors hover-underline">Services</Link>
                        <ChevronRight className="h-3 w-3" />
                        <span style={{ color: accent.hex }}>{svc.title}</span>
                    </nav>

                    <div className="grid lg:grid-cols-[1fr_420px] gap-14 items-start">
                        <div>
                            {/* Icon + badge row */}
                            <div className="hero-anim-2 flex items-center gap-4 mb-6">
                                <div
                                    className="flex h-16 w-16 items-center justify-center rounded-2xl animate-float"
                                    style={{ background: `rgba(${accent.rgb},0.15)`, border: `1px solid rgba(${accent.rgb},0.4)` }}
                                >
                                    <svc.Icon className="h-8 w-8" style={{ color: accent.hex }} />
                                </div>
                                {svc.isCorporate && (
                                    <span className="rounded-full border border-white/20 bg-white/8 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/50">
                                        Corporate Service
                                    </span>
                                )}
                            </div>

                            <h1 className="hero-anim-3 font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-white leading-tight mb-3">
                                {svc.title}
                            </h1>
                            <p className="hero-anim-3 text-sm font-bold uppercase tracking-widest mb-5" style={{ color: `${accent.hex}cc` }}>
                                {svc.tagline}
                            </p>
                            <p className="hero-anim-4 text-slate-300 text-base leading-relaxed max-w-xl mb-8">{svc.shortDesc}</p>

                            <div className="hero-anim-5 flex flex-wrap gap-3">
                                <a href="#enquire" className="btn-gold text-sm">
                                    Get a Free Quote
                                </a>
                                <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 transition-all">
                                    Talk to an Expert
                                </Link>
                            </div>

                            {/* SEO keyword chips */}
                            <div className="hero-anim-5 flex flex-wrap gap-2 mt-6 opacity-50">
                                {svc.seoKeywords.slice(0, 4).map((kw) => (
                                    <span key={kw} className="rounded-full border border-white/10 px-2.5 py-0.5 text-[9px] text-white/40 font-medium">{kw}</span>
                                ))}
                            </div>
                        </div>

                        {/* Form — desktop in hero */}
                        <div id="enquire" className="hidden lg:block hero-anim-right">
                            <div className="rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm p-6">
                                <h3 className="font-serif text-xl font-medium text-white mb-1">Request a Free Quote</h3>
                                <p className="text-slate-500 text-xs mb-5">We respond within 24 hours</p>
                                <ServiceLeadForm serviceType={svc.title} isCorporate={svc.isCorporate} darkMode />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══ CONTENT ═════════════════════════════════════════════════════ */}
            <div className="container-inner py-14">
                <div className="grid lg:grid-cols-[1fr_360px] gap-12 items-start">

                    {/* LEFT */}
                    <div className="space-y-14">

                        {/* Overview */}
                        <section data-aos="fade-up">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="h-0.5 w-8 rounded-full" style={{ background: accent.hex }} />
                                <h2 className="font-serif text-2xl font-medium text-brand-950">About This Service</h2>
                            </div>
                            <p className="text-stone-600 leading-[1.9] text-[17px]">{svc.overview}</p>
                        </section>

                        {/* Features */}
                        <section>
                            <div className="flex items-center gap-3 mb-6" data-aos="fade-up">
                                <div className="h-0.5 w-8 rounded-full" style={{ background: accent.hex }} />
                                <h2 className="font-serif text-2xl font-medium text-brand-950">What We Offer</h2>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                                {svc.features.map((f, i) => (
                                    <div
                                        key={f.title}
                                        className="rounded-xl border border-stone-200 bg-white p-5 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
                                        data-aos="zoom-in"
                                        data-aos-delay={String((i % 2) * 80)}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: `rgba(${accent.rgb},0.12)` }}>
                                                <CheckCircle2 className="h-4 w-4" style={{ color: accent.hex }} />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-brand-950 text-sm mb-1">{f.title}</h3>
                                                <p className="text-stone-500 text-sm leading-relaxed">{f.desc}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Process */}
                        <section data-aos="fade-up">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-0.5 w-8 rounded-full" style={{ background: accent.hex }} />
                                <h2 className="font-serif text-2xl font-medium text-brand-950">Our Process</h2>
                            </div>
                            <div className="relative pl-8">
                                {/* Vertical line */}
                                <div className="absolute left-4 top-0 bottom-0 w-px bg-stone-200" />
                                <div className="space-y-6">
                                    {svc.process.map((step, i) => (
                                        <div
                                            key={step.title}
                                            className="relative bg-white rounded-xl border border-stone-100 p-5 shadow-sm"
                                            data-aos="fade-left"
                                            data-aos-delay={String(i * 100)}
                                        >
                                            {/* Circle on line */}
                                            <div
                                                className="absolute -left-[18px] top-5 flex h-8 w-8 items-center justify-center rounded-full text-white text-xs font-black shadow-sm"
                                                style={{ background: accent.hex }}
                                            >
                                                {i + 1}
                                            </div>
                                            <h3 className="font-semibold text-brand-950 mb-1">{step.title}</h3>
                                            <p className="text-stone-500 text-sm leading-relaxed">{step.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* For Whom */}
                        <section data-aos="fade-up">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-0.5 w-8 rounded-full" style={{ background: accent.hex }} />
                                <h2 className="font-serif text-2xl font-medium text-brand-950">Who Is This For</h2>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-3">
                                {svc.forWhom.map((fw, i) => (
                                    <div
                                        key={fw.label}
                                        className="rounded-xl bg-white border border-stone-200 p-5 hover:shadow-sm transition-all"
                                        data-aos="scale-up"
                                        data-aos-delay={String(i * 80)}
                                    >
                                        <div className="h-1 w-8 rounded-full mb-4" style={{ background: accent.hex }} />
                                        <h3 className="font-semibold text-brand-950 text-sm mb-2">{fw.label}</h3>
                                        <p className="text-stone-500 text-xs leading-relaxed">{fw.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* FAQs */}
                        <section data-aos="fade-up">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-0.5 w-8 rounded-full" style={{ background: accent.hex }} />
                                <h2 className="font-serif text-2xl font-medium text-brand-950">Frequently Asked Questions</h2>
                            </div>
                            <div className="space-y-3">
                                {svc.faqs.map((faq, i) => (
                                    <details
                                        key={i}
                                        className="group rounded-xl border border-stone-200 bg-white overflow-hidden hover:border-stone-300 transition-colors"
                                    >
                                        <summary className="flex cursor-pointer items-start justify-between gap-4 p-5 font-semibold text-brand-950 text-sm list-none hover:bg-stone-50 transition-colors">
                                            {faq.q}
                                            <ChevronRight className="h-4 w-4 text-stone-400 shrink-0 mt-0.5 transition-transform duration-300 group-open:rotate-90" />
                                        </summary>
                                        <div className="px-5 pb-5 pt-2 text-sm text-stone-500 leading-relaxed border-t border-stone-100">
                                            {faq.a}
                                        </div>
                                    </details>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* RIGHT — sticky sidebar */}
                    <div className="hidden lg:block sticky top-[90px] space-y-4">
                        {/* Lead form */}
                        <div className="rounded-2xl bg-white border border-stone-200 p-6 shadow-sm" data-aos="fade-left">
                            <h3 className="font-serif text-xl font-medium text-brand-950 mb-1">Request a Quote</h3>
                            <p className="text-stone-400 text-xs mb-5">Free consultation · 24-hour response</p>
                            <ServiceLeadForm serviceType={svc.title} isCorporate={svc.isCorporate} />
                        </div>

                        {/* Call card */}
                        <div
                            className="rounded-2xl p-5"
                            style={{ background: `rgba(${accent.rgb},0.06)`, border: `1px solid rgba(${accent.rgb},0.2)` }}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <Phone className="h-4 w-4" style={{ color: accent.hex }} />
                                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: accent.hex }}>Prefer to Call?</p>
                            </div>
                            <a
                                href="tel:+918807709919"
                                className="font-serif text-xl font-medium text-brand-950 hover:opacity-70 transition-opacity block mb-1"
                            >
                                +91 8807709919
                            </a>
                            <p className="text-stone-400 text-xs">Mon–Sat, 9 AM – 7 PM IST</p>
                        </div>
                    </div>
                </div>

                {/* Mobile form */}
                <div className="lg:hidden mt-14 bg-white rounded-2xl border border-stone-200 p-6 shadow-sm" id="enquire">
                    <h3 className="font-serif text-xl font-medium text-brand-950 mb-1">Request a Free Quote</h3>
                    <p className="text-stone-400 text-xs mb-5">Free consultation · 24-hour response</p>
                    <ServiceLeadForm serviceType={svc.title} isCorporate={svc.isCorporate} />
                </div>
            </div>

            {/* ══ RELATED ═════════════════════════════════════════════════════ */}
            {relatedServices.length > 0 && (
                <section className="border-t border-stone-200 bg-white py-14">
                    <div className="container-inner">
                        <div className="flex items-center justify-between mb-8" data-aos="fade-up">
                            <h2 className="font-serif text-2xl font-medium text-brand-950">Related Services</h2>
                            <Link href="/services" className="flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline">
                                All Services <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {relatedServices.map((rs, i) => (
                                <Link
                                    key={rs.slug}
                                    href={`/services/${rs.slug}`}
                                    className="group flex items-center gap-5 rounded-2xl border border-stone-200 bg-stone-50 p-5 hover:bg-white hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                                    data-aos="fade-up"
                                    data-aos-delay={String(i * 100)}
                                >
                                    <div
                                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                                        style={{ background: `rgba(${rs.accentColor.rgb},0.12)` }}
                                    >
                                        <rs.Icon className="h-6 w-6" style={{ color: rs.accentColor.hex }} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-brand-950 mb-0.5 group-hover:text-brand-700 transition-colors">{rs.title}</h3>
                                        <p className="text-stone-400 text-xs line-clamp-1">{rs.tagline}</p>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-stone-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-brand-600" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ══ CTA ═════════════════════════════════════════════════════════ */}
            <section className="relative overflow-hidden py-16" style={{ background: "#020617" }}>
                <div
                    className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{ background: `radial-gradient(ellipse at 50% 0%, ${accent.hex} 0%, transparent 60%)` }}
                />
                <div className="container-inner relative z-10 text-center" data-aos="fade-up">
                    <h2 className="font-serif text-2xl sm:text-3xl font-medium text-white mb-3">
                        Ready to get started?
                    </h2>
                    <p className="text-slate-400 text-sm mb-7 max-w-sm mx-auto">
                        Our {svc.title} experts are ready to craft the perfect solution for you.
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center">
                        <a href="#enquire" className="btn-gold text-sm">Get a Free Quote</a>
                        <Link
                            href="/services"
                            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" /> All Services
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
