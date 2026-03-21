import { getCurrentUser, adminFetch } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Ticket, ArrowRight, Calendar, Users, MapPin } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'My Bookings | IG Holidays' };
export const dynamic = 'force-dynamic';

function formatDate(d: string) {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

const STATUS_COLORS: Record<string, string> = {
    confirmed: 'bg-green-100 text-green-700 border-green-200',
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    cancelled: 'bg-red-100 text-red-700 border-red-200',
    completed: 'bg-stone-100 text-stone-600 border-stone-200',
};

const PAYMENT_COLORS: Record<string, string> = {
    paid: 'text-green-600',
    pending: 'text-yellow-600',
    failed: 'text-red-500',
    refunded: 'text-blue-600',
};

export default async function BookingsPage() {
    const user = await getCurrentUser();
    if (!user) redirect('/auth/login?redirect=/dashboard/bookings');

    const res = await adminFetch(
        `/items/bookings?filter[user_id][_eq]=${user.id}&sort[]=-date_created&limit=100`
    );
    const data = await res.json();
    const bookings: any[] = data.data || [];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-stone-900">My Bookings</h1>
                    <p className="text-stone-500 text-sm mt-1">{bookings.length} booking{bookings.length !== 1 ? 's' : ''} total</p>
                </div>
                <Link href="/packages" className="btn-gold text-sm py-2 px-4">
                    + New Booking
                </Link>
            </div>

            {bookings.length === 0 ? (
                <div className="rounded-2xl border border-stone-200 bg-white p-16 text-center">
                    <Ticket className="h-12 w-12 text-stone-300 mx-auto mb-4" />
                    <p className="text-lg font-semibold text-stone-600">No bookings yet</p>
                    <p className="text-sm text-stone-400 mt-2 mb-6">Your travel bookings will appear here once you make one.</p>
                    <Link href="/packages" className="btn-primary inline-flex">Browse Holiday Packages</Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.map(b => (
                        <div key={b.id} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm hover:shadow-md transition-all">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                        <h3 className="font-bold text-stone-900 text-lg leading-tight">{b.package_title}</h3>
                                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STATUS_COLORS[b.status] || STATUS_COLORS.pending}`}>
                                            {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-stone-500 mt-2">
                                        <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{formatDate(b.travel_date)}</span>
                                        <span className="flex items-center gap-1">
                                            <Users className="h-3.5 w-3.5" />
                                            {b.num_adults} adult{b.num_adults !== 1 ? 's' : ''}
                                            {b.num_children > 0 && `, ${b.num_children} child${b.num_children !== 1 ? 'ren' : ''}`}
                                        </span>
                                        <span className="flex items-center gap-1 text-xs text-stone-400">
                                            Ref: {b.reference_number}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-xl font-bold text-stone-900">₹{Number(b.total_amount).toLocaleString('en-IN')}</p>
                                        <p className={`text-xs font-medium ${PAYMENT_COLORS[b.payment_status] || ''}`}>
                                            {b.payment_status?.charAt(0).toUpperCase() + b.payment_status?.slice(1) || 'Pending'}
                                        </p>
                                    </div>
                                    <Link
                                        href={`/dashboard/bookings/${b.id}`}
                                        className="flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline whitespace-nowrap"
                                    >
                                        Details <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
