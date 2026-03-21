'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LayoutDashboard, Ticket, User, LogOut, Star } from 'lucide-react';

const navItems = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/bookings', label: 'My Bookings', icon: Ticket },
    { href: '/dashboard/profile', label: 'Profile', icon: User },
];

export default function DashboardNav({ user }: { user: any }) {
    const pathname = usePathname();
    const { logout } = useAuth();

    return (
        <div className="rounded-2xl border border-stone-200 bg-white shadow-sm overflow-hidden">
            {/* Profile area */}
            <div className="p-5 border-b border-stone-100">
                <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                        <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-brand-800 to-brand-950 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                            {user.first_name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="font-bold text-stone-900 text-sm truncate">{user.first_name} {user.last_name}</p>
                        <p className="text-xs text-stone-400 truncate">{user.email}</p>
                    </div>
                </div>

                {/* Loyalty mini-badge */}
                <div className="mt-3 flex items-center gap-2 rounded-xl bg-brand-50 border border-brand-100 px-3 py-2">
                    <Star className="h-3.5 w-3.5 text-gold-500 fill-gold-400 flex-shrink-0" />
                    <span className="text-xs font-semibold text-brand-800">IG Rewards member</span>
                </div>
            </div>

            {/* Nav */}
            <nav className="p-3 space-y-0.5">
                {navItems.map(({ href, label, icon: Icon }) => {
                    const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
                    return (
                        <Link key={href} href={href}
                            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                                active
                                    ? 'bg-brand-900 text-white shadow-sm'
                                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                            }`}>
                            <Icon className="h-4 w-4 flex-shrink-0" />
                            {label}
                        </Link>
                    );
                })}
            </nav>

            {/* Sign out */}
            <div className="p-3 border-t border-stone-100">
                <button onClick={logout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-stone-500 hover:bg-red-50 hover:text-red-600 transition-all">
                    <LogOut className="h-4 w-4 flex-shrink-0" />
                    Sign out
                </button>
            </div>
        </div>
    );
}
