'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, PenLine, Mail } from 'lucide-react';
import LeadForm from '@/components/LeadForm';

export default function CustomJourneyDropdown({ packageTitle }: { packageTitle: string }) {
    const [open, setOpen] = useState(true);

    // Keep open if navigated with #enquire or #customise hash
    useEffect(() => {
        if (window.location.hash === '#enquire' || window.location.hash === '#customise') {
            setOpen(true);
        }
        const onHash = () => {
            if (window.location.hash === '#enquire' || window.location.hash === '#customise') {
                setOpen(true);
            }
        };
        window.addEventListener('hashchange', onHash);
        return () => window.removeEventListener('hashchange', onHash);
    }, []);

    return (
        <div id="enquire" className="rounded-2xl border border-stone-200 bg-white shadow-sm overflow-hidden scroll-mt-32">
            <button
                onClick={() => setOpen(o => !o)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-stone-50 transition-colors group"
                aria-expanded={open}
            >
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
                        <PenLine className="h-4 w-4 text-brand-700" />
                    </div>
                    <div className="text-left">
                        <p className="text-sm font-bold text-stone-900">Customise This Journey</p>
                        <p className="text-xs text-stone-400">Get a free personalised quote</p>
                    </div>
                </div>
                <ChevronDown
                    className={`h-4 w-4 text-stone-400 transition-transform duration-200 group-hover:text-stone-600 ${open ? 'rotate-180' : ''}`}
                />
            </button>

            {open && (
                <div className="border-t border-stone-100 p-5 space-y-4">
                    <LeadForm prefilledPackage={packageTitle} />

                    {/* Contact email */}
                    <div className="flex items-center gap-2.5 rounded-xl bg-stone-50 border border-stone-100 px-4 py-3">
                        <Mail className="h-4 w-4 text-brand-600 shrink-0" />
                        <div className="min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-0.5">Or email us directly</p>
                            <a
                                href="mailto:info@myperfecttrips.com"
                                className="text-sm font-semibold text-brand-800 hover:text-brand-600 transition-colors truncate block"
                            >
                                info@myperfecttrips.com
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
