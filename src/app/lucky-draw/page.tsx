import type { Metadata } from 'next';
import Image from 'next/image';
import { Gift, Plane, Star, Instagram } from 'lucide-react';
import LuckyDrawForm from '@/components/LuckyDrawForm';
import CountdownTimer from '@/components/CountdownTimer';

const IG_URL = 'https://www.instagram.com/myperfecttrips';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://myperfecttrips.com';

export const metadata: Metadata = {
    title: 'Win Your Dream Holiday FREE | Lucky Draw – My Perfect Trips',
    description: 'Enter our FREE holiday lucky draw! Follow @myperfecttrips, share our reel with 5 friends, and win a free trip to Dubai, Turkey, Paris, or Georgia. Draw closes 30 Dec, winner announced 31 December 2026.',
    keywords: 'free trip giveaway UK, win free holiday, lucky draw 2026, My Perfect Trips giveaway, Dubai free trip, travel competition UK',
    alternates: { canonical: `${BASE}/lucky-draw` },
    openGraph: {
        title: 'Win Your Dream Holiday FREE — My Perfect Trips',
        description: 'Follow us on Instagram, share our reel with 5 friends, and win a free holiday!',
        url: `${BASE}/lucky-draw`,
        siteName: 'My Perfect Trips',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Win Your Dream Holiday FREE — My Perfect Trips',
        description: 'Follow @myperfecttrips on Instagram, enter our lucky draw and win a free holiday!',
    },
};

