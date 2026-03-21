'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { User, LogOut, Ticket, LayoutDashboard, ChevronDown, Settings } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function HeaderAuthButton() {
    const { user, loading, logout } = useAuth();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    if (loading) return <div className="h-9 w-28 animate-pulse rounded-full bg-stone-100" />;

    if (!user) {
        return (
            <Link
                href="/auth/login"
                className="flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-700 shadow-sm transition-all hover:bg-stone-50 hover:border-stone-300"
            >
                <User className="h-4 w-4" />
                Sign in
            </Link>
        );
    }

    const initials = `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase() || '?';

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen(o => !o)}
                className="flex items-center gap-2.5 rounded-full border border-stone-200 bg-white pl-1.5 pr-3 py-1.5 text-sm font-semibold text-stone-700 shadow-sm hover:bg-stone-50 hover:border-stone-300 transition-all"
            >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-900 text-white text-xs font-bold flex-shrink-0">
                    {initials}
                </div>
                <span className="hidden sm:block max-w-[90px] truncate">{user.first_name}</span>
                <ChevronDown className={`h-3.5 w-3.5 text-stone-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl border border-stone-200 bg-white shadow-xl py-1.5 z-50 overflow-hidden">
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-stone-100">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-900 text-white text-sm font-bold flex-shrink-0">
                                {initials}
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-stone-900 truncate">{user.first_name} {user.last_name}</p>
                                <p className="text-xs text-stone-400 truncate">{user.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Nav links */}
                    <div className="py-1">
                        <Link href="/dashboard" onClick={() => setOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors">
                            <LayoutDashboard className="h-4 w-4 text-stone-400" /> Dashboard
                        </Link>
                        <Link href="/dashboard/bookings" onClick={() => setOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors">
                            <Ticket className="h-4 w-4 text-stone-400" /> My Bookings
                        </Link>
                        <Link href="/dashboard/profile" onClick={() => setOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors">
                            <Settings className="h-4 w-4 text-stone-400" /> Profile Settings
                        </Link>
                    </div>

                    {/* Sign out */}
                    <div className="border-t border-stone-100 py-1">
                        <button onClick={() => { setOpen(false); logout(); }}
                            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                            <LogOut className="h-4 w-4" /> Sign out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
