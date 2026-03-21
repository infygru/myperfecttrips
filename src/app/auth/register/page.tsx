import Link from 'next/link';
import { Compass } from 'lucide-react';
import RegisterForm from '@/components/auth/RegisterForm';
import { getSiteSettings } from '@/lib/directus';
import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Create Account | IG Holidays',
    description: 'Join IG Holidays — earn loyalty points, get travel reminders, and manage all your bookings in one place.',
};

export default async function RegisterPage() {
    let s: any = null;
    try { s = await getSiteSettings(); } catch { }
    const dUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
    const logoUrl = s?.logo ? `${dUrl}/assets/${s.logo}` : null;

    return (
        <main className="min-h-screen flex">
            {/* LEFT — Brand strip */}
            <div className="hidden lg:flex lg:w-[42%] flex-col bg-brand-950 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5"
                    style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-gold-400/10 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-brand-700/30 blur-3xl" />

                <div className="relative z-10 flex flex-col h-full p-10 xl:p-12">
                    <Link href="/" className="flex items-center gap-3 w-fit group">
                        {logoUrl ? (
                            <Image src={logoUrl} alt="IG Holidays" width={130} height={36} className="h-8 w-auto brightness-0 invert" unoptimized />
                        ) : (
                            <>
                                <div className="h-9 w-9 rounded-xl bg-white/10 flex items-center justify-center">
                                    <Compass className="h-5 w-5 text-white" />
                                </div>
                                <span className="font-serif text-lg font-semibold text-white">IG Holidays</span>
                            </>
                        )}
                    </Link>

                    <div className="flex-1 flex flex-col justify-center">
                        <p className="text-gold-400 text-xs font-bold uppercase tracking-widest mb-3">Join the community</p>
                        <h1 className="font-serif text-3xl xl:text-4xl font-bold text-white leading-tight">
                            Travel smarter,<br />earn rewards
                        </h1>
                        <p className="mt-4 text-stone-300 text-sm xl:text-base leading-relaxed">
                            Create your free account and start earning loyalty points from your very first booking.
                        </p>

                        {/* Loyalty highlight */}
                        <div className="mt-8 rounded-2xl bg-white/10 border border-white/10 p-5">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-9 w-9 rounded-xl bg-gold-400/20 flex items-center justify-center">
                                    <span className="text-lg">⭐</span>
                                </div>
                                <div>
                                    <p className="text-white text-sm font-bold">IG Rewards</p>
                                    <p className="text-stone-400 text-xs">Loyalty points programme</p>
                                </div>
                            </div>
                            <div className="space-y-2.5">
                                {[
                                    '1 point earned for every ₹100 you spend',
                                    'Redeem from 500 points — ₹500 off your booking',
                                    'Valid on holiday packages and hotel stays',
                                ].map(t => (
                                    <div key={t} className="flex items-start gap-2">
                                        <div className="h-4 w-4 rounded-full bg-gold-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <div className="h-1.5 w-1.5 rounded-full bg-gold-400" />
                                        </div>
                                        <p className="text-stone-300 text-xs">{t}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <p className="text-xs text-stone-500 mt-8">Already have an account?{' '}
                        <Link href="/auth/login" className="text-stone-300 hover:text-white underline">Sign in</Link>
                    </p>
                </div>
            </div>

            {/* RIGHT — Form */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 bg-white overflow-y-auto">
                <div className="w-full max-w-[420px]">
                    {/* Mobile logo */}
                    <div className="lg:hidden mb-6 text-center">
                        <Link href="/" className="inline-flex items-center gap-2">
                            <div className="h-8 w-8 rounded-xl bg-brand-900 flex items-center justify-center">
                                <Compass className="h-4 w-4 text-white" />
                            </div>
                            <span className="font-serif text-lg font-semibold text-brand-950">IG Holidays</span>
                        </Link>
                    </div>

                    <RegisterForm />
                </div>
            </div>
        </main>
    );
}
