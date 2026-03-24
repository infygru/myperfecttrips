import { getCurrentUser, adminFetch } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
    Plane, Calendar, ArrowRight, MapPin, Star, Gift,
    CheckCircle2, XCircle, ChevronRight, Users,
    Sparkles, PhoneCall, Mail, Ticket, TrendingUp,
    Clock, Globe, HeartHandshake,
} from 'lucide-react';
import { getUserLoyaltyBalance, getLoyaltyTransactions, MIN_REDEEM } from '@/lib/loyalty';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'My Dashboard | IG Holidays' };
export const dynamic = 'force-dynamic';

function formatDate(d: string) {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
function daysUntil(d: string) {
    return Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);
}
function greeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
}

const STATUS: Record<string, { label: string; cls: string; dot: string }> = {
    confirmed: { label: 'Confirmed', cls: 'bg-emerald-100 text-emerald-700',  dot: 'bg-emerald-500' },
    pending:   { label: 'Pending',   cls: 'bg-amber-100  text-amber-700',    dot: 'bg-amber-400'  },
    cancelled: { label: 'Cancelled', cls: 'bg-red-100    text-red-600',      dot: 'bg-red-500'    },
    completed: { label: 'Completed', cls: 'bg-blue-100   text-blue-700',     dot: 'bg-blue-500'   },
};

