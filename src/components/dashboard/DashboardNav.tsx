'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth, getUserDisplayName, getUserInitials, getAvatarUrl } from '@/context/AuthContext';
import { LayoutDashboard, Ticket, User, LogOut, Star } from 'lucide-react';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://api.igholidays.com';

const navItems = [
    { href: '/dashboard',          label: 'Overview',    icon: LayoutDashboard },
    { href: '/dashboard/bookings', label: 'My Bookings', icon: Ticket },
    { href: '/dashboard/profile',  label: 'Profile',     icon: User },
];

export default function DashboardNav({ user }: { user: any }) {
    const pathname = usePathname();
    const { logout } = useAuth();
    const displayName = getUserDisplayName(user);
    const initials = getUserInitials(user);
    const avatarUrl = getAvatarUrl(user, DIRECTUS_URL);

    return (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
            {/* Profile */}
            <div className="px-4 py-5 border-b border-stone-100">
                <div className="flex items-center gap-3 mb-4">
                    <div className="relative shrink-0">
                        <div className="h-10 w-10 rounded-xl overflow-hidden bg-brand-900 flex items-center justify-center">
                            {avatarUrl ? (
                                <Image src={avatarUrl} alt={displayName} width={40} height={40} className="h-full w-full object-cover" unoptimized />
                            ) : (
                                <span className="text-sm font-bold text-white">{initials}</span>
                            )}
                        </div>
                        <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-stone-900 truncate">{displayName}</p>
                        <p className="text-xs text-stone-400 truncate">{user.email}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-100 px-3 py-2">
                    <Star className="h-3 w-3 text-amber-500 fill-amber-400 shrink-0" />
                    <span className="text-xs font-semibold text-amber-700">IG Rewards Member</span>
                </div>
            </div>

            {/* Nav links */}
            <nav className="p-2">
                {navItems.map(({ href, label, icon: Icon }) => {
                    const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
                    return (
                        <Link key={href} href={href}
                            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all mb-0.5 ${
                                active
                                    ? 'bg-brand-900 text-white'
                                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                            }`}>
                            <Icon className="h-4 w-4 shrink-0" />
                            {label}
                        </Link>
                    );
                })}
            </nav>

            {/* Sign out */}
            <div className="p-2 pt-0 border-t border-stone-100 mt-1">
                <button onClick={logout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-stone-400 hover:bg-red-50 hover:text-red-600 transition-all">
                    <LogOut className="h-4 w-4 shrink-0" />
                    Sign out
                </button>
            </div>
        </div>
    );
}
