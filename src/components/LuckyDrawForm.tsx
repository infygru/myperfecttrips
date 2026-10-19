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
const inputClass = "w-full pl-10 pr-4 py-3.5 rounded-xl bg-white/15 border border-white/25 text-white placeholder-white/40 focus:outline-none focus:border-white/70 focus:bg-white/20 transition-all text-base sm:text-sm backdrop-blur-sm";
const labelClass = "block text-xs font-bold uppercase tracking-widest text-white/70 mb-2";

export default function LuckyDrawForm() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        instagram_handle: '',
        preferred_destination: '',
    });
    const [screenshot, setScreenshot] = useState<File | null>(null);
    const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
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
        const data = new FormData();
        data.append('name', form.name);
        data.append('email', form.email);
        data.append('phone', form.phone);
        data.append('instagram_handle', form.instagram_handle.startsWith('@')
            ? form.instagram_handle : `@${form.instagram_handle}`);
        data.append('preferred_destination', form.preferred_destination);
        if (screenshot) data.append('screenshot', screenshot);

        setLoading(true);
        try {
            const res = await fetch('/api/lucky-draw/submit', { method: 'POST', body: data });
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
                        Your entry is confirmed. The lucky winner will be announced on{' '}
                        <span className="text-gold-400 font-semibold">31 December 2026</span>. Good luck!
                    </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-stone-400 text-xs">
                    <Gift className="w-3.5 h-3.5 text-gold-400" />
                    Share with more friends to spread the luck!
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
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                    <input type="text" name="name" required value={form.name} onChange={handleChange}
                        placeholder="Your full name" className={inputClass} />
                </div>
            </div>

            {/* Email */}
            <div>
                <label className={labelClass}>Email Address <span className="text-red-400 normal-case tracking-normal">*</span></label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                    <input type="email" name="email" required value={form.email} onChange={handleChange}
                        placeholder="you@example.com" className={inputClass} />
                </div>
            </div>

            {/* Phone */}
            <div>
                <label className={labelClass}>Phone <span className="text-white/40 normal-case tracking-normal font-normal">(optional)</span></label>
                <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                    <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                        placeholder="+44 7123 456789" className={inputClass} />
                </div>
            </div>

            {/* Instagram */}
            <div>
                <label className={labelClass}>Instagram Handle <span className="text-red-400 normal-case tracking-normal">*</span></label>
                <div className="relative">
                    <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                    <input type="text" name="instagram_handle" required value={form.instagram_handle} onChange={handleChange}
                        placeholder="@yourusername" className={inputClass} />
                </div>
                <p className="mt-1.5 text-[11px] text-white/50">You must be following @myperfecttrips to qualify.</p>
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
                    className="cursor-pointer border-2 border-dashed border-white/25 hover:border-white/60 rounded-2xl p-5 flex flex-col items-center gap-3 transition-all hover:bg-white/10">
                    {screenshotPreview ? (
                        <img src={screenshotPreview} alt="Preview" className="max-h-36 rounded-xl object-contain" />
                    ) : (
                        <>
                            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                <Upload className="w-6 h-6 text-stone-400" />
                            </div>
                            <div className="text-center">
                                <p className="text-stone-300 text-sm font-medium">Upload your screenshot</p>
                                <p className="text-stone-600 text-xs mt-0.5">Show you&apos;ve followed us &amp; shared the reel · JPG / PNG · max 10 MB</p>
                            </div>
                        </>
                    )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
                {screenshotPreview && (
                    <button type="button"
                        onClick={() => { setScreenshot(null); setScreenshotPreview(null); }}
                        className="mt-2 text-xs text-white/50 hover:text-red-300 transition-colors">
                        Remove screenshot
                    </button>
                )}
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
                className="w-full py-4 rounded-xl bg-white hover:bg-yellow-50 text-rose-600 font-black text-base shadow-[0_6px_30px_rgba(255,255,255,0.25)] hover:shadow-[0_8px_40px_rgba(255,255,255,0.35)] transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0">
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
                        Enter the Lucky Draw
                    </span>
                )}
            </button>

            <p className="text-center text-[11px] text-white/40 leading-relaxed">
                By entering you agree to our{' '}
                <a href="/terms" className="underline underline-offset-2 hover:text-white/70 transition-colors">terms &amp; conditions</a>.
                One entry per person. Open to UK residents 18+. Winner announced 31 December 2026.
            </p>
        </form>
    );
}
