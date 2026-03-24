import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import type { Metadata } from "next";
import {
    ArrowRight, CheckCircle2, Phone, Star, Shield, Clock, Award, ChevronRight,
    Zap, Globe, TrendingUp
} from "lucide-react";
import { servicesList } from "@/lib/servicesData";
import CountUpNumber from "@/components/CountUpNumber";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Travel Services in Chennai & India | Corporate MICE, Visa, Group & Holiday Planning | My Perfect Trips",
    description: "My Perfect Trips offers complete travel services in India — Corporate MICE events, group travel bookings, visa assistance, college tours, corporate travel packages, and bespoke luxury holiday planning. Best travel agency in Chennai.",
    keywords: "travel services India, corporate MICE Chennai, group travel India, visa assistance Chennai, bespoke holiday planning India, travel agency Chennai, holiday packages India, corporate travel management",
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "https://myperfecttrips.com"}/services`,
    },
    openGraph: {
        title: "Travel Services | My Perfect Trips — Corporate MICE, Visa & Holiday Planning",
        description: "Complete travel services from India's leading travel agency — corporate events, group tours, visa processing, and luxury holidays.",
        url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://myperfecttrips.com"}/services`,
        type: "website",
    },
};

const stats = [
    { end: 15, suffix: "+", label: "Years of Excellence" },
    { end: 10000, suffix: "+", label: "Happy Travellers" },
    { end: 500, suffix: "+", label: "Corporate Clients" },
    { end: 50, suffix: "+", label: "Global Destinations" },
];

const whyUs = [
    { Icon: Shield, title: "End-to-End Ownership", desc: "We take complete responsibility — from first consultation to safe return, every detail managed." },
    { Icon: Clock, title: "24/7 Support", desc: "Round-the-clock dedicated helpline for every traveller. We're always a call or message away." },
    { Icon: Star, title: "Curated Quality", desc: "Every vendor, hotel, and experience is personally vetted. No compromise on quality." },
    { Icon: Award, title: "Transparent Pricing", desc: "No hidden fees, clear breakdowns, and best-price assurance across all services." },
    { Icon: Zap, title: "Expert Team", desc: "15+ years of travel expertise across destinations, logistics, and event management." },
    { Icon: Globe, title: "Global Network", desc: "Deep partnerships with airlines, hotels, and operators in 50+ countries worldwide." },
];

const bookingProcess = [
    { n: "01", title: "Reach Out", desc: "Share your requirement via our form, WhatsApp, or a direct call. We respond within the hour." },
    { n: "02", title: "Expert Consultation", desc: "A dedicated specialist listens, understands your needs, and assesses the best solution." },
    { n: "03", title: "Custom Proposal", desc: "Receive a detailed, fully-costed proposal within 24 hours — no commitment required." },
    { n: "04", title: "Travel with Confidence", desc: "Confirm your booking and travel knowing our team supports you every step of the way." },
];

