import { getCurrentUser, adminFetch } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
    Ticket, Calendar, Clock, ArrowRight, MapPin,
    TrendingUp, Star, Gift, Plane, CheckCircle2,
    AlertCircle, CircleDot, Shield, ShieldCheck,
    Lock, Sparkles, ChevronRight
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

const STATUS_CONFIG: Record<string, { label: string; cls: string; dot: string; icon: typeof CheckCircle2 }> = {
    confirmed: { label: 'Confirmed', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500', icon: CheckCircle2 },
    pending:   { label: 'Pending',   cls: 'bg-amber-50 text-amber-700 border-amber-200',     dot: 'bg-amber-500',  icon: AlertCircle },
    cancelled: { label: 'Cancelled', cls: 'bg-red-50 text-red-600 border-red-200',           dot: 'bg-red-500',    icon: CircleDot },
    completed: { label: 'Completed', cls: 'bg-stone-100 text-stone-600 border-stone-200',    dot: 'bg-stone-400',  icon: CheckCircle2 },
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
    const initials = `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase() || '?';

    return (
        <div className="space-y-5">

            {/* ── WELCOME HERO ── */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 p-6 sm:p-8 shadow-lg">
                {/* Decorative blobs */}
                <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-gold-400/10 blur-[70px]" />
                <div className="pointer-events-none absolute -bottom-12 -left-12 h-44 w-44 rounded-full bg-brand-600/20 blur-[60px]" />
                <div className="pointer-events-none absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />

                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                    <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="h-14 w-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white text-xl font-bold flex-shrink-0 shadow-inner">
                            {initials}
                        </div>
                        <div>
                            <p className="text-stone-400 text-xs font-medium">
                                {greeting()} · {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </p>
                            <h1 className="text-xl sm:text-2xl font-bold text-white mt-0.5 tracking-tight">
                                {user.first_name} {user.last_name}
                            </h1>
                            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    Account active
                                </span>
                                <span className="text-white/20">·</span>
                                <span className="inline-flex items-center gap-1 text-[10px] text-stone-400">
                                    <ShieldCheck className="h-3 w-3" />
                                    Session secured
                                </span>
                            </div>
                        </div>
                    </div>
                    <Link href="/packages"
                        className="inline-flex items-center gap-2 rounded-xl bg-white/10 border border-white/20 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/20 transition-all backdrop-blur-sm flex-shrink-0 shadow-sm">
                        <Plane className="h-4 w-4" /> Book New Trip
                    </Link>
                </div>
            </div>

            {/* ── STATS ROW ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                    { label: 'Total Bookings',  value: bookings.length,  icon: Ticket,       gradient: 'from-brand-700 to-brand-900',   ring: 'ring-brand-100' },
                    { label: 'Confirmed Trips', value: confirmed.length, icon: CheckCircle2, gradient: 'from-emerald-500 to-emerald-700', ring: 'ring-emerald-100' },
                    { label: 'Upcoming',        value: upcoming.length,  icon: Plane,        gradient: 'from-blue-500 to-blue-700',      ring: 'ring-blue-100' },
                    { label: 'Total Spent',     value: totalSpent > 0 ? `₹${(totalSpent / 1000).toFixed(0)}K` : '₹0', icon: TrendingUp, gradient: 'from-gold-500 to-amber-700', ring: 'ring-gold-100' },
                ].map(({ label, value, icon: Icon, gradient, ring }) => (
                    <div key={label} className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
                        <div className={`inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-sm mb-3 ring-2 ${ring}`}>
                            <Icon className="h-4 w-4 text-white" />
                        </div>
                        <p className="text-2xl font-bold text-stone-900 tracking-tight">{value}</p>
                        <p className="text-xs text-stone-500 mt-0.5 font-medium">{label}</p>
                    </div>
                ))}
            </div>

            {/* ── MAIN CONTENT ── */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

                {/* ── LEFT COLUMN ── */}
                <div className="lg:col-span-3 space-y-5">

                    {/* Next Trip Banner */}
                    {nextTrip ? (
                        <div className="relative rounded-2xl overflow-hidden border border-amber-200/80 shadow-sm">
                            {/* Gradient background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50" />
                            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold-300/25 blur-3xl" />
                            <div className="absolute -left-6 -bottom-6 h-28 w-28 rounded-full bg-orange-200/30 blur-2xl" />

                            <div className="relative p-5 sm:p-6">
                                <div className="flex items-start justify-between gap-3 mb-4">
                                    <div>
                                        <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gold-700 mb-1.5">
                                            <Sparkles className="h-3 w-3" />
                                            Next adventure
                                        </p>
                                        <h2 className="text-lg sm:text-xl font-bold text-stone-900 leading-snug">{nextTrip.package_title}</h2>
                                    </div>
                                    <div className={`shrink-0 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_CONFIG[nextTrip.status]?.cls || STATUS_CONFIG.pending.cls}`}>
                                        <span className={`h-1.5 w-1.5 rounded-full ${STATUS_CONFIG[nextTrip.status]?.dot || 'bg-amber-500'}`} />
                                        {STATUS_CONFIG[nextTrip.status]?.label}
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3 mb-4">
                                    <div className="rounded-xl bg-white/70 border border-amber-100 px-3 py-2.5 text-center backdrop-blur-sm">
                                        <Calendar className="h-3.5 w-3.5 text-gold-600 mx-auto mb-1" />
                                        <p className="text-xs font-bold text-stone-900">{formatDate(nextTrip.travel_date)}</p>
                                        <p className="text-[10px] text-stone-500">Date</p>
                                    </div>
                                    <div className="rounded-xl bg-white/70 border border-amber-100 px-3 py-2.5 text-center backdrop-blur-sm">
                                        <Clock className="h-3.5 w-3.5 text-gold-600 mx-auto mb-1" />
                                        <p className="text-xs font-bold text-stone-900">{daysUntil(nextTrip.travel_date)} days</p>
                                        <p className="text-[10px] text-stone-500">To go</p>
                                    </div>
                                    <div className="rounded-xl bg-white/70 border border-amber-100 px-3 py-2.5 text-center backdrop-blur-sm">
                                        <MapPin className="h-3.5 w-3.5 text-gold-600 mx-auto mb-1" />
                                        <p className="text-xs font-bold text-stone-900">{nextTrip.num_adults + (nextTrip.num_children || 0)}</p>
                                        <p className="text-[10px] text-stone-500">Travellers</p>
                                    </div>
                                </div>

                                <Link href={`/dashboard/bookings/${nextTrip.id}`}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-800 transition-colors shadow-sm">
                                    View Trip Details <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-2xl border-2 border-dashed border-stone-200 bg-white p-8 text-center">
                            <div className="h-14 w-14 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto mb-4">
                                <Plane className="h-7 w-7 text-stone-400" />
                            </div>
                            <p className="font-bold text-stone-700 text-base">No upcoming trips</p>
                            <p className="text-sm text-stone-400 mt-1 mb-5">Your next adventure is just one booking away</p>
                            <Link href="/packages"
                                className="inline-flex items-center gap-2 rounded-xl bg-brand-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-800 transition-colors shadow-sm">
                                Browse Packages <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    )}

                    {/* Recent Bookings */}
                    <div className="rounded-2xl border border-stone-200 bg-white shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
                            <h2 className="font-bold text-stone-900">Recent Bookings</h2>
                            <Link href="/dashboard/bookings"
                                className="text-xs font-semibold text-brand-700 hover:text-brand-900 flex items-center gap-1 transition-colors">
                                View all <ChevronRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>

                        {bookings.length === 0 ? (
                            <div className="px-5 py-12 text-center">
                                <Ticket className="h-10 w-10 text-stone-200 mx-auto mb-3" />
                                <p className="text-sm font-semibold text-stone-500">No bookings yet</p>
                                <p className="text-xs text-stone-400 mt-1">Your booking history will appear here</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-stone-100">
                                {bookings.slice(0, 5).map(b => {
                                    const sc = STATUS_CONFIG[b.status] || STATUS_CONFIG.pending;
                                    return (
                                        <Link key={b.id} href={`/dashboard/bookings/${b.id}`}
                                            className="flex items-center gap-4 px-5 py-4 hover:bg-stone-50/80 transition-colors group">
                                            <div className={`h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 border ${sc.cls}`}>
                                                <sc.icon className="h-4 w-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-stone-900 truncate group-hover:text-brand-900 transition-colors">{b.package_title}</p>
                                                <p className="text-xs text-stone-400 mt-0.5">{formatDate(b.travel_date)} · <span className="font-mono">{b.reference_number}</span></p>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <p className="text-sm font-bold text-stone-900">₹{Number(b.total_amount).toLocaleString('en-IN')}</p>
                                                <span className={`text-[10px] font-bold rounded-full px-2 py-0.5 border ${sc.cls}`}>{sc.label}</span>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── RIGHT COLUMN ── */}
                <div className="lg:col-span-2 space-y-5">

                    {/* Loyalty Points Card */}
                    <div className="rounded-2xl border border-stone-200 bg-white shadow-sm overflow-hidden">
                        <div className="bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 px-5 pt-5 pb-9 relative overflow-hidden">
                            <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-gold-400/10 blur-2xl pointer-events-none" />
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <Star className="h-4 w-4 text-gold-400 fill-gold-400" />
                                    <span className="text-white text-xs font-bold uppercase tracking-wider">IG Rewards</span>
                                </div>
                                {canRedeem && (
                                    <span className="rounded-full bg-gold-400 px-2.5 py-0.5 text-[10px] font-bold text-brand-950 animate-pulse">
                                        REDEEMABLE
                                    </span>
                                )}
                            </div>
                            <p className="text-3xl font-bold text-white tabular-nums">{loyaltyBalance.toLocaleString()}</p>
                            <p className="text-stone-400 text-xs mt-1">points · worth ₹{loyaltyBalance.toLocaleString()}</p>
                        </div>

                        {/* Progress float card */}
                        <div className="-mt-4 mx-4 rounded-xl bg-white border border-stone-200 shadow-md p-4">
                            {canRedeem ? (
                                <div className="text-center">
                                    <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gold-100 mb-2">
                                        <Gift className="h-4 w-4 text-gold-600" />
                                    </div>
                                    <p className="text-sm font-bold text-stone-900">Ready to redeem!</p>
                                    <p className="text-xs text-stone-500 mt-0.5">Use points at checkout for a discount</p>
                                </div>
                            ) : (
                                <>
                                    <div className="flex justify-between text-xs text-stone-500 mb-2.5">
                                        <span className="font-medium">{loyaltyBalance} pts</span>
                                        <span className="font-semibold text-brand-700">{pointsToNext} pts to redeem</span>
                                    </div>
                                    <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-gold-400 to-gold-500 rounded-full transition-all duration-700"
                                            style={{ width: `${progressPct}%` }} />
                                    </div>
                                    <p className="text-[10px] text-stone-400 mt-2 text-center">
                                        Earn {pointsToNext} more to unlock ₹{MIN_REDEEM} off
                                    </p>
                                </>
                            )}
                        </div>

                        {/* Earn rate */}
                        <div className="px-5 py-4 border-t border-stone-100 bg-stone-50/50">
                            <p className="text-xs font-bold text-stone-600 mb-2 uppercase tracking-wide">How to earn</p>
                            <div className="space-y-1.5">
                                {[
                                    { icon: '📦', text: 'Book any holiday package or hotel' },
                                    { icon: '₹', text: '1 point for every ₹100 spent' },
                                ].map(item => (
                                    <div key={item.text} className="flex items-center gap-2 text-xs text-stone-500">
                                        <div className="h-5 w-5 rounded-full bg-gold-100 flex items-center justify-center flex-shrink-0 text-[9px] font-bold text-gold-700">{item.icon}</div>
                                        {item.text}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent transactions */}
                        {loyaltyTxns.length > 0 && (
                            <div className="px-5 py-4 border-t border-stone-100">
                                <p className="text-xs font-bold text-stone-600 mb-3 uppercase tracking-wide">Recent activity</p>
                                <div className="space-y-2.5">
                                    {loyaltyTxns.slice(0, 3).map((t: any) => (
                                        <div key={t.id} className="flex items-center justify-between gap-3">
                                            <p className="text-xs text-stone-500 truncate">{t.description}</p>
                                            <span className={`text-xs font-bold flex-shrink-0 ${t.type === 'earned' ? 'text-emerald-600' : 'text-red-500'}`}>
                                                {t.type === 'earned' ? '+' : '-'}{t.points} pts
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Account Security Card */}
                    <div className="rounded-2xl border border-stone-200 bg-white shadow-sm overflow-hidden">
                        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-stone-100">
                            <div className="h-7 w-7 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                                <Shield className="h-3.5 w-3.5 text-emerald-600" />
                            </div>
                            <h3 className="text-sm font-bold text-stone-900">Account Security</h3>
                            <span className="ml-auto text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full px-2 py-0.5">SECURED</span>
                        </div>

                        <div className="px-5 py-4 space-y-3">
                            {[
                                { icon: CheckCircle2, label: 'Email verified',       sub: user.email,            ok: true },
                                { icon: Lock,         label: 'Password protected',   sub: 'Account secured',     ok: true },
                                { icon: ShieldCheck,  label: 'Secure session',       sub: 'httpOnly cookie',     ok: true },
                            ].map(({ icon: Icon, label, sub, ok }) => (
                                <div key={label} className="flex items-center gap-3">
                                    <Icon className={`h-4 w-4 flex-shrink-0 ${ok ? 'text-emerald-500' : 'text-stone-300'}`} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold text-stone-800">{label}</p>
                                        <p className="text-[10px] text-stone-400 truncate">{sub}</p>
                                    </div>
                                    <span className={`text-[10px] font-bold flex-shrink-0 ${ok ? 'text-emerald-600' : 'text-stone-400'}`}>
                                        {ok ? '✓' : '—'}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="px-5 pb-4">
                            <Link href="/dashboard/profile"
                                className="flex w-full items-center justify-center gap-2 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 px-4 py-2.5 text-xs font-semibold text-stone-600 transition-colors">
                                Manage Profile & Security <ChevronRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="rounded-2xl border border-stone-200 bg-white shadow-sm p-4">
                        <p className="text-xs font-bold text-stone-500 mb-3 uppercase tracking-wider px-1">Quick actions</p>
                        <div className="space-y-0.5">
                            {[
                                { href: '/packages',             label: 'Browse Packages',  icon: Plane,         desc: 'Find your next trip' },
                                { href: '/dashboard/bookings',   label: 'All Bookings',     icon: Ticket,        desc: 'View booking history' },
                                { href: '/dashboard/profile',    label: 'Edit Profile',     icon: MapPin,        desc: 'Update your details' },
                                { href: '/contact',              label: 'Get Support',      icon: AlertCircle,   desc: 'Talk to our experts' },
                            ].map(({ href, label, icon: Icon, desc }) => (
                                <Link key={href} href={href}
                                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-stone-700 hover:bg-stone-50 hover:text-brand-900 transition-colors group">
                                    <div className="h-8 w-8 rounded-lg bg-stone-100 group-hover:bg-brand-50 flex items-center justify-center flex-shrink-0 transition-colors">
                                        <Icon className="h-4 w-4 text-stone-500 group-hover:text-brand-700 transition-colors" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-semibold text-xs">{label}</p>
                                        <p className="text-[10px] text-stone-400">{desc}</p>
                                    </div>
                                    <ChevronRight className="h-3.5 w-3.5 text-stone-300 group-hover:text-brand-400 transition-colors flex-shrink-0" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