const DESTINATIONS = [
    { name: 'Dubai',   flag: '🇦🇪', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80&fit=crop' },
    { name: 'Turkey',  flag: '🇹🇷', img: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600&q=80&fit=crop' },
    { name: 'Paris',   flag: '🇫🇷', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80&fit=crop' },
    { name: 'Georgia', flag: '🇬🇪', img: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?w=600&q=80&fit=crop' },
];

const schema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'My Perfect Trips Free Holiday Lucky Draw 2026',
    description: 'Win a free trip for one lucky winner to Dubai, Turkey, Paris, or Georgia.',
    startDate: '2026-10-20',
    endDate: '2026-12-31',
    organizer: { '@type': 'TravelAgency', name: 'My Perfect Trips', url: BASE },
    url: `${BASE}/lucky-draw`,
};

export default function LuckyDrawPage() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

            <style>{`
                @keyframes ticker { from{transform:translateX(0)} to{transform:translateX(-50%)} }
                .ticker-track { animation: ticker 24s linear infinite; }
                @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
                .spin-slow { animation: spin-slow 20s linear infinite; }
                @keyframes bounce-in { 0%{transform:scale(0.5);opacity:0} 70%{transform:scale(1.05)} 100%{transform:scale(1);opacity:1} }
                .bounce-in { animation: bounce-in 0.7s cubic-bezier(0.16,1,0.3,1) both; }
                @keyframes shimmer { 0%,100%{opacity:0.6} 50%{opacity:1} }
                .shimmer { animation: shimmer 2.5s ease-in-out infinite; }
                .glow-btn { box-shadow: 0 0 0 0 rgba(255,255,255,0.4); animation: pulse-btn 2s ease-in-out infinite; }
                @keyframes pulse-btn { 0%,100%{box-shadow:0 0 0 0 rgba(255,255,255,0.4)} 50%{box-shadow:0 0 0 14px rgba(255,255,255,0)} }
            `}</style>

            {/* ══════════════════════════════════════════
                HERO — one screen, everything in it
            ══════════════════════════════════════════ */}
            <section className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden">

                {/* Vivid animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-sky-400 via-blue-600 to-indigo-700 animate-gradient" />

                {/* Subtle travel photo overlay */}
                <div className="absolute inset-0">
                    <Image
                        src="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1600&q=60&fit=crop"
                        alt="travel collage"
                        fill
                        className="object-cover opacity-15 mix-blend-overlay"
                        priority
                        sizes="100vw"
                    />
                </div>

                {/* Radial vignette depth */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_50%,transparent,rgba(0,0,0,0.35))]" />

                {/* Decorative floating rings */}
                <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full border-2 border-white/10 spin-slow pointer-events-none" />
                <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full border-2 border-white/10 spin-slow pointer-events-none" style={{ animationDirection: 'reverse' }} />

                {/* Floating sparkles */}
                <div className="absolute top-16 left-[8%] animate-float pointer-events-none opacity-70">
                    <Star className="w-5 h-5 text-white fill-white" />
                </div>
                <div className="absolute top-28 right-[10%] animate-float-2 pointer-events-none opacity-50">
                    <Star className="w-3 h-3 text-yellow-200 fill-yellow-200" />
                </div>
                <div className="absolute bottom-32 left-[12%] animate-float-3 pointer-events-none opacity-60">
                    <Star className="w-4 h-4 text-white fill-white" />
                </div>
                <div className="absolute top-1/2 right-[6%] animate-float pointer-events-none opacity-40">
                    <Plane className="w-10 h-10 text-white rotate-45" />
                </div>
                <div className="absolute top-20 right-[25%] animate-float-2 pointer-events-none opacity-30">
                    <Plane className="w-6 h-6 text-white rotate-[30deg]" />
                </div>

                {/* ── CONTENT ── */}
                <div className="relative z-10 w-full max-w-2xl mx-auto px-5 py-20 sm:py-16 flex flex-col items-center text-center gap-5">

                    {/* Top badge */}
                    <div className="hero-anim-1 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 border border-white/40 backdrop-blur-sm text-white text-xs font-black uppercase tracking-widest">
                        <Gift className="w-3.5 h-3.5 shrink-0" />
                        Free Trip Giveaway 2026
                        <Gift className="w-3.5 h-3.5 shrink-0" />
                    </div>

                    {/* HEADLINE */}
                    <div className="hero-anim-2">
                        <p className="text-white/80 font-serif text-sm sm:text-base font-light tracking-wider mb-1">
                            Could this be your next adventure?
                        </p>
                        <h1 className="font-serif font-black text-white leading-[0.9] tracking-tight drop-shadow-2xl"
                            style={{ fontSize: 'clamp(3rem, 14vw, 7rem)' }}>
                            WIN YOUR<br />DREAM<br />
                            <span className="text-yellow-200">HOLIDAY!</span>
                        </h1>
                        <p className="mt-3 text-white font-bold text-xs sm:text-sm">
                            🏨 Hotel with Breakfast · 🎡 All Activities · 🚗 Transfers — Complete Land Package
                        </p>
                    </div>

                    {/* DESTINATION CARDS — 2×2 mobile, 4-col desktop */}
                    <div className="hero-anim-3 w-full grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                        {DESTINATIONS.map(d => (
                            <div key={d.name} className="relative overflow-hidden rounded-2xl aspect-[3/2] group">
                                <Image
                                    src={d.img}
                                    alt={d.name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    sizes="(max-width: 640px) 45vw, 22vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                <div className="absolute inset-0 ring-2 ring-inset ring-white/0 group-hover:ring-white/50 transition-all duration-300 rounded-2xl" />
                                <div className="absolute bottom-0 inset-x-0 p-2 sm:p-2.5 flex items-end justify-between">
                                    <span className="text-white font-bold text-xs sm:text-sm leading-tight">{d.name}</span>
                                    <span className="text-lg sm:text-xl leading-none">{d.flag}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* INSTAGRAM FOLLOW CTA */}
                    <div className="hero-anim-4 w-full flex flex-col items-center gap-3">
                        <p className="text-white/70 text-xs font-bold uppercase tracking-widest">Step 1 — Follow us to enter</p>
                        <a
                            href={IG_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 px-6 py-3 rounded-full font-black text-sm text-white transition-all duration-200 active:scale-95 hover:scale-105"
                            style={{ background: 'linear-gradient(135deg, #f58529, #dd2a7b, #8134af, #515bd4)' }}
                        >
                            <Instagram className="w-5 h-5 shrink-0" />
                            Follow @myperfecttrips on Instagram
                        </a>

                        {/* remaining steps */}
                        <div className="flex items-center justify-center gap-1 sm:gap-2 flex-wrap mt-1">
                            {[
                                { n: '02', label: 'Share reel × 5' },
                                { n: '03', label: 'Fill form' },
                                { n: '04', label: '🏆 Win!' },
                            ].map((s, i) => (
                                <div key={s.n} className="flex items-center gap-1 sm:gap-2">
                                    <div className="flex items-center gap-1.5 bg-white/15 border border-white/25 backdrop-blur-sm rounded-full px-3 py-1.5">
                                        <span className="text-yellow-200 font-black text-[10px] sm:text-xs">{s.n}</span>
                                        <span className="text-white font-semibold text-[10px] sm:text-xs">{s.label}</span>
                                    </div>
                                    {i < 2 && <span className="text-white/50 font-bold text-xs">→</span>}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* COUNTDOWN */}
                    <div className="hero-anim-5 w-full">
                        <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-3">
                            Draw closes in
                        </p>
                        <CountdownTimer target="2026-12-30T23:59:59" />
                        <p className="mt-2 text-white/50 text-[11px]">Closes 30 Dec · Winner announced 31 Dec 2026 · UK residents 18+</p>
                    </div>

                    {/* CTA */}
                    <div className="w-full flex flex-col items-center gap-3">
                        <a href="#enter"
                            className="glow-btn w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 sm:px-12 py-4 sm:py-5 rounded-full bg-white text-rose-600 font-black text-base sm:text-lg hover:bg-yellow-50 transition-all duration-200 active:scale-95">
                            <Gift className="w-5 h-5 shrink-0" />
                            Enter the Draw — It&apos;s Free!
                        </a>
                        <p className="text-white/50 text-[11px] font-medium">No purchase necessary · One entry per person</p>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce pointer-events-none">
                    <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest">Scroll to enter</p>
                    <div className="w-5 h-8 rounded-full border-2 border-white/30 flex items-start justify-center pt-1.5">
                        <div className="w-1 h-2 bg-white/60 rounded-full animate-bounce" />
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                TICKER STRIP
            ══════════════════════════════════════════ */}
            <div className="bg-yellow-300 overflow-hidden py-2.5 select-none">
                <div className="ticker-track flex items-center whitespace-nowrap w-max">
                    {[0, 1].map(i => (
                        <div key={i} className="flex items-center gap-6 px-6">
                            {['🏆 ONE LUCKY WINNER', '🏨 HOTEL WITH BREAKFAST', '🎡 ALL ACTIVITIES INCLUDED', '🚗 TRANSFERS INCLUDED', '🌍 COMPLETE LAND PACKAGE', '🇦🇪 DUBAI', '🇹🇷 TURKEY', '🇫🇷 PARIS', '🇬🇪 GEORGIA', '📸 SHARE & WIN', '🎉 WINNER ANNOUNCED 31 DEC'].map(item => (
                                <span key={item} className="text-rose-700 font-black text-xs tracking-widest uppercase">
                                    {item} <span className="text-rose-400 mx-1">·</span>
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* ══════════════════════════════════════════
                ENTRY FORM — clean white section
            ══════════════════════════════════════════ */}
            <section id="enter" className="relative py-14 sm:py-20 bg-gradient-to-b from-slate-50 to-white">

                {/* Coloured top accent line */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600" />

                <div className="relative z-10 max-w-lg mx-auto px-5">

                    {/* Heading */}
                    <div className="text-center mb-8" data-aos="fade-up">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-bold uppercase tracking-widest mb-4">
                            <Gift className="w-3.5 h-3.5" />
                            Final Step
                        </div>
                        <h2 className="font-serif text-3xl sm:text-4xl font-black text-slate-900 mb-2">
                            Submit Your Entry
                        </h2>
                        <p className="text-slate-500 text-sm sm:text-base">
                            Follow &amp; share first — then fill in below.
                        </p>
                    </div>

                    {/* Instagram follow button */}
                    <div className="flex justify-center mb-5" data-aos="fade-up" data-aos-delay="60">
                        <a
                            href={IG_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full font-black text-sm text-white shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
                            style={{ background: 'linear-gradient(135deg, #f58529, #dd2a7b, #8134af, #515bd4)' }}
                        >
                            <Instagram className="w-4 h-4 shrink-0" />
                            Follow @myperfecttrips on Instagram
                        </a>
                    </div>

                    {/* Quick checklist */}
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 mb-6" data-aos="fade-up" data-aos-delay="80">
                        {[
                            { icon: '✅', text: 'Followed us on Instagram', cls: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
                            { icon: '✅', text: 'Shared reel × 5 friends',  cls: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
                            { icon: '📸', text: 'Screenshot ready',         cls: 'bg-sky-50    border-sky-200    text-sky-800' },
                        ].map(item => (
                            <div key={item.text}
                                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-xs font-semibold ${item.cls}`}>
                                <span className="shrink-0 text-base">{item.icon}</span>
                                {item.text}
                            </div>
                        ))}
                    </div>

                    {/* Form card — solid white, high contrast */}
                    <div
                        data-aos="fade-up"
                        data-aos-delay="120"
                        className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/80 p-5 sm:p-8">
                        <LuckyDrawForm />
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                T&Cs — styled
            ══════════════════════════════════════════ */}
            <section className="py-14 sm:py-16 bg-gradient-to-b from-slate-900 to-slate-950">
                <div className="max-w-3xl mx-auto px-5">

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8 pb-5 border-b border-white/8">
                        <div>
                            <p className="text-sky-400 text-xs font-black uppercase tracking-widest mb-1">Competition Rules</p>
                            <h3 className="text-white font-serif text-xl sm:text-2xl font-bold">Terms &amp; Conditions</h3>
                        </div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-stone-400 text-xs font-semibold">
                            <span className="w-2 h-2 rounded-full bg-sky-400 shrink-0" />
                            Closes 30 December 2026
                        </div>
                    </div>

                    {/* Grid of terms */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                            { n: '01', text: 'Open to UK residents aged 18 and over only.' },
                            { n: '02', text: 'Must follow @myperfecttrips on Instagram and share the giveaway reel with at least 5 friends.' },
                            { n: '03', text: 'One entry per person. Duplicate or fraudulent entries will be disqualified.' },
                            { n: '04', text: 'Prize: one free holiday for one person — to Dubai, Turkey, Paris, or Georgia (winner\'s choice). Subject to availability and travel dates agreed with My Perfect Trips.' },
                            { n: '05', text: 'This is a complete land package — includes hotel accommodation with breakfast, all activities, and airport transfers. Visa costs and personal expenses are not included.' },
                            { n: '06', text: 'Draw closes 30 December 2026. Winner chosen at random and announced on 31 December 2026 via @myperfecttrips on Instagram.' },
                            { n: '07', text: 'The winner must claim their prize within 30 days of announcement. Unclaimed prizes are forfeit. No cash alternative.' },
                            { n: '08', text: 'My Perfect Trips reserves the right to amend or withdraw this promotion at any time without notice.' },
                        ].map(item => (
                            <div key={item.n}
                                className="flex gap-3 p-4 rounded-xl bg-white/4 border border-white/8 hover:border-sky-400/20 transition-colors">
                                <span className="shrink-0 w-7 h-7 rounded-lg bg-sky-400/15 border border-sky-400/25 flex items-center justify-center text-sky-400 font-black text-[10px]">
                                    {item.n}
                                </span>
                                <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">{item.text}</p>
                            </div>
                        ))}
                    </div>

                    <p className="mt-6 text-center text-stone-600 text-xs">
                        For any queries contact{' '}
                        <a href="mailto:info@myperfecttrips.com" className="text-sky-400 hover:text-sky-300 transition-colors underline underline-offset-2">
                            info@myperfecttrips.com
                        </a>
                    </p>
                </div>
            </section>
        </>
    );
}
