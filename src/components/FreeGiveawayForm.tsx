'use client';

import { useState, useRef } from 'react';
import { Upload, CheckCircle, Instagram, MapPin, User, Mail, Phone, Gift } from 'lucide-react';

const DESTINATIONS = [
    { value: 'Dubai', flag: '🇦🇪' },
    { value: 'Turkey', flag: '🇹🇷' },
    { value: 'Paris', flag: '🇫🇷' },
    { value: 'Georgia', flag: '🇬🇪' },
];

// text-base (16px) prevents iOS Safari from auto-zooming on input focus
const inputClass = "w-full pl-10 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all text-base sm:text-sm";
const labelClass = "block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2";

export default function FreeGiveawayForm() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        instagram_handle: '',
        preferred_destination: '',
    });
    const [screenshot, setScreenshot] = useState<File | null>(null);
    const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
    const [gdprConsent, setGdprConsent] = useState(false);
    const [marketingConsent, setMarketingConsent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] ?? null;
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            setError('Please upload an image file (JPG, PNG, etc.)');
            return;
        }
        setScreenshot(file);
        setScreenshotPreview(URL.createObjectURL(file));
        setError('');
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        if (!form.preferred_destination) {
            setError('Please select your preferred destination.');
            return;
        }
        if (!gdprConsent) {
            setError('You must agree to the data processing consent to enter.');
            return;
        }
        const data = new FormData();
        data.append('name', form.name);
        data.append('email', form.email);
        data.append('phone', form.phone);
        data.append('instagram_handle', form.instagram_handle.startsWith('@')
            ? form.instagram_handle : `@${form.instagram_handle}`);
        data.append('preferred_destination', form.preferred_destination);
        data.append('gdpr_consent', 'true');
        data.append('marketing_consent', marketingConsent ? 'true' : 'false');
        if (screenshot) data.append('screenshot', screenshot);

        setLoading(true);
        try {
            const res = await fetch('/api/free-giveaway/submit', { method: 'POST', body: data });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || 'Submission failed');
            setSuccess(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    if (success) {
        return (
            <div className="flex flex-col items-center gap-5 py-10 text-center">
                <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-xl shadow-green-500/25">
                        <CheckCircle className="w-10 h-10 text-white" strokeWidth={2} />
                    </div>
                    <div className="absolute -inset-2 rounded-full bg-green-400/15 animate-pulse-glow" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-white font-serif mb-2">You&apos;re Entered!</h3>
                    <p className="text-stone-400 text-sm max-w-xs mx-auto leading-relaxed">
                        Your entry is confirmed. The winner will be announced in{' '}
                        <span className="text-gold-400 font-semibold">January 2027</span>. Good luck!
                    </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-stone-400 text-xs">
                    <Gift className="w-3.5 h-3.5 text-gold-400" />
                    Share with more friends to spread the word!
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name */}
            <div>
                <label className={labelClass}>Full Name <span className="text-red-400 normal-case tracking-normal">*</span></label>
                <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" name="name" required value={form.name} onChange={handleChange}
                        placeholder="Your full name" className={inputClass} />
                </div>
            </div>

            {/* Email */}
            <div>
                <label className={labelClass}>Email Address <span className="text-red-400 normal-case tracking-normal">*</span></label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="email" name="email" required value={form.email} onChange={handleChange}
                        placeholder="you@example.com" className={inputClass} />
                </div>
            </div>

            {/* Phone */}
            <div>
                <label className={labelClass}>Phone <span className="text-slate-400 normal-case tracking-normal font-normal">(optional)</span></label>
                <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                        placeholder="+44 7123 456789" className={inputClass} />
                </div>
            </div>

            {/* Instagram */}
            <div>
                <label className={labelClass}>Instagram Handle <span className="text-red-400 normal-case tracking-normal">*</span></label>
                <div className="relative">
                    <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" name="instagram_handle" required value={form.instagram_handle} onChange={handleChange}
                        placeholder="@yourusername" className={inputClass} />
                </div>
                <p className="mt-1.5 text-[11px] text-slate-400">You must be following @myperfecttrips to qualify.</p>
            </div>

            {/* Destination */}
            <div>
                <label className={labelClass}>Preferred Destination <span className="text-red-400 normal-case tracking-normal">*</span></label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500 pointer-events-none z-10" />
                    <select name="preferred_destination" required value={form.preferred_destination} onChange={handleChange}
                        className={`${inputClass} appearance-none cursor-pointer`}>
                        <option value="" disabled className="bg-brand-950 text-stone-500">Where would you like to go?</option>
                        {DESTINATIONS.map(d => (
                            <option key={d.value} value={d.value} className="bg-brand-950 text-white">
                                {d.flag} {d.value}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Screenshot upload */}
            <div>
                <label className={labelClass}>Proof Screenshot <span className="text-stone-600 normal-case tracking-normal font-normal">(recommended)</span></label>
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-pointer border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-2xl p-5 flex flex-col items-center gap-3 transition-all hover:bg-blue-50/50">
                    {screenshotPreview ? (
                        <img src={screenshotPreview} alt="Preview" className="max-h-36 rounded-xl object-contain" />
                    ) : (
                        <>
                            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                <Upload className="w-6 h-6 text-stone-400" />
                            </div>
                            <div className="text-center">
                                <p className="text-slate-600 text-sm font-medium">Upload your screenshot</p>
                                <p className="text-slate-400 text-xs mt-0.5">Show you&apos;ve followed us &amp; shared the reel · JPG / PNG · max 10 MB</p>
                            </div>
                        </>
                    )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
                {screenshotPreview && (
                    <button type="button"
                        onClick={() => { setScreenshot(null); setScreenshotPreview(null); }}
                        className="mt-2 text-xs text-slate-400 hover:text-red-500 transition-colors">
                        Remove screenshot
                    </button>
                )}
            </div>

            {/* GDPR Consent — required */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                        type="checkbox"
                        checked={gdprConsent}
                        onChange={e => setGdprConsent(e.target.checked)}
                        className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 accent-blue-600 cursor-pointer"
                    />
                    <span className="text-xs text-slate-600 leading-relaxed">
                        <span className="font-bold text-slate-800">I agree</span> that My Perfect Trips may store and use the personal data I have provided above solely to administer this giveaway and contact me if I win, in accordance with the{' '}
                        <a href="/privacy-policy" className="text-blue-600 underline underline-offset-2 hover:text-blue-500 transition-colors">Privacy Policy</a>.{' '}
                        <span className="text-red-500 font-semibold">*</span>
                    </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                        type="checkbox"
                        checked={marketingConsent}
                        onChange={e => setMarketingConsent(e.target.checked)}
                        className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 accent-blue-600 cursor-pointer"
                    />
                    <span className="text-xs text-slate-500 leading-relaxed">
                        I&apos;d also like to receive travel inspiration, exclusive offers, and news from My Perfect Trips by email. You can unsubscribe at any time.
                    </span>
                </label>
            </div>

            {/* Error */}
            {error && (
                <div className="flex items-start gap-2 text-red-400 text-sm bg-red-400/8 border border-red-400/20 rounded-xl px-4 py-3">
                    <span className="shrink-0 mt-0.5">⚠</span>
                    <span>{error}</span>
                </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-black text-base shadow-[0_4px_20px_rgba(14,165,233,0.4)] hover:shadow-[0_6px_28px_rgba(14,165,233,0.55)] transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0">
                {loading ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Submitting your entry...
                    </span>
                ) : (
                    <span className="flex items-center justify-center gap-2">
                        <Gift className="w-5 h-5" />
                        Enter the Free Giveaway
                    </span>
                )}
            </button>

            <p className="text-center text-[11px] text-slate-400 leading-relaxed">
                By entering you agree to our{' '}
                <a href="/terms" className="underline underline-offset-2 hover:text-slate-600 transition-colors">terms &amp; conditions</a>.
                One entry per person. Open to UK residents 18+. Winner announced January 2027.
            </p>
        </form>
    );
}
