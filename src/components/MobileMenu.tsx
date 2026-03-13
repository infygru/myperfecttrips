"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Menu, X, Phone, ChevronRight } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";

export default function MobileMenu({
    nav,
    phone,
}: {
    nav: { name: string; path: string }[];
    phone: string;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    const close = () => setIsOpen(false);

    const portal = (
        <>
            {/* Backdrop */}
            <div
                onClick={close}
                className={`fixed inset-0 z-[99998] bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
                aria-hidden="true"
            />

            {/* Drawer */}
            <div
                role="dialog"
                aria-modal="true"
                aria-label="Navigation menu"
                className={`fixed top-0 right-0 z-[99999] flex h-full w-[300px] flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                {/* Drawer Header */}
                <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4">
                    <span className="text-xs font-black uppercase tracking-[0.18em] text-stone-400">
                        Menu
                    </span>
                    <button
                        onClick={close}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-stone-500 transition-colors hover:bg-stone-200"
                        aria-label="Close menu"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 overflow-y-auto py-3">
                    {nav.map((link) => (
                        <Link
                            key={link.name}
                            href={link.path}
                            onClick={close}
                            className="flex items-center justify-between px-5 py-3.5 text-[15px] font-medium text-stone-800 transition-colors hover:bg-brand-50 hover:text-brand-700 active:bg-brand-100"
                        >
                            {link.name}
                            <ChevronRight className="h-4 w-4 text-stone-300" />
                        </Link>
                    ))}
                </nav>

                {/* Drawer Footer */}
                <div className="space-y-3 border-t border-stone-100 p-5">
                    <a
                        href={`https://wa.me/${phone.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={close}
                        className="flex items-center gap-3 rounded-xl bg-[#25D366]/10 px-4 py-3 text-sm font-semibold text-[#128C7E] transition-colors hover:bg-[#25D366]/20"
                    >
                        <WhatsAppIcon className="h-5 w-5 shrink-0" />
                        <span className="truncate">{phone}</span>
                    </a>
                    <Link
                        href="/contact"
                        onClick={close}
                        className="flex items-center justify-center gap-2 rounded-xl bg-brand-950 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-800"
                    >
                        <Phone className="h-4 w-4" />
                        Get a Free Quote
                    </Link>
                </div>
            </div>
        </>
    );

    return (
        <>
            {/* Hamburger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-700 transition-colors hover:bg-stone-50 lg:hidden"
                aria-label="Open menu"
                aria-expanded={isOpen}
            >
                <Menu className="h-5 w-5" />
            </button>

            {/* Portal: renders at document.body to escape any parent stacking context */}
            {mounted && createPortal(portal, document.body)}
        </>
    );
}
