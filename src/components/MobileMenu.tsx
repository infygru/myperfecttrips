"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Menu, X, Phone, Mail, MapPin } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";

export default function MobileMenu({ nav, phone }: { nav: { name: string, path: string }[], phone: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent scrolling when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            // Prevent background interaction entirely on iOS Safari
            document.body.style.position = "fixed";
            document.body.style.width = "100%";
        } else {
            document.body.style.overflow = "";
            document.body.style.position = "";
            document.body.style.width = "";
        }
        return () => {
            document.body.style.overflow = "";
            document.body.style.position = "";
            document.body.style.width = "";
        };
    }, [isOpen]);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="relative z-[60] flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-950 transition-all hover:bg-brand-100 hover:scale-105 active:scale-95 lg:hidden"
                aria-label="Open Menu"
            >
                <Menu className="h-5 w-5" />
            </button>

            {/* Immersive Full-Screen Overlay via Portal */}
            {mounted && createPortal(
                <div
                    className={`fixed inset-0 z-[99999] flex flex-col justify-between bg-white transition-all duration-400 will-change-transform lg:hidden ${
                        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none delay-100"
                    }`}
                >
                    {/* Header Section */}
                    <div className={`flex items-center justify-between px-6 py-5 transition-transform duration-500 delay-100 ${isOpen ? "translate-y-0" : "-translate-y-10"}`}>
                        <span className="font-serif text-xl font-medium tracking-tight text-brand-950">
                            Menu
                        </span>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 text-stone-500 transition-all hover:bg-stone-200 hover:rotate-90"
                            aria-label="Close Menu"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Navigation Links - Centered */}
                    <div className="flex-1 flex flex-col justify-center px-8">
                        <nav className="flex flex-col gap-6">
                            {nav.map((link, idx) => (
                                <Link
                                    key={link.name}
                                    href={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`overflow-hidden py-1 transition-all duration-500 ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                                    style={{ transitionDelay: `${150 + idx * 50}ms` }}
                                >
                                    <span className="block font-serif text-4xl sm:text-5xl font-medium text-brand-950 transition-transform duration-300 hover:translate-x-3 hover:text-brand-600">
                                        {link.name}
                                    </span>
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Footer / Contact Details */}
                    <div className={`px-8 pb-10 transition-all duration-700 delay-300 ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
                        <div className="mb-8 space-y-4">
                            <a
                                href={`https://wa.me/${phone.replace(/[^0-9]/g, "")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 text-sm font-medium text-stone-600 transition-colors hover:text-brand-800"
                            >
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366]">
                                    <WhatsAppIcon className="h-4 w-4" />
                                </div>
                                <span className="tracking-wide">{phone}</span>
                            </a>
                            <a 
                                href="mailto:info@igholidays.com"
                                className="flex items-center gap-3 text-sm font-medium text-stone-600 transition-colors hover:text-brand-800"
                            >
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                                    <Mail className="h-4 w-4" />
                                </div>
                                <span className="tracking-wide">info@igholidays.com</span>
                            </a>
                        </div>
                        
                        <button 
                            onClick={() => setIsOpen(false)} 
                            className="w-full rounded-2xl bg-brand-950 py-4 text-sm font-semibold text-white shadow-xl shadow-brand-900/20 active:scale-[0.98] transition-all"
                        >
                            Close Menu
                        </button>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
