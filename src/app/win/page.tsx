import type { Metadata } from 'next';
import { Gift, Instagram, Share2, UserCheck, Trophy } from 'lucide-react';
import LuckyDrawForm from '@/components/LuckyDrawForm';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://myperfecttrips.com';

export const metadata: Metadata = {
    title: 'Win a Free Trip | Lucky Draw Giveaway – My Perfect Trips',
    description: 'Enter our FREE trip lucky draw! Follow us on Instagram, share our reel with 5 friends, and win a holiday to Dubai, Turkey, Paris, or Georgia. Winner announced 31 December 2026.',
    keywords: 'free trip giveaway UK, lucky draw holiday, win free holiday, My Perfect Trips giveaway, Dubai free trip, travel giveaway Manchester',
    alternates: { canonical: `${BASE}/win` },
    openGraph: {
        title: 'Win a FREE Trip with My Perfect Trips!',
        description: 'Follow us, share our reel with 5 friends, and enter to win a FREE holiday to Dubai, Turkey, Paris, or Georgia!',
        url: `${BASE}/win`,
        siteName: 'My Perfect Trips',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Win a FREE Trip with My Perfect Trips!',
        description: 'Enter our lucky draw and win a free holiday to Dubai, Turkey, Paris, or Georgia!',
    },
};

const STEPS = [
    {
        icon: Instagram,
        step: '01',
        title: 'Follow Us on Instagram',
        description: 'Follow @myperfecttrips on Instagram if you haven\'t already.',
    },
    {
        icon: Share2,
        step: '02',
        title: 'Share Our Reel',
        description: 'Share our giveaway reel to your Instagram story or send it directly to 5 friends.',
    },
    {
        icon: UserCheck,
        step: '03',
        title: 'Fill in the Form',
        description: 'Complete the entry form below with your details and upload a screenshot as proof.',
    },
    {
        icon: Trophy,
        step: '04',
        title: 'Win a Free Trip!',
        description: 'One lucky winner will be announced live on 31st December 2026.',
    },
];

const DESTINATIONS = [
    { name: 'Dubai', emoji: '🇦🇪', desc: 'Burj Khalifa, desert safari & world-class luxury' },
    { name: 'Turkey', emoji: '🇹🇷', desc: 'Istanbul\'s grand bazaars, Cappadocia & coastal gems' },
    { name: 'Paris', emoji: '🇫🇷', desc: 'The Eiffel Tower, Louvre & romantic city walks' },
    { name: 'Georgia', emoji: '🇬🇪', desc: 'Ancient monasteries, the Caucasus mountains & fine wine' },
];

