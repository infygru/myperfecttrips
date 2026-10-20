import { getCurrentUser, adminFetch } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
    Plane, Calendar, ArrowRight, Star, Gift,
    CheckCircle2, XCircle, ChevronRight, Users,
    PhoneCall, Ticket, Clock, Globe, Mail,
} from 'lucide-react';
import { getUserLoyaltyBalance, getLoyaltyTransactions, MIN_REDEEM } from '@/lib/loyalty';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'My Dashboard | My Perfect Trips' };
export const dynamic = 'force-dynamic';

function fmt(d: string) {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
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

    const all       = (await bookingsRes.json()).data as any[] || [];
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

    const firstName = user.first_name?.trim() || '';
    const lastName  = user.last_name?.trim()  || '';
    const fullName  = [firstName, lastName].filter(Boolean).join(' ') || user.email?.split('@')[0] || 'there';
    const initials  = firstName && lastName ? `${firstName[0]}${lastName[0]}`.toUpperCase()
                    : firstName             ? firstName[0].toUpperCase()
                    : user.email?.[0]?.toUpperCase() || '?';

    const statusStyle: Record<string, { label: string; dot: string; text: string }> = {
        confirmed: { label: 'Confirmed', dot: 'bg-emerald-500', text: 'text-stone-700' },
        completed: { label: 'Completed', dot: 'bg-stone-400',   text: 'text-stone-500' },
        cancelled: { label: 'Cancelled', dot: 'bg-red-400',     text: 'text-stone-500' },
        pending:   { label: 'Pending',   dot: 'bg-amber-400',   text: 'text-stone-700' },
    };

    return (
        <div className="space-y-4">

            {/* ── WELCOME ─────────────────────────────────────────── */}
            <div className="bg-white rounded-xl border border-stone-200 px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-stone-900 flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {initials}
                    </div>
                    <div>
                        <p className="text-xs text-stone-400">{greet()}</p>
                        <h1 className="text-base font-bold text-stone-900">{fullName}</h1>
                    </div>
                </div>
                <Link href="/packages"
                    className="shrink-0 inline-flex items-center gap-2 rounded-lg bg-stone-900 hover:bg-stone-700 px-4 py-2 text-sm font-semibold text-white transition-colors">
                    <Plane className="h-4 w-4" />
                    Book a Trip
                </Link>
            </div>

            {/* ── STATS ───────────────────────────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                    { label: 'Total Trips',   value: confirmed.length,                                   sub: 'all time'    },
                    { label: 'Confirmed',     value: all.filter(b => b.status === 'confirmed').length,   sub: 'active'      },
                    { label: 'Upcoming',      value: upcoming.length,                                    sub: 'ahead'       },
                    { label: 'Total Spent',   value: spent > 0 ? `£${(spent / 1000).toFixed(0)}K` : '£0', sub: 'on holidays' },
                ].map(({ label, value, sub }) => (
                    <div key={label} className="bg-white rounded-xl border border-stone-200 px-4 py-3">
                        <p className="text-2xl font-bold text-stone-900">{value}</p>
                        <p className="text-xs font-medium text-stone-600 mt-0.5">{label}</p>
                        <p className="text-[10px] text-stone-400">{sub}</p>
                    </div>
                ))}
            </div>

            {/* ── REWARDS + NEXT TRIP ─────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                {/* REWARDS */}
                <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
                    <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-stone-400" />
                            <p className="text-sm font-semibold text-stone-900">IG Rewards</p>
                        </div>
                        {canRedeem && (
                            <span className="text-[10px] font-semibold bg-stone-100 text-stone-600 rounded-full px-2.5 py-1">
                                Redeemable
                            </span>
                        )}
                    </div>
                    <div className="px-5 py-4">
                        <p className="text-[10px] text-stone-400 mb-1">Points balance</p>
                        <div className="flex items-baseline gap-1.5 mb-0.5">
                            <span className="text-4xl font-bold text-stone-900 tabular-nums">
                                {loyaltyBalance.toLocaleString('en-GB')}
                            </span>
                            <span className="text-sm text-stone-400">pts</span>
                        </div>
                        <p className="text-xs text-stone-400 mb-4">≈ £{loyaltyBalance.toLocaleString('en-GB')} value</p>

                        {canRedeem ? (
                            <div className="flex items-center gap-2.5 rounded-lg bg-stone-50 border border-stone-200 px-3 py-2.5">
                                <Gift className="h-4 w-4 text-stone-500 shrink-0" />
                                <div>
                                    <p className="text-xs font-semibold text-stone-800">Ready to redeem</p>
                                    <p className="text-[11px] text-stone-500">Apply at checkout for £{MIN_REDEEM} off</p>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="flex justify-between text-xs mb-1.5">
                                    <span className="text-stone-400">{loyaltyBalance} pts</span>
                                    <span className="text-stone-600 font-medium">{ptsToNext} to next reward</span>
                                </div>
                                <div className="h-1.5 rounded-full bg-stone-100 overflow-hidden">
                                    <div className="h-full rounded-full bg-stone-900 transition-all"
                                        style={{ width: `${pctProgress || 2}%` }} />
                                </div>
                                <p className="text-[10px] text-stone-400 mt-1.5">£100 spent = 1 pt · Redeem at {MIN_REDEEM} pts</p>
                            </div>
                        )}

                        {loyaltyTxns.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-stone-100 space-y-2">
                                <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">Recent activity</p>
                                {loyaltyTxns.slice(0, 3).map((t: any) => (
                                    <div key={t.id} className="flex items-center justify-between">
                                        <p className="text-xs text-stone-500 truncate">{t.description}</p>
                                        <span className={`text-xs font-semibold ml-3 shrink-0 ${t.type === 'earned' ? 'text-stone-800' : 'text-stone-400'}`}>
                                            {t.type === 'earned' ? '+' : '-'}{t.points}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* NEXT TRIP */}
                {next ? (
                    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
                        <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Plane className="h-4 w-4 text-stone-400" />
                                <p className="text-sm font-semibold text-stone-900">Next Trip</p>
                            </div>
                            <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 rounded-full px-2.5 py-1">
                                Confirmed
                            </span>
                        </div>
                        <div className="px-5 py-4">
                            <h2 className="text-sm font-bold text-stone-900 mb-3">{next.package_title}</h2>

                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between text-xs">
                                    <span className="text-stone-400 flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Travel date</span>
                                    <span className="font-medium text-stone-700">{fmt(next.travel_date)}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-stone-400 flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> Days to go</span>
                                    <span className="font-bold text-stone-900">{daysUntil(next.travel_date)} days</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-stone-400 flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> Travellers</span>
                                    <span className="font-medium text-stone-700">{next.num_adults + (next.num_children || 0)}</span>
                                </div>
                                <div className="flex justify-between text-xs pt-2 border-t border-stone-100">
                                    <span className="text-stone-400">Total paid</span>
                                    <span className="font-bold text-stone-900">£{Number(next.total_amount).toLocaleString('en-GB')}</span>
                                </div>
                            </div>

                            <Link href={`/dashboard/bookings/${next.id}`}
                                className="flex items-center justify-center gap-2 w-full rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-700 transition-colors">
                                View Booking <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-stone-200 flex flex-col items-center justify-center px-6 py-10 text-center">
                        <Globe className="h-8 w-8 text-stone-300 mb-3" />
                        <p className="text-sm font-semibold text-stone-700">No upcoming trips</p>
                        <p className="text-xs text-stone-400 mt-1 mb-5">Explore our packages and book your next holiday</p>
                        <Link href="/packages"
                            className="inline-flex items-center gap-2 rounded-lg bg-stone-900 hover:bg-stone-700 px-4 py-2 text-sm font-semibold text-white transition-colors">
                            Browse Packages <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>
                )}
            </div>

            {/* ── RECENT BOOKINGS ─────────────────────────────────── */}
            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-stone-100">
                    <p className="text-sm font-semibold text-stone-900">Recent Bookings</p>
                    <Link href="/dashboard/bookings"
                        className="flex items-center gap-1 text-xs text-stone-400 hover:text-stone-700 transition-colors">
                        View all <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                </div>
                {recent.length === 0 ? (
                    <div className="px-6 py-10 text-center">
                        <Ticket className="h-8 w-8 text-stone-200 mx-auto mb-3" />
                        <p className="text-sm text-stone-400">No confirmed bookings yet</p>
                        <Link href="/packages"
                            className="inline-flex items-center gap-2 mt-4 rounded-lg bg-stone-900 hover:bg-stone-700 px-4 py-2 text-xs font-semibold text-white transition-colors">
                            Browse Packages
                        </Link>
                    </div>
                ) : (
                    <div className="divide-y divide-stone-100">
                        {recent.map(b => {
                            const s = statusStyle[b.status] || statusStyle.pending;
                            return (
                                <Link key={b.id} href={`/dashboard/bookings/${b.id}`}
                                    className="flex items-center gap-4 px-5 py-3.5 hover:bg-stone-50 transition-colors group">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-stone-900 truncate">{b.package_title}</p>
                                        <p className="text-xs text-stone-400 mt-0.5">{fmt(b.travel_date)}</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-sm font-semibold text-stone-900">£{Number(b.total_amount).toLocaleString('en-GB')}</p>
                                        <span className={`inline-flex items-center gap-1 text-[10px] font-medium mt-0.5 ${s.text}`}>
                                            <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />{s.label}
                                        </span>
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-stone-300 group-hover:text-stone-500 shrink-0" />
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ── BOTTOM ROW ──────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Quick links */}
                <div className="bg-white rounded-xl border border-stone-200 p-1.5">
                    <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest px-3 pt-2 pb-1">Quick Links</p>
                    {[
                        { href: '/packages',           label: 'Browse Packages', icon: Globe  },
                        { href: '/dashboard/bookings', label: 'All Bookings',    icon: Ticket },
                        { href: '/dashboard/profile',  label: 'My Profile',      icon: Star   },
                    ].map(({ href, label, icon: Icon }) => (
                        <Link key={href} href={href}
                            className="flex items-center gap-2.5 rounded-lg px-3 py-2 hover:bg-stone-50 transition-colors group">
                            <Icon className="h-4 w-4 text-stone-400 shrink-0" />
                            <span className="text-sm text-stone-600 group-hover:text-stone-900">{label}</span>
                            <ChevronRight className="h-3.5 w-3.5 ml-auto text-stone-200 group-hover:text-stone-400" />
                        </Link>
                    ))}
                </div>

                {/* Support */}
                <div className="bg-white rounded-xl border border-stone-200 p-5">
                    <p className="text-sm font-semibold text-stone-900 mb-0.5">Need help?</p>
                    <p className="text-xs text-stone-400 mb-4">Our travel experts are happy to assist you</p>
                    <div className="space-y-2">
                        <a href="tel:+447895910015"
                            className="flex items-center gap-3 rounded-lg border border-stone-200 px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50 transition-colors">
                            <PhoneCall className="h-4 w-4 text-stone-400 shrink-0" />
                            +44 7895 910015
                        </a>
                        <a href="mailto:sales@myperfecttrips.com"
                            className="flex items-center gap-3 rounded-lg border border-stone-200 px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50 transition-colors">
                            <Mail className="h-4 w-4 text-stone-400 shrink-0" />
                            sales@myperfecttrips.com
                        </a>
                    </div>
                </div>
            </div>

        </div>
    );
}
