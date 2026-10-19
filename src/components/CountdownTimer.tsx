'use client';
import { useState, useEffect } from 'react';

function pad(n: number) {
    return String(n).padStart(2, '0');
}

export default function CountdownTimer({ target }: { target: string }) {
    const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0, ready: false });

    useEffect(() => {
        const end = new Date(target).getTime();
        const tick = () => {
            const diff = Math.max(0, end - Date.now());
            setT({
                d: Math.floor(diff / 86400000),
                h: Math.floor((diff % 86400000) / 3600000),
                m: Math.floor((diff % 3600000) / 60000),
                s: Math.floor((diff % 60000) / 1000),
                ready: true,
            });
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [target]);

    const units = [
        { v: t.d, l: 'Days' },
        { v: t.h, l: 'Hours' },
        { v: t.m, l: 'Mins' },
        { v: t.s, l: 'Secs' },
    ];

    if (!t.ready) return (
        <div className="grid grid-cols-4 gap-3 sm:gap-5 max-w-sm mx-auto">
            {['Days', 'Hours', 'Mins', 'Secs'].map(l => (
                <div key={l} className="flex flex-col items-center gap-2">
                    <div className="w-full aspect-square rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gold-400">{l}</span>
                </div>
            ))}
        </div>
    );

    return (
        <div className="grid grid-cols-4 gap-3 sm:gap-5 max-w-sm mx-auto">
            {units.map(({ v, l }) => (
                <div key={l} className="flex flex-col items-center gap-2">
                    <div className="w-full aspect-square rounded-2xl bg-white/8 border border-white/15 backdrop-blur-sm flex items-center justify-center shadow-inner shadow-black/20">
                        <span className="text-3xl sm:text-5xl font-black tabular-nums bg-gradient-to-b from-white to-stone-300 bg-clip-text text-transparent leading-none">
                            {pad(v)}
                        </span>
                    </div>
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.18em] text-gold-400">{l}</span>
                </div>
            ))}
        </div>
    );
}
