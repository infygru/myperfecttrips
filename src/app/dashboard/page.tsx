import { getCurrentUser, adminFetch } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
    Plane, Calendar, ArrowRight, Star, Gift,
    CheckCircle2, XCircle, ChevronRight, Users,
    PhoneCall, Mail, Ticket, TrendingUp,
    Clock, Globe, MapPin, Sparkles,
} from 'lucide-react';
import { getUserLoyaltyBalance, getLoyaltyTransactions, MIN_REDEEM } from '@/lib/loyalty';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'My Dashboard | IG Holidays' };
export const dynamic = 'force-dynamic';

function fmt(d: string) {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
function daysUntil(d: string) {
    return Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);
}
function greet() {
    const h = new Date().getHours();
    return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}

export default async function DashboardPage() {
    const user = await getCurrentUser();
    if (!user) redirect('/auth/login?redirect=/dashboard');

    const [bookingsRes, loyaltyBalance, loyaltyTxns] = await Promise.all([
        adminFetch(`/items/bookings?filter[user_id][_eq]=${user.id}&sort[]=-date_created&limit=50`),
        getUserLoyaltyBalance(user.id),
        getLoyaltyTransactions(user.id, 5),
    ]);

    const all: any[]     = (await bookingsRes.json()).data || [];
    const confirmed      = all.filter(b => b.status === 'confirmed' || b.status === 'completed');
    const upcoming       = all.filter(b => b.status === 'confirmed' && b.travel_date && daysUntil(b.travel_date) > 0)
                              .sort((a, b) => new Date(a.travel_date).getTime() - new Date(b.travel_date).getTime());
    const next           = upcoming[0];
    const spent          = all.filter(b => b.payment_status === 'paid').reduce((s, b) => s + Number(b.total_amount), 0);
    const recent         = all.filter(b => b.status !== 'pending').slice(0, 5);

    const ptsToNext   = Math.max(0, MIN_REDEEM - ((loyaltyBalance % MIN_REDEEM) || MIN_REDEEM));
    const pctProgress = Math.min(100, ((loyaltyBalance % MIN_REDEEM) / MIN_REDEEM) * 100);
    const canRedeem   = loyaltyBalance >= MIN_REDEEM;

    const name     = [user.first_name, user.last_name].filter(Boolean).join(' ').trim() || user.email?.split('@')[0] || 'Traveller';
    const initials = (user.first_name || user.last_name)
        ? `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase()
        : (user.email?.[0] || 'T').toUpperCase();

    const statusMap: Record<string, { label: string; bg: string; text: string; dot: string }> = {
        confirmed: { label: 'Confirmed', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
        completed: { label: 'Completed', bg: 'bg-blue-50',    text: 'text-blue-700',    dot: 'bg-blue-500'   },
        cancelled: { label: 'Cancelled', bg: 'bg-red-50',     text: 'text-red-600',     dot: 'bg-red-500'    },
        pending:   { label: 'Pending',   bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-400'  },
    };

    return (
        <div className="space-y-6">

            {/* ══════════════════════════════════════════
                WELCOME HERO
            ══════════════════════════════════════════ */}
            <div className="relative overflow-hidden rounded-3xl bg-[#0b1120]">
                {/* layered bg effects */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#1d4ed820,_transparent_60%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_#f59e0b15,_transparent_60%)]" />
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23fff\' fill-opacity=\'1\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'1\' cy=\'1\' r=\'1\'/%3E%3C/g%3E%3C/svg%3E")' }} />

                <div className="relative px-6 py-7 sm:px-8 sm:py-8">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-5 justify-between">
                        <div className="flex items-center gap-4">
                            {/* avatar ring */}
                            <div className="relative shrink-0">
                                <div className="h-[52px] w-[52px] rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xl font-black text-white shadow-lg shadow-amber-500/40 ring-2 ring-amber-400/30">
                                    {initials}
                                </div>
                                <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-400 border-2 border-[#0b1120]" />
                            </div>
                            <div>
                                <p className="text-slate-500 text-xs font-medium">{greet()}</p>
                                <h1 className="text-[22px] font-black text-white leading-tight mt-0.5">{name}</h1>
                                <div className="flex items-center gap-2 mt-1.5">
                                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/15 border border-amber-400/25 px-2.5 py-0.5">
                                        <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                                        <span className="text-amber-400 text-[11px] font-bold">IG Rewards Member</span>
                                    </span>
                                    <span className="text-slate-600 text-xs hidden sm:block">
                                        {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long' })}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <Link href="/packages"
                            className="shrink-0 inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-orange-500 px-6 py-3 text-sm font-black text-slate-950 transition-all shadow-lg shadow-amber-500/30 active:scale-95">
                            <Plane className="h-4 w-4" />
                            Book a Trip
                        </Link>
                    </div>

                    {/* inline mini stats */}
                    <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                            { icon: Ticket,      label: 'Total Trips',   value: confirmed.length,                              color: 'text-violet-400' },
                            { icon: CheckCircle2,label: 'Confirmed',      value: all.filter(b=>b.status==='confirmed').length,  color: 'text-emerald-400' },
                            { icon: Globe,       label: 'Upcoming',       value: upcoming.length,                               color: 'text-sky-400' },
                            { icon: TrendingUp,  label: 'Total Spent',    value: spent > 0 ? `₹${(spent/1000).toFixed(0)}K` : '₹0', color: 'text-amber-400' },
                        ].map(({ icon: Icon, label, value, color }) => (
                            <div key={label} className="rounded-2xl bg-white/5 border border-white/8 px-4 py-3 flex items-center gap-3">
                                <Icon className={`h-5 w-5 shrink-0 ${color}`} />
                                <div>
                                    <p className="text-white font-black text-lg leading-none">{value}</p>
                                    <p className="text-slate-500 text-[11px] mt-0.5">{label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════════════════
                REWARDS — PREMIUM CARD
            ══════════════════════════════════════════ */}
            <div className="relative overflow-hidden rounded-3xl shadow-2xl shadow-amber-900/20"
                style={{ background: 'linear-gradient(135deg, #1a0a00 0%, #3d1a00 35%, #7c3500 60%, #c26000 85%, #e8a000 100%)' }}>

                {/* shine overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(105deg,transparent_40%,rgba(255,255,255,0.08)_45%,transparent_50%)]" />
                <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-amber-400/20 blur-3xl" />
                <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-orange-600/20 blur-2xl" />
                <div className="absolute inset-0 opacity-[0.04]"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23fff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />

                <div className="relative px-6 py-6 sm:px-8 sm:py-7">
                    <div className="flex items-start justify-between mb-5">
                        <div className="flex items-center gap-3">
                            <div className="h-11 w-11 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center">
                                <Star className="h-6 w-6 text-amber-300 fill-amber-300" />
                            </div>
                            <div>
                                <p className="text-amber-200/70 text-[11px] font-bold uppercase tracking-widest">IG Rewards</p>
                                <p className="text-white text-xs mt-0.5">Loyalty Programme</p>
                            </div>
                        </div>
                        <span className="rounded-full bg-amber-400/20 border border-amber-400/30 px-3 py-1 text-xs font-black text-amber-300 uppercase tracking-wide">
                            {canRedeem ? '✦ Redeemable' : 'Gold Member'}
                        </span>
                    </div>

                    {/* big points */}
                    <div className="mb-5">
                        <p className="text-amber-200/60 text-xs font-semibold mb-1">Your Points Balance</p>
                        <div className="flex items-end gap-3">
                            <p className="text-5xl sm:text-6xl font-black text-white tracking-tight" style={{ textShadow: '0 0 40px rgba(245,158,11,0.4)' }}>
                                {loyaltyBalance.toLocaleString('en-IN')}
                            </p>
                            <span className="text-amber-300/80 text-sm font-semibold mb-2">pts</span>
                        </div>
                        <p className="text-amber-200/50 text-xs mt-1">≈ ₹{loyaltyBalance.toLocaleString('en-IN')} cashback value · ₹100 spent = 1 pt</p>
                    </div>

                    {/* progress or redeem */}
                    {canRedeem ? (
                        <div className="flex items-center gap-3 rounded-2xl bg-amber-400/15 border border-amber-400/25 px-4 py-3">
                            <Gift className="h-5 w-5 text-amber-300 shrink-0" />
                            <div>
                                <p className="text-white text-sm font-black">You can redeem now!</p>
                                <p className="text-amber-200/60 text-xs">Apply at checkout to get ₹{MIN_REDEEM} off your next booking</p>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="flex justify-between text-xs mb-2">
                                <span className="text-amber-200/60">{loyaltyBalance} pts earned</span>
                                <span className="text-amber-300 font-bold">{ptsToNext} pts to next reward</span>
                            </div>
                            <div className="h-2.5 rounded-full bg-black/30 overflow-hidden">
                                <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 shadow-sm transition-all"
                                    style={{ width: `${pctProgress || 2}%` }} />
                            </div>
                            <p className="text-amber-200/40 text-[10px] mt-1.5">Reach {MIN_REDEEM} points to unlock your next reward</p>
                        </div>
                    )}

                    {/* recent activity */}
                    {loyaltyTxns.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-white/10">
                            <p className="text-amber-200/40 text-[10px] font-bold uppercase tracking-widest mb-2">Recent Activity</p>
                            <div className="flex flex-wrap gap-2">
                                {loyaltyTxns.slice(0, 3).map((t: any) => (
                                    <span key={t.id} className="inline-flex items-center gap-1.5 rounded-lg bg-white/8 border border-white/10 px-2.5 py-1 text-xs">
                                        <span className={`font-black ${t.type === 'earned' ? 'text-emerald-400' : 'text-red-400'}`}>
                                            {t.type === 'earned' ? '+' : '-'}{t.points}
                                        </span>
                                        <span className="text-amber-200/50 truncate max-w-[120px]">{t.description}</span>
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* card number style decoration */}
                    <div className="mt-5 flex items-center justify-between">
                        <p className="text-amber-200/30 text-xs font-mono tracking-[0.2em]">
                            {name.toUpperCase().slice(0, 20)}
                        </p>
                        <p className="text-amber-200/30 text-[10px]">VALID 2026</p>
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════════════════
                MAIN GRID
            ══════════════════════════════════════════ */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

                {/* LEFT — 3 cols */}
                <div className="lg:col-span-3 space-y-5">

                    {/* NEXT TRIP */}
                    {next ? (
                        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
                            <div className="relative overflow-hidden px-5 py-4 bg-[#0b1120]">
                                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_right,_#1d4ed830,_transparent_70%)]" />
                                <div className="relative flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="h-4 w-4 text-amber-400" />
                                        <span className="text-xs font-black text-white uppercase tracking-widest">Your Next Adventure</span>
                                    </div>
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 border border-emerald-400/25 px-2.5 py-1 text-[10px] font-bold text-emerald-400">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Confirmed
                                    </span>
                                </div>
                            </div>
                            <div className="p-5">
                                <div className="flex items-start justify-between gap-2 mb-4">
                                    <div>
                                        <h2 className="text-base font-black text-stone-900 leading-snug">{next.package_title}</h2>
                                        {next.destination && (
                                            <p className="text-xs text-stone-400 flex items-center gap-1 mt-1">
                                                <MapPin className="h-3 w-3" />{next.destination}
                                            </p>
                                        )}
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-lg font-black text-stone-900">₹{Number(next.total_amount).toLocaleString('en-IN')}</p>
                                        <p className="text-[10px] text-stone-400">total paid</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2 mb-4">
                                    {[
                                        { icon: Calendar, label: 'Travel Date',  val: fmt(next.travel_date),                              bg: 'bg-indigo-50 border-indigo-100', ic: 'text-indigo-500' },
                                        { icon: Clock,    label: 'Days To Go',   val: `${daysUntil(next.travel_date)} days`,               bg: 'bg-amber-50  border-amber-100',  ic: 'text-amber-500'  },
                                        { icon: Users,    label: 'Travellers',   val: `${next.num_adults + (next.num_children || 0)} pax`,  bg: 'bg-emerald-50 border-emerald-100', ic: 'text-emerald-500' },
                                    ].map(({ icon: I, label, val, bg, ic }) => (
                                        <div key={label} className={`rounded-2xl border ${bg} p-3 text-center`}>
                                            <I className={`h-4 w-4 ${ic} mx-auto mb-1`} />
                                            <p className="text-xs font-bold text-stone-800 leading-tight">{val}</p>
                                            <p className="text-[10px] text-stone-400 mt-0.5">{label}</p>
                                        </div>
                                    ))}
                                </div>
                                <Link href={`/dashboard/bookings/${next.id}`}
                                    className="flex items-center justify-center gap-2 w-full rounded-2xl bg-[#0b1120] hover:bg-[#1e293b] active:scale-[0.99] px-4 py-3 text-sm font-black text-white transition-all">
                                    View Full Booking <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl border-2 border-dashed border-stone-200 px-8 py-12 text-center">
                            <div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-indigo-100 to-sky-100 flex items-center justify-center mx-auto mb-4">
                                <Globe className="h-8 w-8 text-indigo-400" />
                            </div>
                            <p className="font-black text-stone-800 text-lg">No upcoming trips</p>
                            <p className="text-stone-400 text-sm mt-1.5 mb-6 max-w-xs mx-auto">Explore our curated holiday packages and book your next getaway today</p>
                            <Link href="/packages"
                                className="inline-flex items-center gap-2 rounded-2xl bg-[#0b1120] hover:bg-[#1e293b] px-6 py-3 text-sm font-black text-white transition-all">
                                Browse Packages <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    )}

                    {/* RECENT BOOKINGS */}
                    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
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
                        {recent.length === 0 ? (
                            <div className="px-6 py-12 text-center">
                                <Ticket className="h-10 w-10 text-stone-200 mx-auto mb-3" />
                                <p className="text-sm font-semibold text-stone-500">No confirmed bookings yet</p>
                                <Link href="/packages"
                                    className="inline-flex items-center gap-2 mt-4 rounded-2xl bg-[#0b1120] px-5 py-2.5 text-xs font-black text-white">
                                    Browse Packages
                                </Link>
                            </div>
                        ) : (
                            <div className="divide-y divide-stone-100">
                                {recent.map(b => {
                                    const s = statusMap[b.status] || statusMap.pending;
                                    return (
                                        <Link key={b.id} href={`/dashboard/bookings/${b.id}`}
                                            className="flex items-center gap-4 px-5 py-4 hover:bg-stone-50 transition-colors group">
                                            <div className={`h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 ${s.bg}`}>
                                                {b.status === 'confirmed' && <CheckCircle2 className={`h-5 w-5 ${s.text}`} />}
                                                {b.status === 'cancelled' && <XCircle      className={`h-5 w-5 ${s.text}`} />}
                                                {b.status === 'completed' && <CheckCircle2 className={`h-5 w-5 ${s.text}`} />}
                                                {b.status === 'pending'   && <Clock        className={`h-5 w-5 ${s.text}`} />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-stone-900 truncate group-hover:text-indigo-700 transition-colors">
                                                    {b.package_title}
                                                </p>
                                                <p className="text-xs text-stone-400 mt-0.5">
                                                    {fmt(b.travel_date)}
                                                    {b.reference_number && <> · <span className="font-mono text-[11px]">{b.reference_number}</span></>}
                                                </p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="text-sm font-black text-stone-900">₹{Number(b.total_amount).toLocaleString('en-IN')}</p>
                                                <span className={`inline-flex items-center gap-1 text-[10px] font-bold rounded-full px-2 py-0.5 ${s.bg} ${s.text}`}>
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

                {/* RIGHT — 2 cols */}
                <div className="lg:col-span-2 space-y-4">

                    {/* QUICK ACTIONS */}
                    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
                        <div className="px-5 py-3.5 border-b border-stone-100">
                            <p className="text-xs font-black text-stone-500 uppercase tracking-widest">Quick Actions</p>
                        </div>
                        <div className="p-2.5 space-y-1">
                            {[
                                { href: '/packages',           label: 'Browse Packages', sub: 'Find your next trip',   icon: Globe,      from: 'from-violet-500', to: 'to-indigo-600' },
                                { href: '/dashboard/bookings', label: 'My Bookings',     sub: 'View all reservations', icon: Ticket,     from: 'from-emerald-500',to: 'to-teal-600'   },
                                { href: '/dashboard/profile',  label: 'My Profile',      sub: 'Update your details',   icon: Star,       from: 'from-amber-500',  to: 'to-orange-500' },
                                { href: '/contact',            label: 'Get Support',     sub: 'We\'re here to help',   icon: PhoneCall,  from: 'from-sky-500',    to: 'to-blue-600'   },
                            ].map(({ href, label, sub, icon: Icon, from, to }) => (
                                <Link key={href} href={href}
                                    className="flex items-center gap-3.5 rounded-2xl px-3.5 py-3 hover:bg-stone-50 transition-colors group">
                                    <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${from} ${to} flex items-center justify-center shrink-0 shadow-sm`}>
                                        <Icon className="h-4.5 w-4.5 text-white" style={{ height: 18, width: 18 }} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-stone-800 group-hover:text-stone-900">{label}</p>
                                        <p className="text-[11px] text-stone-400">{sub}</p>
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-stone-300 group-hover:text-stone-500 transition-colors shrink-0" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* NEED HELP */}
                    <div className="rounded-3xl overflow-hidden border border-stone-200 shadow-sm">
                        <div className="relative overflow-hidden bg-[#0b1120] px-5 py-5">
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#1d4ed820,_transparent_70%)]" />
                            <div className="relative">
                                <p className="text-white font-black text-sm">Need assistance?</p>
                                <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                                    Our travel experts are available to help plan your perfect holiday.
                                </p>
                            </div>
                        </div>
                        <div className="bg-white p-3 space-y-2">
                            <a href="tel:+918807709919"
                                className="flex items-center gap-3 rounded-2xl border border-stone-200 px-4 py-3 text-sm font-semibold text-stone-700 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-all group">
                                <PhoneCall className="h-4 w-4 text-indigo-500 shrink-0" />
                                <span className="flex-1">+91 88077 09919</span>
                                <ArrowRight className="h-3.5 w-3.5 text-stone-300 group-hover:text-indigo-400 transition-colors" />
                            </a>
                            <a href="mailto:info@igholidays.com"
                                className="flex items-center gap-3 rounded-2xl border border-stone-200 px-4 py-3 text-sm font-semibold text-stone-700 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-all group">
                                <Mail className="h-4 w-4 text-indigo-500 shrink-0" />
                                <span className="flex-1 truncate">info@igholidays.com</span>
                                <ArrowRight className="h-3.5 w-3.5 text-stone-300 group-hover:text-indigo-400 transition-colors" />
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
