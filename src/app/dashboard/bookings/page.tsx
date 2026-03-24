import { getCurrentUser, adminFetch } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Ticket, Calendar, Users, ChevronRight, Plane, CheckCircle2, AlertCircle, XCircle, Clock } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'My Bookings | IG Holidays' };
export const dynamic = 'force-dynamic';

function formatDate(d: string) {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

const STATUS: Record<string, { label: string; bg: string; text: string; border: string; icon: any }> = {
    confirmed: { label: 'Confirmed', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle2 },
    pending:   { label: 'Pending',   bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200',   icon: AlertCircle },
    cancelled: { label: 'Cancelled', bg: 'bg-red-50',     text: 'text-red-600',     border: 'border-red-200',     icon: XCircle },
    completed: { label: 'Completed', bg: 'bg-stone-100',  text: 'text-stone-600',   border: 'border-stone-200',   icon: CheckCircle2 },
};

const PAYMENT: Record<string, { text: string; label: string }> = {
    paid:     { text: 'text-emerald-600', label: 'Paid' },
    pending:  { text: 'text-amber-600',   label: 'Pending' },
    failed:   { text: 'text-red-500',     label: 'Failed' },
    refunded: { text: 'text-blue-600',    label: 'Refunded' },
};

export default async function BookingsPage() {
    const user = await getCurrentUser();
    if (!user) redirect('/auth/login?redirect=/dashboard/bookings');

    const res = await adminFetch(`/items/bookings?filter[user_id][_eq]=${user.id}&sort[]=-date_created&limit=100`);
    const bookings: any[] = (await res.json()).data || [];

    const counts = {
        all:       bookings.length,
        confirmed: bookings.filter(b => b.status === 'confirmed').length,
        pending:   bookings.filter(b => b.status === 'pending').length,
        completed: bookings.filter(b => b.status === 'completed').length,
        cancelled: bookings.filter(b => b.status === 'cancelled').length,
    };

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-stone-900">My Bookings</h1>
                    <p className="text-stone-400 text-sm mt-0.5">{counts.all} booking{counts.all !== 1 ? 's' : ''} total</p>
                </div>
                <Link href="/packages"
                    className="inline-flex items-center gap-2 rounded-xl bg-brand-900 hover:bg-brand-800 px-4 py-2.5 text-sm font-semibold text-white transition-colors shadow-sm">
                    <Plane className="h-4 w-4" /> New Trip
                </Link>
            </div>

            {/* Status summary pills */}
            {bookings.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {[
                        { key: 'all',       label: `All (${counts.all})`,           cls: 'bg-stone-900 text-white' },
                        { key: 'confirmed', label: `Confirmed (${counts.confirmed})`,cls: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
                        { key: 'pending',   label: `Pending (${counts.pending})`,    cls: 'bg-amber-50 text-amber-700 border border-amber-200' },
                        { key: 'completed', label: `Completed (${counts.completed})`,cls: 'bg-stone-100 text-stone-600 border border-stone-200' },
                    ].filter(({ key }) => key === 'all' || counts[key as keyof typeof counts] > 0).map(({ label, cls }) => (
                        <span key={label} className={`rounded-full px-3 py-1 text-xs font-semibold ${cls}`}>{label}</span>
                    ))}
                </div>
            )}

            {/* List */}
            {bookings.length === 0 ? (
                <div className="bg-white rounded-2xl border-2 border-dashed border-stone-200 p-16 text-center">
                    <div className="h-14 w-14 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto mb-4">
                        <Ticket className="h-7 w-7 text-stone-400" />
                    </div>
                    <p className="text-base font-semibold text-stone-600">No bookings yet</p>
                    <p className="text-sm text-stone-400 mt-1.5 mb-6">Your travel bookings will appear here once you make one.</p>
                    <Link href="/packages"
                        className="inline-flex items-center gap-2 rounded-xl bg-brand-900 hover:bg-brand-800 px-5 py-2.5 text-sm font-semibold text-white transition-colors">
                        Browse Holiday Packages
                    </Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {bookings.map(b => {
                        const s  = STATUS[b.status] || STATUS.pending;
                        const p  = PAYMENT[b.payment_status] || PAYMENT.pending;
                        const Icon = s.icon;
                        return (
                            <div key={b.id} className="bg-white rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                                <div className="p-5">
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                                        <div className="flex items-start gap-3 flex-1 min-w-0">
                                            <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 border ${s.bg} ${s.border}`}>
                                                <Icon className={`h-4 w-4 ${s.text}`} />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-bold text-stone-900 leading-snug">{b.package_title}</h3>
                                                <p className="text-xs text-stone-400 mt-0.5 font-mono">{b.reference_number}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0">
                                            <div className="text-right">
                                                <p className="text-base font-bold text-stone-900">₹{Number(b.total_amount).toLocaleString('en-IN')}</p>
                                                <p className={`text-xs font-semibold ${p.text}`}>{p.label}</p>
                                            </div>
                                            <Link href={`/dashboard/bookings/${b.id}`}
                                                className="flex items-center justify-center h-9 w-9 rounded-xl bg-stone-100 hover:bg-brand-900 hover:text-white text-stone-500 transition-all">
                                                <ChevronRight className="h-4 w-4" />
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-stone-100">
                                        <span className="flex items-center gap-1.5 text-xs text-stone-500">
                                            <Calendar className="h-3.5 w-3.5 text-stone-400" />
                                            {formatDate(b.travel_date)}
                                        </span>
                                        <span className="flex items-center gap-1.5 text-xs text-stone-500">
                                            <Users className="h-3.5 w-3.5 text-stone-400" />
                                            {b.num_adults} adult{b.num_adults !== 1 ? 's' : ''}
                                            {b.num_children > 0 ? `, ${b.num_children} child${b.num_children !== 1 ? 'ren' : ''}` : ''}
                                        </span>
                                        <span className="ml-auto">
                                            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${s.bg} ${s.text} ${s.border}`}>
                                                {s.label}
                                            </span>
                                        </span>
                                    </div>
                                </div>

                                {/* Pending payment CTA */}
                                {b.status === 'pending' && b.payment_status !== 'paid' && (
                                    <div className="px-5 pb-4">
                                        <Link href={`/checkout/${b.package_slug}?bookingId=${b.id}`}
                                            className="flex items-center justify-center gap-2 w-full rounded-xl bg-amber-400 hover:bg-amber-500 px-4 py-2.5 text-sm font-bold text-amber-900 transition-colors">
                                            Complete Payment to Confirm →
                                        </Link>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
