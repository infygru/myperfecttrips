"use client";

import { useState } from "react";
import { Plane, Globe } from "lucide-react";
import FlightSearchForm from "./FlightSearchForm";
import PackageSearchForm from "./PackageSearchForm";

export default function UnifiedSearchWidget() {
    const [activeTab, setActiveTab] = useState<"flights" | "packages">("flights");

    return (
        <div className="w-full max-w-[1150px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 z-20 relative px-4 md:px-6">

            {/* TABS - Modern Clean Pill Style */}
            <div className="flex justify-start gap-2 mb-4">
                <button
                    onClick={() => setActiveTab("flights")}
                    className={`px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all duration-300 backdrop-blur-md
                        ${activeTab === "flights"
                            ? "bg-white text-slate-900 shadow-xl"
                            : "bg-black/20 text-white hover:bg-black/40 border border-white/10"
                        }`}
                >
                    <Plane className={`w-4 h-4 ${activeTab === "flights" ? "text-brand-blue" : "text-white/80"}`} />
                    Flights
                </button>
                <button
                    onClick={() => setActiveTab("packages")}
                    className={`px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all duration-300 backdrop-blur-md
                        ${activeTab === "packages"
                            ? "bg-white text-slate-900 shadow-xl"
                            : "bg-black/20 text-white hover:bg-black/40 border border-white/10"
                        }`}
                >
                    <Globe className={`w-4 h-4 ${activeTab === "packages" ? "text-brand-blue" : "text-white/80"}`} />
                    Holidays
                </button>
            </div>

            {/* FORM CARD CONTAINER - Overflow Visible for Dropdowns */}
            <div className="p-0 relative z-10 font-sans">
                {activeTab === "packages" ? (
                    <div className="animate-in fade-in duration-200">
                        <PackageSearchForm />
                    </div>
                ) : (
                    <div className="animate-in fade-in duration-200">
                        <FlightSearchForm />
                    </div>
                )}
            </div>

        </div>
    );
}
