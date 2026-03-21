import Link from 'next/link';
import { CheckCircle2, Calendar, ArrowRight, Download } from 'lucide-react';
import { adminFetch } from '@/lib/auth';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Booking Confirmed! | IG Holidays' };

type Props = { searchParams: Promise<{ bookingId?: string; ref?: string }> };

function formatDate(d: string) {
    if (!d) return 'TBD';
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default async function PaymentSuccessPage({ searchParams }: Props) {
    const { bookingId, ref } = await searchParams;

    let booking: any = null;
    if (bookingId) {
        try {
            const res = await adminFetch(`/items/bookings/${bookingId}`);
            const data = await res.json();
            booking = data.data;
        } catch { }
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-stone-50 flex items-center justify-center py-16 px-4">
            <div className="w-full max-w-lg text-center">
                {/* Success icon */}
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 mx-auto mb-6">
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>

                <h1 className="text-3xl font-bold text-stone-900 mb-2">Booking Confirmed!</h1>
                <p className="text-stone-500 mb-8">
                    Your holiday adventure is all set. We&apos;ve sent confirmation details and will keep you updated.
                </p>

                {/* Booking summary */}
                <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm text-left mb-6">
                    {booking ? (
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-stone-500">Package</span>
                                <span className="font-semibold text-stone-900 text-right">{booking.package_title}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-stone-500">Reference</span>
                                <span className="font-mono font-semibold text-stone-700">{booking.reference_number}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-stone-500">Travel Date</span>
                                <span className="font-semibold text-stone-900">{formatDate(booking.travel_date)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-stone-500">Travellers</span>
                                <span className="font-semibold text-stone-900">
                                    {booking.num_adults} Adult{booking.num_adults !== 1 ? 's' : ''}
                                    {booking.num_children > 0 && `, ${booking.num_children} Child${booking.num_children !== 1 ? 'ren' : ''}`}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm border-t border-stone-100 pt-3">
                                <span className="text-stone-500">Amount Paid</span>
                                <span className="font-bold text-green-700 text-base">₹{Number(booking.total_amount).toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                    ) : ref ? (
                        <div className="text-center py-2">
                            <p className="text-sm text-stone-500">Reference: <span className="font-mono font-semibold text-stone-700">{ref}</span></p>
                        </div>
                    ) : (
                        <p className="text-center text-sm text-stone-400">Payment successful</p>
                    )}
                </div>

                {/* What's next */}
                <div className="rounded-2xl border border-green-100 bg-green-50 p-5 text-left mb-6">
                    <p className="font-semibold text-green-800 mb-2">What happens next?</p>
                    <ul className="space-y-1.5 text-sm text-green-700">
                        <li>✓ Our team will call you within 24 hours to confirm all details</li>
                        <li>✓ You&apos;ll receive SMS reminders 7 days &amp; 1 day before your trip</li>
                        <li>✓ Your itinerary and vouchers will be sent to your email</li>
                        <li>✓ Call us anytime at +91 8807709919 for assistance</li>
                    </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {bookingId && (
                        <Link href={`/dashboard/bookings/${bookingId}`} className="btn-primary inline-flex justify-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            View My Booking
                        </Link>
                    )}
                    <Link href="/packages" className="btn-outline inline-flex justify-center">
                        Explore More Packages
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                </div>
            </div>
        </main>
    );
}
