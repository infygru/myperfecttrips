import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { directus } from '@/lib/directus';
import { readItems } from '@directus/sdk';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Shield, Clock, MapPin, Star } from 'lucide-react';
import { getUserLoyaltyBalance, MIN_REDEEM } from '@/lib/loyalty';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ packageSlug: string }>; searchParams: Promise<{ bookingId?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    return { title: 'Checkout | My Perfect Trips' };
}

export default async function CheckoutPage({ params, searchParams }: Props) {
    const { packageSlug } = await params;
    const { bookingId } = await searchParams;

    const user = await getCurrentUser();
    if (!user) redirect(`/auth/login?redirect=/checkout/${packageSlug}`);

    const loyaltyBalance = await getUserLoyaltyBalance(user.id);

    // Fetch package
    let pkg: any;
    try {
        const result = (await directus.request(
            readItems('packages' as any, {
                filter: { slug: { _eq: packageSlug } } as any,
                limit: 1,
            })
        )) as any[];
        pkg = result?.[0];
    } catch { }

    if (!pkg) return notFound();

    const dUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
    const imageUrl = pkg.image ? `${dUrl}/assets/${pkg.image}` : null;
    const price = Number(pkg.price) || 0;

    return (
        <main className="min-h-screen bg-stone-50 py-10 px-4">
            <div className="container-inner">
                <Link href={`/packages/${packageSlug}`} className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-brand-700 mb-8 transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back to package
                </Link>

                <h1 className="text-3xl font-bold text-stone-900 mb-8">Complete Your Booking</h1>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Booking form */}
                    <div className="lg:col-span-3">
                        <CheckoutForm
                            packageId={pkg.id}
                            packageTitle={pkg.title}
                            packageSlug={packageSlug}
                            basePrice={price}
                            userId={user.id}
                            userName={`${user.first_name} ${user.last_name}`}
                            userEmail={user.email}
                            userPhone={user.phone || ''}
                            loyaltyBalance={loyaltyBalance}
                            existingBookingId={bookingId}
                        />
                    </div>

                    {/* Order summary */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Package card */}
                        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sticky top-24">
                            <h2 className="font-bold text-stone-900 mb-4">Order Summary</h2>

                            {imageUrl && (
                                <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-4">
                                    <Image src={imageUrl} alt={pkg.title} fill className="object-cover" unoptimized />
                                </div>
                            )}

                            <h3 className="font-semibold text-stone-900">{pkg.title}</h3>

                            <div className="flex flex-wrap gap-3 mt-2 mb-4">
                                {pkg.destination && (
                                    <span className="flex items-center gap-1 text-xs text-stone-500">
                                        <MapPin className="h-3 w-3" /> {pkg.destination}
                                    </span>
                                )}
                                {(pkg.duration_nights || pkg.duration_days) && (
                                    <span className="flex items-center gap-1 text-xs text-stone-500">
                                        <Clock className="h-3 w-3" />
                                        {pkg.duration_nights}N/{pkg.duration_days}D
                                    </span>
                                )}
                            </div>

                            <div className="border-t border-stone-100 pt-4 space-y-2">
                                <div className="flex justify-between text-sm text-stone-600">
                                    <span>Base price (per person)</span>
                                    <span>£{price.toLocaleString('en-GB')}</span>
                                </div>
                                <p className="text-xs text-stone-400">Final amount calculated based on travellers below</p>
                            </div>

                            {/* Loyalty points earned */}
                            {price > 0 && (
                                <div className="mt-3 flex items-center gap-2 rounded-xl bg-gold-50 border border-gold-100 px-3 py-2.5">
                                    <Star className="h-3.5 w-3.5 text-gold-600 fill-gold-500 flex-shrink-0" />
                                    <p className="text-xs text-gold-800 font-medium">
                                        Earn up to <span className="font-bold">{Math.floor(price / 100)} pts</span> per person on this booking
                                    </p>
                                </div>
                            )}
                            {loyaltyBalance >= MIN_REDEEM && (
                                <div className="mt-2 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-100 px-3 py-2.5">
                                    <Shield className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                                    <p className="text-xs text-emerald-800 font-medium">
                                        You have <span className="font-bold">{loyaltyBalance} pts</span> available to redeem
                                    </p>
                                </div>
                            )}

                            {/* Trust badges */}
                            <div className="mt-4 pt-4 border-t border-stone-100 space-y-2">
                                <div className="flex items-center gap-2 text-xs text-stone-500">
                                    <Shield className="h-3.5 w-3.5 text-green-500" />
                                    Secure payment via Cashfree
                                </div>
                                <div className="flex items-center gap-2 text-xs text-stone-500">
                                    <Shield className="h-3.5 w-3.5 text-green-500" />
                                    Instant booking confirmation
                                </div>
                                <div className="flex items-center gap-2 text-xs text-stone-500">
                                    <Shield className="h-3.5 w-3.5 text-green-500" />
                                    24/7 customer support
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
