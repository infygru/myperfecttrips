import { getCurrentUser, adminFetch } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Ticket, Calendar, Users, ChevronRight, Plane, CheckCircle2, AlertCircle, XCircle, Clock } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'My Bookings | My Perfect Trips' };
export const dynamic = 'force-dynamic';

function formatDate(d: string) {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

const STATUS: Record<string, { label: string; dot: string; text: string; icon: any }> = {
    confirmed: { label: 'Confirmed', dot: 'bg-emerald-500', text: 'text-emerald-700', icon: CheckCircle2 },
    pending:   { label: 'Pending',   dot: 'bg-amber-400',   text: 'text-amber-700',   icon: AlertCircle  },
    cancelled: { label: 'Cancelled', dot: 'bg-red-400',     text: 'text-red-600',     icon: XCircle      },
    completed: { label: 'Completed', dot: 'bg-stone-400',   text: 'text-stone-500',   icon: CheckCircle2 },
};

const PAYMENT: Record<string, { label: string; text: string }> = {
    paid:     { label: 'Paid',     text: 'text-emerald-600' },
    pending:  { label: 'Pending',  text: 'text-amber-600'   },
    failed:   { label: 'Failed',   text: 'text-red-500'     },
    refunded: { label: 'Refunded', text: 'text-stone-500'   },
};

export default async function BookingsPage() {
    const user = await getCurrentUser();
    if (!user) redirect('/auth/login?redirect=/dashboard/bookings');

    const res = await adminFetch(`/items/bookings?filter[user_id][_eq]=${user.id}&sort[]=-date_created&limit=100`);
    const bookings: any[] = (await res.json()).data || [];

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-bold text-stone-900">My Bookings</h1>
                    <p className="text-xs text-stone-400 mt-0.5">{bookings.length} booking{bookings.length !== 1 ? 's' : ''} total</p>
                </div>
                <Link href="/packages"
                    className="inline-flex items-center gap-2 rounded-lg bg-stone-900 hover:bg-stone-700 px-4 py-2 text-sm font-semibold text-white transition-colors">
                    <Plane className="h-4 w-4" /> New Trip
                </Link>
            </div>

            {bookings.length === 0 ? (
                <div className="bg-white rounded-xl border-2 border-dashed border-stone-200 p-14 text-center">
                    <Ticket className="h-8 w-8 text-stone-300 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-stone-600">No bookings yet</p>
                    <p className="text-xs text-stone-400 mt-1 mb-5">Your travel bookings will appear here once you make one.</p>
                    <Link href="/packages"
                        className="inline-flex items-center gap-2 rounded-lg bg-stone-900 hover:bg-stone-700 px-4 py-2 text-sm font-semibold text-white transition-colors">
                        Browse Holiday Packages
                    </Link>
                </div>
            ) : (
                <div className="space-y-2">
                    {bookings.map(b => {
                        const s = STATUS[b.status] || STATUS.pending;
                        const p = PAYMENT[b.payment_status] || PAYMENT.pending;
                        return (
                            <div key={b.id} className="bg-white rounded-xl border border-stone-200 overflow-hidden">
                                <div className="p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-semibold text-stone-900 leading-snug">{b.package_title}</h3>
                                            <p className="text-[11px] text-stone-400 mt-0.5 font-mono">{b.reference_number}</p>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-stone-900">₹{Number(b.total_amount).toLocaleString('en-IN')}</p>
                                                <p className={`text-[10px] font-medium ${p.text}`}>{p.label}</p>
                                            </div>
                                            <Link href={`/dashboard/bookings/${b.id}`}
                                                className="flex items-center justify-center h-8 w-8 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-400 hover:text-stone-700 transition-colors">
                                                <ChevronRight className="h-4 w-4" />
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-stone-100">
                                        <span className="flex items-center gap-1.5 text-xs text-stone-500">
                                            <Calendar className="h-3.5 w-3.5 text-stone-300" />
                                            {formatDate(b.travel_date)}
                                        </span>
                                        <span className="flex items-center gap-1.5 text-xs text-stone-500">
                                            <Users className="h-3.5 w-3.5 text-stone-300" />
                                            {b.num_adults} adult{b.num_adults !== 1 ? 's' : ''}
                                            {b.num_children > 0 ? `, ${b.num_children} child${b.num_children !== 1 ? 'ren' : ''}` : ''}
                                        </span>
                                        <span className="ml-auto flex items-center gap-1.5 text-xs font-medium">
                                            <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                                            <span className={s.text}>{s.label}</span>
                                        </span>
                                    </div>
                                </div>

                                {b.status === 'pending' && b.payment_status !== 'paid' && (
                                    <div className="px-4 pb-4">
                                        <Link href={`/checkout/${b.package_slug}?bookingId=${b.id}`}
                                            className="flex items-center justify-center gap-2 w-full rounded-lg bg-stone-900 hover:bg-stone-700 px-4 py-2 text-sm font-semibold text-white transition-colors">
                                            Complete Payment →
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
