'use client';

import { useState, useEffect } from 'react';
import {
    Calendar, Users, MessageSquare, Minus, Plus, Star, Gift, Tag,
    Phone, AlertCircle, Loader2, CreditCard, CheckCircle2, ShieldCheck,
} from 'lucide-react';
import { MIN_REDEEM } from '@/lib/loyalty-constants';

interface Props {
    packageId: string;
    packageTitle: string;
    packageSlug: string;
    basePrice: number;
    userId: string;
    userName: string;
    userEmail: string;
    userPhone: string;
    loyaltyBalance: number;
    existingBookingId?: string;
}

function CounterInput({ label, sub, value, onChange, min = 0 }: {
    label: string; sub: string; value: number; onChange: (v: number) => void; min?: number;
}) {
    return (
        <div className="flex items-center justify-between rounded-xl border border-stone-200 bg-stone-50/50 px-4 py-3">
            <div>
                <p className="text-sm font-semibold text-stone-800">{label}</p>
                <p className="text-xs text-stone-400">{sub}</p>
            </div>
            <div className="flex items-center gap-3">
                <button type="button" onClick={() => onChange(Math.max(min, value - 1))}
                    className="h-8 w-8 rounded-xl border border-stone-200 bg-white flex items-center justify-center text-stone-600 hover:bg-stone-100 disabled:opacity-40 transition-all"
                    disabled={value <= min}>
                    <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-5 text-center text-base font-bold text-stone-900">{value}</span>
                <button type="button" onClick={() => onChange(value + 1)}
                    className="h-8 w-8 rounded-xl border border-stone-200 bg-white flex items-center justify-center text-stone-600 hover:bg-stone-100 transition-all">
                    <Plus className="h-3.5 w-3.5" />
                </button>
            </div>
        </div>
    );
}

declare global {
    interface Window {
        Razorpay?: new (options: Record<string, any>) => { open(): void };
    }
}

async function loadRazorpaySDK(): Promise<void> {
    if (typeof window === 'undefined') return;
    if (window.Razorpay) return;
    await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load payment SDK. Please refresh and try again.'));
        document.head.appendChild(script);
    });
}

/** UK/international phone: at least 7 digits */
function isValidPhone(val: string): boolean {
    const digits = val.replace(/\D/g, '');
    return digits.length >= 7 && digits.length <= 15;
}