export default function WinPage() {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: 'My Perfect Trips Free Holiday Lucky Draw',
        description: 'Win a free trip to Dubai, Turkey, Paris, or Georgia. Follow us on Instagram, share our reel with 5 friends, and enter the lucky draw.',
        startDate: '2026-10-20',
        endDate: '2026-12-31',
        organizer: {
            '@type': 'TravelAgency',
            name: 'My Perfect Trips',
            url: BASE,
        },
        url: `${BASE}/win`,
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />

            {/* Hero */}
            <section className="relative min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-brand-950 via-brand-900 to-stone-900 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold-400/10 via-transparent to-transparent pointer-events-none" />
                <div className="relative z-10 text-center px-6 py-20 max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-400/20 border border-gold-400/30 text-gold-400 text-sm font-semibold mb-6">
                        <Gift className="w-4 h-4" />
                        FREE TRIP GIVEAWAY
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4">
                        Win a <span className="text-gold-400">Free Holiday</span><br />
                        on Us!
                    </h1>
                    <p className="text-stone-300 text-lg md:text-xl mb-8 max-w-xl mx-auto">
                        We're giving away a completely free trip for two to one lucky winner.
                        Choose your dream destination — Dubai, Turkey, Paris, or Georgia.
                    </p>
                    <a
                        href="#enter"
                        className="inline-block px-8 py-4 rounded-xl bg-gold-400 hover:bg-gold-500 text-brand-950 font-bold text-lg transition"
                    >
                        Enter Now — It's Free
                    </a>
                    <p className="mt-4 text-stone-500 text-sm">Winner announced 31 December 2026</p>
                </div>
            </section>

            {/* Prize destinations */}
            <section className="bg-brand-950 py-16 px-6">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-3">
                        Choose Your Dream Destination
                    </h2>
                    <p className="text-stone-400 text-center mb-10">
                        The winner picks any one of these four incredible destinations.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {DESTINATIONS.map(d => (
                            <div
                                key={d.name}
                                className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center hover:border-gold-400/40 transition"
                            >
                                <div className="text-4xl mb-3">{d.emoji}</div>
                                <h3 className="text-white font-bold text-lg mb-1">{d.name}</h3>
                                <p className="text-stone-400 text-xs">{d.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How to enter */}
            <section className="bg-stone-950 py-16 px-6">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-3">
                        How to Enter
                    </h2>
                    <p className="text-stone-400 text-center mb-10">Three simple steps to be in with a chance of winning.</p>
                    <div className="grid md:grid-cols-2 gap-6">
                        {STEPS.map(({ icon: Icon, step, title, description }) => (
                            <div key={step} className="flex gap-4 bg-white/5 border border-white/10 rounded-2xl p-6">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 rounded-xl bg-gold-400/20 border border-gold-400/30 flex items-center justify-center">
                                        <Icon className="w-5 h-5 text-gold-400" />
                                    </div>
                                </div>
                                <div>
                                    <div className="text-gold-400 text-xs font-bold mb-1">STEP {step}</div>
                                    <h3 className="text-white font-semibold mb-1">{title}</h3>
                                    <p className="text-stone-400 text-sm">{description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Entry form */}
            <section id="enter" className="bg-brand-950 py-16 px-6">
                <div className="max-w-lg mx-auto">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-400/20 border border-gold-400/30 text-gold-400 text-sm font-semibold mb-4">
                            <Gift className="w-4 h-4" />
                            ENTER THE LUCKY DRAW
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                            Submit Your Entry
                        </h2>
                        <p className="text-stone-400 text-sm">
                            Fill in your details below. Make sure you've followed us and shared the reel first!
                        </p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
                        <LuckyDrawForm />
                    </div>
                </div>
            </section>

            {/* T&Cs */}
            <section className="bg-stone-950 py-10 px-6">
                <div className="max-w-2xl mx-auto text-stone-500 text-xs space-y-2">
                    <h3 className="text-stone-400 font-semibold text-sm mb-3">Terms & Conditions</h3>
                    <p>1. This giveaway is open to UK residents aged 18 and over.</p>
                    <p>2. To enter, participants must follow @myperfecttrips on Instagram and share the giveaway reel with a minimum of 5 friends.</p>
                    <p>3. One entry per person. Duplicate entries will be disqualified.</p>
                    <p>4. The prize is one trip for two people to the winner's chosen destination (Dubai, Turkey, Paris, or Georgia). The trip is subject to availability and travel dates to be agreed with My Perfect Trips.</p>
                    <p>5. The prize includes return flights from a UK airport and accommodation as specified. Travel insurance and personal expenses are not included.</p>
                    <p>6. The winner will be selected at random and announced on 31 December 2026 via Instagram.</p>
                    <p>7. The winner must claim their prize within 30 days of announcement. Unclaimed prizes will be forfeit.</p>
                    <p>8. My Perfect Trips reserves the right to amend or withdraw this promotion at any time.</p>
                    <p>9. No cash alternative is offered.</p>
                    <p>10. My Perfect Trips, Bartle House, 9 Oxford Court, Manchester M2 3WQ is the promoter of this competition.</p>
                </div>
            </section>
        </>
    );
}
