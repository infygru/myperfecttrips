'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Users, MessageSquare, Minus, Plus, Star, Gift, Phone, AlertCircle, Loader2, QrCode, CheckCircle2, ArrowLeft } from 'lucide-react';
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

const UPI_APPS = [
    { name: 'Google Pay', icon: '🟢', scheme: 'tez://upi/pay' },
    { name: 'PhonePe', icon: '🟣', scheme: 'phonepe://pay' },
    { name: 'Paytm', icon: '🔵', scheme: 'paytmmp://pay' },
    { name: 'BHIM', icon: '🇮🇳', scheme: 'upi://pay' },
];

export default function CheckoutForm({
    packageId, packageTitle, packageSlug, basePrice,
    userId, userName, userEmail, userPhone, loyaltyBalance,
}: Props) {
    const router = useRouter();

    // Form state
    const [adults, setAdults]             = useState(1);
    const [children, setChildren]         = useState(0);
    const [travelDate, setTravelDate]     = useState('');
    const [specialRequests, setSpecialRequests] = useState('');
    const [phone, setPhone]               = useState(userPhone);
    const [usePoints, setUsePoints]       = useState(false);

    // UI state
    const [step, setStep]       = useState<'form' | 'payment'>('form');
    const [error, setError]     = useState('');
    const [loading, setLoading] = useState(false);

    // Payment state (set after booking creation)
    const [bookingId, setBookingId]         = useState('');
    const [referenceNumber, setReferenceNumber] = useState('');
    const [utrNumber, setUtrNumber]         = useState('');

    const today    = new Date().toISOString().split('T')[0];
    const subtotal = basePrice * (adults + children * 0.5);
    const pointsDiscount = usePoints && loyaltyBalance >= MIN_REDEEM
        ? Math.min(loyaltyBalance, subtotal)
        : 0;
    const totalAmount    = Math.max(1, Math.round(subtotal - pointsDiscount));
    const pointsToRedeem = usePoints ? Math.round(pointsDiscount) : 0;
    const pointsEarnable = Math.floor(totalAmount / 100);

    // Step 1: Create booking and proceed to payment screen
    const handleProceed = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!travelDate) { setError('Please select a travel date'); return; }
        setLoading(true);

        try {
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
                    phone,
                    points_redeemed:  pointsToRedeem,
                    discount_amount:  pointsDiscount,
                }),
            });
            const bookingData = await bookingRes.json();
            if (!bookingRes.ok) throw new Error(bookingData.error || 'Booking creation failed');

            setBookingId(bookingData.booking.id);
            setReferenceNumber(bookingData.booking.reference_number);
            setStep('payment');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Submit UTR and confirm payment
    const handleConfirm = async () => {
        if (!utrNumber.trim()) { setError('Please enter the UTR / Transaction ID from your UPI app'); return; }
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/payment/confirm', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ bookingId, utrNumber }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to confirm payment');

            router.push(`/payment/success?bookingId=${bookingId}&ref=${referenceNumber}&pending=1`);
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    const upiBase = `pa=infyguru@sbi&pn=IG%20Holidays&am=${totalAmount}&cu=INR&tn=Booking%20${referenceNumber}`;

    // ── STEP 2: UPI Payment Screen ──────────────────────────────────────────
    if (step === 'payment') {
        return (
            <div className="space-y-5">
                {/* Header */}
                <div className="rounded-2xl border border-brand-200 bg-brand-50/50 p-5 shadow-sm text-center">
                    <p className="text-stone-500 text-sm mb-1">Pay</p>
                    <p className="text-3xl font-bold text-brand-900">₹{totalAmount.toLocaleString('en-IN')}</p>
                    <p className="text-stone-500 text-sm mt-1">to <span className="font-semibold text-stone-800">infyguru@sbi</span> (IG Holidays)</p>
                    <p className="text-xs text-stone-400 mt-1 font-mono">Ref: {referenceNumber}</p>
                </div>

                {/* QR Code */}
                <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm flex flex-col items-center gap-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-stone-700">
                        <QrCode className="h-4 w-4 text-brand-700" />
                        Scan with any UPI app
                    </div>
                    <img
                        src={`/api/payment/qr?amount=${totalAmount}&ref=${referenceNumber}`}
                        alt="UPI QR Code"
                        width={220}
                        height={220}
                        className="rounded-xl border border-stone-100"
                    />
                    <p className="text-xs text-stone-400">Works with GPay, PhonePe, BHIM, Paytm &amp; all UPI apps</p>
                </div>

                {/* OR divider */}
                <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-stone-200" />
                    <span className="text-xs text-stone-400 font-semibold tracking-wide">OR OPEN YOUR UPI APP</span>
                    <div className="flex-1 h-px bg-stone-200" />
                </div>

                {/* UPI App Buttons */}
                <div className="grid grid-cols-2 gap-3">
                    {UPI_APPS.map(app => (
                        <a
                            key={app.name}
                            href={`${app.scheme}?${upiBase}`}
                            className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3 hover:border-brand-300 hover:bg-brand-50/40 transition-all"
                        >
                            <span className="text-2xl leading-none">{app.icon}</span>
                            <span className="text-sm font-semibold text-stone-800">{app.name}</span>
                        </a>
                    ))}
                </div>

                {/* UTR Entry */}
                <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm space-y-3">
                    <h3 className="font-bold text-stone-900">Confirm Your Payment</h3>
                    <p className="text-sm text-stone-500">
                        After paying, enter the <span className="font-semibold text-stone-700">UTR / Transaction ID</span> shown in your UPI app to confirm your booking.
                    </p>
                    <input
                        type="text"
                        value={utrNumber}
                        onChange={e => setUtrNumber(e.target.value)}
                        placeholder="e.g. 406123456789"
                        className="w-full h-11 rounded-xl border border-stone-200 bg-stone-50/50 px-4 text-sm font-mono outline-none focus:border-brand-700 focus:ring-2 focus:ring-brand-700/10 focus:bg-white transition-all"
                    />
                </div>

                {error && (
                    <div className="flex items-start gap-3 rounded-xl bg-red-50 border border-red-100 px-4 py-3">
                        <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                <button
                    onClick={handleConfirm}
                    disabled={loading || !utrNumber.trim()}
                    className="w-full h-14 rounded-xl bg-gradient-to-r from-brand-900 to-brand-800 text-white font-bold text-base flex items-center justify-center gap-2.5 hover:from-brand-800 hover:to-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                >
                    {loading ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Confirming...
                        </>
                    ) : (
                        <>
                            <CheckCircle2 className="h-5 w-5" />
                            I&apos;ve Paid — Confirm Booking
                        </>
                    )}
                </button>

                <button
                    type="button"
                    onClick={() => { setStep('form'); setError(''); }}
                    className="w-full flex items-center justify-center gap-1.5 text-sm text-stone-500 hover:text-stone-700 transition-colors py-1"
                >
                    <ArrowLeft className="h-3.5 w-3.5" /> Back to booking details
                </button>

                <p className="text-center text-xs text-stone-400">
                    By confirming you agree to our{' '}
                    <a href="/terms" className="underline hover:text-stone-600">Terms</a> &{' '}
                    <a href="/refund-policy" className="underline hover:text-stone-600">Refund Policy</a>
                </p>
            </div>
        );
    }

    // ── STEP 1: Booking Form ─────────────────────────────────────────────────
    return (
        <form onSubmit={handleProceed} className="space-y-5">
            {error && (
                <div className="flex items-start gap-3 rounded-xl bg-red-50 border border-red-100 px-4 py-3">
                    <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}

            {/* Travel Date */}
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm space-y-3">
                <h3 className="font-bold text-stone-900 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-brand-700" /> Travel Date
                </h3>
                <input type="date" required min={today} value={travelDate} onChange={e => setTravelDate(e.target.value)}
                    className="w-full h-11 rounded-xl border border-stone-200 bg-stone-50/50 px-4 text-sm text-stone-900 outline-none focus:border-brand-700 focus:ring-2 focus:ring-brand-700/10 focus:bg-white transition-all"
                />
            </div>

            {/* Travellers */}
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm space-y-3">
                <h3 className="font-bold text-stone-900 flex items-center gap-2">
                    <Users className="h-4 w-4 text-brand-700" /> Travellers
                </h3>
                <CounterInput label="Adults"   sub="Age 12 and above"    value={adults}   onChange={setAdults}   min={1} />
                <CounterInput label="Children" sub="Age 2–11 (50% rate)" value={children} onChange={setChildren} min={0} />
            </div>

            {/* Contact */}
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm space-y-3">
                <h3 className="font-bold text-stone-900 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-brand-700" /> Contact Details
                </h3>
                <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1.5">Mobile number</label>
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full h-11 rounded-xl border border-stone-200 bg-stone-50/50 px-4 text-sm outline-none focus:border-brand-700 focus:ring-2 focus:ring-brand-700/10 focus:bg-white transition-all"
                    />
                </div>
            </div>

            {/* Special Requests */}
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

            {/* Loyalty Points */}
            {loyaltyBalance > 0 && (
                <div className={`rounded-2xl border p-5 shadow-sm transition-all ${usePoints && loyaltyBalance >= MIN_REDEEM ? 'border-gold-300 bg-gold-50/50' : 'border-stone-200 bg-white'}`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-xl bg-gold-100 flex items-center justify-center flex-shrink-0">
                                <Star className="h-4 w-4 text-gold-600 fill-gold-500" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-stone-900">IG Reward Points</p>
                                <p className="text-xs text-stone-500">
                                    {loyaltyBalance.toLocaleString()} pts · worth ₹{loyaltyBalance.toLocaleString()}
                                </p>
                            </div>
                        </div>
                        {loyaltyBalance >= MIN_REDEEM ? (
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked={usePoints} onChange={e => setUsePoints(e.target.checked)} />
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
                                ₹{Math.round(pointsDiscount).toLocaleString('en-IN')} discount applied
                                <span className="font-normal text-gold-600 ml-1">({Math.round(pointsDiscount)} pts redeemed)</span>
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Price Summary */}
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
                <h3 className="font-bold text-stone-900 mb-4">Price Summary</h3>
                <div className="space-y-2.5">
                    <div className="flex justify-between text-sm text-stone-600">
                        <span>{adults} adult{adults !== 1 ? 's' : ''} × ₹{basePrice.toLocaleString('en-IN')}</span>
                        <span>₹{(adults * basePrice).toLocaleString('en-IN')}</span>
                    </div>
                    {children > 0 && (
                        <div className="flex justify-between text-sm text-stone-600">
                            <span>{children} child{children !== 1 ? 'ren' : ''} × ₹{(basePrice * 0.5).toLocaleString('en-IN')}</span>
                            <span>₹{(children * basePrice * 0.5).toLocaleString('en-IN')}</span>
                        </div>
                    )}
                    {pointsDiscount > 0 && (
                        <div className="flex justify-between text-sm text-emerald-600 font-medium">
                            <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-current" /> Loyalty discount</span>
                            <span>− ₹{Math.round(pointsDiscount).toLocaleString('en-IN')}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-base font-bold text-stone-900 pt-3 border-t border-stone-100">
                        <span>Total payable</span>
                        <span>₹{totalAmount.toLocaleString('en-IN')}</span>
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

            {/* Proceed button */}
            <button type="submit" disabled={loading}
                className="w-full h-14 rounded-xl bg-gradient-to-r from-brand-900 to-brand-800 text-white font-bold text-base flex items-center justify-center gap-2.5 hover:from-brand-800 hover:to-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg">
                {loading ? (
                    <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Creating booking...
                    </>
                ) : (
                    <>
                        <QrCode className="h-5 w-5" />
                        Proceed to Pay ₹{totalAmount.toLocaleString('en-IN')}
                    </>
                )}
            </button>

            <p className="text-center text-xs text-stone-400">
                Secure UPI payment · By proceeding you agree to our{' '}
                <a href="/terms" className="underline hover:text-stone-600">Terms</a> &{' '}
                <a href="/refund-policy" className="underline hover:text-stone-600">Refund Policy</a>
            </p>
        </form>
    );
}
