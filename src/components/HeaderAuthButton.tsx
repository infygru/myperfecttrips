'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { User, LogOut, Ticket, ChevronDown } from 'lucide-react';
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

    if (loading) return <div className="h-9 w-24 animate-pulse rounded-full bg-stone-100" />;

    if (!user) {
        return (
            <Link
                href="/auth/login"
                className="rounded-full border border-stone-200 bg-white px-5 py-2 text-sm font-semibold text-stone-700 shadow-sm transition-all hover:bg-stone-50 hover:border-stone-300 flex items-center gap-2"
            >
                <User className="h-4 w-4" />
                Sign in
            </Link>
        );
    }

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen(o => !o)}
                className="flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-2 text-sm font-semibold text-stone-700 shadow-sm hover:bg-stone-50 transition-all"
            >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-900 text-white text-xs font-bold">
                    {user.first_name?.[0]?.toUpperCase()}
                </div>
                <span className="hidden sm:block max-w-[100px] truncate">{user.first_name}</span>
                <ChevronDown className={`h-3.5 w-3.5 text-stone-400 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl border border-stone-200 bg-white shadow-lg py-2 z-50">
                    <div className="px-4 py-2 border-b border-stone-100 mb-1">
                        <p className="text-xs font-semibold text-stone-900 truncate">{user.first_name} {user.last_name}</p>
                        <p className="text-xs text-stone-400 truncate">{user.email}</p>
                    </div>
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors"
                        onClick={() => setOpen(false)}
                    >
                        <User className="h-4 w-4" /> Dashboard
                    </Link>
                    <Link
                        href="/dashboard/bookings"
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors"
                        onClick={() => setOpen(false)}
                    >
                        <Ticket className="h-4 w-4" /> My Bookings
                    </Link>
                    <div className="border-t border-stone-100 mt-1 pt-1">
                        <button
                            onClick={() => { setOpen(false); logout(); }}
                            className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                        >
                            <LogOut className="h-4 w-4" /> Sign out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
