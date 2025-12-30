"use client";

import React, { useState } from "react";
import { Share2, Check } from "lucide-react";

interface ShareButtonProps {
    title: string;
    className?: string;
}

export default function ShareButton({ title, className }: ShareButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        const url = window.location.href;

        // 1. Try Native Share (Mobile)
        // Only try if we are absolutely sure.
        if (typeof navigator !== "undefined" && navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: `Check out this trip: ${title}`,
                    url: url,
                });
                return;
            } catch (err) {
                // Ignore AbortError (user cancelled), continue to fallback for others?
                // Actually, if share exists but fails, user might have seen the sheet and cancelled.
                // We shouldn't auto-copy in that case.
                if ((err as Error).name === "AbortError") return;
                // Otherwise fallback
            }
        }

        // 2. Robust Fallback: Old School Copy
        // This works even in non-secure contexts (HTTP) where navigator.clipboard might fail
        try {
            const textArea = document.createElement("textarea");
            textArea.value = url;

            // Avoid scrolling to bottom
            textArea.style.top = "0";
            textArea.style.left = "0";
            textArea.style.position = "fixed";

            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);

            if (successful) {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } else {
                throw new Error("execCommand returned false");
            }
        } catch (err) {
            console.error("Copy failed:", err);
            // 3. Absolute Last Resort
            prompt("Here is the link to share:", url);
        }
    };

    return (
        <button
            onClick={handleShare}
            className={className || "flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-blue-300 text-slate-600 font-bold py-3 rounded-xl transition-all text-sm shadow-sm active:scale-95"}
        >
            {copied ? (
                <>
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-green-600">Copied!</span>
                </>
            ) : (
                <>
                    <Share2 className="w-4 h-4" />
                    Share Trip
                </>
            )}
        </button>
    );
}
