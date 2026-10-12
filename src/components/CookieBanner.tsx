"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";

const CONSENT_KEY = "igholidays_cookie_consent";

export default function CookieBanner() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        try {
            const stored = localStorage.getItem(CONSENT_KEY);
            if (!stored) setVisible(true);
        } catch { }
    }, []);

    const accept = () => {
        try {
            localStorage.setItem(CONSENT_KEY, "accepted");
        } catch { }
        setVisible(false);
    };

    const decline = () => {
        try {
            localStorage.setItem(CONSENT_KEY, "declined");
        } catch { }
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 sm:p-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="mx-auto max-w-4xl bg-brand-950 border border-brand-800 rounded-2xl shadow-2xl px-6 py-5 flex flex-col sm:flex-row items-center gap-5 text-white">
                {/* Icon */}
                <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-gold-500/10">
                    <Cookie className="h-6 w-6 text-gold-400" />
                </div>

                {/* Text */}
                <div className="flex-1 text-sm text-stone-300 leading-relaxed text-center sm:text-left">
                    <strong className="text-white">We use cookies</strong> to improve your experience, analyze site traffic, and display relevant offers.
                    By continuing, you agree to our{" "}
                    <Link href="/cookie-policy" className="text-gold-400 hover:text-gold-300 underline underline-offset-2 transition-colors" onClick={accept}>
                        Cookie Policy
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy-policy" className="text-gold-400 hover:text-gold-300 underline underline-offset-2 transition-colors" onClick={accept}>
                        Privacy Policy
                    </Link>.
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 flex-shrink-0">
                    <button
                        onClick={decline}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-stone-400 hover:text-white transition-colors border border-brand-800 hover:border-brand-600"
                    >
                        Decline
                    </button>
                    <button
                        onClick={accept}
                        className="px-5 py-2 rounded-lg text-sm font-bold bg-gold-500 hover:bg-gold-400 text-brand-950 transition-colors shadow-md"
                    >
                        Accept All
                    </button>
                    <button onClick={decline} className="p-1.5 text-stone-500 hover:text-stone-300 transition-colors" aria-label="Close cookie banner">
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
