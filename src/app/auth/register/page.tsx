import Link from 'next/link';
import Image from 'next/image';
import { Compass } from 'lucide-react';
import RegisterForm from '@/components/auth/RegisterForm';
import { getSiteSettings } from '@/lib/directus';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Account | My Perfect Trips',
  description: 'Join My Perfect Trips — earn loyalty points, get travel reminders, and manage all your bookings in one place.',
};

export default async function RegisterPage() {
  let s: any = null;
  try { s = await getSiteSettings(); } catch { }
  const dUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
  const logoUrl = s?.logo ? `${dUrl}/assets/${s.logo}` : null;
  const heroImgUrl = s?.hero_image ? `${dUrl}/assets/${s.hero_image}` : null;

  return (
    <main className="min-h-screen flex bg-stone-50">
      {/* LEFT */}
      <div className="hidden lg:flex lg:w-[42%] flex-col relative overflow-hidden">
        {heroImgUrl ? (
          <Image src={heroImgUrl} alt="" fill className="object-cover" unoptimized priority />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-950/92 via-brand-950/82 to-brand-900/70" />
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-gold-400/8 blur-[90px]" />
        <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-brand-600/20 blur-[70px]" />

        <div className="relative z-10 flex flex-col h-full px-10 xl:px-12 py-10 xl:py-12">
          <Link href="/" className="flex items-center gap-3 w-fit group">
            {logoUrl ? (
              <Image src={logoUrl} alt="My Perfect Trips" width={130} height={36} className="h-8 w-auto brightness-0 invert" unoptimized />
            ) : (
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-white/10 flex items-center justify-center">
                  <Compass className="h-5 w-5 text-white" />
                </div>
                <span className="font-serif text-lg font-semibold text-white">My Perfect Trips</span>
              </div>
            )}
          </Link>

          <div className="flex-1 flex flex-col justify-center mt-14">
            <div className="inline-flex items-center gap-2 mb-5">
              <span className="h-px w-8 bg-gold-400/60" />
              <span className="text-gold-400 text-xs font-bold uppercase tracking-widest">Join the community</span>
            </div>
            <h1 className="font-serif text-3xl xl:text-4xl font-bold text-white leading-[1.2]">
              Travel smarter,<br />earn rewards.
            </h1>
            <p className="mt-4 text-stone-300/90 text-sm xl:text-base leading-relaxed max-w-[300px]">
              Create your free account and start earning loyalty points from your very first booking.
            </p>

            {/* Rewards card */}
            <div className="mt-8 rounded-2xl bg-white/8 border border-white/10 backdrop-blur-sm p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-9 w-9 rounded-xl bg-gold-400/20 flex items-center justify-center shrink-0">
                  <span className="text-lg">⭐</span>
                </div>
                <div>
                  <p className="text-white text-sm font-bold">IG Rewards</p>
                  <p className="text-stone-400 text-xs">Earn on every booking</p>
                </div>
              </div>
              <div className="space-y-2.5">
                {[
                  '£100 spent = 1 loyalty point',
                  'Redeem from 500 points (= £500 off)',
                  'Valid on packages & hotel stays',
                ].map(t => (
                  <div key={t} className="flex items-start gap-2.5">
                    <div className="h-4 w-4 rounded-full bg-gold-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-gold-400" />
                    </div>
                    <p className="text-stone-300/90 text-xs">{t}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="text-xs text-stone-500 mt-8 pt-8 border-t border-white/10">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-stone-300 hover:text-white transition-colors underline">Sign in</Link>
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 bg-white overflow-y-auto min-h-screen">
        <div className="w-full max-w-[420px]">
          {/* Mobile logo */}
          <div className="lg:hidden mb-7 text-center">
            <Link href="/" className="inline-flex items-center gap-2.5">
              {logoUrl ? (
                <Image src={logoUrl} alt="My Perfect Trips" width={120} height={36} className="h-8 w-auto" unoptimized />
              ) : (
                <>
                  <div className="h-8 w-8 rounded-xl bg-brand-900 flex items-center justify-center">
                    <Compass className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-serif text-lg font-semibold text-brand-950">My Perfect Trips</span>
                </>
              )}
            </Link>
          </div>

          <RegisterForm />
        </div>
      </div>
    </main>
  );
}
