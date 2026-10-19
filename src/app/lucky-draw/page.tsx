import type { Metadata } from 'next';
import Image from 'next/image';
import { Gift, Instagram, Share2, UserCheck, Trophy, Plane, Star, CheckCircle, ArrowDown } from 'lucide-react';
import LuckyDrawForm from '@/components/LuckyDrawForm';
import CountdownTimer from '@/components/CountdownTimer';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://myperfecttrips.com';

export const metadata: Metadata = {
    title: 'Win a FREE Trip for Two | Lucky Draw Giveaway – My Perfect Trips',
    description: 'Enter our FREE holiday lucky draw! Follow @myperfecttrips on Instagram, share our reel with 5 friends, and win a trip worth up to £3,000 to Dubai, Turkey, Paris, or Georgia. Winner announced 31 December 2026.',
    keywords: 'free trip giveaway UK, win free holiday, lucky draw 2026, My Perfect Trips giveaway, Dubai free trip, Paris giveaway, travel competition UK',
    alternates: { canonical: `${BASE}/lucky-draw` },
    openGraph: {
        title: 'Win a FREE Holiday for Two — My Perfect Trips Giveaway',
        description: 'Follow us, share our reel with 5 friends, and enter to win a holiday worth up to £3,000. Dubai · Turkey · Paris · Georgia.',
        url: `${BASE}/lucky-draw`,
        siteName: 'My Perfect Trips',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Win a FREE Holiday for Two — My Perfect Trips Giveaway',
        description: 'Enter our lucky draw and win a free holiday worth up to £3,000!',
    },
};

const DESTINATIONS = [
    {
        name: 'Dubai',
        subtitle: 'United Arab Emirates',
        flag: '🇦🇪',
        tagline: 'City of Gold',
        img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=900&q=85&fit=crop',
        highlights: ['Burj Khalifa', 'Desert Safari', '5-Star Luxury'],
        accent: 'from-amber-400/20 to-orange-600/60',
    },
    {
        name: 'Turkey',
        subtitle: 'Istanbul & Cappadocia',
        flag: '🇹🇷',
        tagline: 'Where East Meets West',
        img: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=900&q=85&fit=crop',
        highlights: ['Grand Bazaar', 'Hot Air Balloons', 'Ancient History'],
        accent: 'from-red-400/20 to-red-700/60',
    },
    {
        name: 'Paris',
        subtitle: 'France',
        flag: '🇫🇷',
        tagline: 'City of Light & Love',
        img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=900&q=85&fit=crop',
        highlights: ['Eiffel Tower', 'The Louvre', 'World-Class Cuisine'],
        accent: 'from-blue-400/20 to-indigo-700/60',
    },
    {
        name: 'Georgia',
        subtitle: 'Tbilisi & Kazbegi',
        flag: '🇬🇪',
        tagline: 'Jewel of the Caucasus',
        img: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?w=900&q=85&fit=crop',
        highlights: ['Ancient Monasteries', 'Mountain Villages', 'Fine Wine'],
        accent: 'from-emerald-400/20 to-emerald-700/60',
    },
];

const STEPS = [
    {
        Icon: Instagram,
        number: '01',
        title: 'Follow Us',
        detail: 'Follow @myperfecttrips on Instagram.',
        grad: 'from-pink-500 to-rose-600',
        shadow: 'shadow-rose-500/30',
    },
    {
        Icon: Share2,
        number: '02',
        title: 'Share the Reel',
        detail: 'Share our giveaway reel to your story or send it to 5 friends.',
        grad: 'from-violet-500 to-purple-600',
        shadow: 'shadow-purple-500/30',
    },
    {
        Icon: UserCheck,
        number: '03',
        title: 'Enter Below',
        detail: 'Fill in the form with your details and upload a screenshot as proof.',
        grad: 'from-sky-500 to-blue-600',
        shadow: 'shadow-blue-500/30',
    },
    {
        Icon: Trophy,
        number: '04',
        title: 'Win Your Trip!',
        detail: 'One lucky winner announced live on 31 December 2026.',
        grad: 'from-gold-400 to-amber-600',
        shadow: 'shadow-gold-500/30',
    },
];

