'use client';

import { useState, useRef } from 'react';
import { Upload, CheckCircle, Instagram, MapPin, User, Mail, Phone } from 'lucide-react';

const DESTINATIONS = ['Dubai', 'Turkey', 'Paris', 'Georgia'];

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
            <div className="flex flex-col items-center gap-4 py-12 text-center">
                <CheckCircle className="w-16 h-16 text-green-400" />
                <h3 className="text-2xl font-bold text-white">You're entered!</h3>
                <p className="text-stone-300 max-w-sm">
                    We've received your entry. The lucky winner will be announced on
                    <span className="text-gold-400 font-semibold"> 31st December 2026</span>.
                    Good luck!
                </p>
                <p className="text-stone-400 text-sm">Share with more friends to spread the word!</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
                <label className="block text-sm font-medium text-stone-300 mb-1">
                    Full Name <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                        type="text"
                        name="name"
                        required
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-stone-500 focus:outline-none focus:border-gold-400 transition"
                    />
                </div>
            </div>

            {/* Email */}
            <div>
                <label className="block text-sm font-medium text-stone-300 mb-1">
                    Email Address <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                        type="email"
                        name="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-stone-500 focus:outline-none focus:border-gold-400 transition"
                    />
                </div>
            </div>

            {/* Phone */}
            <div>
                <label className="block text-sm font-medium text-stone-300 mb-1">
                    Phone Number <span className="text-stone-500 text-xs">(optional)</span>
                </label>
                <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+44 7123 456789"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-stone-500 focus:outline-none focus:border-gold-400 transition"
                    />
                </div>
            </div>

            {/* Instagram handle */}
            <div>
                <label className="block text-sm font-medium text-stone-300 mb-1">
                    Instagram Handle <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                    <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                        type="text"
                        name="instagram_handle"
                        required
                        value={form.instagram_handle}
                        onChange={handleChange}
                        placeholder="@yourusername"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-stone-500 focus:outline-none focus:border-gold-400 transition"
                    />
                </div>
                <p className="mt-1 text-xs text-stone-500">Must follow @myperfecttrips on Instagram to qualify.</p>
            </div>

            {/* Preferred destination */}
            <div>
                <label className="block text-sm font-medium text-stone-300 mb-1">
                    Preferred Destination <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <select
                        name="preferred_destination"
                        required
                        value={form.preferred_destination}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-gold-400 transition appearance-none"
                    >
                        <option value="" disabled className="bg-brand-950">Select a destination...</option>
                        {DESTINATIONS.map(d => (
                            <option key={d} value={d} className="bg-brand-950">{d}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Screenshot upload */}
            <div>
                <label className="block text-sm font-medium text-stone-300 mb-1">
                    Proof Screenshot <span className="text-stone-500 text-xs">(optional but recommended)</span>
                </label>
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-pointer border-2 border-dashed border-white/20 hover:border-gold-400/50 rounded-xl p-5 flex flex-col items-center gap-2 transition"
                >
                    {screenshotPreview ? (
                        <img src={screenshotPreview} alt="Preview" className="max-h-40 rounded-lg object-contain" />
                    ) : (
                        <>
                            <Upload className="w-8 h-8 text-stone-400" />
                            <p className="text-stone-400 text-sm text-center">
                                Upload a screenshot showing you've followed us &amp; shared the reel with 5 friends
                            </p>
                            <p className="text-stone-600 text-xs">JPG, PNG · max 10 MB</p>
                        </>
                    )}
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFile}
                />
                {screenshotPreview && (
                    <button
                        type="button"
                        onClick={() => { setScreenshot(null); setScreenshotPreview(null); }}
                        className="mt-1 text-xs text-stone-500 hover:text-red-400 transition"
                    >
                        Remove screenshot
                    </button>
                )}
            </div>

            {error && (
                <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">
                    {error}
                </p>
            )}

            <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gold-400 hover:bg-gold-500 text-brand-950 font-bold text-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {loading ? 'Submitting...' : 'Enter the Lucky Draw'}
            </button>

            <p className="text-center text-xs text-stone-500">
                By entering you agree to our{' '}
                <a href="/terms" className="underline hover:text-stone-300">terms &amp; conditions</a>.
                One entry per person. Winner announced 31 December 2026.
            </p>
        </form>
    );
}
