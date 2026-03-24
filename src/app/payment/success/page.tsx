import Link from 'next/link';
import { CheckCircle2, Clock, Calendar, ArrowRight, XCircle } from 'lucide-react';
import { verifyAndUpdatePayment } from '@/lib/cashfree';
import { adminFetch } from '@/lib/auth';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Booking Confirmed! | My Perfect Trips' };

type Props = { searchParams: Promise<{ bookingId?: string; ref?: string; order_id?: string }> };

function formatDate(d: string) {
    if (!d) return 'TBD';
    return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default async function PaymentSuccessPage({ searchParams }: Props) {
    const { bookingId, ref, order_id } = await searchParams;

    let booking: any = null;
    let paymentStatus: string = 'pending';

    if (order_id) {
        // Auto-verify with Cashfree — updates booking if paid
        try {
            const result = await verifyAndUpdatePayment(order_id, bookingId);
            paymentStatus = result.status;
            booking = result.booking;
        } catch {
            // Fall through — try to fetch booking directly
        }
    }

    // Fallback: fetch booking without verification
    if (!booking && bookingId) {
        try {
            const res = await adminFetch(`/items/bookings/${bookingId}`);
            const data = await res.json();
            booking = data.data;
            if (booking) paymentStatus = booking.payment_status || 'pending';
        } catch { }
    }

    const isPaid = paymentStatus === 'paid';
    const isFailed = !isPaid && (paymentStatus === 'expired' || paymentStatus === 'failed');

    // Failed / expired payment
    if (isFailed) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-red-50 via-white to-stone-50 flex items-center justify-center py-16 px-4">
                <div className="w-full max-w-lg text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 mx-auto mb-6">
                        <XCircle className="h-10 w-10 text-red-500" />
                    </div>
                    <h1 className="text-3xl font-bold text-stone-900 mb-2">Payment Not Completed</h1>
                    <p className="text-stone-500 mb-8">Your payment was not completed. Your booking has been saved — you can retry from your dashboard.</p>
                    {ref && (
                        <div className="rounded-xl border border-stone-200 bg-white p-4 mb-6 text-sm">
                            <span className="text-stone-500">Reference: </span>
                            <span className="font-mono font-semibold text-stone-700">{ref}</span>
                        </div>
                    )}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        {bookingId && (
                            <Link href={`/dashboard/bookings/${bookingId}`} className="btn-primary inline-flex justify-center">
                                Retry Payment
                            </Link>
                        )}
                        <Link href="/packages" className="btn-outline inline-flex justify-center">
                            Explore Packages
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-stone-50 flex items-center justify-center py-16 px-4">
            <div className="w-full max-w-lg text-center">
                {/* Icon */}
                <div className={`flex h-20 w-20 items-center justify-center rounded-full mx-auto mb-6 ${isPaid ? 'bg-green-100' : 'bg-amber-100'}`}>
                    {isPaid
                        ? <CheckCircle2 className="h-10 w-10 text-green-600" />
                        : <Clock className="h-10 w-10 text-amber-600" />
                    }
                </div>

                <h1 className="text-3xl font-bold text-stone-900 mb-2">
                    {isPaid ? 'Booking Confirmed!' : 'Payment Processing…'}
                </h1>
                <p className="text-stone-500 mb-8">
                    {isPaid
                        ? 'Your holiday adventure is all set. We\'ve sent confirmation details and will keep you updated.'
                        : 'Your payment is being processed. We\'ll confirm your booking as soon as it clears.'
                    }
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
                                <span className="text-stone-500">Amount</span>
                                <span className={`font-bold text-base ${isPaid ? 'text-green-700' : 'text-amber-700'}`}>
                                    £{Number(booking.total_amount).toLocaleString('en-GB')}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-stone-500">Payment</span>
                                <span className={`font-semibold text-sm ${isPaid ? 'text-green-700' : 'text-amber-600'}`}>
                                    {isPaid ? '✓ Paid via Cashfree' : '⏳ Processing'}
                                </span>
                            </div>
                        </div>
                    ) : ref ? (
                        <div className="text-center py-2">
                            <p className="text-sm text-stone-500">Reference: <span className="font-mono font-semibold text-stone-700">{ref}</span></p>
                        </div>
                    ) : (
                        <p className="text-center text-sm text-stone-400">Payment submitted successfully</p>
                    )}
                </div>

                {/* What's next */}
                <div className={`rounded-2xl border p-5 text-left mb-6 ${isPaid ? 'border-green-100 bg-green-50' : 'border-amber-100 bg-amber-50'}`}>
                    <p className={`font-semibold mb-2 ${isPaid ? 'text-green-800' : 'text-amber-800'}`}>What happens next?</p>
                    <ul className={`space-y-1.5 text-sm ${isPaid ? 'text-green-700' : 'text-amber-700'}`}>
                        {!isPaid && <li>⏳ Your payment is being processed (usually within a few minutes)</li>}
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
