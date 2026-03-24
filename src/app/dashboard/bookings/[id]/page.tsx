import { getCurrentUser, adminFetch } from '@/lib/auth';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft, Calendar, Users, Phone, Mail,
    CreditCard, CheckCircle2, XCircle, Clock,
    MapPin, AlertTriangle, Receipt, FileText,
    ChevronRight, Plane
} from 'lucide-react';
import CancelBookingButton from '@/components/dashboard/CancelBookingButton';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
type Props = { params: Promise<{ id: string }> };
export async function generateMetadata(): Promise<Metadata> {
    return { title: 'Booking Details | My Perfect Trips' };
}

function formatDate(d: string) {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}
function formatDateTime(d: string) {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}
function daysUntil(d: string) {
    return Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);
}

const BOOKING_STATUS: Record<string, { label: string; bg: string; text: string; border: string; icon: any }> = {
    confirmed: { label: 'Confirmed', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle2 },
    pending:   { label: 'Pending',   bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200',   icon: Clock },
    cancelled: { label: 'Cancelled', bg: 'bg-red-50',     text: 'text-red-600',     border: 'border-red-200',     icon: XCircle },
    completed: { label: 'Completed', bg: 'bg-stone-100',  text: 'text-stone-600',   border: 'border-stone-200',   icon: CheckCircle2 },
};

const PAY_STATUS: Record<string, { label: string; text: string; bg: string }> = {
    paid:     { label: 'Paid',     text: 'text-emerald-700', bg: 'bg-emerald-50' },
    pending:  { label: 'Pending',  text: 'text-amber-700',   bg: 'bg-amber-50' },
    failed:   { label: 'Failed',   text: 'text-red-600',     bg: 'bg-red-50' },
    refunded: { label: 'Refunded', text: 'text-blue-600',    bg: 'bg-blue-50' },
};

export default async function BookingDetailPage({ params }: Props) {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) redirect(`/auth/login?redirect=/dashboard/bookings/${id}`);

    const [bRes, payRes] = await Promise.all([
        adminFetch(`/items/bookings/${id}`),
        adminFetch(`/items/payments?filter[booking_id][_eq]=${id}&sort[]=-date_created`),
    ]);
    const b = (await bRes.json()).data;
    if (!b || b.user_id !== user.id) return notFound();
    const payments: any[] = (await payRes.json()).data || [];

    const bs = BOOKING_STATUS[b.status] || BOOKING_STATUS.pending;
    const ps = PAY_STATUS[b.payment_status] || PAY_STATUS.pending;
    const StatusIcon = bs.icon;
    const days = b.travel_date ? daysUntil(b.travel_date) : null;

    return (
        <div className="space-y-5">
            {/* Back */}
            <Link href="/dashboard/bookings"
                className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-brand-700 transition-colors">
                <ArrowLeft className="h-4 w-4" /> Back to bookings
            </Link>

            {/* Hero card */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                <div className="bg-brand-950 px-6 py-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <p className="text-stone-500 text-xs mb-1.5 font-mono">{b.reference_number}</p>
                            <h1 className="text-xl font-bold text-white leading-snug">{b.package_title}</h1>
                        </div>
                        <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-semibold ${bs.bg} ${bs.text} ${bs.border}`}>
                            <StatusIcon className="h-4 w-4" />
                            {bs.label}
                        </div>
                    </div>
                </div>

                {/* Key info tiles */}
                <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-stone-100">
                    {[
                        { icon: Calendar,   label: 'Travel Date',  value: formatDate(b.travel_date) },
                        { icon: Users,      label: 'Travellers',   value: `${b.num_adults} adult${b.num_adults !== 1 ? 's' : ''}${b.num_children > 0 ? ` · ${b.num_children} child${b.num_children !== 1 ? 'ren' : ''}` : ''}` },
                        { icon: CreditCard, label: 'Total Amount', value: `£${Number(b.total_amount).toLocaleString('en-GB')}` },
                        { icon: Clock,      label: 'Booked On',    value: formatDateTime(b.date_created) },
                    ].map(({ icon: Icon, label, value }) => (
                        <div key={label} className="px-5 py-4">
                            <div className="flex items-center gap-1.5 text-stone-400 text-xs mb-1.5">
                                <Icon className="h-3.5 w-3.5" />{label}
                            </div>
                            <p className="text-sm font-semibold text-stone-800">{value}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Countdown banner for upcoming confirmed trips */}
            {b.status === 'confirmed' && days !== null && days > 0 && (
                <div className="rounded-2xl bg-gradient-to-r from-brand-950 to-brand-800 px-5 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Plane className="h-5 w-5 text-gold-400" />
                        <div>
                            <p className="text-white font-bold text-sm">Your trip is coming up!</p>
                            <p className="text-stone-400 text-xs mt-0.5">Pack your bags — {days} day{days !== 1 ? 's' : ''} to go</p>
                        </div>
                    </div>
                    <span className="text-2xl font-bold text-gold-400 tabular-nums">{days}d</span>
                </div>
            )}

            {/* Pending payment CTA */}
            {b.status === 'pending' && b.payment_status !== 'paid' && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-5">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="font-semibold text-amber-800 text-sm">Payment required to confirm your booking</p>
                            <p className="text-xs text-amber-700 mt-0.5 mb-4">Complete your payment to secure your spot. Your booking is reserved but not confirmed until paid.</p>
                            <Link href={`/checkout/${b.package_slug}?bookingId=${b.id}`}
                                className="inline-flex items-center gap-2 rounded-xl bg-amber-400 hover:bg-amber-500 px-5 py-2.5 text-sm font-bold text-amber-900 transition-colors">
                                Complete Payment <ChevronRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Two columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Contact details */}
                <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <FileText className="h-4 w-4 text-stone-400" />
                        <h2 className="text-sm font-bold text-stone-900">Contact Details</h2>
                    </div>
                    <div className="space-y-3">
                        {[
                            { icon: Users, label: 'Name',  value: b.user_name },
                            { icon: Mail,  label: 'Email', value: b.user_email },
                            ...(b.user_phone ? [{ icon: Phone, label: 'Phone', value: b.user_phone }] : []),
                        ].map(({ icon: Icon, label, value }) => (
                            <div key={label} className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-stone-50 border border-stone-100 flex items-center justify-center shrink-0">
                                    <Icon className="h-3.5 w-3.5 text-stone-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-stone-400 font-medium uppercase tracking-wider">{label}</p>
                                    <p className="text-sm font-semibold text-stone-800">{value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Payment status */}
                <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <Receipt className="h-4 w-4 text-stone-400" />
                        <h2 className="text-sm font-bold text-stone-900">Payment Status</h2>
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`rounded-xl px-4 py-2 ${ps.bg}`}>
                            <p className={`text-lg font-bold ${ps.text}`}>£{Number(b.total_amount).toLocaleString('en-GB')}</p>
                            <p className={`text-xs font-semibold ${ps.text}`}>{ps.label}</p>
                        </div>
                    </div>

                    {payments.length > 0 ? (
                        <div className="space-y-2">
                            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Transaction history</p>
                            {payments.map(p => (
                                <div key={p.id} className="flex items-center justify-between gap-2 rounded-xl bg-stone-50 border border-stone-100 px-3 py-2.5">
                                    <div className="min-w-0">
                                        <p className="text-xs font-semibold text-stone-700 truncate">
                                            {p.gateway?.toUpperCase() || 'Payment'} · <span className="font-mono">{p.transaction_id || p.order_id}</span>
                                        </p>
                                        <p className="text-[10px] text-stone-400">{formatDateTime(p.date_created)}</p>
                                    </div>
                                    <span className={`text-sm font-bold shrink-0 ${p.status === 'success' ? 'text-emerald-600' : p.status === 'failed' ? 'text-red-500' : 'text-amber-600'}`}>
                                        {p.status === 'success' ? '✓' : p.status === 'failed' ? '✗' : '~'} £{Number(p.amount).toLocaleString('en-GB')}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-stone-400 italic">No payment records found.</p>
                    )}
                </div>
            </div>

            {/* Special requests */}
            {b.special_requests && (
                <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5">
                    <div className="flex items-center gap-2 mb-3">
                        <MapPin className="h-4 w-4 text-stone-400" />
                        <h2 className="text-sm font-bold text-stone-900">Special Requests</h2>
                    </div>
                    <p className="text-sm text-stone-600 leading-relaxed">{b.special_requests}</p>
                </div>
            )}

            {/* Cancel booking */}
            {b.status === 'confirmed' && (
                <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-5">
                    <h3 className="text-sm font-bold text-stone-800 mb-1">Cancel Booking</h3>
                    <p className="text-xs text-stone-500 mb-4">
                        Cancellations are subject to our{' '}
                        <Link href="/refund-policy" className="underline hover:text-brand-700">refund policy</Link>.
                        {' '}Need help? Call{' '}
                        <a href="tel:+918807709919" className="font-semibold text-stone-700 hover:text-brand-700">+91 8807709919</a>.
                    </p>
                    <CancelBookingButton bookingId={b.id} />
                </div>
            )}

            {/* View package */}
            {b.package_slug && (
                <div className="text-center pb-2">
                    <Link href={`/packages/${b.package_slug}`}
                        className="inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-brand-700 transition-colors">
                        View package page <ChevronRight className="h-4 w-4" />
                    </Link>
                </div>
            )}
        </div>
    );
}
