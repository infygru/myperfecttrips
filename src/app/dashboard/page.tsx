import { getCurrentUser, adminFetch } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
    Ticket, Calendar, Clock, ArrowRight, MapPin,
    TrendingUp, Star, Gift, Plane, CheckCircle2,
    AlertCircle, CircleDot
} from 'lucide-react';
import { getUserLoyaltyBalance, getLoyaltyTransactions, MIN_REDEEM } from '@/lib/loyalty';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Dashboard | IG Holidays' };
export const dynamic = 'force-dynamic';

function formatDate(d: string) {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function daysUntil(dateStr: string) {
    const diff = new Date(dateStr).getTime() - Date.now();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function greeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
}

const STATUS_CONFIG: Record<string, { label: string; cls: string; icon: typeof CheckCircle2 }> = {
    confirmed: { label: 'Confirmed', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
    pending: { label: 'Pending', cls: 'bg-amber-50 text-amber-700 border-amber-200', icon: AlertCircle },
    cancelled: { label: 'Cancelled', cls: 'bg-red-50 text-red-600 border-red-200', icon: CircleDot },
    completed: { label: 'Completed', cls: 'bg-stone-100 text-stone-600 border-stone-200', icon: CheckCircle2 },
};

export default async function DashboardPage() {
    const user = await getCurrentUser();
    if (!user) redirect('/auth/login?redirect=/dashboard');

    const [bookingsRes, loyaltyBalance, loyaltyTxns] = await Promise.all([
        adminFetch(`/items/bookings?filter[user_id][_eq]=${user.id}&sort[]=-date_created&limit=50`),
        getUserLoyaltyBalance(user.id),
        getLoyaltyTransactions(user.id, 5),
    ]);

    const bookingsData = await bookingsRes.json();
    const bookings: any[] = bookingsData.data || [];
    const confirmed = bookings.filter(b => b.status === 'confirmed');
    const upcoming = confirmed
        .filter(b => b.travel_date && daysUntil(b.travel_date) > 0)
        .sort((a, b) => new Date(a.travel_date).getTime() - new Date(b.travel_date).getTime());
    const nextTrip = upcoming[0];
    const totalSpent = bookings
        .filter(b => b.payment_status === 'paid')
        .reduce((s, b) => s + Number(b.total_amount), 0);

    const pointsToNext = Math.max(0, MIN_REDEEM - (loyaltyBalance % MIN_REDEEM || MIN_REDEEM));
    const progressPct = Math.min(100, ((loyaltyBalance % MIN_REDEEM) / MIN_REDEEM) * 100);
    const canRedeem = loyaltyBalance >= MIN_REDEEM;

    const stats = [
        { label: 'Total Bookings', value: bookings.length, icon: Ticket, bg: 'bg-brand-50', ic: 'text-brand-700', border: 'border-brand-100' },
        { label: 'Confirmed Trips', value: confirmed.length, icon: CheckCircle2, bg: 'bg-emerald-50', ic: 'text-emerald-600', border: 'border-emerald-100' },
        { label: 'Upcoming', value: upcoming.length, icon: Plane, bg: 'bg-blue-50', ic: 'text-blue-600', border: 'border-blue-100' },
        { label: 'Total Spent', value: `₹${(totalSpent / 1000).toFixed(0)}K`, icon: TrendingUp, bg: 'bg-gold-50', ic: 'text-gold-700', border: 'border-gold-100' },
    ];

    return (
        <div className="space-y-6">
            {/* ── Header ── */}
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <p className="text-stone-500 text-sm">{greeting()}</p>
                    <h1 className="text-2xl font-bold text-stone-900 mt-0.5">{user.first_name} {user.last_name}</h1>
                    <p className="text-stone-400 text-xs mt-1">
                        {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                </div>
                <Link href="/packages"
                    className="flex items-center gap-2 rounded-xl bg-brand-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-800 transition-colors shadow-sm">
                    <Plane className="h-4 w-4" /> Book New Trip
                </Link>
            </div>

            {/* ── Stats grid ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {stats.map(({ label, value, icon: Icon, bg, ic, border }) => (
                    <div key={label} className={`rounded-2xl border ${border} bg-white p-4 shadow-sm`}>
                        <div className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${bg} mb-3`}>
                            <Icon className={`h-5 w-5 ${ic}`} />
                        </div>
                        <p className="text-xl font-bold text-stone-900">{value}</p>
                        <p className="text-xs text-stone-500 mt-0.5">{label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                {/* ── Left column ── */}
                <div className="lg:col-span-3 space-y-5">
                    {/* Next trip */}
                    {nextTrip ? (
                        <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 via-gold-50 to-orange-50 p-5 shadow-sm overflow-hidden relative">
                            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gold-300/20 blur-2xl" />
                            <div className="relative">
                                <p className="text-xs font-bold uppercase tracking-widest text-gold-700 mb-2 flex items-center gap-1.5">
                                    <span className="h-1.5 w-1.5 rounded-full bg-gold-500 animate-pulse inline-block" />
                                    Next adventure
                                </p>
                                <h2 className="text-xl font-bold text-stone-900 leading-tight">{nextTrip.package_title}</h2>

                                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3">
                                    <div className="flex items-center gap-1.5 text-sm text-stone-600">
                                        <Calendar className="h-3.5 w-3.5 text-gold-600" />
                                        {formatDate(nextTrip.travel_date)}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-sm text-stone-600">
                                        <Clock className="h-3.5 w-3.5 text-gold-600" />
                                        {daysUntil(nextTrip.travel_date)} days to go
                                    </div>
                                    <div className="flex items-center gap-1.5 text-sm text-stone-600">
                                        <MapPin className="h-3.5 w-3.5 text-gold-600" />
                                        {nextTrip.num_adults + (nextTrip.num_children || 0)} travellers
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-4">
                                    <div className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_CONFIG[nextTrip.status]?.cls || STATUS_CONFIG.pending.cls}`}>
                                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                        {STATUS_CONFIG[nextTrip.status]?.label}
                                    </div>
                                    <Link href={`/dashboard/bookings/${nextTrip.id}`}
                                        className="flex items-center gap-1 text-sm font-semibold text-brand-800 hover:underline">
                                        View details <ArrowRight className="h-3.5 w-3.5" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-6 text-center">
                            <Plane className="h-8 w-8 text-stone-300 mx-auto mb-3" />
                            <p className="font-semibold text-stone-600">No upcoming trips</p>
                            <p className="text-xs text-stone-400 mt-1 mb-4">Plan your next adventure today</p>
                            <Link href="/packages" className="inline-flex items-center gap-1.5 rounded-xl bg-brand-900 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-800 transition-colors">
                                Browse Packages <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>
                    )}

                    {/* Recent bookings */}
                    <div className="rounded-2xl border border-stone-200 bg-white shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
                            <h2 className="font-bold text-stone-900 text-sm">Recent Bookings</h2>
                            <Link href="/dashboard/bookings"
                                className="text-xs font-semibold text-brand-700 hover:text-brand-900 flex items-center gap-1 transition-colors">
                                View all <ArrowRight className="h-3 w-3" />
                            </Link>
                        </div>

                        {bookings.length === 0 ? (
                            <div className="px-5 py-10 text-center">
                                <Ticket className="h-8 w-8 text-stone-300 mx-auto mb-2" />
                                <p className="text-sm text-stone-500 font-medium">No bookings yet</p>
                                <p className="text-xs text-stone-400 mt-1">Your booking history will appear here</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-stone-100">
                                {bookings.slice(0, 4).map(b => {
                                    const sc = STATUS_CONFIG[b.status] || STATUS_CONFIG.pending;
                                    return (
                                        <Link key={b.id} href={`/dashboard/bookings/${b.id}`}
                                            className="flex items-center gap-4 px-5 py-3.5 hover:bg-stone-50 transition-colors">
                                            <div className={`h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 ${sc.cls.replace('text-', 'bg-').replace(' text-', ' ').split(' ')[0]}`}>
                                                <sc.icon className={`h-4 w-4 ${sc.cls.split(' ')[1]}`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-stone-900 truncate">{b.package_title}</p>
                                                <p className="text-xs text-stone-400">{formatDate(b.travel_date)} · {b.reference_number}</p>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <p className="text-sm font-bold text-stone-900">₹{Number(b.total_amount).toLocaleString('en-IN')}</p>
                                                <span className={`text-[10px] font-semibold rounded-full px-2 py-0.5 border ${sc.cls}`}>{sc.label}</span>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Right column ── */}
                <div className="lg:col-span-2 space-y-5">
                    {/* Loyalty Points Card */}
                    <div className="rounded-2xl border border-stone-200 bg-white shadow-sm overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-brand-900 to-brand-800 px-5 pt-5 pb-8">
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                    <Star className="h-4 w-4 text-gold-400 fill-gold-400" />
                                    <span className="text-white text-xs font-bold uppercase tracking-wider">IG Rewards</span>
                                </div>
                                {canRedeem && (
                                    <span className="rounded-full bg-gold-400 px-2.5 py-0.5 text-[10px] font-bold text-brand-950">
                                        REDEEMABLE
                                    </span>
                                )}
                            </div>
                            <p className="text-3xl font-bold text-white mt-3">{loyaltyBalance.toLocaleString()}</p>
                            <p className="text-stone-400 text-xs mt-0.5">loyalty points · worth ₹{loyaltyBalance.toLocaleString()}</p>
                        </div>

                        {/* Progress */}
                        <div className="-mt-4 mx-4 rounded-xl bg-white border border-stone-200 shadow-sm p-4">
                            {canRedeem ? (
                                <div className="text-center">
                                    <Gift className="h-5 w-5 text-gold-600 mx-auto mb-1.5" />
                                    <p className="text-sm font-bold text-stone-900">Ready to redeem!</p>
                                    <p className="text-xs text-stone-500 mt-0.5">Use your points at checkout for a discount</p>
                                </div>
                            ) : (
                                <>
                                    <div className="flex justify-between text-xs text-stone-500 mb-2">
                                        <span>{loyaltyBalance} pts</span>
                                        <span className="font-semibold text-stone-700">{pointsToNext} pts to redeem</span>
                                    </div>
                                    <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-gold-400 to-gold-500 rounded-full transition-all"
                                            style={{ width: `${progressPct}%` }} />
                                    </div>
                                    <p className="text-xs text-stone-400 mt-2 text-center">
                                        Earn {pointsToNext} more points to unlock ₹{MIN_REDEEM} discount
                                    </p>
                                </>
                            )}
                        </div>

                        {/* Earn rate */}
                        <div className="px-5 py-4 bg-stone-50/50 border-t border-stone-100">
                            <p className="text-xs font-bold text-stone-700 mb-2">How to earn more</p>
                            <div className="flex items-center gap-2 text-xs text-stone-500">
                                <div className="h-5 w-5 rounded-full bg-gold-100 flex items-center justify-center flex-shrink-0">
                                    <span className="text-gold-700 text-[9px] font-bold">1</span>
                                </div>
                                Book any holiday package or hotel
                            </div>
                            <div className="flex items-center gap-2 text-xs text-stone-500 mt-1.5">
                                <div className="h-5 w-5 rounded-full bg-gold-100 flex items-center justify-center flex-shrink-0">
                                    <span className="text-gold-700 text-[9px] font-bold">₹</span>
                                </div>
                                Earn 1 point for every ₹100 spent
                            </div>
                        </div>

                        {/* Recent transactions */}
                        {loyaltyTxns.length > 0 && (
                            <div className="px-5 py-4 border-t border-stone-100">
                                <p className="text-xs font-bold text-stone-700 mb-3">Recent activity</p>
                                <div className="space-y-2">
                                    {loyaltyTxns.slice(0, 3).map((t: any) => (
                                        <div key={t.id} className="flex items-center justify-between">
                                            <p className="text-xs text-stone-500 truncate max-w-[160px]">{t.description}</p>
                                            <span className={`text-xs font-bold ${t.type === 'earned' ? 'text-emerald-600' : 'text-red-500'}`}>
                                                {t.type === 'earned' ? '+' : '-'}{t.points} pts
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Quick links */}
                    <div className="rounded-2xl border border-stone-200 bg-white shadow-sm p-4">
                        <p className="text-xs font-bold text-stone-700 mb-3 uppercase tracking-wider">Quick actions</p>
                        <div className="space-y-1">
                            {[
                                { href: '/packages', label: 'Browse Packages', icon: Plane },
                                { href: '/dashboard/bookings', label: 'All Bookings', icon: Ticket },
                                { href: '/dashboard/profile', label: 'Edit Profile', icon: MapPin },
                                { href: '/contact', label: 'Get Support', icon: AlertCircle },
                            ].map(({ href, label, icon: Icon }) => (
                                <Link key={href} href={href}
                                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-stone-600 hover:bg-stone-50 hover:text-brand-900 transition-colors group">
                                    <Icon className="h-4 w-4 text-stone-400 group-hover:text-brand-700 transition-colors" />
                                    {label}
                                    <ArrowRight className="h-3 w-3 ml-auto text-stone-300 group-hover:text-brand-500 transition-colors" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
