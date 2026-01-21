"use client";

import { useState } from "react";
import { Plane, Globe } from "lucide-react";
import FlightSearchForm from "./FlightSearchForm";
import PackageSearchForm from "./PackageSearchForm";

export default function UnifiedSearchWidget() {
    const [activeTab, setActiveTab] = useState<"flights" | "packages">("flights");

    return (
        <div className="w-full max-w-[1150px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 z-20 relative px-4 md:px-6">

            {/* TABS - Pill Style Toggle (Reverted) */}
            <div className="flex justify-center gap-4 mb-4">
                <div className="bg-white p-1 rounded-full flex shadow-sm border border-slate-200">
                    <button
                        onClick={() => setActiveTab("flights")}
                        className={`px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-all duration-300
                            ${activeTab === "flights"
                                ? "bg-slate-900 text-white shadow-md"
                                : "text-slate-500 hover:bg-slate-50"
                            }`}
                    >
                        <Plane className="w-4 h-4" />
                        Flights
                    </button>
                    <button
                        onClick={() => setActiveTab("packages")}
                        className={`px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-all duration-300
                            ${activeTab === "packages"
                                ? "bg-slate-900 text-white shadow-md"
                                : "text-slate-500 hover:bg-slate-50"
                            }`}
                    >
                        <Globe className="w-4 h-4" />
                        Holidays
                    </button>
                </div>
            </div>

            {/* FORM CARD CONTAINER - Overflow Visible for Dropdowns */}
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-0 relative z-10 font-sans">
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
