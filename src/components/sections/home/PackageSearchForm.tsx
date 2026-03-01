"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronDown, Check, Globe, MapPin, Loader2, Wallet } from "lucide-react";

export default function PackageSearchForm() {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [budget, setBudget] = useState("Any Budget");
    const [isBudgetOpen, setIsBudgetOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);

    const budgetOptions = ["Any Budget", "£500 - £1000", "£1000 - £2000", "£2000+"];

    const handleSearch = () => {
        setIsPending(true);
        const params = new URLSearchParams();
        if (query) params.set("search", query);
        if (budget && budget !== "Any Budget") params.set("budget", budget);

        setTimeout(() => {
            router.push(`/packages?${params.toString()}`);
            setIsPending(false);
        }, 800);
    };

    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
                @media (min-width: 768px) {
                    .desktop-flex-1 { flex: 1 1 0% !important; min-width: 0 !important; }
                    .desktop-w-20 { flex: 0 0 20% !important; max-width: 20% !important; }
                }
            `}} />
            <form className="relative transition-all duration-500">
                {/* --- SINGLE ROW LAYOUT (Flex) --- */}
                <div className="grid grid-cols-1 md:flex md:flex-row items-center bg-white md:rounded-full rounded-2xl shadow-lg border border-slate-200 relative z-20 md:p-2 md:pl-4">

                    {/* DESTINATION (40%) */}
                    <div className="w-full desktop-flex-1 relative group p-3 md:p-4 border-r border-slate-100 md:hover:bg-slate-50 md:rounded-l-full transition-colors rounded-tl-2xl md:rounded-l-full">
                        <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                            <Globe className="w-3.5 h-3.5" /> Destination
                        </label>
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Where to?"
                            className="w-full bg-transparent outline-none text-sm md:text-lg font-bold text-slate-900 placeholder:text-slate-300 truncate font-mono ml-1"
                        />
                    </div>

                    {/* BUDGET (35%) */}
                    <div className="w-full desktop-flex-1 relative group p-3 md:p-4 border-r border-slate-100 cursor-pointer md:hover:bg-slate-50 transition-colors" onClick={() => setIsBudgetOpen(!isBudgetOpen)}>
                        <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                            <Wallet className="w-3.5 h-3.5" /> Budget / Person
                        </label>
                        <div className="flex items-center justify-between ml-1">
                            <span className={`text-sm md:text-lg font-bold font-mono ${budget === "Any Budget" ? "text-slate-300" : "text-slate-900"}`}>{budget}</span>
                            <ChevronDown className={`w-4 h-4 text-slate-400 ml-2 transition-transform ${isBudgetOpen ? "rotate-180" : ""}`} />
                        </div>

                        {isBudgetOpen && (
                            <div className="absolute top-[100%] left-0 w-full min-w-[240px] bg-white shadow-2xl rounded-2xl border border-slate-100 mt-2 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 p-1">
                                {budgetOptions.map(option => (
                                    <button
                                        key={option}
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); setBudget(option); setIsBudgetOpen(false); }}
                                        className={`w-full text-left px-4 py-3 text-sm font-bold rounded-xl flex justify-between items-center ${budget === option ? "text-brand-blue bg-blue-50" : "text-slate-700 hover:bg-slate-50"}`}
                                    >
                                        {option}
                                        {budget === option && <Check className="w-4 h-4" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* SEARCH BUTTON (20%) */}
                    <div className="w-full desktop-w-20 p-3 md:pl-2 rounded-b-2xl md:rounded-none">
                        <button
                            onClick={handleSearch}
                            type="button"
                            disabled={isPending}
                            style={{ backgroundColor: '#0056D2' }}
                            className="w-full h-12 md:h-14 md:px-8 text-white font-bold text-base md:text-lg rounded-xl md:rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 group"
                        >
                            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <> <Search className="w-5 h-5 md:w-6 md:h-6" /> <span>Search</span> </>}
                        </button>
                    </div>

                </div>

            </form>
        </>
    );
}
