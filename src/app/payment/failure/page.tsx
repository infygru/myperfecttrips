import Link from 'next/link';
import { XCircle, Phone, RotateCcw } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Payment Failed | My Perfect Trips' };

type Props = { searchParams: Promise<{ bookingId?: string; ref?: string; error?: string }> };

export default async function PaymentFailurePage({ searchParams }: Props) {
    const { bookingId, ref, error } = await searchParams;

    const errorMessages: Record<string, string> = {
        missing_order: 'Order information was missing in the payment response.',
        invalid_checksum: 'Payment verification failed due to a checksum mismatch.',
        booking_not_found: 'We could not find the associated booking.',
        server_error: 'A server error occurred while processing your payment.',
    };

    const displayError = error ? errorMessages[error] : 'Your payment could not be processed.';

    return (
        <main className="min-h-screen bg-gradient-to-br from-red-50 via-white to-stone-50 flex items-center justify-center py-16 px-4">
            <div className="w-full max-w-lg text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 mx-auto mb-6">
                    <XCircle className="h-10 w-10 text-red-500" />
                </div>

                <h1 className="text-3xl font-bold text-stone-900 mb-2">Payment Failed</h1>
                <p className="text-stone-500 mb-8">{displayError}</p>

                {ref && (
                    <div className="rounded-xl border border-stone-200 bg-white p-4 mb-6 text-sm">
                        <span className="text-stone-500">Reference: </span>
                        <span className="font-mono font-semibold text-stone-700">{ref}</span>
                    </div>
                )}

                <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5 text-left mb-6">
                    <p className="font-semibold text-amber-800 mb-2">Don&apos;t worry — your booking is saved</p>
                    <p className="text-sm text-amber-700">
                        Your booking details have been saved. You can retry the payment from your dashboard,
                        or call us to complete it over phone.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {bookingId ? (
                        <Link
                            href={`/dashboard/bookings/${bookingId}`}
                            className="btn-primary inline-flex justify-center"
                        >
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Retry Payment
                        </Link>
                    ) : (
                        <Link href="/dashboard/bookings" className="btn-primary inline-flex justify-center">
                            View My Bookings
                        </Link>
                    )}
                    <a
                        href="tel:+918807709919"
                        className="btn-outline inline-flex justify-center"
                    >
                        <Phone className="h-4 w-4 mr-2" />
                        Call Us
                    </a>
                </div>
            </div>
        </main>
    );
}
