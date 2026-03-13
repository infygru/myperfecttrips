"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Phone, ChevronRight } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";

export default function MobileMenu({ nav, phone }: { nav: { name: string; path: string }[]; phone: string }) {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    const close = () => setIsOpen(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-700 transition-colors hover:bg-stone-50 lg:hidden"
                aria-label="Open Menu"
            >
                <Menu className="h-5 w-5" />
            </button>

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm lg:hidden"
                    onClick={close}
                />
            )}

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 z-[9999] h-full w-[280px] bg-white shadow-2xl transition-transform duration-300 ease-in-out lg:hidden flex flex-col ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4">
                    <span className="text-sm font-bold uppercase tracking-widest text-stone-500">Menu</span>
                    <button
                        onClick={close}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 transition-colors"
                        aria-label="Close Menu"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 overflow-y-auto py-4">
                    {nav.map((link) => (
                        <Link
                            key={link.name}
                            href={link.path}
                            onClick={close}
                            className="flex items-center justify-between px-5 py-3.5 text-base font-medium text-stone-800 hover:bg-stone-50 hover:text-brand-700 transition-colors"
                        >
                            {link.name}
                            <ChevronRight className="h-4 w-4 text-stone-300" />
                        </Link>
                    ))}
                </nav>

                {/* Footer */}
                <div className="border-t border-stone-100 p-5 space-y-3">
                    <a
                        href={`https://wa.me/${phone.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 rounded-xl bg-[#25D366]/10 px-4 py-3 text-sm font-semibold text-[#128C7E] transition-colors hover:bg-[#25D366]/20"
                    >
                        <WhatsAppIcon className="h-4 w-4 shrink-0" />
                        <span className="truncate">{phone}</span>
                    </a>
                    <Link
                        href="/contact"
                        onClick={close}
                        className="flex items-center justify-center gap-2 rounded-xl bg-brand-950 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-800"
                    >
                        <Phone className="h-4 w-4" />
                        Get a Free Quote
                    </Link>
                </div>
            </div>
        </>
    );
}
