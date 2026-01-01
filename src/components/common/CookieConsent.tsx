"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { X, Cookie } from "lucide-react";

export default function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already consented
        const consent = localStorage.getItem("cookie_consent");
        if (!consent) {
            // Small delay to prevent immediate layout shift/pop-in
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("cookie_consent", "true");
        setIsVisible(false);
    };

    const handleDecline = () => {
        // Even if declined, we usually store that choice so we don't nag them again immediately
        localStorage.setItem("cookie_consent", "false");
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:bottom-8 z-50 max-w-sm animate-in fade-in slide-in-from-bottom-10 duration-500">
            <div className="bg-white border border-slate-200 shadow-xl rounded-2xl p-6 relative">
                <button
                    onClick={handleDecline}
                    className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label="Close"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                        <Cookie className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 mb-1">Cookie Policy</h3>
                        <p className="text-sm text-slate-500 leading-relaxed mb-4">
                            We use cookies to enhance your browsing experience and analyze our traffic.
                            Review our <Link href="/cookie-policy" className="text-blue-600 font-medium hover:underline underline-offset-2">Cookie Policy</Link>.
                        </p>

                        <div className="flex gap-2">
                            <button
                                onClick={handleAccept}
                                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-5 rounded-lg transition-all shadow-sm active:scale-95"
                            >
                                Accept All
                            </button>
                            <button
                                onClick={handleDecline}
                                className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold py-2.5 px-5 rounded-lg transition-all active:scale-95"
                            >
                                Decline
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
