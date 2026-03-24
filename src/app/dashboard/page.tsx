import { getCurrentUser, adminFetch } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
    Ticket, Calendar, Clock, ArrowRight, MapPin,
    TrendingUp, Star, Gift, Plane, CheckCircle2,
    AlertCircle, XCircle, ChevronRight, Users,
    Sparkles, Lock, ShieldCheck
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
    return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
}

function greeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
}

const STATUS: Record<string, { label: string; bg: string; text: string; border: string; dot: string }> = {
    confirmed: { label: 'Confirmed', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
    pending:   { label: 'Pending',   bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200',   dot: 'bg-amber-400' },
    cancelled: { label: 'Cancelled', bg: 'bg-red-50',     text: 'text-red-600',     border: 'border-red-200',     dot: 'bg-red-500' },
    completed: { label: 'Completed', bg: 'bg-stone-100',  text: 'text-stone-600',   border: 'border-stone-200',   dot: 'bg-stone-400' },
};

export default async function DashboardPage() {
    const user = await getCurrentUser();
    if (!user) redirect('/auth/login?redirect=/dashboard');

    const [bookingsRes, loyaltyBalance, loyaltyTxns] = await Promise.all([
        adminFetch(`/items/bookings?filter[user_id][_eq]=${user.id}&sort[]=-date_created&limit=50`),
        getUserLoyaltyBalance(user.id),
        getLoyaltyTransactions(user.id, 5),
    ]);

    const bookings: any[] = (await bookingsRes.json()).data || [];
    const confirmed  = bookings.filter(b => b.status === 'confirmed');
    const upcoming   = confirmed
        .filter(b => b.travel_date && daysUntil(b.travel_date) > 0)
        .sort((a, b) => new Date(a.travel_date).getTime() - new Date(b.travel_date).getTime());
    const nextTrip   = upcoming[0];
    const totalSpent = bookings.filter(b => b.payment_status === 'paid').reduce((s, b) => s + Number(b.total_amount), 0);
    const pointsToNext = Math.max(0, MIN_REDEEM - ((loyaltyBalance % MIN_REDEEM) || MIN_REDEEM));
    const progressPct  = Math.min(100, ((loyaltyBalance % MIN_REDEEM) / MIN_REDEEM) * 100);
    const canRedeem    = loyaltyBalance >= MIN_REDEEM;
    const initials     = `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase() || '?';

    return (
        <div className="space-y-6">

            {/* ── WELCOME BANNER ── */}
            <div className="relative overflow-hidden rounded-2xl bg-brand-950 px-6 py-7 sm:px-8">
                {/* Texture */}
                <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
                    style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '22px 22px' }} />
                <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-gold-400/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-10 left-10 h-40 w-40 rounded-full bg-brand-700/30 blur-2xl" />

                <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                    <div className="flex items-center gap-4">
                        <div className="h-13 w-13 shrink-0 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-white text-lg font-bold" style={{ height: 52, width: 52 }}>
                            {initials}
                        </div>
                        <div>
                            <p className="text-stone-400 text-xs">{greeting()}</p>
                            <h1 className="text-xl font-bold text-white mt-0.5">{user.first_name} {user.last_name}</h1>
                            <p className="text-stone-500 text-xs mt-1">
                                {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                        </div>
                    </div>
                    <Link href="/packages"
                        className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-gold-400 hover:bg-gold-500 px-5 py-2.5 text-sm font-bold text-brand-950 transition-colors shadow-lg shadow-gold-400/20">
                        <Plane className="h-4 w-4" />
                        Book a Trip
                    </Link>
                </div>
            </div>

            {/* ── STATS ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                    { label: 'Total Bookings',  value: bookings.length,     sub: 'all time',          color: 'bg-brand-900' },
                    { label: 'Confirmed',        value: confirmed.length,    sub: 'trips confirmed',   color: 'bg-emerald-600' },
                    { label: 'Upcoming',         value: upcoming.length,     sub: 'trips ahead',       color: 'bg-sky-600' },
                    { label: 'Total Spent',      value: totalSpent > 0 ? `₹${(totalSpent/1000).toFixed(0)}K` : '₹0', sub: 'on holidays', color: 'bg-amber-500' },
                ].map(({ label, value, sub, color }) => (
                    <div key={label} className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-sm">
                        <div className={`inline-flex h-2 w-2 rounded-full ${color} mb-3`} />
                        <p className="text-2xl font-bold text-stone-900">{value}</p>
                        <p className="text-xs font-semibold text-stone-500 mt-0.5">{label}</p>
                        <p className="text-[10px] text-stone-400 mt-0.5">{sub}</p>
                    </div>
                ))}
            </div>

            {/* ── CONTENT GRID ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* ── LEFT (2 cols) ── */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Next trip */}
                    {nextTrip ? (
                        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                            <div className="bg-gradient-to-r from-brand-950 to-brand-800 px-5 py-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="h-4 w-4 text-gold-400" />
                                    <span className="text-xs font-bold text-white uppercase tracking-widest">Next Adventure</span>
                                </div>
                                <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${STATUS[nextTrip.status]?.bg} ${STATUS[nextTrip.status]?.text} ${STATUS[nextTrip.status]?.border}`}>
                                    <span className={`h-1.5 w-1.5 rounded-full ${STATUS[nextTrip.status]?.dot}`} />
                                    {STATUS[nextTrip.status]?.label}
                                </span>
                            </div>

                            <div className="px-5 py-5">
                                <h2 className="text-lg font-bold text-stone-900 mb-4">{nextTrip.package_title}</h2>

                                <div className="grid grid-cols-3 gap-3 mb-5">
                                    <div className="rounded-xl bg-stone-50 border border-stone-100 px-3 py-3 text-center">
                                        <Calendar className="h-4 w-4 text-brand-700 mx-auto mb-1.5" />
                                        <p className="text-xs font-bold text-stone-800">{formatDate(nextTrip.travel_date)}</p>
                                        <p className="text-[10px] text-stone-400 mt-0.5">Travel date</p>
                                    </div>
                                    <div className="rounded-xl bg-amber-50 border border-amber-100 px-3 py-3 text-center">
                                        <Clock className="h-4 w-4 text-amber-600 mx-auto mb-1.5" />
                                        <p className="text-xs font-bold text-stone-800">{daysUntil(nextTrip.travel_date)} days</p>
                                        <p className="text-[10px] text-stone-400 mt-0.5">To go</p>
                                    </div>
                                    <div className="rounded-xl bg-stone-50 border border-stone-100 px-3 py-3 text-center">
                                        <Users className="h-4 w-4 text-brand-700 mx-auto mb-1.5" />
                                        <p className="text-xs font-bold text-stone-800">{nextTrip.num_adults + (nextTrip.num_children || 0)}</p>
                                        <p className="text-[10px] text-stone-400 mt-0.5">Travellers</p>
                                    </div>
                                </div>

                                <Link href={`/dashboard/bookings/${nextTrip.id}`}
                                    className="flex items-center justify-center gap-2 w-full rounded-xl bg-brand-900 hover:bg-brand-800 px-4 py-2.5 text-sm font-semibold text-white transition-colors">
                                    View booking details <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border-2 border-dashed border-stone-200 p-10 text-center">
                            <div className="h-12 w-12 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto mb-3">
                                <Plane className="h-6 w-6 text-stone-400" />
                            </div>
                            <p className="font-semibold text-stone-700">No upcoming trips</p>
                            <p className="text-sm text-stone-400 mt-1 mb-4">Start planning your next adventure</p>
                            <Link href="/packages"
                                className="inline-flex items-center gap-2 rounded-xl bg-brand-900 hover:bg-brand-800 px-5 py-2.5 text-sm font-semibold text-white transition-colors">
                                Browse Packages <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    )}

                    {/* Recent bookings */}
                    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
                            <h2 className="text-sm font-bold text-stone-900">Recent Bookings</h2>
                            <Link href="/dashboard/bookings"
                                className="flex items-center gap-1 text-xs font-semibold text-brand-700 hover:text-brand-900 transition-colors">
                                View all <ChevronRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>

                        {bookings.length === 0 ? (
                            <div className="px-5 py-12 text-center">
                                <Ticket className="h-8 w-8 text-stone-200 mx-auto mb-3" />
                                <p className="text-sm font-medium text-stone-500">No bookings yet</p>
                                <p className="text-xs text-stone-400 mt-1">Your booking history will appear here</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-stone-100">
                                {bookings.slice(0, 5).map(b => {
                                    const s = STATUS[b.status] || STATUS.pending;
                                    return (
                                        <Link key={b.id} href={`/dashboard/bookings/${b.id}`}
                                            className="flex items-center gap-4 px-5 py-3.5 hover:bg-stone-50 transition-colors group">
                                            <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border ${s.bg} ${s.border}`}>
                                                {b.status === 'confirmed' && <CheckCircle2 className={`h-4 w-4 ${s.text}`} />}
                                                {b.status === 'pending'   && <AlertCircle  className={`h-4 w-4 ${s.text}`} />}
                                                {b.status === 'cancelled' && <XCircle      className={`h-4 w-4 ${s.text}`} />}
                                                {b.status === 'completed' && <CheckCircle2 className={`h-4 w-4 ${s.text}`} />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-stone-800 truncate group-hover:text-brand-900 transition-colors">
                                                    {b.package_title}
                                                </p>
                                                <p className="text-xs text-stone-400 mt-0.5">
                                                    {formatDate(b.travel_date)} · <span className="font-mono">{b.reference_number}</span>
                                                </p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="text-sm font-bold text-stone-900">₹{Number(b.total_amount).toLocaleString('en-IN')}</p>
                                                <span className={`text-[10px] font-semibold ${s.text}`}>{s.label}</span>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── RIGHT (1 col) ── */}
                <div className="space-y-5">

                    {/* Loyalty card */}
                    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                        <div className="relative overflow-hidden bg-gradient-to-br from-brand-950 to-brand-800 px-5 pt-5 pb-8">
                            <div className="pointer-events-none absolute -top-6 -right-6 h-28 w-28 rounded-full bg-gold-400/15 blur-2xl" />
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <Star className="h-3.5 w-3.5 text-gold-400 fill-gold-400" />
                                    <span className="text-xs font-bold text-white/80 uppercase tracking-wider">IG Rewards</span>
                                </div>
                                {canRedeem && (
                                    <span className="rounded-full bg-gold-400 px-2.5 py-0.5 text-[10px] font-bold text-brand-950">
                                        Redeemable
                                    </span>
                                )}
                            </div>
                            <p className="text-3xl font-bold text-white tabular-nums">{loyaltyBalance.toLocaleString()}</p>
                            <p className="text-stone-400 text-xs mt-1">points · ₹{loyaltyBalance.toLocaleString()} value</p>
                        </div>

                        <div className="-mt-4 mx-4 rounded-xl bg-white border border-stone-200 shadow-sm p-4">
                            {canRedeem ? (
                                <div className="text-center">
                                    <Gift className="h-5 w-5 text-amber-500 mx-auto mb-1.5" />
                                    <p className="text-sm font-bold text-stone-900">Ready to redeem!</p>
                                    <p className="text-xs text-stone-400 mt-0.5">Apply at checkout for ₹{MIN_REDEEM} off</p>
                                </div>
                            ) : (
                                <>
                                    <div className="flex justify-between text-xs mb-2">
                                        <span className="text-stone-500">{loyaltyBalance} pts</span>
                                        <span className="font-semibold text-brand-700">{pointsToNext} pts to go</span>
                                    </div>
                                    <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-gold-400 to-amber-500 rounded-full" style={{ width: `${progressPct}%` }} />
                                    </div>
                                    <p className="text-[10px] text-stone-400 mt-2 text-center">₹100 spent = 1 point · Redeem at {MIN_REDEEM} pts</p>
                                </>
                            )}
                        </div>

                        {loyaltyTxns.length > 0 && (
                            <div className="px-4 py-4 border-t border-stone-100">
                                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2.5">Recent activity</p>
                                <div className="space-y-2">
                                    {loyaltyTxns.slice(0, 3).map((t: any) => (
                                        <div key={t.id} className="flex items-center justify-between gap-2">
                                            <p className="text-xs text-stone-500 truncate">{t.description}</p>
                                            <span className={`text-xs font-bold shrink-0 ${t.type === 'earned' ? 'text-emerald-600' : 'text-red-500'}`}>
                                                {t.type === 'earned' ? '+' : '-'}{t.points}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Account security */}
                    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                        <div className="px-4 py-3.5 border-b border-stone-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                                <span className="text-sm font-bold text-stone-900">Account Security</span>
                            </div>
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full px-2 py-0.5">Secure</span>
                        </div>
                        <div className="px-4 py-4 space-y-3">
                            {[
                                { icon: CheckCircle2, label: 'Email verified',     note: user.email,         ok: true  },
                                { icon: Lock,         label: 'Password set',       note: 'Protected',        ok: true  },
                                { icon: ShieldCheck,  label: 'Secure session',     note: 'httpOnly cookie',  ok: true  },
                            ].map(({ icon: Icon, label, note, ok }) => (
                                <div key={label} className="flex items-center gap-3">
                                    <Icon className={`h-4 w-4 shrink-0 ${ok ? 'text-emerald-500' : 'text-stone-300'}`} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold text-stone-800">{label}</p>
                                        <p className="text-[10px] text-stone-400 truncate">{note}</p>
                                    </div>
                                    <span className="text-[10px] font-bold text-emerald-600 shrink-0">✓</span>
                                </div>
                            ))}
                        </div>
                        <div className="px-4 pb-4">
                            <Link href="/dashboard/profile"
                                className="flex items-center justify-center gap-1.5 w-full rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 py-2.5 text-xs font-semibold text-stone-600 transition-colors">
                                Manage Profile <ChevronRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>
                    </div>

                    {/* Quick links */}
                    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-3">
                        {[
                            { href: '/packages',           label: 'Browse Packages',  icon: Plane },
                            { href: '/dashboard/bookings', label: 'All Bookings',     icon: Ticket },
                            { href: '/dashboard/profile',  label: 'Edit Profile',     icon: MapPin },
                            { href: '/contact',            label: 'Get Support',      icon: AlertCircle },
                        ].map(({ href, label, icon: Icon }) => (
                            <Link key={href} href={href}
                                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-stone-600 hover:bg-stone-50 hover:text-brand-900 transition-colors group">
                                <Icon className="h-4 w-4 text-stone-400 group-hover:text-brand-700 transition-colors" />
                                <span className="font-medium">{label}</span>
                                <ChevronRight className="h-3.5 w-3.5 ml-auto text-stone-300 group-hover:text-brand-400 transition-colors" />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