export default async function ServicesPage() {
    noStore();

    return (
        <main className="min-h-screen overflow-hidden">

            {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
            <section className="relative bg-[#020617] overflow-hidden min-h-[92vh] flex items-center">

                {/* Animated background orbs */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="animate-pulse-glow absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-sky-500/8 blur-[120px]" />
                    <div className="animate-pulse-glow2 absolute top-1/3 right-0 h-[400px] w-[400px] rounded-full bg-violet-500/10 blur-[100px]" />
                    <div className="animate-pulse-glow absolute bottom-0 left-1/3 h-[300px] w-[300px] rounded-full bg-sky-400/6 blur-[80px]" />
                    {/* Grid pattern */}
                    <div
                        className="absolute inset-0 opacity-[0.025]"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='white' stroke-width='0.5'/%3E%3C/svg%3E")`,
                        }}
                    />
                </div>

                <div className="container-inner relative z-10 py-24 lg:py-32">
                    <div className="grid lg:grid-cols-[1fr_480px] gap-16 items-center">

                        {/* LEFT — headline + CTAs */}
                        <div>
                            <div className="hero-anim-1 inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-sky-400 mb-6">
                                <TrendingUp className="h-3.5 w-3.5" />
                                15+ Years of Trusted Travel Services
                            </div>

                            <h1 className="hero-anim-2 font-serif font-medium text-white leading-[1.05] tracking-tight mb-6">
                                <span className="block text-4xl sm:text-5xl lg:text-6xl">Premium Travel</span>
                                <span className="block text-4xl sm:text-5xl lg:text-6xl">
                                    Services{" "}
                                    <em
                                        className="not-italic animate-gradient"
                                        style={{
                                            background: "linear-gradient(90deg, #fbbf24, #0ea5e9, #a855f7, #fbbf24)",
                                            backgroundSize: "200% auto",
                                            WebkitBackgroundClip: "text",
                                            WebkitTextFillColor: "transparent",
                                        }}
                                    >
                                        Built for You
                                    </em>
                                </span>
                            </h1>

                            <p className="hero-anim-3 text-slate-400 text-lg leading-relaxed max-w-xl mb-8">
                                From corporate MICE and group bookings to visa facilitation and bespoke luxury holidays — My Perfect Trips is your single trusted partner for extraordinary travel.
                            </p>

                            <div className="hero-anim-4 flex flex-wrap gap-3 mb-12">
                                <Link href="/contact" className="btn-gold text-sm">
                                    Free Consultation
                                </Link>
                                <a
                                    href="#services"
                                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:border-white/30 transition-all"
                                >
                                    Explore Services <ChevronRight className="h-4 w-4" />
                                </a>
                            </div>

                            {/* Inline trust badges */}
                            <div className="hero-anim-5 flex flex-wrap items-center gap-5 border-t border-white/10 pt-8">
                                {[
                                    { icon: Shield, label: "100% Safe & Verified" },
                                    { icon: Star, label: "Premium Quality" },
                                    { icon: Phone, label: "24/7 Support" },
                                ].map(({ icon: Icon, label }) => (
                                    <div key={label} className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                                        <Icon className="h-3.5 w-3.5 text-gold-400" />
                                        {label}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT — service tile grid */}
                        <div className="hero-anim-right grid grid-cols-2 gap-3">
                            {servicesList.map((svc, i) => (
                                <Link
                                    key={svc.slug}
                                    href={`/services/${svc.slug}`}
                                    className="group relative rounded-2xl border border-white/8 p-5 transition-all duration-300 hover:border-white/20 hover:-translate-y-1"
                                    style={{
                                        background: `linear-gradient(135deg, rgba(${svc.accentColor.rgb},0.12) 0%, rgba(255,255,255,0.03) 100%)`,
                                        animationDelay: `${i * 80}ms`,
                                    }}
                                >
                                    <div
                                        className="flex h-10 w-10 items-center justify-center rounded-xl mb-4 transition-transform duration-300 group-hover:scale-110"
                                        style={{ background: `rgba(${svc.accentColor.rgb},0.2)` }}
                                    >
                                        <svc.Icon className="h-5 w-5" style={{ color: svc.accentColor.hex }} />
                                    </div>
                                    <h3 className="text-sm font-bold text-white/90 leading-tight mb-1">
                                        {svc.title}
                                    </h3>
                                    <p className="text-[10px] text-slate-500 leading-snug line-clamp-2">{svc.tagline}</p>
                                    <ArrowRight
                                        className="absolute bottom-4 right-4 h-3.5 w-3.5 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5"
                                        style={{ color: svc.accentColor.hex }}
                                    />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom fade to next section */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-900 to-transparent" />
            </section>

            {/* ══ STATS ════════════════════════════════════════════════════════════ */}
            <section className="bg-slate-900 border-b border-white/5">
                <div className="container-inner">
                    <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/8">
                        {stats.map((s, i) => (
                            <div
                                key={s.label}
                                className="flex flex-col items-center py-10 px-6 text-center"
                                data-aos="fade-up"
                                data-aos-delay={String(i * 100)}
                            >
                                <span className="font-serif text-4xl sm:text-5xl font-bold text-white mb-2">
                                    <CountUpNumber end={s.end} suffix={s.suffix} />
                                </span>
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ SERVICES GRID ════════════════════════════════════════════════════ */}
            <section id="services" className="bg-[#F8F7F4] py-24">
                <div className="container-inner">
                    <div className="text-center mb-14" data-aos="fade-up">
                        <div className="inline-flex items-center gap-2 rounded-full bg-brand-950/5 border border-brand-950/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-700 mb-4">
                            What We Offer
                        </div>
                        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-brand-950">
                            A Service for <em className="not-italic text-gold-600">Every Journey</em>
                        </h2>
                        <p className="text-stone-500 text-base mt-3 max-w-xl mx-auto">
                            Six specialised services, each delivered with the same commitment to excellence and personal attention.
                        </p>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                        {servicesList.map((svc, i) => (
                            <Link
                                key={svc.slug}
                                href={`/services/${svc.slug}`}
                                className="svc-card-glow group flex flex-col rounded-2xl bg-white border border-stone-200 shadow-sm overflow-hidden hover-lift"
                                style={{ "--svc-accent": svc.accentColor.hex } as React.CSSProperties}
                                data-aos="fade-up"
                                data-aos-delay={String((i % 3) * 100)}
                            >
                                {/* Colored top strip */}
                                <div
                                    className="relative overflow-hidden px-6 pt-7 pb-6"
                                    style={{ background: `linear-gradient(135deg, #020617 0%, #0f172a 100%)` }}
                                >
                                    <div
                                        className="absolute inset-0 opacity-20"
                                        style={{ background: `radial-gradient(circle at 100% 0%, ${svc.accentColor.hex} 0%, transparent 60%)` }}
                                    />
                                    <div
                                        className="relative z-10 flex h-11 w-11 items-center justify-center rounded-xl mb-4 transition-transform duration-300 group-hover:scale-110"
                                        style={{ background: `rgba(${svc.accentColor.rgb},0.2)`, border: `1px solid rgba(${svc.accentColor.rgb},0.4)` }}
                                    >
                                        <svc.Icon className="h-5 w-5" style={{ color: svc.accentColor.hex }} />
                                    </div>
                                    <h3 className="relative z-10 font-serif text-xl font-medium text-white leading-tight mb-1">{svc.title}</h3>
                                    <p className="relative z-10 text-[10px] font-bold uppercase tracking-widest" style={{ color: `${svc.accentColor.hex}99` }}>
                                        {svc.tagline}
                                    </p>
                                </div>

                                {/* Body */}
                                <div className="flex flex-col flex-1 p-6 relative z-[1]">
                                    <p className="text-stone-600 text-sm leading-relaxed mb-5">{svc.shortDesc}</p>

                                    <ul className="space-y-2 mb-6">
                                        {svc.features.slice(0, 3).map((f) => (
                                            <li key={f.title} className="flex items-start gap-2 text-xs text-stone-500">
                                                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{ color: svc.accentColor.hex }} />
                                                <span>{f.title}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="mt-auto flex items-center gap-2 text-sm font-bold transition-colors duration-200" style={{ color: svc.accentColor.hex }}>
                                        Explore Service
                                        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ WHY US ═══════════════════════════════════════════════════════════ */}
            <section className="bg-white border-y border-stone-100 py-24 overflow-hidden">
                <div className="container-inner">
                    <div className="grid lg:grid-cols-[420px_1fr] gap-16 items-center">
                        {/* Left — statement */}
                        <div data-aos="fade-right">
                            <div className="inline-flex items-center gap-2 rounded-full bg-brand-950/5 border border-brand-950/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-700 mb-5">
                                Why My Perfect Trips
                            </div>
                            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-brand-950 leading-tight mb-6">
                                The Difference Is in the Details
                            </h2>
                            <p className="text-stone-500 leading-relaxed mb-8">
                                With 15 years of operational excellence and a pan-India network, we deliver experiences that consistently exceed expectations. Every traveller is treated like a VIP — from the first enquiry to safe return.
                            </p>
                            <Link href="/about" className="inline-flex items-center gap-2 text-sm font-bold text-brand-950 hover-underline">
                                Learn About Us <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>

                        {/* Right — features */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            {whyUs.map((item, i) => (
                                <div
                                    key={item.title}
                                    className="flex gap-4 p-5 rounded-2xl border border-stone-100 hover:border-stone-200 hover:bg-stone-50 transition-all duration-300"
                                    data-aos="zoom-in"
                                    data-aos-delay={String((i % 2) * 100 + Math.floor(i / 2) * 80)}
                                >
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-950 text-white">
                                        <item.Icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-brand-950 text-sm mb-1">{item.title}</h3>
                                        <p className="text-stone-500 text-xs leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ══ PROCESS ══════════════════════════════════════════════════════════ */}
            <section className="bg-[#F8F7F4] py-24">
                <div className="container-inner">
                    <div className="text-center mb-14" data-aos="fade-up">
                        <div className="inline-flex items-center gap-2 rounded-full bg-brand-950/5 border border-brand-950/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-700 mb-4">
                            How It Works
                        </div>
                        <h2 className="font-serif text-3xl sm:text-4xl font-medium text-brand-950">
                            From Enquiry to Experience
                        </h2>
                    </div>

                    {/* Timeline */}
                    <div className="relative">
                        {/* Connecting line */}
                        <div className="absolute top-[52px] left-[calc(12.5%)] right-[calc(12.5%)] h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent hidden lg:block" />

                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {bookingProcess.map((step, i) => (
                                <div
                                    key={step.n}
                                    className="relative flex flex-col items-center text-center lg:items-start lg:text-left"
                                    data-aos="fade-up"
                                    data-aos-delay={String(i * 120)}
                                >
                                    <div className="relative z-10 flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-brand-950 text-white font-black text-sm mb-5 shadow-lg shadow-brand-950/20">
                                        {step.n}
                                        <div className="absolute -inset-1 rounded-2xl bg-brand-950/20 blur-sm -z-10" />
                                    </div>
                                    <h3 className="font-semibold text-brand-950 mb-2">{step.title}</h3>
                                    <p className="text-stone-500 text-sm leading-relaxed">{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ══ CTA STRIP ════════════════════════════════════════════════════════ */}
            <section className="relative bg-[#020617] py-20 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/4 h-64 w-96 rounded-full bg-gold-400/8 blur-[80px] animate-pulse-glow" />
                    <div className="absolute bottom-0 right-1/4 h-48 w-64 rounded-full bg-sky-500/8 blur-[60px] animate-pulse-glow2" />
                </div>
                <div className="container-inner relative z-10">
                    <div className="max-w-3xl mx-auto text-center" data-aos="fade-up">
                        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-white mb-4">
                            Ready to plan your <em className="not-italic text-gold-400">next journey?</em>
                        </h2>
                        <p className="text-slate-400 text-base mb-8 max-w-xl mx-auto">
                            Speak with a dedicated travel expert and receive a custom proposal within 24 hours. No commitment required.
                        </p>
                        <div className="flex flex-wrap gap-3 justify-center">
                            <Link href="/contact" className="btn-gold text-sm">
                                Free Expert Consultation
                            </Link>
                            <a
                                href="https://wa.me/918807709919"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-all"
                            >
                                WhatsApp Us Directly
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══ FAQ ══════════════════════════════════════════════════════════════ */}
            <section className="bg-white py-24">
                <div className="container-inner max-w-4xl">
                    <div className="text-center mb-12" data-aos="fade-up">
                        <div className="inline-flex items-center gap-2 rounded-full bg-brand-950/5 border border-brand-950/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-700 mb-4">
                            Common Questions
                        </div>
                        <h2 className="font-serif text-3xl sm:text-4xl font-medium text-brand-950">Services FAQ</h2>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2" data-aos="fade-up" data-aos-delay="100">
                        {[
                            { q: "What destinations do you specialise in?", a: "Domestically: Andaman, Kashmir, Kerala, Goa, Rajasthan. Internationally: UAE, Maldives, Thailand, Bali, Singapore, Europe, and the UK, among many others." },
                            { q: "Do you offer group discounts for college or corporate tours?", a: "Yes. We hold volume contracts with airlines and hotel chains, securing subsidised B2B group rates for educational and corporate travel." },
                            { q: "Can MyPerfectTrips assist with travel insurance?", a: "Absolutely. Travel insurance is a core part of our offering — covering medical emergencies, trip cancellations, and baggage delays." },
                            { q: "How early should we start planning an international holiday?", a: "For visa-required destinations (Europe, US, UK), plan 3–4 months ahead. For visa-on-arrival or domestic trips, 1–2 months is sufficient for best rates." },
                            { q: "Do you have a B2B partner program?", a: "Yes. We have a dedicated B2B desk for travel agents and corporate travel bookers. Contact us for partnership rates and commission structures." },
                            { q: "What is the booking process?", a: "Enquire → receive a custom proposal within 24h → review & refine → confirm with advance payment → travel. Simple and transparent throughout." },
                        ].map((faq, i) => (
                            <details key={i} className="group rounded-2xl border border-stone-100 bg-stone-50/70 overflow-hidden hover:bg-stone-50 transition-colors">
                                <summary className="flex cursor-pointer items-start justify-between gap-4 p-5 font-semibold text-brand-950 text-sm list-none">
                                    {faq.q}
                                    <ChevronRight className="h-4 w-4 text-stone-400 shrink-0 mt-0.5 transition-transform duration-300 group-open:rotate-90" />
                                </summary>
                                <div className="px-5 pb-5 pt-2 text-sm text-stone-500 leading-relaxed border-t border-stone-100">
                                    {faq.a}
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

        </main>
    );
}