const schema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'My Perfect Trips Free Holiday Lucky Draw 2026',
    description: 'Win a free trip for two to Dubai, Turkey, Paris, or Georgia worth up to £3,000.',
    startDate: '2026-10-20',
    endDate: '2026-12-31',
    organizer: { '@type': 'TravelAgency', name: 'My Perfect Trips', url: BASE },
    url: `${BASE}/lucky-draw`,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
};

export default function LuckyDrawPage() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

            {/* Marquee + misc keyframes */}
            <style>{`
                @keyframes ticker { from { transform: translateX(0) } to { transform: translateX(-50%) } }
                .ticker-track { animation: ticker 28s linear infinite; }
                .ticker-track:hover { animation-play-state: paused; }
            `}</style>

            {/* ══════════════════════════════════════════
                HERO
            ══════════════════════════════════════════ */}
            <section className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden bg-brand-950">

                {/* Background */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_110%,rgba(251,191,36,0.18),transparent)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_80%_10%,rgba(139,92,246,0.12),transparent)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_35%_at_10%_20%,rgba(59,130,246,0.10),transparent)]" />
                    <div className="absolute inset-0 opacity-[0.03]"
                        style={{ backgroundImage: 'radial-gradient(circle, #fbbf24 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
                </div>

                {/* Orbs */}
                <div className="absolute top-1/4 left-1/6 h-56 w-56 sm:h-80 sm:w-80 rounded-full bg-gold-400/8 blur-[80px] sm:blur-[100px] animate-float pointer-events-none" />
                <div className="absolute bottom-1/4 right-1/6 h-48 w-48 sm:h-64 sm:w-64 rounded-full bg-violet-500/8 blur-[60px] sm:blur-[80px] animate-float-2 pointer-events-none" />

                {/* Decorative plane — hidden on very small screens */}
                <div className="hidden xs:block absolute top-16 right-4 sm:top-20 sm:right-16 opacity-8 hero-anim-scale pointer-events-none">
                    <Plane className="w-20 h-20 sm:w-36 sm:h-36 text-gold-300 rotate-45" />
                </div>
                <div className="absolute bottom-20 left-4 sm:left-14 opacity-8 animate-float-2 pointer-events-none">
                    <Star className="w-7 h-7 sm:w-10 sm:h-10 text-gold-400" fill="currentColor" />
                </div>

                {/* Content */}
                <div className="relative z-10 container-inner text-center px-5 pt-24 pb-20 sm:py-28">

                    {/* Badge */}
                    <div className="hero-anim-1 inline-flex items-center gap-2 px-4 py-1.5 sm:px-5 sm:py-2 rounded-full bg-gold-400/15 border border-gold-400/30 text-gold-300 text-[10px] sm:text-sm font-bold tracking-wider sm:tracking-widest uppercase mb-6 sm:mb-8 backdrop-blur-sm">
                        <Gift className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-400 shrink-0" />
                        Free Trip Giveaway 2026
                        <Gift className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-400 shrink-0" />
                    </div>

                    {/* Headline — fluid sizing prevents overflow on 360px screens */}
                    <h1 className="hero-anim-2 mx-auto max-w-4xl leading-[0.92] mb-5 sm:mb-6">
                        <span className="block font-serif text-base sm:text-2xl text-stone-300 font-light mb-1 sm:mb-2">
                            We&apos;re giving away a
                        </span>
                        <span className="block font-serif font-black bg-gradient-to-r from-gold-200 via-gold-400 to-amber-500 bg-clip-text text-transparent"
                            style={{ fontSize: 'clamp(2.8rem, 16vw, 9rem)', lineHeight: 1 }}>
                            FREE TRIP
                        </span>
                        <span className="block font-serif text-xl sm:text-4xl md:text-5xl text-white font-medium mt-1 sm:mt-2">
                            for Two — on Us.
                        </span>
                    </h1>

                    {/* Prize chips */}
                    <div className="hero-anim-3 flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
                        {[
                            { label: 'Flights Included' },
                            { label: 'Hotel Included' },
                            { label: 'Worth up to £3,000' },
                        ].map(chip => (
                            <span key={chip.label}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 rounded-full bg-white/8 border border-white/15 text-stone-200 text-xs sm:text-sm font-semibold backdrop-blur-sm">
                                <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gold-400 shrink-0" />
                                {chip.label}
                            </span>
                        ))}
                    </div>

                    {/* Destination flags */}
                    <div className="hero-anim-4 flex flex-wrap items-center justify-center gap-2.5 sm:gap-5 mb-8 sm:mb-10">
                        {DESTINATIONS.map(d => (
                            <div key={d.name} className="flex items-center gap-1.5 text-stone-300 text-sm font-medium">
                                <span className="text-lg sm:text-2xl">{d.flag}</span>
                                <span>{d.name}</span>
                            </div>
                        ))}
                    </div>

                    {/* CTAs — stacked on mobile, row on sm+ */}
                    <div className="hero-anim-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                        <a href="#enter"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full bg-gold-400 hover:bg-gold-300 text-brand-950 font-black text-base shadow-[0_8px_32px_rgba(251,191,36,0.35)] hover:shadow-[0_12px_40px_rgba(251,191,36,0.5)] transition-all duration-300 active:scale-95">
                            <Gift className="w-5 h-5 shrink-0" />
                            Enter the Draw — It&apos;s Free
                        </a>
                        <a href="#destinations"
                            className="inline-flex items-center gap-1.5 text-stone-400 hover:text-white text-sm font-semibold transition-colors py-2">
                            See destinations <ArrowDown className="w-4 h-4" />
                        </a>
                    </div>

                    <p className="mt-5 text-stone-500 text-xs font-medium tracking-wide">
                        Winner announced 31 December 2026 · Open to UK residents 18+
                    </p>
                </div>

                {/* Bottom fade */}
                <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-gold-400 to-transparent pointer-events-none" />
            </section>

            {/* ══════════════════════════════════════════
                SCROLLING TICKER
            ══════════════════════════════════════════ */}
            <div className="bg-gold-400 overflow-hidden py-2.5 sm:py-3 select-none">
                <div className="ticker-track flex items-center whitespace-nowrap w-max">
                    {[0, 1].map(i => (
                        <div key={i} className="flex items-center gap-6 sm:gap-8 px-6 sm:px-8">
                            {['🏆 ONE LUCKY WINNER', '✈️ FLIGHTS INCLUDED', '🏨 HOTEL INCLUDED', '🚗 TRANSFERS INCLUDED', '💰 WORTH UP TO £3,000', '🇦🇪 DUBAI', '🇹🇷 TURKEY', '🇫🇷 PARIS', '🇬🇪 GEORGIA', '📸 SHARE & WIN'].map(item => (
                                <span key={item}
                                    className="text-brand-950 font-black text-xs sm:text-sm tracking-widest uppercase flex items-center gap-3">
                                    {item}
                                    <span className="text-brand-900/40 font-light ml-1">·</span>
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* ══════════════════════════════════════════
                DESTINATIONS
            ══════════════════════════════════════════ */}
            <section id="destinations" className="py-14 sm:py-20 lg:py-28 bg-white">
                <div className="container-inner px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10 sm:mb-14" data-aos="fade-up">
                        <span className="section-label mx-auto">The Prize</span>
                        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-brand-950 font-bold mb-3">
                            Choose Your Dream Destination
                        </h2>
                        <p className="text-stone-500 text-sm sm:text-base max-w-lg mx-auto">
                            The winner picks any one of these four incredible destinations. Flights, hotel &amp; transfers all included.
                        </p>
                    </div>

                    {/* 1 col on mobile, 2 col on sm+ */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
                        {DESTINATIONS.map((dest, idx) => (
                            <div key={dest.name}
                                data-aos="zoom-in"
                                data-aos-delay={String(idx * 80)}
                                className="group relative overflow-hidden rounded-2xl sm:rounded-3xl bg-brand-950 cursor-default"
                                style={{ aspectRatio: '4/3' }}>

                                <Image
                                    src={dest.img}
                                    alt={dest.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    sizes="(max-width: 640px) 100vw, 50vw"
                                />

                                {/* Overlays */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                                <div className={`absolute inset-0 bg-gradient-to-br ${dest.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                                <div className="absolute inset-0 rounded-2xl sm:rounded-3xl ring-0 group-hover:ring-2 group-hover:ring-gold-400/50 transition-all duration-300" />

                                {/* Flag */}
                                <div className="absolute top-4 right-4 text-3xl sm:text-4xl leading-none drop-shadow-lg">
                                    {dest.flag}
                                </div>

                                {/* Tagline */}
                                <div className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-black/40 border border-white/20 backdrop-blur-sm text-white text-[10px] sm:text-xs font-bold tracking-wider uppercase">
                                    {dest.tagline}
                                </div>

                                {/* Bottom info */}
                                <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6">
                                    <p className="text-white/60 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1">
                                        {dest.subtitle}
                                    </p>
                                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2.5 group-hover:text-gold-300 transition-colors">
                                        {dest.name}
                                    </h3>
                                    <div className="flex flex-wrap gap-1.5">
                                        {dest.highlights.map(h => (
                                            <span key={h}
                                                className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-white/15 border border-white/20 text-white text-[10px] sm:text-xs font-semibold backdrop-blur-sm">
                                                {h}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                HOW TO ENTER — Infographic
            ══════════════════════════════════════════ */}
            <section className="py-14 sm:py-20 lg:py-28 bg-brand-950 overflow-hidden">
                <div className="container-inner px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12 sm:mb-16" data-aos="fade-up">
                        <span className="section-label mx-auto !text-gold-400 before:!bg-gold-400/30 after:!bg-gold-400/30">How It Works</span>
                        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white font-bold mb-3">
                            Enter in 3 Simple Steps
                        </h2>
                        <p className="text-stone-400 text-sm sm:text-base max-w-sm mx-auto">
                            No purchase necessary. No catch. Just follow, share, and enter.
                        </p>
                    </div>

                    {/*
                        Mobile: vertical list with connecting line on left
                        Desktop (lg): horizontal row with connecting dashed line between circles
                    */}
                    <div className="relative max-w-sm mx-auto lg:max-w-none">

                        {/* Vertical connector — mobile & sm only */}
                        <div className="absolute left-[39px] top-12 bottom-12 w-px border-l-2 border-dashed border-white/15 z-0 lg:hidden" />

                        {/* Horizontal connector — lg only */}
                        <div className="hidden lg:block absolute top-[48px] left-[calc(12.5%+44px)] right-[calc(12.5%+44px)] h-px border-t-2 border-dashed border-white/15 z-0" />

                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-0 lg:gap-6 relative z-10">
                            {STEPS.map(({ Icon, number, title, detail, grad, shadow }, idx) => (
                                <div key={number}
                                    data-aos="fade-up"
                                    data-aos-delay={String(idx * 100)}
                                    className="flex lg:flex-col items-start lg:items-center gap-5 lg:gap-0 lg:text-center group pb-8 lg:pb-0 last:pb-0">

                                    {/* Circle */}
                                    <div className={`relative shrink-0 flex h-20 w-20 lg:h-24 lg:w-24 items-center justify-center rounded-full bg-gradient-to-br ${grad} shadow-xl ${shadow} ring-4 ring-white/5 group-hover:scale-105 transition-transform duration-300`}>
                                        <Icon className="w-8 h-8 lg:w-9 lg:h-9 text-white" strokeWidth={1.8} />
                                        <span className="absolute -top-2 -right-2 flex h-7 w-7 lg:h-8 lg:w-8 items-center justify-center rounded-full bg-brand-950 border-2 border-white/20 text-white text-xs font-black">
                                            {number}
                                        </span>
                                    </div>

                                    {/* Text */}
                                    <div className="lg:mt-5 flex-1">
                                        <h3 className="font-serif text-lg sm:text-xl font-bold text-white mb-1.5">{title}</h3>
                                        <p className="text-stone-400 text-sm leading-relaxed">{detail}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="mt-12 sm:mt-14 text-center" data-aos="fade-up" data-aos-delay="450">
                        <a href="#enter"
                            className="inline-flex items-center gap-2.5 px-7 py-4 rounded-full bg-gold-400 hover:bg-gold-300 text-brand-950 font-black text-base shadow-[0_8px_32px_rgba(251,191,36,0.3)] hover:shadow-[0_12px_40px_rgba(251,191,36,0.45)] transition-all duration-300 active:scale-95">
                            <Gift className="w-5 h-5 shrink-0" />
                            Enter Now — It&apos;s Free
                        </a>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                PRIZE VALUE CALLOUT
            ══════════════════════════════════════════ */}
            <section className="relative py-14 sm:py-20 lg:py-28 bg-gradient-to-br from-stone-950 via-brand-950 to-stone-950 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_50%,rgba(251,191,36,0.08),transparent)]" />
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold-400/30 to-transparent" />
                    <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold-400/30 to-transparent" />
                </div>

                <div className="relative z-10 container-inner px-4 sm:px-6 text-center">
                    <p className="text-stone-400 text-xs sm:text-sm font-bold uppercase tracking-widest mb-3" data-aos="fade-up">
                        Total Prize Value
                    </p>

                    {/* Fluid £3,000 — clamp prevents overflow on 320px screens */}
                    <div className="font-serif font-black bg-gradient-to-r from-gold-200 via-gold-400 to-amber-500 bg-clip-text text-transparent mb-4 sm:mb-6 animate-gradient"
                        style={{ fontSize: 'clamp(3.5rem, 22vw, 10rem)', lineHeight: 1 }}
                        data-aos="scale-up">
                        £3,000
                    </div>

                    <p className="text-white font-serif text-xl sm:text-2xl lg:text-3xl mb-8 sm:mb-10" data-aos="fade-up" data-aos-delay="100">
                        One winner. Two people. Unforgettable memories.
                    </p>

                    {/* Included items — 2×2 on mobile, row on sm+ */}
                    <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-4"
                        data-aos="fade-up" data-aos-delay="200">
                        {[
                            { icon: '✈️', label: 'Return Flights', sub: 'From any UK airport' },
                            { icon: '🏨', label: 'Hotel Stay', sub: '4 or 5 star' },
                            { icon: '🚗', label: 'Transfers', sub: 'Airport to hotel' },
                            { icon: '📋', label: 'Itinerary', sub: 'Fully planned by us' },
                        ].map(item => (
                            <div key={item.label}
                                className="flex flex-col items-center gap-1 bg-white/5 border border-white/10 rounded-2xl px-3 sm:px-6 py-4 hover:border-gold-400/30 transition-all">
                                <span className="text-2xl sm:text-3xl mb-0.5">{item.icon}</span>
                                <span className="text-white font-bold text-xs sm:text-sm">{item.label}</span>
                                <span className="text-stone-500 text-[10px] sm:text-xs">{item.sub}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                COUNTDOWN TIMER
            ══════════════════════════════════════════ */}
            <section className="py-14 sm:py-20 lg:py-24 bg-stone-950 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(30,58,138,0.15),transparent)] pointer-events-none" />
                <div className="relative z-10 container-inner px-4 sm:px-6 text-center">
                    <div data-aos="fade-up">
                        <span className="section-label mx-auto !text-gold-400 before:!bg-gold-400/30 after:!bg-gold-400/30">Draw Closing</span>
                        <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-white font-bold mb-1.5">
                            Winner Announced In
                        </h2>
                        <p className="text-stone-500 mb-8 sm:mb-10 text-sm">
                            31 December 2026 — don&apos;t miss your chance
                        </p>
                    </div>
                    <div data-aos="zoom-in" data-aos-delay="100">
                        <CountdownTimer target="2026-12-31T23:59:59" />
                    </div>
                    <p className="mt-8 text-stone-600 text-xs font-medium tracking-wide" data-aos="fade-up" data-aos-delay="200">
                        Draw closes midnight 31 December 2026 · Winner contacted within 7 days
                    </p>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                ENTRY FORM
            ══════════════════════════════════════════ */}
            <section id="enter" className="relative py-14 sm:py-20 lg:py-28 bg-brand-950 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(251,191,36,0.10),transparent)]" />
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold-400/20 to-transparent" />
                    <div className="absolute inset-0 opacity-[0.02]"
                        style={{ backgroundImage: 'radial-gradient(circle, #fbbf24 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
                </div>

                <div className="relative z-10 container-inner px-4 sm:px-6">
                    <div className="max-w-lg mx-auto">

                        {/* Heading */}
                        <div className="text-center mb-8" data-aos="fade-up">
                            <span className="section-label mx-auto !text-gold-400 before:!bg-gold-400/30 after:!bg-gold-400/30">Final Step</span>
                            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white font-bold mb-3">
                                Submit Your Entry
                            </h2>
                            <p className="text-stone-400 text-sm sm:text-base">
                                Follow us and share the reel first, then fill in below.
                            </p>
                        </div>

                        {/* Pre-flight checklist */}
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3 mb-6" data-aos="fade-up" data-aos-delay="80">
                            {[
                                { icon: '✅', text: 'Followed @myperfecttrips' },
                                { icon: '✅', text: 'Shared reel with 5 friends' },
                                { icon: '📸', text: 'Screenshot ready to upload' },
                            ].map(item => (
                                <div key={item.text}
                                    className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-stone-300 text-sm font-medium">
                                    <span className="text-base shrink-0">{item.icon}</span>
                                    <span>{item.text}</span>
                                </div>
                            ))}
                        </div>

                        {/* Form card */}
                        <div
                            data-aos="zoom-in"
                            data-aos-delay="150"
                            className="rounded-2xl sm:rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl shadow-black/40 p-5 sm:p-8">
                            <LuckyDrawForm />
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                SOCIAL PROOF
            ══════════════════════════════════════════ */}
            <section className="py-10 sm:py-12 bg-white border-t border-stone-100">
                <div className="container-inner px-4 sm:px-6">
                    {/* 2×2 grid on mobile → row on sm+ */}
                    <div className="grid grid-cols-2 gap-6 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-14">
                        {[
                            { value: '15+', label: 'Years in Travel' },
                            { value: '10K+', label: 'Happy Travellers' },
                            { value: '50+', label: 'Destinations' },
                            { value: '5★', label: 'Client Rating' },
                        ].map(s => (
                            <div key={s.label} className="text-center">
                                <p className="font-serif text-3xl sm:text-4xl font-bold text-brand-950">{s.value}</p>
                                <p className="text-stone-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest mt-1">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                T&Cs
            ══════════════════════════════════════════ */}
            <section className="py-10 sm:py-12 bg-stone-950">
                <div className="container-inner px-4 sm:px-6 max-w-2xl">
                    <h3 className="text-stone-400 font-semibold text-xs sm:text-sm mb-4 uppercase tracking-wider">Terms &amp; Conditions</h3>
                    <ol className="space-y-2 text-stone-600 text-xs leading-relaxed list-decimal pl-4">
                        <li>This giveaway is open to UK residents aged 18 and over.</li>
                        <li>To enter, participants must follow @myperfecttrips on Instagram and share the giveaway reel with a minimum of 5 friends.</li>
                        <li>One entry per person. Duplicate entries will be disqualified.</li>
                        <li>The prize is one trip for two to the winner&apos;s chosen destination (Dubai, Turkey, Paris, or Georgia), worth up to £3,000. Subject to availability and dates agreed with My Perfect Trips.</li>
                        <li>The prize includes return flights from a UK airport and accommodation as specified. Travel insurance and personal expenses are not included.</li>
                        <li>The winner will be selected at random and announced on 31 December 2026 via Instagram.</li>
                        <li>The winner must claim their prize within 30 days of announcement. Unclaimed prizes are forfeit.</li>
                        <li>My Perfect Trips reserves the right to amend or withdraw this promotion at any time without notice.</li>
                        <li>No cash alternative is offered.</li>
                        <li>Promoter: My Perfect Trips, Bartle House, 9 Oxford Court, Manchester M2 3WQ.</li>
                    </ol>
                </div>
            </section>
        </>
    );
}
