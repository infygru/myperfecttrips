'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth, getUserDisplayName, getUserInitials, getAvatarUrl } from '@/context/AuthContext';
import { LayoutDashboard, Ticket, User, LogOut } from 'lucide-react';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://api.myperfecttrips.com';

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
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
            {/* Profile */}
            <div className="px-4 py-4 border-b border-stone-100">
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg overflow-hidden bg-stone-900 flex items-center justify-center shrink-0">
                        {avatarUrl ? (
                            <Image src={avatarUrl} alt={displayName} width={36} height={36} className="h-full w-full object-cover" />
                        ) : (
                            <span className="text-xs font-bold text-white">{initials}</span>
                        )}
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-stone-900 truncate">{displayName}</p>
                        <p className="text-xs text-stone-400 truncate">{user.email}</p>
                    </div>
                </div>
            </div>

            {/* Nav links */}
            <nav className="p-1.5">
                {navItems.map(({ href, label, icon: Icon }) => {
                    const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
                    return (
                        <Link key={href} href={href}
                            className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors mb-0.5 ${
                                active
                                    ? 'bg-stone-900 text-white'
                                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                            }`}>
                            <Icon className="h-4 w-4 shrink-0" />
                            {label}
                        </Link>
                    );
                })}
            </nav>

            {/* Sign out */}
            <div className="p-1.5 border-t border-stone-100">
                <button onClick={logout}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-stone-400 hover:bg-stone-50 hover:text-stone-600 transition-colors">
                    <LogOut className="h-4 w-4 shrink-0" />
                    Sign out
                </button>
            </div>
        </div>
    );
}