export default function CheckoutForm({
    packageId, packageTitle, packageSlug, basePrice,
    userId, userName, userEmail, userPhone, loyaltyBalance,
    existingBookingId,
}: Props) {
    // Form state
    const [adults, setAdults]                       = useState(1);
    const [children, setChildren]                   = useState(0);
    const [travelDate, setTravelDate]               = useState('');
    const [specialRequests, setSpecialRequests]     = useState('');
    const [usePoints, setUsePoints]                 = useState(false);

    // Phone + OTP state
    // Pre-verified only if phone came from the user's saved profile
    const [phone, setPhone]                 = useState(userPhone);
    const [phoneVerified, setPhoneVerified] = useState(!!userPhone);
    const [otpSent, setOtpSent]             = useState(false);
    const [otpValue, setOtpValue]           = useState('');
    const [sendingOtp, setSendingOtp]       = useState(false);
    const [verifyingOtp, setVerifyingOtp]   = useState(false);
    const [otpError, setOtpError]           = useState('');
    const [otpSuccess, setOtpSuccess]       = useState('');
    const [resendCountdown, setResendCountdown] = useState(0);

    // Countdown timer for resend
    useEffect(() => {
        if (resendCountdown <= 0) return;
        const t = setTimeout(() => setResendCountdown(c => c - 1), 1000);
        return () => clearTimeout(t);
    }, [resendCountdown]);

    // Coupon state
    const [couponInput, setCouponInput]     = useState('');
    const [couponLoading, setCouponLoading] = useState(false);
    const [couponError, setCouponError]     = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<{
        id: string; code: string; type: 'percentage' | 'fixed';
        value: number; discountAmount: number; message: string;
    } | null>(null);

    // Booking / payment state
    const [currentBookingId, setCurrentBookingId] = useState<string | undefined>(existingBookingId);
    const [error, setError]       = useState('');
    const [loading, setLoading]   = useState(false);
    const [redirecting, setRedirecting] = useState(false);

    const today          = new Date().toISOString().split('T')[0];
    const subtotal       = basePrice * (adults + children * 0.5);
    const couponDiscount = appliedCoupon?.discountAmount ?? 0;
    const afterCoupon    = Math.max(0, subtotal - couponDiscount);
    const pointsDiscount = usePoints && loyaltyBalance >= MIN_REDEEM
        ? Math.min(loyaltyBalance, afterCoupon) : 0;
    const totalAmount    = Math.max(1, Math.round(afterCoupon - pointsDiscount));
    const pointsToRedeem = usePoints ? Math.round(pointsDiscount) : 0;
    const pointsEarnable = Math.floor(totalAmount / 100);

    // ── Traveller count change resets coupon (subtotal changed) ──────────────
    function handleTravellerChange(setter: (v: number) => void, v: number) {
        setter(v);
        if (appliedCoupon) {
            setCouponInput(appliedCoupon.code);
            setAppliedCoupon(null);
            setCouponError('Traveller count changed — please re-apply your coupon');
        }
    }

    // ── Coupon apply / remove ─────────────────────────────────────────────────
    async function handleApplyCoupon() {
        const code = couponInput.trim().toUpperCase();
        if (!code) return;
        setCouponError('');
        setCouponLoading(true);
        try {
            const res = await fetch('/api/coupon/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, subtotal, packageSlug }),
            });
            const data = await res.json();
            if (!res.ok || !data.valid) {
                setCouponError(data.message || 'Invalid coupon code');
                setAppliedCoupon(null);
            } else {
                setAppliedCoupon({
                    id:             data.couponId,
                    code:           data.code,
                    type:           data.type,
                    value:          data.value,
                    discountAmount: data.discountAmount,
                    message:        data.message,
                });
                setCouponInput(data.code);
                setCouponError('');
            }
        } catch {
            setCouponError('Failed to validate coupon. Please try again.');
        } finally {
            setCouponLoading(false);
        }
    }

    function handleRemoveCoupon() {
        setAppliedCoupon(null);
        setCouponInput('');
        setCouponError('');
    }

    // ── Phone change resets verification ─────────────────────────────────────
    function handlePhoneChange(val: string) {
        setPhone(val);
        setPhoneVerified(false);
        setOtpSent(false);
        setOtpValue('');
        setOtpError('');
        setOtpSuccess('');
        setResendCountdown(0);
    }

    // ── Send / Resend OTP ─────────────────────────────────────────────────────
    async function handleSendOtp() {
        setOtpError('');
        if (!isValidPhone(phone)) {
            setOtpError('Enter a valid phone number');
            return;
        }
        setSendingOtp(true);
        try {
            const res  = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: phone.replace(/\D/g, '').slice(-10), email: userEmail }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to send OTP');
            setOtpSent(true);
            setOtpValue('');
            setOtpSuccess(data.message || 'OTP sent');
            setResendCountdown(30); // 30s cooldown before resend
        } catch (err: any) {
            setOtpError(err.message || 'Failed to send OTP. Try again.');
        } finally {
            setSendingOtp(false);
        }
    }

    // ── Verify OTP ────────────────────────────────────────────────────────────
    async function handleVerifyOtp() {
        setOtpError('');
        if (otpValue.length !== 6 || !/^\d{6}$/.test(otpValue)) {
            setOtpError('Enter the 6-digit OTP');
            return;
        }
        setVerifyingOtp(true);
        try {
            const res  = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone: phone.replace(/\D/g, '').slice(-10),
                    otp:   otpValue,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Invalid OTP');
            setPhoneVerified(true);
            setOtpSent(false);
            setOtpValue('');
            setOtpSuccess('');
        } catch (err: any) {
            setOtpError(err.message || 'Invalid OTP. Please try again.');
        } finally {
            setVerifyingOtp(false);
        }
    }

    // ── Pay ───────────────────────────────────────────────────────────────────
    const handleProceed = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!travelDate) { setError('Please select a travel date'); return; }
        if (!isValidPhone(phone)) { setError('Please enter a valid phone number'); return; }
        if (!phoneVerified) { setError('Please verify your mobile number with OTP before proceeding'); return; }

        setLoading(true);
        try {
            let bookingId  = currentBookingId;
            let bookingRef = '';

            if (!bookingId) {
                const bookingRes = await fetch('/api/bookings', {
                    method:  'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        package_id:       packageId,
                        package_title:    packageTitle,
                        package_slug:     packageSlug,
                        travel_date:      travelDate,
                        num_adults:       adults,
                        num_children:     children,
                        total_amount:     totalAmount,
                        special_requests: specialRequests,
                        phone:            phone.replace(/\D/g, '').slice(-10),
                        points_redeemed:  pointsToRedeem,
                        discount_amount:  pointsDiscount,
                        coupon_code:      appliedCoupon?.code    || null,
                        coupon_id:        appliedCoupon?.id      || null,
                        coupon_discount:  appliedCoupon?.discountAmount ?? 0,
                    }),
                });
                const bookingData = await bookingRes.json();
                if (!bookingRes.ok) throw new Error(bookingData.error || 'Booking creation failed');
                bookingId  = bookingData.booking.id;
                bookingRef = bookingData.booking.reference_number;
                setCurrentBookingId(bookingId);
            } else {
                const checkRes  = await fetch(`/api/bookings/${bookingId}`);
                const checkData = await checkRes.json();
                if (!checkRes.ok || checkData.booking?.payment_status === 'paid') {
                    setCurrentBookingId(undefined);
                    throw new Error('Please refresh the page and try again');
                }
                bookingRef = checkData.booking?.reference_number || '';
            }

            const orderRes  = await fetch('/api/payment/create-order', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookingId }),
            });
            const orderData = await orderRes.json();
            if (!orderRes.ok) throw new Error(orderData.error || 'Payment initiation failed');

            setRedirecting(true);
            await loadRazorpaySDK();
            await new Promise<void>((resolve, reject) => {
                const rzp = new window.Razorpay!({
                    key:         orderData.keyId,
                    order_id:    orderData.razorpayOrderId,
                    amount:      orderData.amount,
                    currency:    orderData.currency,
                    name:        'My Perfect Trips',
                    description: `Booking: ${packageTitle}`,
                    prefill:     orderData.prefill,
                    theme:       { color: '#1c1917' },
                    handler: async (response: {
                        razorpay_payment_id: string;
                        razorpay_order_id: string;
                        razorpay_signature: string;
                    }) => {
                        try {
                            const verifyRes = await fetch('/api/payment/verify', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    razorpay_order_id:   response.razorpay_order_id,
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_signature:  response.razorpay_signature,
                                    bookingId,
                                }),
                            });
                            const verifyData = await verifyRes.json();
                            if (!verifyRes.ok) throw new Error(verifyData.error || 'Payment verification failed');
                            window.location.href = `/payment/success?bookingId=${bookingId}&ref=${bookingRef}`;
                            resolve();
                        } catch (err: any) { reject(err); }
                    },
                    modal: { ondismiss: () => reject(new Error('Payment cancelled')) },
                });
                rzp.open();
            });
        } catch (err: any) {
            const msg = err.message || 'Something went wrong';
            if (msg !== 'Payment cancelled') setError(msg);
            setLoading(false);
            setRedirecting(false);
        }
    };

    // ── Redirecting overlay ───────────────────────────────────────────────────
    if (redirecting) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-5">
                <div className="h-16 w-16 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-brand-700" />
                </div>
                <div className="text-center">
                    <p className="font-bold text-stone-900 text-lg">Redirecting to secure payment…</p>
                    <p className="text-stone-400 text-sm mt-1">Please do not close or refresh this page</p>
                </div>
            </div>
        );
    }

    // ── Form ──────────────────────────────────────────────────────────────────
    return (
        <form onSubmit={handleProceed} className="space-y-5">
            {error && (
                <div className="flex items-start gap-3 rounded-xl bg-red-50 border border-red-100 px-4 py-3">
                    <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}

            {/* ── Travel Date ── */}
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm space-y-3">
                <h3 className="font-bold text-stone-900 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-brand-700" /> Travel Date
                </h3>
                <input type="date" required min={today} value={travelDate}
                    onChange={e => setTravelDate(e.target.value)}
                    className="w-full h-11 rounded-xl border border-stone-200 bg-stone-50/50 px-4 text-sm text-stone-900 outline-none focus:border-brand-700 focus:ring-2 focus:ring-brand-700/10 focus:bg-white transition-all"
                />
            </div>

            {/* ── Travellers ── */}
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm space-y-3">
                <h3 className="font-bold text-stone-900 flex items-center gap-2">
                    <Users className="h-4 w-4 text-brand-700" /> Travellers
                </h3>
                <CounterInput label="Adults"   sub="Age 12 and above"    value={adults}   onChange={v => handleTravellerChange(setAdults, v)}   min={1} />
                <CounterInput label="Children" sub="Age 2–11 (50% rate)" value={children} onChange={v => handleTravellerChange(setChildren, v)} min={0} />
            </div>

            {/* ── Mobile Verification ── */}
            <div className={`rounded-2xl border bg-white p-5 shadow-sm space-y-4 transition-colors ${
                phoneVerified ? 'border-emerald-300' : 'border-stone-200'
            }`}>
                <h3 className="font-bold text-stone-900 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-brand-700" />
                    Mobile Number
                    {phoneVerified && (
                        <span className="ml-auto flex items-center gap-1 text-xs font-semibold text-emerald-600">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                        </span>
                    )}
                </h3>

                {/* Phone input row */}
                <div className="flex gap-2">
                    <div className="flex items-center h-11 rounded-xl border border-stone-200 bg-stone-50 px-3 text-sm font-semibold text-stone-500 shrink-0">
                        +44
                    </div>
                    <input
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        value={phone.replace(/\D/g, '').slice(-10)}
                        onChange={e => handlePhoneChange(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="7123 456789"
                        disabled={phoneVerified}
                        className={`flex-1 h-11 rounded-xl border px-4 text-sm outline-none transition-all
                            ${phoneVerified
                                ? 'border-emerald-200 bg-emerald-50 text-emerald-800 font-semibold cursor-not-allowed'
                                : 'border-stone-200 bg-stone-50/50 text-stone-900 focus:border-brand-700 focus:ring-2 focus:ring-brand-700/10 focus:bg-white'
                            }`}
                    />
                    {phoneVerified ? (
                        <button type="button"
                            onClick={() => { setPhoneVerified(false); setPhone(''); }}
                            className="h-11 px-4 rounded-xl border border-stone-200 text-xs font-semibold text-stone-500 hover:bg-stone-50 transition-all shrink-0">
                            Change
                        </button>
                    ) : (
                        <button type="button"
                            onClick={handleSendOtp}
                            disabled={sendingOtp || !isValidPhone(phone)}
                            className="h-11 px-4 rounded-xl bg-brand-900 text-white text-xs font-bold hover:bg-brand-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0 whitespace-nowrap">
                            {sendingOtp ? <Loader2 className="h-4 w-4 animate-spin" /> : otpSent ? 'Resend OTP' : 'Send OTP'}
                        </button>
                    )}
                </div>

                {/* Validation hint */}
                {!phoneVerified && phone.length > 0 && !isValidPhone(phone) && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3 shrink-0" />
                        Please enter a valid phone number
                    </p>
                )}

                {/* OTP input — shown after OTP is sent */}
                {otpSent && !phoneVerified && (
                    <div className="space-y-3 pt-1">
                        {otpSuccess && (
                            <p className="text-xs text-emerald-600 flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3 shrink-0" /> {otpSuccess} — check your email inbox
                            </p>
                        )}
                        <label className="block text-xs font-semibold text-stone-600">
                            Enter 6-digit OTP
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="tel"
                                inputMode="numeric"
                                maxLength={6}
                                value={otpValue}
                                onChange={e => {
                                    setOtpError('');
                                    setOtpValue(e.target.value.replace(/\D/g, '').slice(0, 6));
                                }}
                                placeholder="••••••"
                                className="flex-1 h-11 rounded-xl border border-stone-200 bg-stone-50/50 px-4 text-sm tracking-[0.3em] font-bold outline-none focus:border-brand-700 focus:ring-2 focus:ring-brand-700/10 focus:bg-white transition-all"
                            />
                            <button type="button"
                                onClick={handleVerifyOtp}
                                disabled={verifyingOtp || otpValue.length !== 6}
                                className="h-11 px-5 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2 shrink-0">
                                {verifyingOtp
                                    ? <Loader2 className="h-4 w-4 animate-spin" />
                                    : <><ShieldCheck className="h-4 w-4" /> Verify</>
                                }
                            </button>
                        </div>

                        {/* Resend OTP */}
                        <div className="flex items-center gap-1.5 pt-0.5">
                            <span className="text-xs text-stone-400">Didn&apos;t receive it?</span>
                            {resendCountdown > 0 ? (
                                <span className="text-xs text-stone-400 font-medium">
                                    Resend in {resendCountdown}s
                                </span>
                            ) : (
                                <button type="button" onClick={handleSendOtp} disabled={sendingOtp}
                                    className="text-xs font-semibold text-brand-700 hover:text-brand-900 hover:underline disabled:opacity-50 transition-colors">
                                    {sendingOtp ? 'Sending…' : 'Resend OTP'}
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* OTP error */}
                {otpError && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3 shrink-0" /> {otpError}
                    </p>
                )}
            </div>

            {/* ── Special Requests ── */}
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm space-y-3">
                <h3 className="font-bold text-stone-900 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-brand-700" />
                    Special Requests <span className="text-stone-400 font-normal text-xs">(optional)</span>
                </h3>
                <textarea rows={3} value={specialRequests} onChange={e => setSpecialRequests(e.target.value)}
                    placeholder="Dietary requirements, room preferences, anniversary setup..."
                    className="w-full rounded-xl border border-stone-200 bg-stone-50/50 px-4 py-3 text-sm outline-none focus:border-brand-700 focus:ring-2 focus:ring-brand-700/10 focus:bg-white transition-all resize-none"
                />
            </div>

            {/* ── Coupon Code ── */}
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm space-y-3">
                <h3 className="font-bold text-stone-900 flex items-center gap-2">
                    <Tag className="h-4 w-4 text-brand-700" /> Coupon Code
                </h3>
                {appliedCoupon ? (
                    <div className="flex items-start justify-between gap-3 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3">
                        <div className="flex items-start gap-2.5">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-bold text-emerald-800 font-mono tracking-wider">{appliedCoupon.code}</p>
                                <p className="text-xs text-emerald-600 mt-0.5">{appliedCoupon.message}</p>
                            </div>
                        </div>
                        <button type="button" onClick={handleRemoveCoupon}
                            className="text-xs font-semibold text-stone-400 hover:text-red-500 transition-colors shrink-0 mt-0.5">
                            Remove
                        </button>
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={couponInput}
                            onChange={e => { setCouponInput(e.target.value.toUpperCase()); setCouponError(''); }}
                            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleApplyCoupon(); } }}
                            placeholder="Enter coupon code"
                            className="flex-1 h-11 rounded-xl border border-stone-200 bg-stone-50/50 px-4 text-sm font-mono uppercase tracking-wider outline-none focus:border-brand-700 focus:ring-2 focus:ring-brand-700/10 focus:bg-white transition-all"
                        />
                        <button type="button" onClick={handleApplyCoupon}
                            disabled={couponLoading || !couponInput.trim()}
                            className="h-11 px-5 rounded-xl bg-brand-900 text-white text-sm font-bold hover:bg-brand-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2 shrink-0">
                            {couponLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Apply'}
                        </button>
                    </div>
                )}
                {couponError && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3 shrink-0" /> {couponError}
                    </p>
                )}
            </div>

            {/* ── Loyalty Points ── */}
            {loyaltyBalance > 0 && (
                <div className={`rounded-2xl border p-5 shadow-sm transition-all ${
                    usePoints && loyaltyBalance >= MIN_REDEEM ? 'border-gold-300 bg-gold-50/50' : 'border-stone-200 bg-white'
                }`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-xl bg-gold-100 flex items-center justify-center flex-shrink-0">
                                <Star className="h-4 w-4 text-gold-600 fill-gold-500" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-stone-900">IG Reward Points</p>
                                <p className="text-xs text-stone-500">
                                    {loyaltyBalance.toLocaleString()} pts · worth £{loyaltyBalance.toLocaleString()}
                                </p>
                            </div>
                        </div>
                        {loyaltyBalance >= MIN_REDEEM ? (
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked={usePoints}
                                    onChange={e => setUsePoints(e.target.checked)} />
                                <div className="w-10 h-6 bg-stone-200 rounded-full peer peer-checked:bg-brand-900 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-4" />
                            </label>
                        ) : (
                            <span className="text-xs text-stone-400">Need {MIN_REDEEM - loyaltyBalance} more pts</span>
                        )}
                    </div>
                    {usePoints && pointsDiscount > 0 && (
                        <div className="mt-3 rounded-xl bg-gold-100 border border-gold-200 px-3 py-2.5 flex items-center gap-2">
                            <Gift className="h-4 w-4 text-gold-700 flex-shrink-0" />
                            <p className="text-sm font-semibold text-gold-800">
                                £{Math.round(pointsDiscount).toLocaleString('en-GB')} discount applied
                                <span className="font-normal text-gold-600 ml-1">({Math.round(pointsDiscount)} pts redeemed)</span>
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* ── Price Summary ── */}
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
                <h3 className="font-bold text-stone-900 mb-4">Price Summary</h3>
                <div className="space-y-2.5">
                    <div className="flex justify-between text-sm text-stone-600">
                        <span>{adults} adult{adults !== 1 ? 's' : ''} × £{basePrice.toLocaleString('en-GB')}</span>
                        <span>£{(adults * basePrice).toLocaleString('en-GB')}</span>
                    </div>
                    {children > 0 && (
                        <div className="flex justify-between text-sm text-stone-600">
                            <span>{children} child{children !== 1 ? 'ren' : ''} × £{(basePrice * 0.5).toLocaleString('en-GB')}</span>
                            <span>£{(children * basePrice * 0.5).toLocaleString('en-GB')}</span>
                        </div>
                    )}
                    {couponDiscount > 0 && (
                        <div className="flex justify-between text-sm text-emerald-600 font-medium">
                            <span className="flex items-center gap-1"><Tag className="h-3.5 w-3.5" /> Coupon ({appliedCoupon!.code})</span>
                            <span>− £{Math.round(couponDiscount).toLocaleString('en-GB')}</span>
                        </div>
                    )}
                    {pointsDiscount > 0 && (
                        <div className="flex justify-between text-sm text-emerald-600 font-medium">
                            <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-current" /> Loyalty discount</span>
                            <span>− £{Math.round(pointsDiscount).toLocaleString('en-GB')}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-base font-bold text-stone-900 pt-3 border-t border-stone-100">
                        <span>Total payable</span>
                        <span>£{totalAmount.toLocaleString('en-GB')}</span>
                    </div>
                </div>
                {pointsEarnable > 0 && (
                    <div className="mt-3 flex items-center gap-2 rounded-xl bg-brand-50 border border-brand-100 px-3 py-2">
                        <Star className="h-3.5 w-3.5 text-gold-600 fill-gold-500 flex-shrink-0" />
                        <p className="text-xs text-brand-700 font-medium">
                            You&apos;ll earn <span className="font-bold">{pointsEarnable} loyalty points</span> on this booking
                        </p>
                    </div>
                )}
            </div>

            {/* ── Pay button ── */}
            <button type="submit" disabled={loading || !phoneVerified}
                className="w-full h-14 rounded-xl bg-gradient-to-r from-brand-900 to-brand-800 text-white font-bold text-base flex items-center justify-center gap-2.5 hover:from-brand-800 hover:to-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg">
                {loading ? (
                    <><Loader2 className="h-5 w-5 animate-spin" /> Creating booking…</>
                ) : (
                    <><CreditCard className="h-5 w-5" /> Pay £{totalAmount.toLocaleString('en-GB')} Securely</>
                )}
            </button>

            {!phoneVerified && (
                <p className="text-center text-xs text-amber-600 flex items-center justify-center gap-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    Verify your mobile number above to enable payment
                </p>
            )}

            <p className="text-center text-xs text-stone-400">
                Secure payment via Razorpay · UPI, Cards, Netbanking &amp; Wallets accepted<br />
                By proceeding you agree to our{' '}
                <a href="/terms" className="underline hover:text-stone-600">Terms</a> &amp;{' '}
                <a href="/refund-policy" className="underline hover:text-stone-600">Refund Policy</a>
            </p>
        </form>
    );
}
