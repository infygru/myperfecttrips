"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function MobileMenu({ nav, phone }: { nav: { name: string, path: string }[], phone: string }) {
    const [isOpen, setIsOpen] = useState(false);

    // Prevent scrolling when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="rounded-lg p-2 text-stone-600 hover:bg-stone-100 lg:hidden focus:outline-none focus:ring-2 focus:ring-brand-500"
                aria-label="Open Menu"
            >
                <Menu className="h-6 w-6" />
            </button>

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm lg:hidden transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sliding Panel */}
            <div
                className={`fixed top-0 right-0 z-[70] flex h-full w-[80%] max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex items-center justify-between border-b border-stone-100 p-4 sm:px-6">
                    <span className="font-serif text-lg font-semibold text-brand-950">Menu</span>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="rounded-lg p-2 text-stone-500 hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                        aria-label="Close Menu"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                    <nav className="flex flex-col gap-4">
                        {nav.map((link) => (
                            <Link
                                key={link.name}
                                href={link.path}
                                onClick={() => setIsOpen(false)}
                                className="block rounded-xl px-4 py-3 text-lg font-medium text-stone-700 hover:bg-stone-50 hover:text-brand-700"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="border-t border-stone-100 p-4 sm:px-6 bg-stone-50">
                    <a
                        href={`https://wa.me/${phone.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-full items-center justify-center gap-2 rounded-full border border-stone-200 bg-white px-5 py-3 text-base font-semibold text-stone-700 shadow-sm transition-all hover:bg-[#25D366]/10 hover:text-[#25D366] hover:border-[#25D366]/30"
                        onClick={() => setIsOpen(false)}
                    >
                        Chat on WhatsApp
                    </a>
                </div>
            </div>
        </>
    );
}
