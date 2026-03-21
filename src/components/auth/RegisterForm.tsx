'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
    Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight,
    ArrowLeft, CheckCircle2, AlertCircle, RefreshCw, ShieldCheck
} from 'lucide-react';

type Step = 'info' | 'otp' | 'done';

function PasswordStrength({ password }: { password: string }) {
    const has8 = password.length >= 8;
    const hasNum = /\d/.test(password);
    const hasSpecial = /[^a-zA-Z0-9]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const score = [has8, hasNum, hasSpecial, hasUpper].filter(Boolean).length;
    const levels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['', 'bg-red-400', 'bg-yellow-400', 'bg-blue-400', 'bg-green-500'];
    const textColors = ['', 'text-red-500', 'text-yellow-600', 'text-blue-600', 'text-green-600'];
    if (!password) return null;
    return (
        <div className="mt-2 space-y-1.5">
            <div className="flex gap-1">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= score ? colors[score] : 'bg-stone-200'}`} />
                ))}
            </div>
            <p className={`text-xs font-medium ${textColors[score]}`}>{levels[score]}</p>
        </div>
    );
}

function OTPInput({ value, onChange, disabled }: { value: string; onChange: (v: string) => void; disabled?: boolean }) {
    const inputs = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (i: number, v: string) => {
        const clean = v.replace(/\D/g, '').slice(-1);
        const arr = value.padEnd(6, ' ').split('');
        arr[i] = clean || ' ';
        const next = arr.join('').trimEnd();
        onChange(next);
        if (clean && i < 5) inputs.current[i + 1]?.focus();
    };

    const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !value[i] && i > 0) {
            inputs.current[i - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        onChange(pasted);
        e.preventDefault();
        if (pasted.length > 0) inputs.current[Math.min(pasted.length, 5)]?.focus();
    };

    return (
        <div className="flex gap-2.5 justify-center">
            {Array.from({ length: 6 }).map((_, i) => (
                <input
                    key={i}
                    ref={el => { inputs.current[i] = el; }}
                    type="text" inputMode="numeric" maxLength={1}
                    value={value[i] && value[i] !== ' ' ? value[i] : ''}
                    onChange={e => handleChange(i, e.target.value)}
                    onKeyDown={e => handleKeyDown(i, e)}
                    onPaste={handlePaste}
                    disabled={disabled}
                    className="h-12 w-12 rounded-xl border-2 border-stone-200 bg-stone-50 text-center text-lg font-bold text-stone-900 outline-none transition-all focus:border-brand-700 focus:bg-white focus:ring-2 focus:ring-brand-700/10 disabled:opacity-50"
                />
            ))}
        </div>
    );
}

export default function RegisterForm() {
    const [step, setStep] = useState<Step>('info');
    const [form, setForm] = useState({ first_name: '', last_name: '', email: '', password: '', phone: '' });
    const [showPw, setShowPw] = useState(false);
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otpTimer, setOtpTimer] = useState(0);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const { refresh } = useAuth();
    const router = useRouter();
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(f => ({ ...f, [k]: e.target.value }));
        setFieldErrors(fe => ({ ...fe, [k]: '' }));
    };

    const startTimer = () => {
        setOtpTimer(60);
        timerRef.current = setInterval(() => {
            setOtpTimer(t => {
                if (t <= 1) { clearInterval(timerRef.current!); return 0; }
                return t - 1;
            });
        }, 1000);
    };

    useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

    const validateInfo = () => {
        const errs: Record<string, string> = {};
        if (!form.first_name.trim()) errs.first_name = 'Required';
        if (!form.last_name.trim()) errs.last_name = 'Required';
        if (!form.email.includes('@')) errs.email = 'Enter a valid email';
        if (form.password.length < 8) errs.password = 'Minimum 8 characters';
        setFieldErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const goToOTP = async () => {
        if (!validateInfo()) return;
        if (!form.phone) {
            // Skip OTP if no phone
            await submitRegistration(false);
            return;
        }
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: form.phone }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to send OTP');
            setOtpSent(true);
            setStep('otp');
            startTimer();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const resendOTP = async () => {
        if (otpTimer > 0) return;
        setError('');
        setLoading(true);
        try {
            const res = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: form.phone }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setOtp('');
            startTimer();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const verifyAndRegister = async () => {
        if (otp.replace(/\s/g, '').length !== 6) {
            setError('Enter the 6-digit OTP');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const verRes = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: form.phone, otp }),
            });
            const verData = await verRes.json();
            if (!verRes.ok) throw new Error(verData.error || 'Invalid OTP');
            await submitRegistration(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const submitRegistration = async (phoneVerified: boolean) => {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...form, phone_verified: phoneVerified }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Registration failed');
        await refresh();
        setStep('done');
        setTimeout(() => router.push('/dashboard'), 2000);
    };

    // ── STEP: Done ──
    if (step === 'done') {
        return (
            <div className="text-center py-8">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-stone-900">Welcome aboard, {form.first_name}!</h2>
                <p className="text-stone-500 text-sm mt-2">Your account is ready. Redirecting to dashboard...</p>
                <div className="mt-4 h-1 bg-stone-100 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-900 rounded-full animate-[progress_2s_linear_forwards]" style={{ width: '100%', animation: 'none', transition: 'width 2s linear', }} />
                </div>
            </div>
        );
    }

    // ── STEP: OTP ──
    if (step === 'otp') {
        const normalized = form.phone.replace(/[^0-9]/g, '').slice(-10);
        const masked = `+91 ${normalized.slice(0, 2)}XXXXXX${normalized.slice(-2)}`;
        return (
            <div className="space-y-6">
                <button onClick={() => { setStep('info'); setError(''); setOtp(''); }}
                    className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-brand-700 transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back
                </button>

                <div>
                    <div className="h-12 w-12 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center mb-4">
                        <ShieldCheck className="h-6 w-6 text-brand-700" />
                    </div>
                    <h2 className="text-2xl font-bold text-stone-900">Verify your number</h2>
                    <p className="text-stone-500 text-sm mt-1.5">
                        We sent a 6-digit OTP to <span className="font-semibold text-stone-700">{masked}</span>
                    </p>
                </div>

                {error && (
                    <div className="flex items-start gap-3 rounded-xl bg-red-50 border border-red-100 px-4 py-3">
                        <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                <OTPInput value={otp} onChange={setOtp} disabled={loading} />

                <button onClick={verifyAndRegister} disabled={loading || otp.replace(/\s/g, '').length < 6}
                    className="w-full h-12 rounded-xl bg-brand-900 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-brand-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md">
                    {loading ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Verify & Create Account <ArrowRight className="h-4 w-4" /></>}
                </button>

                <div className="text-center">
                    {otpTimer > 0 ? (
                        <p className="text-sm text-stone-400">Resend OTP in <span className="font-semibold text-stone-600">{otpTimer}s</span></p>
                    ) : (
                        <button onClick={resendOTP} disabled={loading}
                            className="flex items-center gap-1.5 text-sm text-brand-700 hover:text-brand-900 font-medium mx-auto transition-colors">
                            <RefreshCw className="h-3.5 w-3.5" /> Resend OTP
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // ── STEP: Info ──
    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-2xl font-bold text-stone-900">Create your account</h2>
                <p className="text-stone-500 text-sm mt-1.5">Free forever — earn rewards from day one</p>
            </div>

            {error && (
                <div className="flex items-start gap-3 rounded-xl bg-red-50 border border-red-100 px-4 py-3">
                    <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}

            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
                {(['first_name', 'last_name'] as const).map((k, i) => (
                    <div key={k} className="space-y-1.5">
                        <label className="block text-sm font-semibold text-stone-700">{i === 0 ? 'First name' : 'Last name'}</label>
                        <div className="relative group">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 group-focus-within:text-brand-700 transition-colors" />
                            <input type="text" required value={form[k]} onChange={set(k)}
                                placeholder={i === 0 ? 'Ravi' : 'Kumar'}
                                className={`w-full h-11 rounded-xl border bg-stone-50/50 pl-9 pr-3 text-sm outline-none transition-all focus:bg-white focus:border-brand-700 focus:ring-2 focus:ring-brand-700/10 ${fieldErrors[k] ? 'border-red-400' : 'border-stone-200'}`}
                            />
                        </div>
                        {fieldErrors[k] && <p className="text-xs text-red-500">{fieldErrors[k]}</p>}
                    </div>
                ))}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-stone-700">Email address</label>
                <div className="relative group">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 group-focus-within:text-brand-700 transition-colors" />
                    <input type="email" required autoComplete="email" value={form.email} onChange={set('email')}
                        placeholder="you@example.com"
                        className={`w-full h-12 rounded-xl border bg-stone-50/50 pl-10 pr-4 text-sm outline-none transition-all focus:bg-white focus:border-brand-700 focus:ring-2 focus:ring-brand-700/10 ${fieldErrors.email ? 'border-red-400' : 'border-stone-200'}`}
                    />
                </div>
                {fieldErrors.email && <p className="text-xs text-red-500">{fieldErrors.email}</p>}
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-stone-700">
                    Mobile number <span className="text-stone-400 font-normal text-xs">(for OTP & reminders)</span>
                </label>
                <div className="relative group flex items-center">
                    <div className="absolute left-0 h-full flex items-center pl-3.5 border-r border-stone-200 pr-3 pointer-events-none">
                        <span className="text-sm font-semibold text-stone-600">🇮🇳 +91</span>
                    </div>
                    <input type="tel" value={form.phone} onChange={set('phone')}
                        placeholder="98765 43210" maxLength={10}
                        className="w-full h-12 rounded-xl border border-stone-200 bg-stone-50/50 pl-[80px] pr-4 text-sm outline-none transition-all focus:bg-white focus:border-brand-700 focus:ring-2 focus:ring-brand-700/10"
                    />
                </div>
                <p className="text-xs text-stone-400">OTP verification will be required if you add a phone number</p>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-stone-700">Password</label>
                <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 group-focus-within:text-brand-700 transition-colors" />
                    <input type={showPw ? 'text' : 'password'} required autoComplete="new-password"
                        value={form.password} onChange={set('password')} placeholder="Min. 8 characters"
                        className={`w-full h-12 rounded-xl border bg-stone-50/50 pl-10 pr-12 text-sm outline-none transition-all focus:bg-white focus:border-brand-700 focus:ring-2 focus:ring-brand-700/10 ${fieldErrors.password ? 'border-red-400' : 'border-stone-200'}`}
                    />
                    <button type="button" onClick={() => setShowPw(s => !s)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 h-7 w-7 rounded-lg flex items-center justify-center text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-all">
                        {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                </div>
                {fieldErrors.password ? <p className="text-xs text-red-500">{fieldErrors.password}</p> : <PasswordStrength password={form.password} />}
            </div>

            {/* Submit */}
            <button onClick={goToOTP} disabled={loading}
                className="w-full h-12 rounded-xl bg-brand-900 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-brand-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md mt-2">
                {loading ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>{form.phone ? 'Continue to Verify' : 'Create Account'} <ArrowRight className="h-4 w-4" /></>}
            </button>

            <p className="text-center text-xs text-stone-400">
                By creating an account you agree to our{' '}
                <Link href="/terms" className="text-stone-600 hover:underline">Terms</Link> &{' '}
                <Link href="/privacy-policy" className="text-stone-600 hover:underline">Privacy Policy</Link>
            </p>

            <p className="text-center text-sm text-stone-500">
                Already have an account?{' '}
                <Link href="/auth/login" className="font-semibold text-brand-700 hover:text-brand-900">Sign in</Link>
            </p>
        </div>
    );
}
