import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
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
        detail: 'One lucky winner is announced live on 31 December 2026.',
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

export default function WinPage() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

            {/* ── MARQUEE CSS ── */}
            <style>{`
                @keyframes ticker { from { transform: translateX(0) } to { transform: translateX(-50%) } }
                .ticker-track { animation: ticker 28s linear infinite; }
                .ticker-track:hover { animation-play-state: paused; }
            `}</style>

            {/* ══════════════════════════════════════════
                HERO — full viewport, dramatic dark
            ══════════════════════════════════════════ */}
            <section className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden bg-brand-950">

                {/* Background layers */}
                <div className="absolute inset-0 pointer-events-none">
                    {/* Rich multi-stop gradient */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_110%,rgba(251,191,36,0.18),transparent)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_80%_10%,rgba(139,92,246,0.12),transparent)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_35%_at_10%_20%,rgba(59,130,246,0.10),transparent)]" />
                    {/* Subtle dot grid */}
                    <div className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: 'radial-gradient(circle, #fbbf24 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
                </div>

                {/* Animated orbs */}
                <div className="absolute top-1/4 left-1/6 h-80 w-80 rounded-full bg-gold-400/8 blur-[100px] animate-float pointer-events-none" />
                <div className="absolute bottom-1/4 right-1/6 h-64 w-64 rounded-full bg-violet-500/8 blur-[80px] animate-float-2 pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-brand-700/10 blur-[120px] animate-float-3 pointer-events-none" />

                {/* Decorative plane */}
                <div className="absolute top-16 right-8 sm:top-20 sm:right-20 opacity-10 hero-anim-scale">
                    <Plane className="w-24 h-24 sm:w-40 sm:h-40 text-gold-300 rotate-45" />
                </div>
                <div className="absolute bottom-24 left-6 sm:left-16 opacity-8 animate-float-2">
                    <Star className="w-10 h-10 text-gold-400" fill="currentColor" />
                </div>
                <div className="absolute top-40 left-10 opacity-8 animate-float-3">
                    <Star className="w-6 h-6 text-gold-300" fill="currentColor" />
                </div>

                {/* Content */}
                <div className="relative z-10 container-inner text-center px-4 py-24 sm:py-32">

                    {/* Eyebrow badge */}
                    <div className="hero-anim-1 inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-gold-400/15 border border-gold-400/30 text-gold-300 text-xs sm:text-sm font-bold tracking-widest uppercase mb-8 backdrop-blur-sm">
                        <Gift className="w-4 h-4 text-gold-400" />
                        Free Trip Giveaway 2026
                        <Gift className="w-4 h-4 text-gold-400" />
                    </div>

                    {/* Headline */}
                    <h1 className="hero-anim-2 mx-auto max-w-4xl leading-[0.95] mb-6">
                        <span className="block font-serif text-2xl sm:text-3xl text-stone-300 font-light mb-2">We're giving away a</span>
                        <span className="block font-serif font-bold text-6xl sm:text-8xl md:text-9xl bg-gradient-to-r from-gold-200 via-gold-400 to-amber-500 bg-clip-text text-transparent">
                            FREE TRIP
                        </span>
                        <span className="block font-serif text-3xl sm:text-5xl text-white font-medium mt-2">for Two — on Us.</span>
                    </h1>

                    {/* Prize value */}
                    <div className="hero-anim-3 inline-flex flex-wrap items-center justify-center gap-3 mb-8">
                        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/8 border border-white/15 text-stone-200 text-sm font-semibold backdrop-blur-sm">
                            <CheckCircle className="w-3.5 h-3.5 text-gold-400" /> Flights Included
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/8 border border-white/15 text-stone-200 text-sm font-semibold backdrop-blur-sm">
                            <CheckCircle className="w-3.5 h-3.5 text-gold-400" /> Hotel Included
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/8 border border-white/15 text-stone-200 text-sm font-semibold backdrop-blur-sm">
                            <CheckCircle className="w-3.5 h-3.5 text-gold-400" /> Worth up to £3,000
                        </span>
                    </div>

                    {/* Destination flags */}
                    <div className="hero-anim-4 flex flex-wrap items-center justify-center gap-3 sm:gap-5 mb-10">
                        {DESTINATIONS.map(d => (
                            <div key={d.name} className="flex items-center gap-1.5 text-stone-300 text-sm sm:text-base font-medium">
                                <span className="text-xl sm:text-2xl">{d.flag}</span>
                                <span>{d.name}</span>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="hero-anim-5 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a href="#enter"
                            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-gold-400 hover:bg-gold-300 text-brand-950 font-black text-base sm:text-lg shadow-[0_8px_32px_rgba(251,191,36,0.35)] hover:shadow-[0_12px_40px_rgba(251,191,36,0.5)] transition-all duration-300 hover:-translate-y-1">
                            <Gift className="w-5 h-5" />
                            Enter the Draw — It&apos;s Free
                        </a>
                        <a href="#destinations" className="inline-flex items-center gap-2 text-stone-400 hover:text-white text-sm font-semibold transition-colors">
                            See destinations <ArrowDown className="w-4 h-4" />
                        </a>
                    </div>

                    <p className="mt-6 text-stone-500 text-xs font-medium tracking-wide">
                        Winner announced 31 December 2026 · Open to UK residents 18+
                    </p>
                </div>

                {/* Bottom fade to next section */}
                <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-gold-400 to-transparent pointer-events-none" />
            </section>

            {/* ══════════════════════════════════════════
                SCROLLING TICKER
            ══════════════════════════════════════════ */}
            <div className="bg-gold-400 overflow-hidden py-3 select-none">
                <div className="ticker-track flex items-center gap-0 whitespace-nowrap w-max">
                    {[0, 1].map(i => (
                        <div key={i} className="flex items-center gap-8 px-8">
                            {['🏆 ONE LUCKY WINNER', '✈️ FLIGHTS INCLUDED', '🏨 HOTEL INCLUDED', '🚗 TRANSFERS INCLUDED', '💰 WORTH UP TO £3,000', '🇦🇪 DUBAI', '🇹🇷 TURKEY', '🇫🇷 PARIS', '🇬🇪 GEORGIA', '📸 SHARE & WIN'].map(item => (
                                <span key={item} className="text-brand-950 font-black text-sm tracking-widest uppercase flex items-center gap-3">
                                    {item}
                                    <span className="text-brand-900/40 font-light">·</span>
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* ══════════════════════════════════════════
                DESTINATION SHOWCASE
            ══════════════════════════════════════════ */}
            <section id="destinations" className="py-20 lg:py-28 bg-white">
                <div className="container-inner">
                    <div className="text-center mb-12 lg:mb-16" data-aos="fade-up">
                        <span className="section-label mx-auto">The Prize</span>
                        <h2 className="font-serif text-4xl sm:text-5xl text-brand-950 font-bold mb-4">
                            Choose Your Dream Destination
                        </h2>
                        <p className="text-stone-500 text-lg max-w-xl mx-auto">
                            The winner picks any one of these four incredible destinations. All flights, hotel, and transfers are included.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-6">
                        {DESTINATIONS.map((dest, idx) => (
                            <div key={dest.name}
                                data-aos="zoom-in"
                                data-aos-delay={String(idx * 100)}
                                className="group relative overflow-hidden rounded-3xl aspect-[4/3] bg-brand-950 cursor-default">

                                {/* Photo */}
                                <Image
                                    src={dest.img}
                                    alt={dest.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    sizes="(max-width: 640px) 100vw, 50vw"
                                />

                                {/* Gradient overlays */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                                <div className={`absolute inset-0 bg-gradient-to-br ${dest.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                                {/* Border glow on hover */}
                                <div className="absolute inset-0 rounded-3xl ring-0 group-hover:ring-2 group-hover:ring-gold-400/60 transition-all duration-300" />

                                {/* Flag */}
                                <div className="absolute top-5 right-5 text-4xl sm:text-5xl leading-none filter drop-shadow-lg">
                                    {dest.flag}
                                </div>

                                {/* Tagline chip */}
                                <div className="absolute top-5 left-5 px-3 py-1 rounded-full bg-black/40 border border-white/20 backdrop-blur-sm text-white text-xs font-bold tracking-wider uppercase">
                                    {dest.tagline}
                                </div>

                                {/* Bottom info */}
                                <div className="absolute bottom-0 inset-x-0 p-6">
                                    <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">{dest.subtitle}</p>
                                    <h3 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-3 group-hover:text-gold-300 transition-colors">
                                        {dest.name}
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {dest.highlights.map(h => (
                                            <span key={h} className="px-2.5 py-1 rounded-full bg-white/15 border border-white/20 text-white text-xs font-semibold backdrop-blur-sm">
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
            <section className="py-20 lg:py-28 bg-brand-950 overflow-hidden">
                <div className="container-inner">
                    <div className="text-center mb-14 lg:mb-20" data-aos="fade-up">
                        <span className="section-label mx-auto !text-gold-400 before:!bg-gold-400/30 after:!bg-gold-400/30">How It Works</span>
                        <h2 className="font-serif text-4xl sm:text-5xl text-white font-bold mb-4">
                            Enter in 3 Simple Steps
                        </h2>
                        <p className="text-stone-400 text-lg max-w-md mx-auto">
                            No purchase necessary. No catch. Just follow, share, and enter.
                        </p>
                    </div>

                    {/* Steps — desktop: horizontal with connecting line, mobile: vertical */}
                    <div className="relative">

                        {/* Connecting dashed line — desktop only */}
                        <div className="hidden lg:block absolute top-[52px] left-[calc(12.5%+40px)] right-[calc(12.5%+40px)] h-px border-t-2 border-dashed border-white/15 z-0" />

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 relative z-10">
                            {STEPS.map(({ Icon, number, title, detail, grad, shadow }, idx) => (
                                <div key={number}
                                    data-aos="fade-up"
                                    data-aos-delay={String(idx * 120)}
                                    className="flex flex-col items-center text-center group">

                                    {/* Circle + icon */}
                                    <div className={`relative mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br ${grad} shadow-xl ${shadow} ring-4 ring-white/5 group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon className="w-9 h-9 text-white" strokeWidth={1.8} />
                                        {/* Step number badge */}
                                        <span className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-brand-950 border-2 border-white/20 text-white text-xs font-black">
                                            {number}
                                        </span>
                                    </div>

                                    <h3 className="font-serif text-xl font-bold text-white mb-2">{title}</h3>
                                    <p className="text-stone-400 text-sm leading-relaxed max-w-[220px]">{detail}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="mt-14 text-center" data-aos="fade-up" data-aos-delay="500">
                        <a href="#enter"
                            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-gold-400 hover:bg-gold-300 text-brand-950 font-black text-base shadow-[0_8px_32px_rgba(251,191,36,0.3)] hover:shadow-[0_12px_40px_rgba(251,191,36,0.45)] transition-all duration-300 hover:-translate-y-1">
                            <Gift className="w-5 h-5" />
                            Enter Now — It&apos;s Free
                        </a>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                PRIZE VALUE CALLOUT
            ══════════════════════════════════════════ */}
            <section className="relative py-20 lg:py-28 bg-gradient-to-br from-stone-950 via-brand-950 to-stone-950 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_50%,rgba(251,191,36,0.08),transparent)]" />
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold-400/30 to-transparent" />
                    <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold-400/30 to-transparent" />
                </div>

                <div className="relative z-10 container-inner text-center">
                    <p className="font-sans text-stone-400 text-sm font-bold uppercase tracking-widest mb-4" data-aos="fade-up">Total Prize Value</p>
                    <div className="font-serif font-black text-[80px] sm:text-[120px] md:text-[160px] leading-none bg-gradient-to-r from-gold-200 via-gold-400 to-amber-500 bg-clip-text text-transparent mb-6 animate-gradient" data-aos="scale-up">
                        £3,000
                    </div>
                    <p className="text-white font-serif text-2xl sm:text-3xl mb-10" data-aos="fade-up" data-aos-delay="100">
                        One winner. Two people. Unforgettable memories.
                    </p>

                    {/* What's included */}
                    <div className="flex flex-wrap items-center justify-center gap-4" data-aos="fade-up" data-aos-delay="200">
                        {[
                            { icon: '✈️', label: 'Return Flights', sub: 'From any UK airport' },
                            { icon: '🏨', label: 'Hotel Stay', sub: '4 or 5 star' },
                            { icon: '🚗', label: 'Transfers', sub: 'Airport to hotel' },
                            { icon: '📋', label: 'Itinerary', sub: 'Fully planned by us' },
                        ].map(item => (
                            <div key={item.label}
                                className="flex flex-col items-center gap-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 min-w-[130px] hover:border-gold-400/30 hover:bg-white/8 transition-all">
                                <span className="text-3xl mb-1">{item.icon}</span>
                                <span className="text-white font-bold text-sm">{item.label}</span>
                                <span className="text-stone-500 text-xs">{item.sub}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                COUNTDOWN TIMER
            ══════════════════════════════════════════ */}
            <section className="py-20 lg:py-24 bg-stone-950 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(30,58,138,0.15),transparent)] pointer-events-none" />
                <div className="relative z-10 container-inner text-center">
                    <div data-aos="fade-up">
                        <span className="section-label mx-auto !text-gold-400 before:!bg-gold-400/30 after:!bg-gold-400/30">Draw Closing</span>
                        <h2 className="font-serif text-3xl sm:text-4xl text-white font-bold mb-2">
                            Winner Announced In
                        </h2>
                        <p className="text-stone-500 mb-10 text-sm">
                            31 December 2026 — don&apos;t miss your chance
                        </p>
                    </div>
                    <div data-aos="zoom-in" data-aos-delay="100">
                        <CountdownTimer target="2026-12-31T23:59:59" />
                    </div>
                    <p className="mt-10 text-stone-600 text-xs font-medium tracking-wide" data-aos="fade-up" data-aos-delay="200">
                        The draw closes midnight 31 December 2026. Winner contacted within 7 days.
                    </p>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                ENTRY FORM
            ══════════════════════════════════════════ */}
            <section id="enter" className="relative py-20 lg:py-28 bg-brand-950 overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(251,191,36,0.10),transparent)]" />
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold-400/20 to-transparent" />
                    <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold-400/20 to-transparent" />
                    <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: 'radial-gradient(circle, #fbbf24 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
                </div>

                <div className="relative z-10 container-inner">
                    <div className="max-w-xl mx-auto">

                        {/* Heading */}
                        <div className="text-center mb-10" data-aos="fade-up">
                            <span className="section-label mx-auto !text-gold-400 before:!bg-gold-400/30 after:!bg-gold-400/30">Final Step</span>
                            <h2 className="font-serif text-4xl sm:text-5xl text-white font-bold mb-3">
                                Submit Your Entry
                            </h2>
                            <p className="text-stone-400 text-base">
                                Make sure you&apos;ve followed us and shared the reel first, then fill in your details below.
                            </p>
                        </div>

                        {/* Checklist reminder */}
                        <div className="flex flex-col sm:flex-row gap-3 mb-8" data-aos="fade-up" data-aos-delay="100">
                            {[
                                { icon: '✅', text: 'Followed @myperfecttrips' },
                                { icon: '✅', text: 'Shared reel with 5 friends' },
                                { icon: '📸', text: 'Screenshot ready to upload' },
                            ].map(item => (
                                <div key={item.text}
                                    className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-stone-300 text-sm font-medium">
                                    <span>{item.icon}</span>
                                    <span>{item.text}</span>
                                </div>
                            ))}
                        </div>

                        {/* Form card */}
                        <div
                            data-aos="zoom-in"
                            data-aos-delay="150"
                            className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl shadow-black/40 p-6 sm:p-8">
                            <LuckyDrawForm />
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                SOCIAL PROOF STRIP
            ══════════════════════════════════════════ */}
            <section className="py-12 bg-white border-t border-stone-100">
                <div className="container-inner">
                    <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16">
                        {[
                            { value: '15+', label: 'Years in Travel' },
                            { value: '10,000+', label: 'Happy Travellers' },
                            { value: '50+', label: 'Destinations' },
                            { value: '5★', label: 'Client Rating' },
                        ].map(s => (
                            <div key={s.label} className="text-center">
                                <p className="font-serif text-3xl sm:text-4xl font-bold text-brand-950">{s.value}</p>
                                <p className="text-stone-500 text-xs font-semibold uppercase tracking-widest mt-1">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                T&Cs
            ══════════════════════════════════════════ */}
            <section className="py-12 bg-stone-950">
                <div className="container-inner max-w-2xl">
                    <h3 className="text-stone-400 font-semibold text-sm mb-5 uppercase tracking-wider">Terms &amp; Conditions</h3>
                    <ol className="space-y-2 text-stone-600 text-xs list-decimal pl-4">
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
