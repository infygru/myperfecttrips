"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Menu, X, Phone, ChevronDown, ChevronRight } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";

type NavItem = {
    name: string;
    path: string;
    children?: { name: string; path: string }[];
};

export default function MobileMenu({ nav, phone }: { nav: NavItem[]; phone: string }) {
    const [open, setOpen]         = useState(false);
    const [mounted, setMounted]   = useState(false);
    const [expanded, setExpanded] = useState<string | null>(null);

    useEffect(() => { setMounted(true); }, []);

    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    const close = () => { setOpen(false); setExpanded(null); };

    // Use inline styles for animated values — avoids className hydration mismatches
    const drawer = (
        <>
            {/* Backdrop */}
            <div
                aria-hidden="true"
                onClick={close}
                className="fixed inset-0 z-[9998] bg-black/60 lg:hidden transition-opacity duration-300"
                style={{ opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none" }}
            />

            {/* Panel */}
            <div
                role="dialog"
                aria-modal="true"
                aria-label="Navigation menu"
                className="fixed inset-y-0 right-0 z-[9999] flex w-[min(320px,88vw)] flex-col bg-white shadow-2xl lg:hidden transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
                style={{ transform: open ? "translateX(0)" : "translateX(100%)" }}
            >
                {/* Header */}
                <div className="flex h-16 shrink-0 items-center justify-between border-b border-stone-100 px-5">
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-stone-400">Menu</span>
                    <button
                        onClick={close}
                        aria-label="Close menu"
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-100 text-stone-600 active:scale-90 transition-transform"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 overflow-y-auto py-2">
                    {nav.map((item) => {
                        const hasChildren = !!item.children?.length;
                        const isExpanded  = expanded === item.name;

                        if (hasChildren) {
                            return (
                                <div key={item.name}>
                                    <button
                                        onClick={() => setExpanded(isExpanded ? null : item.name)}
                                        className="flex w-full items-center gap-3 px-5 py-4 text-left active:bg-stone-50"
                                    >
                                        <span className="flex-1 text-[15px] font-medium text-stone-800">
                                            {item.name}
                                        </span>
                                        <ChevronDown
                                            className={`h-4 w-4 shrink-0 text-stone-400 transition-transform duration-200${isExpanded ? " rotate-180" : ""}`}
                                        />
                                    </button>

                                    {/* Accordion children */}
                                    <div
                                        className="overflow-hidden transition-all duration-300"
                                        style={{ maxHeight: isExpanded ? "400px" : "0px" }}
                                    >
                                        <div className="bg-stone-50/60 pb-2 pt-1">
                                            <Link
                                                href={item.path}
                                                onClick={close}
                                                className="flex items-center gap-2 px-7 py-2.5 text-[13px] font-bold text-brand-700 active:bg-brand-50"
                                            >
                                                <ChevronRight className="h-3 w-3 shrink-0" />
                                                All {item.name}
                                            </Link>
                                            {item.children!.map((child) => (
                                                <Link
                                                    key={child.name}
                                                    href={child.path}
                                                    onClick={close}
                                                    className="flex items-center gap-3 px-7 py-2.5 text-[13px] text-stone-500 active:bg-stone-100"
                                                >
                                                    <span className="h-1 w-1 rounded-full bg-stone-300 shrink-0" />
                                                    {child.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <Link
                                key={item.name}
                                href={item.path}
                                onClick={close}
                                className="flex items-center px-5 py-4 text-[15px] font-medium text-stone-800 active:bg-stone-50"
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer CTAs */}
                <div className="shrink-0 space-y-2.5 border-t border-stone-100 p-4">
                    <a
                        href={`https://wa.me/${phone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={close}
                        className="flex w-full items-center gap-3 rounded-2xl bg-[#25D366]/10 px-4 py-3.5 text-sm font-semibold text-[#128C7E] active:bg-[#25D366]/20"
                    >
                        <WhatsAppIcon className="h-5 w-5 shrink-0 text-[#25D366]" />
                        <span className="truncate">{phone}</span>
                    </a>
                    <Link
                        href="/contact"
                        onClick={close}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-stone-950 px-4 py-3.5 text-sm font-bold text-white active:bg-stone-800"
                    >
                        <Phone className="h-4 w-4 shrink-0" />
                        Get a Free Quote
                    </Link>
                </div>
            </div>
        </>
    );

    return (
        <>
            {/* Hamburger button — suppressHydrationWarning prevents mismatch from stale bundles */}
            <button
                onClick={() => setOpen(true)}
                aria-label="Open menu"
                aria-expanded={open}
                suppressHydrationWarning
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-700 active:bg-stone-50 active:scale-95 transition-transform lg:hidden"
            >
                <Menu className="h-5 w-5" />
            </button>

            {mounted && createPortal(drawer, document.body)}
        </>
    );
}
