"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ChevronDown, Building2, Briefcase, Users, GraduationCap, FileText, PlaneTakeoff, ArrowRight } from "lucide-react";

const serviceLinks = [
    { name: "Corporate MICE", slug: "corporate-mice", Icon: Building2, desc: "Events & conferences" },
    { name: "Corporate Travel", slug: "corporate-travel", Icon: Briefcase, desc: "Business travel solutions" },
    { name: "Group Travel", slug: "group-travel", Icon: Users, desc: "Group bookings & tours" },
    { name: "College Tours", slug: "college-tours", Icon: GraduationCap, desc: "Student excursions" },
    { name: "Visa Assistance", slug: "visa-assistance", Icon: FileText, desc: "Visa processing support" },
    { name: "Holiday Planning", slug: "holiday-planning", Icon: PlaneTakeoff, desc: "Bespoke luxury holidays" },
];

export default function ServicesDropdown() {
    const [open, setOpen] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    function handleMouseEnter() {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setOpen(true);
    }

    function handleMouseLeave() {
        timeoutRef.current = setTimeout(() => setOpen(false), 120);
    }

    return (
        <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <Link
                href="/services"
                className={`flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-colors ${open ? "bg-stone-100 text-brand-950" : "text-stone-600 hover:bg-stone-100 hover:text-brand-950"}`}
            >
                Services
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
            </Link>

            <div
                className={`absolute top-full left-1/2 -translate-x-1/2 pt-3 transition-all duration-200 ${open ? "opacity-100 pointer-events-auto translate-y-0" : "opacity-0 pointer-events-none -translate-y-1"}`}
                style={{ width: "520px" }}
            >
                <div className="bg-white rounded-2xl shadow-xl border border-stone-100 overflow-hidden">
                    <div className="p-3 grid grid-cols-2 gap-1">
                        {serviceLinks.map((link) => (
                            <Link
                                key={link.slug}
                                href={`/services/${link.slug}`}
                                className="flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-stone-50 group"
                            >
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700 transition-colors group-hover:bg-brand-100">
                                    <link.Icon className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-stone-800 group-hover:text-brand-800 leading-tight">{link.name}</p>
                                    <p className="text-xs text-stone-400 mt-0.5">{link.desc}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <div className="border-t border-stone-100 px-4 py-3 flex items-center justify-between bg-stone-50/50">
                        <span className="text-xs text-stone-400">Premium travel services for every need</span>
                        <Link href="/services" className="flex items-center gap-1 text-xs font-bold text-brand-700 hover:underline">
                            View All <ArrowRight className="h-3 w-3" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
