'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect') || '/dashboard';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            router.push(redirect);
        } catch (err: any) {
            setError(err.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
                <div className="flex items-start gap-3 rounded-xl bg-red-50 border border-red-100 px-4 py-3">
                    <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-stone-700">Email address</label>
                <div className="relative group">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 group-focus-within:text-brand-700 transition-colors" />
                    <input
                        type="email" required autoComplete="email"
                        value={email} onChange={e => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full h-12 rounded-xl border border-stone-200 bg-stone-50/50 pl-10 pr-4 text-sm text-stone-900 placeholder-stone-400 outline-none transition-all focus:bg-white focus:border-brand-700 focus:ring-2 focus:ring-brand-700/10"
                    />
                </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                    <label className="block text-sm font-semibold text-stone-700">Password</label>
                    <Link href="/auth/forgot-password" className="text-xs text-brand-700 hover:text-brand-900 font-medium transition-colors">
                        Forgot password?
                    </Link>
                </div>
                <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 group-focus-within:text-brand-700 transition-colors" />
                    <input
                        type={showPw ? 'text' : 'password'} required autoComplete="current-password"
                        value={password} onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full h-12 rounded-xl border border-stone-200 bg-stone-50/50 pl-10 pr-12 text-sm text-stone-900 placeholder-stone-400 outline-none transition-all focus:bg-white focus:border-brand-700 focus:ring-2 focus:ring-brand-700/10"
                    />
                    <button type="button" onClick={() => setShowPw(s => !s)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 h-7 w-7 rounded-lg flex items-center justify-center text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-all">
                        {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
                className="relative w-full h-12 rounded-xl bg-brand-900 text-white text-sm font-semibold transition-all hover:bg-brand-800 active:bg-brand-950 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm hover:shadow-md mt-2">
                {loading ? (
                    <>
                        <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        Signing in...
                    </>
                ) : (
                    <>Sign in <ArrowRight className="h-4 w-4" /></>
                )}
            </button>

            {/* Divider */}
            <div className="relative flex items-center gap-4">
                <div className="flex-1 h-px bg-stone-200" />
                <span className="text-xs text-stone-400 font-medium">New to IG Holidays?</span>
                <div className="flex-1 h-px bg-stone-200" />
            </div>

            <Link href="/auth/register"
                className="flex w-full h-12 items-center justify-center gap-2 rounded-xl border-2 border-stone-200 text-sm font-semibold text-stone-700 hover:border-brand-700 hover:text-brand-700 hover:bg-brand-50/50 transition-all">
                Create a free account
            </Link>
        </form>
    );
}
