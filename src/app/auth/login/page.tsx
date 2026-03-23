import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Compass, Bell, Gift, Shield, MapPin } from 'lucide-react';
import LoginForm from '@/components/auth/LoginForm';
import { getSiteSettings } from '@/lib/directus';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | IG Holidays',
  description: 'Sign in to your IG Holidays account to manage bookings, earn loyalty points, and get trip reminders.',
};

const features = [
  { icon: Bell, text: 'Smart reminders 7 days & 1 day before your trip' },
  { icon: Gift, text: 'Earn loyalty points on every booking' },
  { icon: Shield, text: 'Secure payments with full booking history' },
  { icon: MapPin, text: 'Personalised itineraries & 24/7 support' },
];

export default async function LoginPage() {
  let s: any = null;
  try { s = await getSiteSettings(); } catch { }
  const dUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
  const logoUrl = s?.logo ? `${dUrl}/assets/${s.logo}` : null;
  const heroImgUrl = s?.hero_image ? `${dUrl}/assets/${s.hero_image}` : null;

  return (
    <main className="min-h-screen flex bg-stone-50">
      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-[52%] xl:w-[56%] flex-col relative overflow-hidden">
        {/* Background: hero image or brand gradient */}
        {heroImgUrl ? (
          <Image src={heroImgUrl} alt="" fill className="object-cover" unoptimized priority />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800" />
        )}
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-950/92 via-brand-950/80 to-brand-900/70" />
        {/* Subtle dot grid */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        {/* Glow blobs */}
        <div className="absolute top-0 right-0 h-80 w-80 rounded-full bg-gold-400/8 blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-brand-600/20 blur-[80px]" />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full px-10 xl:px-14 py-10 xl:py-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 w-fit group">
            {logoUrl ? (
              <Image src={logoUrl} alt="IG Holidays" width={140} height={40} className="h-9 w-auto object-contain brightness-0 invert" unoptimized />
            ) : (
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 group-hover:bg-white/15 transition-colors">
                  <Compass className="h-5 w-5 text-white" />
                </div>
                <span className="font-serif text-xl font-semibold text-white">IG Holidays</span>
              </div>
            )}
          </Link>

          {/* Hero copy */}
          <div className="flex-1 flex flex-col justify-center mt-16">
            <div className="inline-flex items-center gap-2 mb-5">
              <span className="h-px w-8 bg-gold-400/60" />
              <span className="text-gold-400 text-xs font-bold uppercase tracking-widest">Your travel companion</span>
            </div>
            <h1 className="font-serif text-4xl xl:text-5xl font-bold text-white leading-[1.15]">
              Every journey<br />tells a story.
            </h1>
            <p className="mt-5 text-stone-300/90 text-base xl:text-lg leading-relaxed max-w-[340px]">
              Sign in to access your bookings, earn loyalty points, and let us craft your perfect adventure.
            </p>

            {/* Feature list */}
            <ul className="mt-10 space-y-3.5">
              {features.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 flex-shrink-0">
                    <Icon className="h-3.5 w-3.5 text-gold-400" />
                  </div>
                  <span className="text-sm text-stone-300/90">{text}</span>
                </li>
              ))}
            </ul>

            {/* Stats row */}
            <div className="mt-12 grid grid-cols-3 gap-3">
              {[
                { value: '10K+', label: 'Happy Travellers' },
                { value: '500+', label: 'Destinations' },
                { value: '4.9★', label: 'Avg Rating' },
              ].map(({ value, label }) => (
                <div key={label} className="rounded-2xl bg-white/8 border border-white/10 backdrop-blur-sm p-3.5 text-center">
                  <p className="text-lg font-bold text-white font-serif">{value}</p>
                  <p className="text-[10px] text-stone-400 mt-0.5 uppercase tracking-wider font-medium">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-3 mt-8 pt-8 border-t border-white/10">
            <div className="flex -space-x-2">
              {['R', 'P', 'A', 'M'].map(l => (
                <div key={l} className="h-7 w-7 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 border-2 border-brand-950/80 flex items-center justify-center text-[10px] font-bold text-brand-950">{l}</div>
              ))}
            </div>
            <p className="text-xs text-stone-400">Trusted by <span className="text-white font-semibold">10,000+</span> travellers across India</p>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-white min-h-screen">
        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-2.5">
              {logoUrl ? (
                <Image src={logoUrl} alt="IG Holidays" width={120} height={36} className="h-8 w-auto" unoptimized />
              ) : (
                <>
                  <div className="h-9 w-9 rounded-xl bg-brand-900 flex items-center justify-center">
                    <Compass className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-serif text-xl font-semibold text-brand-950">IG Holidays</span>
                </>
              )}
            </Link>
          </div>

          {/* Heading */}
          <div className="mb-7">
            <h2 className="text-2xl font-bold text-stone-900 tracking-tight">Welcome back</h2>
            <p className="text-stone-500 text-sm mt-1.5">Sign in to continue your journey</p>
          </div>

          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