export default async function DashboardPage() {
    const user = await getCurrentUser();
    if (!user) redirect('/auth/login?redirect=/dashboard');

    const [bookingsRes, loyaltyBalance, loyaltyTxns] = await Promise.all([
        adminFetch(`/items/bookings?filter[user_id][_eq]=${user.id}&sort[]=-date_created&limit=50`),
        getUserLoyaltyBalance(user.id),
        getLoyaltyTransactions(user.id, 5),
    ]);

    const allBookings: any[] = (await bookingsRes.json()).data || [];
    const confirmedBookings = allBookings.filter(b => b.status === 'confirmed' || b.status === 'completed');
    const upcomingTrips = allBookings
        .filter(b => b.status === 'confirmed' && b.travel_date && daysUntil(b.travel_date) > 0)
        .sort((a, b) => new Date(a.travel_date).getTime() - new Date(b.travel_date).getTime());
    const nextTrip = upcomingTrips[0];
    const totalSpent = allBookings
        .filter(b => b.payment_status === 'paid')
        .reduce((s, b) => s + Number(b.total_amount), 0);
    const recentBookings = allBookings.filter(b => b.status !== 'pending').slice(0, 5);

    const pointsToNext = Math.max(0, MIN_REDEEM - ((loyaltyBalance % MIN_REDEEM) || MIN_REDEEM));
    const progressPct  = Math.min(100, ((loyaltyBalance % MIN_REDEEM) / MIN_REDEEM) * 100);
    const canRedeem    = loyaltyBalance >= MIN_REDEEM;

    const displayName = [user.first_name, user.last_name].filter(Boolean).join(' ').trim()
        || user.email?.split('@')[0] || 'Traveller';
    const initials = (user.first_name || user.last_name)
        ? `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase()
        : (user.email?.[0] || 'T').toUpperCase();

    return (
        <div className="space-y-5">

            {/* ── WELCOME HEADER ─────────────────────────────────────────── */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f2044] px-6 py-6 sm:px-8 sm:py-7">
                {/* decorative blobs */}
                <div className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-sky-500/10 blur-3xl" />
                <div className="pointer-events-none absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '20px 20px' }} />

                <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        {/* avatar */}
                        <div className="h-14 w-14 shrink-0 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-amber-500/30">
                            {initials}
                        </div>
                        <div>
                            <p className="text-slate-400 text-xs font-medium">{greeting()} 👋</p>
                            <h1 className="text-2xl font-black text-white mt-0.5 tracking-tight">{displayName}</h1>
                            <div className="flex items-center gap-1.5 mt-1">
                                <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                                <span className="text-amber-400 text-xs font-semibold">IG Rewards Member</span>
                                <span className="text-slate-600 text-xs">·</span>
                                <span className="text-slate-400 text-xs">
                                    {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </span>
                            </div>
                        </div>
                    </div>
                    <Link href="/packages"
                        className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-amber-400 hover:bg-amber-500 active:scale-95 px-5 py-2.5 text-sm font-bold text-slate-950 transition-all shadow-lg shadow-amber-400/25">
                        <Plane className="h-4 w-4" />
                        Book a Trip
                    </Link>
                </div>
            </div>

            {/* ── STATS ──────────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                    { icon: Ticket,     color: 'from-violet-500 to-indigo-600', label: 'Total Trips',  value: confirmedBookings.length,   sub: 'booked' },
                    { icon: CheckCircle2,color: 'from-emerald-500 to-teal-600', label: 'Confirmed',    value: allBookings.filter(b=>b.status==='confirmed').length, sub: 'active' },
                    { icon: Globe,      color: 'from-sky-500 to-blue-600',      label: 'Upcoming',     value: upcomingTrips.length,        sub: 'ahead'  },
                    { icon: TrendingUp, color: 'from-amber-500 to-orange-500',  label: 'Total Spent',  value: totalSpent > 0 ? `₹${(totalSpent/1000).toFixed(0)}K` : '₹0', sub: 'on holidays' },
                ].map(({ icon: Icon, color, label, value, sub }) => (
                    <div key={label} className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4 sm:p-5 flex gap-4 items-center">
                        <div className={`h-11 w-11 shrink-0 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md`}>
                            <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <p className="text-xl font-black text-stone-900">{value}</p>
                            <p className="text-xs font-semibold text-stone-500">{label}</p>
                            <p className="text-[10px] text-stone-400">{sub}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── REWARDS — FULL-WIDTH HERO ───────────────────────────────── */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-orange-400 shadow-xl shadow-amber-400/30">
                <div className="pointer-events-none absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '16px 16px' }} />
                <div className="pointer-events-none absolute -top-8 -right-8 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
                <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/10 blur-xl" />

                <div className="relative px-6 py-5 sm:px-8 sm:py-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        {/* left */}
                        <div className="flex items-center gap-4">
                            <div className="h-14 w-14 shrink-0 rounded-2xl bg-white/25 border border-white/40 flex items-center justify-center shadow-inner">
                                <Star className="h-7 w-7 text-white fill-white" />
                            </div>
                            <div>
                                <p className="text-amber-900 text-xs font-bold uppercase tracking-widest">IG Rewards Points</p>
                                <p className="text-4xl font-black text-white drop-shadow mt-0.5">{loyaltyBalance.toLocaleString('en-IN')}</p>
                                <p className="text-amber-900/70 text-xs mt-0.5">≈ ₹{loyaltyBalance.toLocaleString('en-IN')} cashback value</p>
                            </div>
                        </div>

                        {/* right */}
                        <div className="sm:text-right">
                            {canRedeem ? (
                                <div className="inline-flex items-center gap-2 rounded-xl bg-white/30 border border-white/50 px-4 py-2.5 shadow-sm">
                                    <Gift className="h-5 w-5 text-white" />
                                    <div>
                                        <p className="text-white text-sm font-black">Ready to redeem!</p>
                                        <p className="text-amber-900/80 text-xs">Use at checkout for ₹{MIN_REDEEM} off</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white/20 rounded-xl px-4 py-3 border border-white/30 min-w-[160px]">
                                    <div className="flex justify-between text-xs font-semibold mb-1.5">
                                        <span className="text-amber-900">{loyaltyBalance} pts</span>
                                        <span className="text-white">{pointsToNext} to go</span>
                                    </div>
                                    <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                                        <div className="h-full bg-white rounded-full shadow transition-all" style={{ width: `${progressPct}%` }} />
                                    </div>
                                    <p className="text-amber-900/70 text-[10px] mt-1.5">₹100 spent = 1 pt · Redeem at {MIN_REDEEM} pts</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent activity */}
                    {loyaltyTxns.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-white/30 flex flex-wrap gap-3">
                            {loyaltyTxns.slice(0, 3).map((t: any) => (
                                <div key={t.id} className="flex items-center gap-2 rounded-lg bg-white/20 px-3 py-1.5">
                                    <span className={`text-xs font-black ${t.type === 'earned' ? 'text-white' : 'text-amber-900'}`}>
                                        {t.type === 'earned' ? '+' : '-'}{t.points} pts
                                    </span>
                                    <span className="text-amber-900/80 text-xs truncate max-w-[140px]">{t.description}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ── MAIN CONTENT GRID ──────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* LEFT — 2 cols */}
                <div className="lg:col-span-2 space-y-5">

                    {/* Next trip */}
                    {nextTrip ? (
                        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                            {/* header band */}
                            <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-[#0f172a] to-[#1e3a5f] border-b border-stone-100">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="h-4 w-4 text-amber-400" />
                                    <span className="text-xs font-bold text-white uppercase tracking-widest">Next Adventure</span>
                                </div>
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/20 border border-emerald-400/30 px-2.5 py-1 text-[10px] font-bold text-emerald-300">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Confirmed
                                </span>
                            </div>

                            <div className="p-5">
                                <div className="flex items-start justify-between gap-3 mb-4">
                                    <div>
                                        <h2 className="text-base font-black text-stone-900">{nextTrip.package_title}</h2>
                                        <p className="text-xs text-stone-400 mt-0.5 flex items-center gap-1">
                                            <MapPin className="h-3 w-3" />{nextTrip.destination || 'Package trip'}
                                        </p>
                                    </div>
                                    <p className="text-lg font-black text-stone-900 shrink-0">₹{Number(nextTrip.total_amount).toLocaleString('en-IN')}</p>
                                </div>

                                <div className="grid grid-cols-3 gap-2.5 mb-4">
                                    <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 text-center">
                                        <Calendar className="h-4 w-4 text-indigo-500 mx-auto mb-1" />
                                        <p className="text-xs font-bold text-stone-800">{formatDate(nextTrip.travel_date)}</p>
                                        <p className="text-[10px] text-stone-400">Travel date</p>
                                    </div>
                                    <div className="rounded-xl bg-amber-50 border border-amber-100 p-3 text-center">
                                        <Clock className="h-4 w-4 text-amber-500 mx-auto mb-1" />
                                        <p className="text-xs font-bold text-stone-800">{daysUntil(nextTrip.travel_date)} days</p>
                                        <p className="text-[10px] text-stone-400">To go</p>
                                    </div>
                                    <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 text-center">
                                        <Users className="h-4 w-4 text-indigo-500 mx-auto mb-1" />
                                        <p className="text-xs font-bold text-stone-800">{nextTrip.num_adults + (nextTrip.num_children || 0)}</p>
                                        <p className="text-[10px] text-stone-400">Travellers</p>
                                    </div>
                                </div>

                                <Link href={`/dashboard/bookings/${nextTrip.id}`}
                                    className="flex items-center justify-center gap-2 w-full rounded-xl bg-[#0f172a] hover:bg-[#1e293b] active:scale-95 px-4 py-2.5 text-sm font-bold text-white transition-all">
                                    View Booking Details <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border-2 border-dashed border-stone-200 p-10 text-center">
                            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-100 to-sky-100 flex items-center justify-center mx-auto mb-3">
                                <Globe className="h-7 w-7 text-indigo-400" />
                            </div>
                            <p className="font-black text-stone-800 text-base">No upcoming trips yet</p>
                            <p className="text-sm text-stone-400 mt-1 mb-5">Explore our curated packages and book your next getaway</p>
                            <Link href="/packages"
                                className="inline-flex items-center gap-2 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] px-6 py-2.5 text-sm font-bold text-white transition-all">
                                Browse Packages <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    )}

                    {/* Recent Bookings */}
                    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
                            <div>
                                <h2 className="text-sm font-black text-stone-900">Recent Bookings</h2>
                                <p className="text-[11px] text-stone-400 mt-0.5">Confirmed, completed &amp; cancelled</p>
                            </div>
                            <Link href="/dashboard/bookings"
                                className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                                View all <ChevronRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>

                        {recentBookings.length === 0 ? (
                            <div className="px-5 py-12 text-center">
                                <Ticket className="h-10 w-10 text-stone-200 mx-auto mb-3" />
                                <p className="text-sm font-semibold text-stone-500">No confirmed bookings yet</p>
                                <p className="text-xs text-stone-400 mt-1">Book a package to get started</p>
                                <Link href="/packages"
                                    className="inline-flex items-center gap-2 mt-4 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] px-4 py-2 text-xs font-bold text-white transition-all">
                                    Browse Packages
                                </Link>
                            </div>
                        ) : (
                            <div className="divide-y divide-stone-100">
                                {recentBookings.map(b => {
                                    const s = STATUS[b.status] || STATUS.pending;
                                    return (
                                        <Link key={b.id} href={`/dashboard/bookings/${b.id}`}
                                            className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors group">
                                            <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${s.cls} bg-opacity-60`}>
                                                {b.status === 'confirmed' && <CheckCircle2 className="h-4 w-4" />}
                                                {b.status === 'cancelled' && <XCircle      className="h-4 w-4" />}
                                                {b.status === 'completed' && <CheckCircle2 className="h-4 w-4" />}
                                                {b.status === 'pending'   && <Clock        className="h-4 w-4" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-stone-800 truncate group-hover:text-indigo-700 transition-colors">
                                                    {b.package_title}
                                                </p>
                                                <p className="text-xs text-stone-400 mt-0.5">
                                                    {formatDate(b.travel_date)}
                                                    {b.reference_number && <> · <span className="font-mono">{b.reference_number}</span></>}
                                                </p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="text-sm font-black text-stone-900">₹{Number(b.total_amount).toLocaleString('en-IN')}</p>
                                                <span className={`inline-flex items-center gap-1 text-[10px] font-bold rounded-full px-2 py-0.5 ${s.cls}`}>
                                                    <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />{s.label}
                                                </span>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT — 1 col */}
                <div className="space-y-4">

                    {/* Quick actions */}
                    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                        <div className="px-4 py-3.5 border-b border-stone-100">
                            <p className="text-xs font-black text-stone-500 uppercase tracking-wider">Quick Actions</p>
                        </div>
                        <div className="p-2">
                            {[
                                { href: '/packages',           label: 'Browse Packages',  icon: Plane,         cls: 'text-indigo-600 bg-indigo-50' },
                                { href: '/dashboard/bookings', label: 'All My Bookings',  icon: Ticket,        cls: 'text-emerald-600 bg-emerald-50' },
                                { href: '/dashboard/profile',  label: 'Edit Profile',     icon: HeartHandshake,cls: 'text-amber-600 bg-amber-50' },
                                { href: '/contact',            label: 'Contact Support',  icon: PhoneCall,     cls: 'text-sky-600 bg-sky-50' },
                            ].map(({ href, label, icon: Icon, cls }) => (
                                <Link key={href} href={href}
                                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-stone-50 transition-colors group">
                                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${cls}`}>
                                        <Icon className="h-4 w-4" />
                                    </div>
                                    <span className="text-sm font-semibold text-stone-700 group-hover:text-stone-900">{label}</span>
                                    <ChevronRight className="h-3.5 w-3.5 ml-auto text-stone-300 group-hover:text-stone-500 transition-colors" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Need Help */}
                    <div className="rounded-2xl overflow-hidden border border-stone-200 shadow-sm bg-white">
                        <div className="bg-gradient-to-br from-[#0f172a] to-[#1e3a5f] px-5 py-4">
                            <p className="text-white font-black text-sm">Need assistance?</p>
                            <p className="text-slate-400 text-xs mt-1">Our travel experts are available to help you plan the perfect trip</p>
                        </div>
                        <div className="p-3 space-y-2">
                            <a href="tel:+918807709919"
                                className="flex items-center gap-3 rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-semibold text-stone-700 hover:bg-stone-50 hover:border-indigo-200 hover:text-indigo-700 transition-all group">
                                <PhoneCall className="h-4 w-4 text-indigo-500 shrink-0" />
                                +91 88077 09919
                                <ArrowRight className="h-3.5 w-3.5 ml-auto text-stone-300 group-hover:text-indigo-400 transition-colors" />
                            </a>
                            <a href="mailto:info@igholidays.com"
                                className="flex items-center gap-3 rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-semibold text-stone-700 hover:bg-stone-50 hover:border-indigo-200 hover:text-indigo-700 transition-all group">
                                <Mail className="h-4 w-4 text-indigo-500 shrink-0" />
                                info@igholidays.com
                                <ArrowRight className="h-3.5 w-3.5 ml-auto text-stone-300 group-hover:text-indigo-400 transition-colors" />
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
