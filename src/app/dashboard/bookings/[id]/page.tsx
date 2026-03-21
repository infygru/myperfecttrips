import { getCurrentUser, adminFetch } from '@/lib/auth';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Users, Phone, Mail, FileText, CreditCard, CheckCircle2, XCircle, Clock } from 'lucide-react';
import CancelBookingButton from '@/components/dashboard/CancelBookingButton';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    return { title: 'Booking Details | IG Holidays' };
}

function formatDate(d: string) {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function formatDateTime(d: string) {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

const STATUS_ICON: Record<string, any> = {
    confirmed: <CheckCircle2 className="h-5 w-5 text-green-600" />,
    pending: <Clock className="h-5 w-5 text-yellow-500" />,
    cancelled: <XCircle className="h-5 w-5 text-red-500" />,
    completed: <CheckCircle2 className="h-5 w-5 text-stone-400" />,
};

const STATUS_COLORS: Record<string, string> = {
    confirmed: 'bg-green-50 text-green-700 border-green-200',
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
    completed: 'bg-stone-50 text-stone-600 border-stone-200',
};

export default async function BookingDetailPage({ params }: Props) {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) redirect(`/auth/login?redirect=/dashboard/bookings/${id}`);

    const res = await adminFetch(`/items/bookings/${id}`);
    const data = await res.json();
    const b = data.data;

    if (!b) return notFound();
    if (b.user_id !== user.id) return notFound();

    // Fetch payment records
    const payRes = await adminFetch(`/items/payments?filter[booking_id][_eq]=${id}&sort[]=-date_created`);
    const payData = await payRes.json();
    const payments: any[] = payData.data || [];

    const canCancel = b.status === 'confirmed';

    return (
        <div className="space-y-6">
            {/* Back */}
            <Link href="/dashboard/bookings" className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-brand-700 transition-colors">
                <ArrowLeft className="h-4 w-4" /> Back to bookings
            </Link>

            {/* Header */}
            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-stone-900">{b.package_title}</h1>
                        <p className="text-stone-400 text-sm mt-1">Reference: <span className="font-mono font-semibold text-stone-600">{b.reference_number}</span></p>
                    </div>
                    <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${STATUS_COLORS[b.status] || STATUS_COLORS.pending}`}>
                        {STATUS_ICON[b.status]}
                        {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                    <InfoTile icon={<Calendar className="h-4 w-4" />} label="Travel Date" value={formatDate(b.travel_date)} />
                    <InfoTile icon={<Users className="h-4 w-4" />} label="Travellers" value={`${b.num_adults} Adult${b.num_adults !== 1 ? 's' : ''}${b.num_children > 0 ? `, ${b.num_children} Child${b.num_children !== 1 ? 'ren' : ''}` : ''}`} />
                    <InfoTile icon={<CreditCard className="h-4 w-4" />} label="Total Amount" value={`₹${Number(b.total_amount).toLocaleString('en-IN')}`} />
                    <InfoTile icon={<Clock className="h-4 w-4" />} label="Booked On" value={formatDateTime(b.date_created)} />
                </div>
            </div>

            {/* Two columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Contact info */}
                <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                    <h2 className="font-bold text-stone-900 mb-4">Contact Details</h2>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm">
                            <div className="h-8 w-8 rounded-lg bg-stone-50 flex items-center justify-center flex-shrink-0">
                                <Users className="h-4 w-4 text-stone-400" />
                            </div>
                            <div>
                                <p className="text-stone-400 text-xs">Name</p>
                                <p className="font-medium text-stone-700">{b.user_name}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <div className="h-8 w-8 rounded-lg bg-stone-50 flex items-center justify-center flex-shrink-0">
                                <Mail className="h-4 w-4 text-stone-400" />
                            </div>
                            <div>
                                <p className="text-stone-400 text-xs">Email</p>
                                <p className="font-medium text-stone-700">{b.user_email}</p>
                            </div>
                        </div>
                        {b.user_phone && (
                            <div className="flex items-center gap-3 text-sm">
                                <div className="h-8 w-8 rounded-lg bg-stone-50 flex items-center justify-center flex-shrink-0">
                                    <Phone className="h-4 w-4 text-stone-400" />
                                </div>
                                <div>
                                    <p className="text-stone-400 text-xs">Phone</p>
                                    <p className="font-medium text-stone-700">{b.user_phone}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Special requests */}
                <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                    <h2 className="font-bold text-stone-900 mb-4">Special Requests</h2>
                    {b.special_requests ? (
                        <p className="text-sm text-stone-600 leading-relaxed">{b.special_requests}</p>
                    ) : (
                        <p className="text-sm text-stone-400 italic">No special requests noted.</p>
                    )}
                </div>
            </div>

            {/* Payment history */}
            {payments.length > 0 && (
                <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                    <h2 className="font-bold text-stone-900 mb-4">Payment History</h2>
                    <div className="space-y-3">
                        {payments.map(p => (
                            <div key={p.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-stone-50 px-4 py-3 text-sm">
                                <div>
                                    <p className="font-medium text-stone-700">PayTM · {p.transaction_id || p.order_id}</p>
                                    <p className="text-xs text-stone-400">{formatDateTime(p.date_created)}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`font-semibold ${p.status === 'success' ? 'text-green-600' : p.status === 'failed' ? 'text-red-500' : 'text-yellow-600'}`}>
                                        {p.status === 'success' ? '✓' : p.status === 'failed' ? '✗' : '~'} ₹{Number(p.amount).toLocaleString('en-IN')}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Pending payment */}
            {b.status === 'pending' && b.payment_status !== 'paid' && (
                <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-6">
                    <p className="font-semibold text-yellow-800 mb-1">Payment pending</p>
                    <p className="text-sm text-yellow-700 mb-4">Your booking is reserved but not yet confirmed. Complete payment to confirm your trip.</p>
                    <Link href={`/checkout/${b.package_slug}?bookingId=${b.id}`} className="btn-gold inline-flex text-sm">
                        Complete Payment →
                    </Link>
                </div>
            )}

            {/* Cancel */}
            {canCancel && (
                <div className="rounded-2xl border border-red-100 bg-red-50/50 p-6">
                    <h3 className="font-semibold text-stone-800 mb-1">Cancel Booking</h3>
                    <p className="text-sm text-stone-500 mb-4">
                        Cancellations are subject to our{' '}
                        <Link href="/refund-policy" className="underline hover:text-brand-700">refund policy</Link>.
                        Please call us at <a href="tel:+918807709919" className="font-semibold">+91 8807709919</a> for assistance.
                    </p>
                    <CancelBookingButton bookingId={b.id} />
                </div>
            )}

            {/* View package */}
            {b.package_slug && (
                <div className="text-center">
                    <Link href={`/packages/${b.package_slug}`} className="text-sm text-stone-400 hover:text-brand-700 transition-colors">
                        View package page →
                    </Link>
                </div>
            )}
        </div>
    );
}

function InfoTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="rounded-xl bg-stone-50 p-3">
            <div className="flex items-center gap-1.5 text-stone-400 text-xs mb-1">{icon}{label}</div>
            <p className="font-semibold text-stone-800 text-sm">{value}</p>
        </div>
    );
}
