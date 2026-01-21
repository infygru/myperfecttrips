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
        <form className="p-5 lg:p-6 bg-white rounded-2xl shadow-xl border border-slate-100">

            {/* --- SINGLE ROW LAYOUT (Flex) --- */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 relative z-20 flex flex-col md:flex-row">

                {/* DESTINATION (40%) */}
                <div className="w-full md:w-[40%] relative group p-4 hover:bg-slate-50 transition-colors border-b md:border-b-0 md:border-r border-slate-100 first:rounded-t-2xl md:first:rounded-l-2xl md:first:rounded-r-none">
                    <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                        <Globe className="w-3.5 h-3.5" /> Destination
                    </label>
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Where to?"
                        className="w-full bg-transparent outline-none text-lg font-bold text-slate-900 placeholder:text-slate-300 truncate font-mono"
                    />
                </div>

                {/* BUDGET (35%) */}
                <div className="w-full md:w-[35%] relative group p-4 hover:bg-slate-50 transition-colors border-b md:border-b-0 md:border-r border-slate-100 cursor-pointer" onClick={() => setIsBudgetOpen(!isBudgetOpen)}>
                    <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                        <Wallet className="w-3.5 h-3.5" /> Budget / Person
                    </label>
                    <div className="flex items-center justify-between">
                        <span className={`text-lg font-bold font-mono ${budget === "Any Budget" ? "text-slate-300" : "text-slate-900"}`}>{budget}</span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 ml-2 transition-transform ${isBudgetOpen ? "rotate-180" : ""}`} />
                    </div>

                    {isBudgetOpen && (
                        <div className="absolute top-[100%] left-0 w-full min-w-[240px] bg-white shadow-2xl rounded-xl border border-slate-100 mt-2 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 p-1">
                            {budgetOptions.map(option => (
                                <button
                                    key={option}
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); setBudget(option); setIsBudgetOpen(false); }}
                                    className={`w-full text-left px-4 py-3 text-[15px] font-semibold rounded-lg flex justify-between items-center ${budget === option ? "text-brand-blue bg-blue-50/50" : "text-slate-700 hover:bg-slate-50"}`}
                                >
                                    {option}
                                    {budget === option && <Check className="w-4 h-4" />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* SEARCH BUTTON (25%) */}
                <div className="w-full md:w-[25%] p-2 md:rounded-r-2xl">
                    <button
                        onClick={handleSearch}
                        type="button"
                        disabled={isPending}
                        className="w-full h-full min-h-[56px] bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 group"
                    >
                        {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <> <Search className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" /> <span>Search</span> </>}
                    </button>
                </div>

            </div>

        </form>
    );
}
