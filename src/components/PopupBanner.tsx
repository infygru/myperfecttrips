'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

interface Props {
    imageUrl: string;
    linkUrl: string;
}

export default function PopupBanner({ imageUrl, linkUrl }: Props) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        // Short delay so the page paints first, then popup appears
        const t = setTimeout(() => setOpen(true), 600);
        return () => clearTimeout(t);
    }, []);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-5"
            onClick={() => setOpen(false)}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" />

            {/* Card */}
            <div
                className="relative z-10 w-full max-w-[360px]"
                style={{ animation: 'popup-in 0.35s cubic-bezier(0.16,1,0.3,1) both' }}
                onClick={e => e.stopPropagation()}
            >
                <style>{`
                    @keyframes popup-in {
                        from { opacity: 0; transform: scale(0.85) translateY(20px); }
                        to   { opacity: 1; transform: scale(1)    translateY(0);    }
                    }
                `}</style>

                {/* Close button */}
                <button
                    onClick={() => setOpen(false)}
                    aria-label="Close popup"
                    className="absolute -top-3 -right-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-800 shadow-lg hover:bg-slate-100 transition-colors"
                >
                    <X className="h-4 w-4" strokeWidth={2.5} />
                </button>

                {/* Clickable square image */}
                <a href={linkUrl} aria-label="View offer">
                    <div className="relative aspect-square w-full overflow-hidden rounded-2xl shadow-2xl ring-2 ring-white/20">
                        <Image
                            src={imageUrl}
                            alt="Special offer"
                            fill
                            className="object-cover"
                            sizes="360px"
                            priority
                        />
                    </div>
                </a>

                <p className="mt-3 text-center text-[11px] text-white/50">
                    Click the image to learn more · Tap outside to close
                </p>
            </div>
        </div>
    );
}
