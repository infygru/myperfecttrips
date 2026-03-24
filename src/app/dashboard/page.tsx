import { getCurrentUser, adminFetch } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
    Plane, Calendar, ArrowRight, Star, Gift,
    CheckCircle2, XCircle, ChevronRight, Users,
    PhoneCall, Ticket, TrendingUp, Clock, Globe,
    MapPin, Sparkles, Mail,
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

    const all      = (await bookingsRes.json()).data as any[] || [];
    const confirmed = all.filter(b => b.status === 'confirmed' || b.status === 'completed');
    const upcoming  = all
        .filter(b => b.status === 'confirmed' && b.travel_date && daysUntil(b.travel_date) > 0)
        .sort((a, b) => new Date(a.travel_date).getTime() - new Date(b.travel_date).getTime());
    const next      = upcoming[0];
    const spent     = all.filter(b => b.payment_status === 'paid').reduce((s, b) => s + Number(b.total_amount), 0);
    const recent    = all.filter(b => b.status !== 'pending').slice(0, 5);

    const ptsToNext   = Math.max(0, MIN_REDEEM - ((loyaltyBalance % MIN_REDEEM) || MIN_REDEEM));
    const pctProgress = Math.min(100, ((loyaltyBalance % MIN_REDEEM) / MIN_REDEEM) * 100);
    const canRedeem   = loyaltyBalance >= MIN_REDEEM;

    // Name — always use actual data from Directus
    const firstName  = user.first_name?.trim() || '';
    const lastName   = user.last_name?.trim()  || '';
    const fullName   = [firstName, lastName].filter(Boolean).join(' ') || user.email?.split('@')[0] || 'there';
    const initials   = firstName && lastName ? `${firstName[0]}${lastName[0]}`.toUpperCase()
                     : firstName             ? firstName[0].toUpperCase()
                     : user.email?.[0]?.toUpperCase() || '?';

    const badge: Record<string, { label: string; bg: string; text: string; dot: string }> = {
        confirmed: { label: 'Confirmed', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
        completed: { label: 'Completed', bg: 'bg-blue-50',    text: 'text-blue-700',    dot: 'bg-blue-500'   },
        cancelled: { label: 'Cancelled', bg: 'bg-red-50',     text: 'text-red-600',     dot: 'bg-red-500'    },
        pending:   { label: 'Pending',   bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-400'  },
    };

    return (
        <div className="space-y-5">

            {/* ── WELCOME ─────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 shrink-0 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-lg font-black">
                        {initials}
                    </div>
                    <div>
                        <p className="text-stone-400 text-xs">{greet()}</p>
                        <h1 className="text-xl font-black text-stone-900 mt-0.5">{fullName}</h1>
                        <p className="text-stone-400 text-xs mt-0.5">{user.email}</p>
                    </div>
                </div>
                <Link href="/packages"
                    className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 px-5 py-2.5 text-sm font-bold text-white transition-all shadow-sm shadow-indigo-600/20">
                    <Plane className="h-4 w-4" />
                    Book a Trip
                </Link>
            </div>

            {/* ── STATS ───────────────────────────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                    { icon: Ticket,      color: 'text-indigo-600 bg-indigo-50',  label: 'Total Trips',  value: confirmed.length,                                        sub: 'all time'      },
                    { icon: CheckCircle2,color: 'text-emerald-600 bg-emerald-50',label: 'Confirmed',    value: all.filter(b => b.status === 'confirmed').length,         sub: 'active'        },
                    { icon: Globe,       color: 'text-sky-600 bg-sky-50',        label: 'Upcoming',     value: upcoming.length,                                         sub: 'trips ahead'   },
                    { icon: TrendingUp,  color: 'text-amber-600 bg-amber-50',    label: 'Total Spent',  value: spent > 0 ? `₹${(spent/1000).toFixed(0)}K` : '₹0',      sub: 'on holidays'   },
                ].map(({ icon: Icon, color, label, value, sub }) => (
                    <div key={label} className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4 flex items-center gap-3">
                        <div className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center ${color}`}>
                            <Icon className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xl font-black text-stone-900 leading-none">{value}</p>
                            <p className="text-xs font-semibold text-stone-500 mt-1">{label}</p>
                            <p className="text-[10px] text-stone-400">{sub}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── REWARDS + BOOKINGS — equal columns ──────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                {/* REWARDS CARD */}
                <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                    {/* header */}
                    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-b border-amber-100 px-5 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-lg bg-amber-400 flex items-center justify-center shadow-sm shadow-amber-300/50">
                                <Star className="h-4 w-4 text-white fill-white" />
                            </div>
                            <div>
                                <p className="text-sm font-black text-stone-800">IG Rewards</p>
                                <p className="text-[11px] text-stone-500">Loyalty Programme</p>
                            </div>
                        </div>
                        <span className={`text-[10px] font-black rounded-full px-2.5 py-1 ${canRedeem ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                            {canRedeem ? '✦ Redeemable' : 'Gold Member'}
                        </span>
                    </div>

                    {/* points */}
                    <div className="px-5 py-5">
                        <p className="text-xs text-stone-400 font-medium mb-1">Your Points Balance</p>
                        <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-5xl font-black text-stone-900 tabular-nums">
                                {loyaltyBalance.toLocaleString('en-IN')}
                            </span>
                            <span className="text-stone-400 text-sm font-semibold">pts</span>
                        </div>
                        <p className="text-xs text-stone-400 mb-4">≈ ₹{loyaltyBalance.toLocaleString('en-IN')} cashback value</p>

                        {/* progress */}
                        {canRedeem ? (
                            <div className="flex items-center gap-3 rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3">
                                <Gift className="h-5 w-5 text-emerald-600 shrink-0" />
                                <div>
                                    <p className="text-sm font-black text-emerald-800">Ready to redeem!</p>
                                    <p className="text-xs text-emerald-600">Apply at checkout for ₹{MIN_REDEEM} off</p>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="flex justify-between text-xs font-medium mb-1.5">
                                    <span className="text-stone-400">{loyaltyBalance} pts earned</span>
                                    <span className="text-amber-600 font-bold">{ptsToNext} pts to reward</span>
                                </div>
                                <div className="h-2 rounded-full bg-stone-100 overflow-hidden">
                                    <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 transition-all"
                                        style={{ width: `${pctProgress || 2}%` }} />
                                </div>
                                <p className="text-[10px] text-stone-400 mt-1.5">₹100 spent = 1 point · Redeem at {MIN_REDEEM} pts</p>
                            </div>
                        )}

                        {/* recent activity */}
                        {loyaltyTxns.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-stone-100">
                                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2">Recent Activity</p>
                                <div className="space-y-2">
                                    {loyaltyTxns.slice(0, 3).map((t: any) => (
                                        <div key={t.id} className="flex items-center justify-between">
                                            <p className="text-xs text-stone-500 truncate">{t.description}</p>
                                            <span className={`text-xs font-black ml-3 shrink-0 ${t.type === 'earned' ? 'text-emerald-600' : 'text-red-500'}`}>
                                                {t.type === 'earned' ? '+' : '-'}{t.points}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* NEXT TRIP or empty */}
                {next ? (
                    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-indigo-100 px-5 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-sm shadow-indigo-500/30">
                                    <Sparkles className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-stone-800">Next Adventure</p>
                                    <p className="text-[11px] text-stone-500">Upcoming trip</p>
                                </div>
                            </div>
                            <span className="text-[10px] font-black rounded-full px-2.5 py-1 bg-emerald-100 text-emerald-700">
                                ✓ Confirmed
                            </span>
                        </div>
                        <div className="px-5 py-5">
                            <h2 className="text-base font-black text-stone-900 leading-snug mb-1">{next.package_title}</h2>
                            {next.destination && (
                                <p className="text-xs text-stone-400 flex items-center gap-1 mb-4">
                                    <MapPin className="h-3 w-3" />{next.destination}
                                </p>
                            )}

                            <div className="grid grid-cols-3 gap-2 mb-4">
                                {[
                                    { icon: Calendar, val: fmt(next.travel_date),                             label: 'Travel Date', cls: 'bg-indigo-50 border-indigo-100 text-indigo-600' },
                                    { icon: Clock,    val: `${daysUntil(next.travel_date)}d`,                 label: 'Days To Go',  cls: 'bg-amber-50  border-amber-100  text-amber-600'  },
                                    { icon: Users,    val: `${next.num_adults + (next.num_children || 0)}`,   label: 'Travellers',  cls: 'bg-emerald-50 border-emerald-100 text-emerald-600' },
                                ].map(({ icon: I, val, label, cls }) => (
                                    <div key={label} className={`rounded-xl border p-2.5 text-center ${cls}`}>
                                        <I className="h-4 w-4 mx-auto mb-1" />
                                        <p className="text-xs font-black text-stone-800">{val}</p>
                                        <p className="text-[10px] text-stone-400 mt-0.5">{label}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center justify-between mb-4 rounded-xl bg-stone-50 border border-stone-100 px-4 py-2.5">
                                <span className="text-xs text-stone-500">Total paid</span>
                                <span className="text-base font-black text-stone-900">₹{Number(next.total_amount).toLocaleString('en-IN')}</span>
                            </div>

                            <Link href={`/dashboard/bookings/${next.id}`}
                                className="flex items-center justify-center gap-2 w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] px-4 py-2.5 text-sm font-bold text-white transition-all">
                                View Booking <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm flex flex-col items-center justify-center px-6 py-10 text-center">
                        <div className="h-14 w-14 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-3">
                            <Globe className="h-7 w-7 text-indigo-400" />
                        </div>
                        <p className="font-black text-stone-800">No upcoming trips</p>
                        <p className="text-stone-400 text-sm mt-1 mb-5 max-w-xs">Explore our holiday packages and book your next adventure</p>
                        <Link href="/packages"
                            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 text-sm font-bold text-white transition-all">
                            Browse Packages <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                )}
            </div>

            {/* ── RECENT BOOKINGS ─────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
                    <div>
                        <h2 className="text-sm font-black text-stone-900">Recent Bookings</h2>
                        <p className="text-[11px] text-stone-400 mt-0.5">Confirmed, completed &amp; cancelled trips</p>
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
                            className="inline-flex items-center gap-2 mt-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 text-xs font-bold text-white transition-all">
                            Browse Packages
                        </Link>
                    </div>
                ) : (
                    <div className="divide-y divide-stone-100">
                        {recent.map(b => {
                            const s = badge[b.status] || badge.pending;
                            return (
                                <Link key={b.id} href={`/dashboard/bookings/${b.id}`}
                                    className="flex items-center gap-4 px-5 py-4 hover:bg-stone-50 transition-colors group">
                                    <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${s.bg}`}>
                                        {b.status === 'confirmed' && <CheckCircle2 className={`h-4 w-4 ${s.text}`} />}
                                        {b.status === 'cancelled' && <XCircle      className={`h-4 w-4 ${s.text}`} />}
                                        {b.status === 'completed' && <CheckCircle2 className={`h-4 w-4 ${s.text}`} />}
                                        {b.status === 'pending'   && <Clock        className={`h-4 w-4 ${s.text}`} />}
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
                                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold rounded-full px-2 py-0.5 mt-0.5 ${s.bg} ${s.text}`}>
                                            <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />{s.label}
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ── BOTTOM ROW: quick links + support ───────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Quick links */}
                <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-2">
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-3 pt-2 pb-1">Quick Links</p>
                    {[
                        { href: '/packages',           label: 'Browse Packages', icon: Globe,     cls: 'bg-indigo-50 text-indigo-600' },
                        { href: '/dashboard/bookings', label: 'All Bookings',    icon: Ticket,    cls: 'bg-emerald-50 text-emerald-600' },
                        { href: '/dashboard/profile',  label: 'My Profile',      icon: Star,      cls: 'bg-amber-50 text-amber-600' },
                    ].map(({ href, label, icon: Icon, cls }) => (
                        <Link key={href} href={href}
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-stone-50 transition-colors group">
                            <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${cls}`}>
                                <Icon className="h-4 w-4" />
                            </div>
                            <span className="text-sm font-semibold text-stone-700 group-hover:text-stone-900">{label}</span>
                            <ChevronRight className="h-3.5 w-3.5 ml-auto text-stone-300 group-hover:text-stone-500" />
                        </Link>
                    ))}
                </div>

                {/* Support */}
                <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5">
                    <p className="text-sm font-black text-stone-900 mb-0.5">Need help?</p>
                    <p className="text-xs text-stone-400 mb-4">Our travel experts are happy to assist</p>
                    <div className="space-y-2">
                        <a href="tel:+918807709919"
                            className="flex items-center gap-3 rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-semibold text-stone-700 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-all group">
                            <PhoneCall className="h-4 w-4 text-indigo-500 shrink-0" />
                            <span className="flex-1">+91 88077 09919</span>
                            <ArrowRight className="h-3.5 w-3.5 text-stone-300 group-hover:text-indigo-400" />
                        </a>
                        <a href="mailto:info@igholidays.com"
                            className="flex items-center gap-3 rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-semibold text-stone-700 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-all group">
                            <Mail className="h-4 w-4 text-indigo-500 shrink-0" />
                            <span className="flex-1">info@igholidays.com</span>
                            <ArrowRight className="h-3.5 w-3.5 text-stone-300 group-hover:text-indigo-400" />
                        </a>
                    </div>
                </div>
            </div>

        </div>
    );
}
