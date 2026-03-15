"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Menu, X, Phone, ChevronDown, ArrowRight } from "lucide-react";
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

    // createPortal requires the DOM — wait for mount
    useEffect(() => { setMounted(true); }, []);

    // Lock body scroll while open
    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    const close = () => { setOpen(false); setExpanded(null); };

    // ── portal contents ──────────────────────────────────────────────────────
    const drawer = (
        <>
            {/* Backdrop */}
            <div
                aria-hidden="true"
                onClick={close}
                className={[
                    "fixed inset-0 z-[9998] bg-black/50 lg:hidden",
                    "transition-opacity duration-300",
                    open ? "opacity-100" : "opacity-0 pointer-events-none",
                ].join(" ")}
            />

            {/* Panel */}
            <div
                role="dialog"
                aria-modal="true"
                aria-label="Site navigation"
                className={[
                    "fixed inset-y-0 right-0 z-[9999] flex w-[min(300px,85vw)] flex-col bg-white shadow-2xl lg:hidden",
                    "transition-transform duration-300 ease-in-out",
                    open ? "translate-x-0" : "translate-x-full",
                ].join(" ")}
            >
                {/* ── Header ── */}
                <div className="flex h-14 shrink-0 items-center justify-between border-b border-stone-100 px-5">
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-400">
                        Navigation
                    </span>
                    <button
                        onClick={close}
                        aria-label="Close menu"
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-stone-600 active:bg-stone-200"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* ── Nav links ── */}
                <nav className="flex-1 overflow-y-auto divide-y divide-stone-100">
                    {nav.map((item) => {
                        const hasChildren = !!item.children?.length;
                        const isExpanded  = expanded === item.name;

                        if (hasChildren) {
                            return (
                                <div key={item.name}>
                                    {/* Parent row — toggle accordion */}
                                    <button
                                        onClick={() => setExpanded(isExpanded ? null : item.name)}
                                        className="flex w-full items-center gap-3 px-5 py-4 text-left active:bg-stone-50"
                                    >
                                        <span className="flex-1 text-[15px] font-medium text-stone-800">
                                            {item.name}
                                        </span>
                                        <ChevronDown
                                            className={[
                                                "h-4 w-4 shrink-0 text-stone-400 transition-transform duration-200",
                                                isExpanded ? "rotate-180" : "",
                                            ].join(" ")}
                                        />
                                    </button>

                                    {/* Children */}
                                    {isExpanded && (
                                        <div className="bg-stone-50 pb-2">
                                            {/* "All …" shortcut */}
                                            <Link
                                                href={item.path}
                                                onClick={close}
                                                className="flex items-center gap-2 px-6 py-3 text-[13px] font-semibold text-brand-700 active:bg-brand-50"
                                            >
                                                <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                                                All {item.name}
                                            </Link>
                                            {item.children!.map((child) => (
                                                <Link
                                                    key={child.name}
                                                    href={child.path}
                                                    onClick={close}
                                                    className="flex items-center gap-2.5 px-6 py-2.5 text-[13px] font-medium text-stone-600 active:bg-brand-50 active:text-brand-700"
                                                >
                                                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-stone-300" />
                                                    {child.name}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        // Plain link
                        return (
                            <Link
                                key={item.name}
                                href={item.path}
                                onClick={close}
                                className="flex items-center px-5 py-4 text-[15px] font-medium text-stone-800 active:bg-stone-50 active:text-brand-700"
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* ── Footer CTAs ── */}
                <div className="shrink-0 space-y-2.5 border-t border-stone-100 p-4">
                    <a
                        href={`https://wa.me/${phone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={close}
                        className="flex w-full items-center gap-3 rounded-xl bg-[#25D366]/10 px-4 py-3 text-sm font-semibold text-[#128C7E] active:bg-[#25D366]/20"
                    >
                        <WhatsAppIcon className="h-5 w-5 shrink-0" />
                        <span className="truncate">{phone}</span>
                    </a>
                    <Link
                        href="/contact"
                        onClick={close}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-950 px-4 py-3 text-sm font-bold text-white active:bg-brand-800"
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
            {/* Hamburger — only visible on mobile */}
            <button
                onClick={() => setOpen(true)}
                aria-label="Open menu"
                aria-expanded={open}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-700 active:bg-stone-50 lg:hidden"
            >
                <Menu className="h-5 w-5" />
            </button>

            {/* Portal to document.body — escapes header's backdrop-filter stacking context */}
            {mounted && createPortal(drawer, document.body)}
        </>
    );
}
