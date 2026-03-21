import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Compass, Star, MapPin, Shield, Bell, Gift } from 'lucide-react';
import LoginForm from '@/components/auth/LoginForm';
import { getSiteSettings } from '@/lib/directus';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sign In | IG Holidays',
    description: 'Sign in to your IG Holidays account to manage bookings, earn loyalty points, and get trip reminders.',
};

const features = [
    { icon: Bell, text: 'Smart reminders 7 days & 1 day before your trip' },
    { icon: Gift, text: 'Earn loyalty points on every booking — redeem for discounts' },
    { icon: Shield, text: 'Secure payments with full booking history' },
    { icon: MapPin, text: 'Personalised itineraries and 24/7 expert support' },
];

const stats = [
    { value: '10,000+', label: 'Happy Travellers' },
    { value: '500+', label: 'Destinations' },
    { value: '4.9★', label: 'Average Rating' },
];

export default async function LoginPage() {
    let s: any = null;
    try { s = await getSiteSettings(); } catch { }
    const dUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
    const logoUrl = s?.logo ? `${dUrl}/assets/${s.logo}` : null;

    return (
        <main className="min-h-screen flex">
            {/* ── LEFT PANEL — Brand ── */}
            <div className="hidden lg:flex lg:w-[52%] xl:w-[55%] flex-col bg-brand-950 relative overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-5"
                    style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
                <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-gold-400/10 blur-3xl" />
                <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-brand-700/40 blur-3xl" />

                <div className="relative z-10 flex flex-col h-full p-10 xl:p-14">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group w-fit">
                        {logoUrl ? (
                            <Image src={logoUrl} alt="IG Holidays" width={140} height={40} className="h-9 w-auto object-contain brightness-0 invert" unoptimized />
                        ) : (
                            <>
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 group-hover:bg-white/15 transition-colors">
                                    <Compass className="h-5 w-5 text-white" />
                                </div>
                                <span className="font-serif text-xl font-semibold text-white">IG Holidays</span>
                            </>
                        )}
                    </Link>

                    {/* Main copy */}
                    <div className="flex-1 flex flex-col justify-center mt-16">
                        <p className="text-gold-400 text-sm font-semibold uppercase tracking-widest mb-4">Your travel companion</p>
                        <h1 className="font-serif text-4xl xl:text-5xl font-bold text-white leading-tight">
                            Every journey<br />tells a story
                        </h1>
                        <p className="mt-5 text-stone-300 text-base xl:text-lg leading-relaxed max-w-sm">
                            Sign in to access your bookings, earn loyalty points, and let us handle the rest of your adventure.
                        </p>

                        {/* Features */}
                        <ul className="mt-10 space-y-4">
                            {features.map(({ icon: Icon, text }) => (
                                <li key={text} className="flex items-start gap-3.5">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 flex-shrink-0 mt-0.5">
                                        <Icon className="h-3.5 w-3.5 text-gold-400" />
                                    </div>
                                    <span className="text-sm text-stone-300">{text}</span>
                                </li>
                            ))}
                        </ul>

                        {/* Stats */}
                        <div className="mt-12 grid grid-cols-3 gap-4">
                            {stats.map(({ value, label }) => (
                                <div key={label} className="rounded-2xl bg-white/5 border border-white/10 p-4">
                                    <p className="text-xl font-bold text-white">{value}</p>
                                    <p className="text-xs text-stone-400 mt-0.5">{label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom trust */}
                    <div className="flex items-center gap-2 mt-8">
                        <div className="flex -space-x-2">
                            {['R','P','A','M'].map(l => (
                                <div key={l} className="h-7 w-7 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 border-2 border-brand-950 flex items-center justify-center text-[10px] font-bold text-brand-950">{l}</div>
                            ))}
                        </div>
                        <p className="text-xs text-stone-400">Trusted by <span className="text-white font-semibold">10,000+</span> travellers across India</p>
                    </div>
                </div>
            </div>

            {/* ── RIGHT PANEL — Form ── */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-white">
                <div className="w-full max-w-[400px]">
                    {/* Mobile logo */}
                    <div className="lg:hidden mb-8 text-center">
                        <Link href="/" className="inline-flex items-center gap-2">
                            <div className="h-9 w-9 rounded-xl bg-brand-900 flex items-center justify-center">
                                <Compass className="h-5 w-5 text-white" />
                            </div>
                            <span className="font-serif text-xl font-semibold text-brand-950">IG Holidays</span>
                        </Link>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-stone-900">Welcome back</h2>
                        <p className="text-stone-500 text-sm mt-1.5">Sign in to your account to continue</p>
                    </div>

                    <Suspense>
                        <LoginForm />
                    </Suspense>
                </div>
            </div>
        </main>
    );
}
