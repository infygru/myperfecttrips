import type { Metadata } from 'next';
import Image from 'next/image';
import { Gift, CheckCircle, Plane, Star, Sparkles } from 'lucide-react';
import LuckyDrawForm from '@/components/LuckyDrawForm';
import CountdownTimer from '@/components/CountdownTimer';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://myperfecttrips.com';

export const metadata: Metadata = {
    title: 'Win a FREE Holiday for Two | Lucky Draw – My Perfect Trips',
    description: 'Enter our FREE holiday lucky draw! Follow @myperfecttrips, share our reel with 5 friends, and win a trip worth up to £3,000 to Dubai, Turkey, Paris, or Georgia. Winner announced 31 December 2026.',
    keywords: 'free trip giveaway UK, win free holiday, lucky draw 2026, My Perfect Trips giveaway, Dubai free trip, travel competition UK',
    alternates: { canonical: `${BASE}/lucky-draw` },
    openGraph: {
        title: 'Win a FREE Holiday for Two — My Perfect Trips',
        description: 'Follow us, share our reel with 5 friends, and win a holiday worth up to £3,000!',
        url: `${BASE}/lucky-draw`,
        siteName: 'My Perfect Trips',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Win a FREE Holiday for Two — My Perfect Trips',
        description: 'Enter our lucky draw and win a free holiday worth up to £3,000!',
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
    description: 'Win a free trip for two to Dubai, Turkey, Paris, or Georgia worth up to £3,000.',
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
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-rose-500 to-violet-700 animate-gradient" />

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
                            My Perfect Trips is giving away
                        </p>
                        <h1 className="font-serif font-black text-white leading-[0.9] tracking-tight drop-shadow-2xl"
                            style={{ fontSize: 'clamp(3rem, 14vw, 7rem)' }}>
                            A FREE<br />HOLIDAY<br />
                            <span className="text-yellow-200">FOR TWO</span>
                        </h1>
                        <p className="mt-3 text-white font-bold text-base sm:text-xl">
                            ✈️ Worth up to <span className="text-yellow-200 text-xl sm:text-2xl">£3,000</span> — Flights · Hotel · Transfers
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

                    {/* STEPS — compact horizontal row */}
                    <div className="hero-anim-4 w-full">
                        <div className="flex items-center justify-center gap-1 sm:gap-2 flex-wrap">
                            {[
                                { n: '01', label: 'Follow us' },
                                { n: '02', label: 'Share reel' },
                                { n: '03', label: 'Fill form' },
                                { n: '04', label: '🏆 Win!' },
                            ].map((s, i) => (
                                <div key={s.n} className="flex items-center gap-1 sm:gap-2">
                                    <div className="flex items-center gap-1.5 bg-white/15 border border-white/25 backdrop-blur-sm rounded-full px-3 py-1.5">
                                        <span className="text-yellow-200 font-black text-[10px] sm:text-xs">{s.n}</span>
                                        <span className="text-white font-semibold text-[10px] sm:text-xs">{s.label}</span>
                                    </div>
                                    {i < 3 && <span className="text-white/50 font-bold text-xs">→</span>}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* COUNTDOWN */}
                    <div className="hero-anim-5 w-full">
                        <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-3">
                            Winner announced in
                        </p>
                        <CountdownTimer target="2026-12-31T23:59:59" />
                        <p className="mt-2 text-white/50 text-[11px]">31 December 2026 · Open to UK residents 18+</p>
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
                            {['🏆 ONE LUCKY WINNER', '✈️ FLIGHTS INCLUDED', '🏨 HOTEL INCLUDED', '🚗 TRANSFERS INCLUDED', '💰 WORTH UP TO £3,000', '🇦🇪 DUBAI', '🇹🇷 TURKEY', '🇫🇷 PARIS', '🇬🇪 GEORGIA', '📸 SHARE & WIN'].map(item => (
                                <span key={item} className="text-rose-700 font-black text-xs tracking-widest uppercase">
                                    {item} <span className="text-rose-400 mx-1">·</span>
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* ══════════════════════════════════════════
                ENTRY FORM — continuation of gradient
            ══════════════════════════════════════════ */}
            <section id="enter" className="relative py-14 sm:py-20 overflow-hidden">

                {/* Background — complementary gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-700 via-pink-600 to-rose-500 animate-gradient" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(255,255,255,0.08),transparent)]" />
                <div className="absolute inset-0 opacity-[0.04]"
                    style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

                {/* Floating decoratives */}
                <div className="absolute top-10 left-[5%] animate-float pointer-events-none opacity-20">
                    <Star className="w-8 h-8 text-yellow-200 fill-yellow-200" />
                </div>
                <div className="absolute bottom-16 right-[8%] animate-float-2 pointer-events-none opacity-15">
                    <Plane className="w-12 h-12 text-white rotate-45" />
                </div>

                <div className="relative z-10 max-w-lg mx-auto px-5">

                    {/* Heading */}
                    <div className="text-center mb-7" data-aos="fade-up">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 border border-white/30 text-white text-xs font-bold uppercase tracking-widest mb-4">
                            <Gift className="w-3.5 h-3.5" />
                            Final Step
                        </div>
                        <h2 className="font-serif text-3xl sm:text-4xl font-black text-white mb-2">
                            Submit Your Entry
                        </h2>
                        <p className="text-white/70 text-sm sm:text-base">
                            Follow &amp; share first — then fill in below.
                        </p>
                    </div>

                    {/* Quick checklist */}
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 mb-6" data-aos="fade-up" data-aos-delay="80">
                        {[
                            { icon: '✅', text: 'Followed @myperfecttrips' },
                            { icon: '✅', text: 'Shared reel × 5 friends' },
                            { icon: '📸', text: 'Screenshot ready' },
                        ].map(item => (
                            <div key={item.text}
                                className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/15 border border-white/20 text-white text-xs sm:text-sm font-semibold backdrop-blur-sm">
                                <span className="shrink-0">{item.icon}</span>
                                {item.text}
                            </div>
                        ))}
                    </div>

                    {/* Form card — glass on vivid bg */}
                    <div
                        data-aos="zoom-in"
                        data-aos-delay="120"
                        className="rounded-2xl sm:rounded-3xl bg-white/10 border border-white/20 backdrop-blur-xl shadow-2xl p-5 sm:p-8">
                        <LuckyDrawForm />
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                T&Cs — minimal
            ══════════════════════════════════════════ */}
            <section className="py-10 bg-stone-950">
                <div className="max-w-2xl mx-auto px-5">
                    <h3 className="text-stone-500 font-bold text-xs uppercase tracking-wider mb-4">Terms &amp; Conditions</h3>
                    <ol className="space-y-1.5 text-stone-600 text-[11px] leading-relaxed list-decimal pl-4">
                        <li>Open to UK residents aged 18 and over.</li>
                        <li>Must follow @myperfecttrips on Instagram and share the giveaway reel with 5 friends to enter.</li>
                        <li>One entry per person. Duplicates disqualified.</li>
                        <li>Prize: one trip for two, worth up to £3,000 (Dubai, Turkey, Paris, or Georgia). Subject to availability and travel dates agreed with My Perfect Trips.</li>
                        <li>Includes return flights from a UK airport and hotel accommodation. Travel insurance and personal expenses not included.</li>
                        <li>Winner selected at random and announced 31 December 2026 via Instagram.</li>
                        <li>Winner must claim within 30 days or prize is forfeit. No cash alternative.</li>
                        <li>My Perfect Trips reserves the right to amend or withdraw this promotion at any time.</li>
                        <li>Promoter: My Perfect Trips, Bartle House, 9 Oxford Court, Manchester M2 3WQ.</li>
                    </ol>
                </div>
            </section>
        </>
    );
}
