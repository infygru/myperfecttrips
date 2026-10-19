"use client";

import { useState, useRef, useEffect } from "react";
import { Plane, Palmtree, Users, Calendar, Wallet, MapPin, Loader2, CheckCircle2, ArrowRight, User, Phone, ChevronDown, ChevronLeft, ChevronRight as ChevronRightIcon } from "lucide-react";
import { submitFlightEnquiry, submitHolidayEnquiry } from "@/actions/enquiry";
import { format } from "date-fns";
import MiniCalendar from "./MiniCalendar";

export default function HeroSearchTabs() {
    const [activeTab, setActiveTab] = useState<"flights" | "holidays">("flights");
    const [step, setStep] = useState<1 | 2>(1);

    // Common Contact State (Step 2)
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");

    // Flight State
    const [fromAirport, setFromAirport] = useState("");
    const [toAirport, setToAirport] = useState("");
    const [departDate, setDepartDate] = useState<Date>();
    const [returnDate, setReturnDate] = useState<Date>();
    const [flightAdults, setFlightAdults] = useState("1");
    const [flightChildren, setFlightChildren] = useState("0");

    // Holiday State
    const [holidayDest, setHolidayDest] = useState("");
    const [holidayAdults, setHolidayAdults] = useState("2");
    const [holidayChildren, setHolidayChildren] = useState("0");
    const [holidayBudget, setHolidayBudget] = useState("");

    // UI State
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    // Autocomplete State
    const [airportsList, setAirportsList] = useState<any[]>([]);
    const [fromQuery, setFromQuery] = useState("");
    const [toQuery, setToQuery] = useState("");
    const [showFromDrop, setShowFromDrop] = useState(false);
    const [showToDrop, setShowToDrop] = useState(false);

    // Dropdown state
    const [showFlightPaxDrop, setShowFlightPaxDrop] = useState(false);
    const [showHolidayPaxDrop, setShowHolidayPaxDrop] = useState(false);
    const [showBudgetDrop, setShowBudgetDrop] = useState(false);
    const [showDepartDrop, setShowDepartDrop] = useState(false);
    const [showReturnDrop, setShowReturnDrop] = useState(false);

    const fromRef = useRef<HTMLDivElement>(null);
    const toRef = useRef<HTMLDivElement>(null);
    const flightPaxRef = useRef<HTMLDivElement>(null);
    const holidayPaxRef = useRef<HTMLDivElement>(null);
    const budgetRef = useRef<HTMLDivElement>(null);
    const departRef = useRef<HTMLDivElement>(null);
    const returnRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function fetchAirports() {
            try {
                const res = await fetch("/data/airports.json?v=" + new Date().getTime(), { cache: "no-store" });
                const data = await res.json();
                const arr = data.filter((a: any) => a.iata_code && a.iata_code !== "\\N");
                setAirportsList(arr);
            } catch (err) {
                console.error("Failed to load global airports", err);
            }
        }
        fetchAirports();

        function handleClickOutside(event: MouseEvent) {
            const node = event.target as Node;
            if (fromRef.current && !fromRef.current.contains(node)) setShowFromDrop(false);
            if (toRef.current && !toRef.current.contains(node)) setShowToDrop(false);
            if (flightPaxRef.current && !flightPaxRef.current.contains(node)) setShowFlightPaxDrop(false);
            if (holidayPaxRef.current && !holidayPaxRef.current.contains(node)) setShowHolidayPaxDrop(false);
            if (budgetRef.current && !budgetRef.current.contains(node)) setShowBudgetDrop(false);
            if (departRef.current && !departRef.current.contains(node)) setShowDepartDrop(false);
            if (returnRef.current && !returnRef.current.contains(node)) setShowReturnDrop(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredFromAirports = airportsList.filter(a => {
        const q = fromQuery.toLowerCase();
        return (
            a.name?.toLowerCase().includes(q) ||
            a.city?.toLowerCase().includes(q) ||
            a.country?.toLowerCase().includes(q) ||
            a.iata_code?.toLowerCase().includes(q) ||
            `${a.city?.toLowerCase()} (${a.iata_code?.toLowerCase()})`.includes(q)
        );
    }).slice(0, 8);

    const filteredToAirports = airportsList.filter(a => {
        const q = toQuery.toLowerCase();
        return (
            a.name?.toLowerCase().includes(q) ||
            a.city?.toLowerCase().includes(q) ||
            a.country?.toLowerCase().includes(q) ||
            a.iata_code?.toLowerCase().includes(q) ||
            `${a.city?.toLowerCase()} (${a.iata_code?.toLowerCase()})`.includes(q)
        );
    }).slice(0, 8);

    const handleNextStep = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");
        if (activeTab === "holidays") {
            if (!holidayDest || !holidayBudget) { setErrorMsg("Please fill all required holiday details"); return; }
        } else {
            if (!fromQuery || !toQuery || !departDate) { setErrorMsg("Please fill all required flight details"); return; }
        }
        setStep(2);
    };

    const handleFinalSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !phone) { setErrorMsg("Please provide your name and phone number"); return; }
        setLoading(true); setErrorMsg(""); setSuccessMsg("");

        if (activeTab === "flights") {
            const formData = new FormData();
            formData.append("from_airport", fromAirport || fromQuery);
            formData.append("to_airport", toAirport || toQuery);
            formData.append("depart_date", departDate ? format(departDate, "yyyy-MM-dd") : "");
            formData.append("return_date", returnDate ? format(returnDate, "yyyy-MM-dd") : "");
            formData.append("adults", flightAdults);
            formData.append("children", flightChildren);
            formData.append("name", name);
            formData.append("phone", phone);
            const res = await submitFlightEnquiry(formData);
            if (res.success) { setSuccessMsg("Flight enquiry received! We'll contact you shortly."); resetForm(); }
            else { setErrorMsg(res.error || "Failed to submit."); }
        } else {
            const formData = new FormData();
            formData.append("destination", holidayDest);
            formData.append("adults", holidayAdults);
            formData.append("children", holidayChildren);
            formData.append("budget", holidayBudget);
            formData.append("name", name);
            formData.append("phone", phone);
            const res = await submitHolidayEnquiry(formData);
            if (res.success) { setSuccessMsg("Holiday enquiry received! We'll craft the perfect itinerary."); resetForm(); }
            else { setErrorMsg(res.error || "Failed to submit."); }
        }
        setLoading(false);
    };

    const resetForm = () => {
        setStep(1); setName(""); setPhone("");
        setFromQuery(""); setFromAirport("");
        setToQuery(""); setToAirport("");
        setDepartDate(undefined); setReturnDate(undefined);
        setHolidayDest(""); setHolidayBudget("");
    };

    // ── CSS classes ──
    const labelClass = "text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1 block text-left";
    const inputClass = "w-full bg-transparent text-[15px] font-semibold text-brand-950 placeholder:text-stone-300 placeholder:font-normal focus:outline-none";
    // trigger row inside each field wrapper
    const triggerClass = "flex items-center gap-4 px-5 py-[18px] w-full transition-colors lg:px-6 lg:py-0 lg:h-[68px]";
    // outer wrapper = direct form child (gets divide-y borders) + relative for dropdown
    const wrapClass = "relative lg:flex-1 lg:min-w-0";
    // form: stack on mobile (divide-y), row on desktop (divide-x)
    const formClass = "flex flex-col lg:flex-row w-full items-stretch lg:items-center divide-y divide-stone-100 lg:divide-y-0 lg:divide-x lg:divide-stone-200";

    // ── Shared airport result list ──
    const AirportList = ({ airports, onSelect }: { airports: any[]; onSelect: (a: any) => void }) => (
        <div className="py-2">
            {airports.length > 0 ? airports.map(a => (
                <button
                    key={a.iata_code}
                    type="button"
                    className="w-full text-left px-5 py-3.5 hover:bg-stone-50 active:bg-stone-100 transition-colors flex items-center justify-between"
                    onClick={() => onSelect(a)}
                >
                    <div className="flex-1 pr-3 min-w-0">
                        <p className="font-semibold text-brand-950 text-sm truncate">{a.city}, {a.country}</p>
                        <p className="text-xs text-stone-400 truncate mt-0.5">{a.name}</p>
                    </div>
                    <span className="text-[10px] font-bold text-stone-400 bg-stone-100 px-2 py-1 rounded-lg flex-shrink-0">{a.iata_code}</span>
                </button>
            )) : (
                <p className="px-5 py-4 text-sm text-stone-400 text-center">No airports found.</p>
            )}
        </div>
    );

    // ── Pax dropdown ──
    // KEY FIX: trigger div and dropdown panel are SIBLINGS inside the ref wrapper.
    // Clicking the panel never bubbles into the trigger → no stopPropagation needed.
    const renderPaxDropdown = (
        adults: string, setAdults: (v: string) => void,
        children: string, setChildren: (v: string) => void,
        showDrop: boolean, setShowDrop: (v: boolean) => void,
        dropRef: React.RefObject<HTMLDivElement | null>
    ) => (
        <div ref={dropRef} className={wrapClass}>
            {/* Trigger */}
            <div
                className={`${triggerClass} cursor-pointer active:bg-stone-50 lg:hover:bg-stone-50/60`}
                onClick={() => setShowDrop(!showDrop)}
            >
                <Users className="h-5 w-5 text-brand-600 flex-shrink-0" />
                <div className="flex flex-col w-full text-left">
                    <span className={labelClass}>Travelers</span>
                    <div className="flex items-center justify-between w-full">
                        <span className="text-[15px] font-semibold text-brand-950">
                            {parseInt(adults || "0") + parseInt(children || "0")} Pax
                        </span>
                        <ChevronDown className={`h-4 w-4 text-stone-400 transition-transform flex-shrink-0 ${showDrop ? "rotate-180" : ""}`} />
                    </div>
                </div>
            </div>
            {/* Dropdown panel — sibling of trigger, never bubbles into it */}
            {showDrop && (
                <div className="absolute top-[calc(100%+8px)] left-4 right-4 lg:left-auto lg:right-0 lg:w-[280px] bg-white rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.15)] border border-stone-100 z-[60] p-5 flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-200">
                    {[
                        { label: "Adults", subtitle: "Ages 12 or above", value: adults, setter: setAdults, min: 1 },
                        { label: "Children", subtitle: "Ages 2 – 11", value: children, setter: setChildren, min: 0 },
                    ].map(({ label, subtitle, value, setter, min }) => (
                        <div key={label} className="flex items-center justify-between">
                            <div>
                                <p className="font-bold text-brand-950 text-sm">{label}</p>
                                <p className="text-[11px] text-stone-400 font-medium mt-0.5">{subtitle}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button type="button" onClick={() => setter(Math.max(min, parseInt(value) - 1).toString())} className="w-9 h-9 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 active:bg-stone-200 text-brand-950 font-bold text-lg transition-colors">−</button>
                                <span className="font-bold text-brand-950 w-5 text-center text-sm">{value}</span>
                                <button type="button" onClick={() => setter((parseInt(value) + 1).toString())} className="w-9 h-9 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 active:bg-stone-200 text-brand-950 font-bold text-lg transition-colors">+</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <div className={`w-full mx-auto flex flex-col items-center transition-all duration-500 ${activeTab === "flights" ? "lg:max-w-6xl" : "lg:max-w-5xl"}`}>

            {successMsg && (
                <div className="mb-4 flex items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3.5 text-sm font-semibold text-white shadow-lg w-full max-w-lg justify-center animate-in fade-in slide-in-from-bottom-2">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0" />{successMsg}
                </div>
            )}
            {errorMsg && (
                <div className="mb-4 flex items-center gap-2 rounded-2xl bg-red-500 px-5 py-3.5 text-sm font-semibold text-white shadow-lg w-full max-w-lg justify-center animate-in fade-in slide-in-from-bottom-2">
                    {errorMsg}
                </div>
            )}

            {/* Tabs */}
            {step === 1 && (
                <div className="flex w-auto bg-white/10 backdrop-blur-md rounded-full p-1 mb-5 border border-white/20 shadow-lg">
                    {(["flights", "holidays"] as const).map((tab) => (
                        <button key={tab} onClick={() => setActiveTab(tab)}
                            className={`flex items-center gap-2 px-5 sm:px-7 py-2.5 rounded-full text-sm font-semibold transition-all ${activeTab === tab ? "bg-white text-brand-950 shadow-md" : "text-white hover:bg-white/10"}`}>
                            {tab === "holidays" ? <Palmtree className="h-4 w-4 flex-shrink-0" /> : <Plane className="h-4 w-4 flex-shrink-0" />}
                            <span className="capitalize">{tab}</span>
                        </button>
                    ))}
                </div>
            )}

            {/* Main card */}
            <div className="w-full bg-white rounded-3xl lg:rounded-full overflow-visible shadow-[0_12px_48px_rgba(0,0,0,0.16)] ring-1 ring-stone-200/70 relative lg:p-1.5">

                {step === 1 ? (
                    <>
                        {/* ── HOLIDAYS ── */}
                        {activeTab === "holidays" && (
                            <form onSubmit={handleNextStep} className={formClass}>

                                {/* Destination — plain text, no dropdown needed */}
                                <div className={wrapClass} onClick={() => document.getElementById("hol-dest")?.focus()}>
                                    <div className={`${triggerClass} cursor-text lg:hover:bg-stone-50/60`}>
                                        <MapPin className="h-5 w-5 text-brand-600 flex-shrink-0" />
                                        <div className="flex flex-col w-full min-w-0">
                                            <label htmlFor="hol-dest" className={labelClass}>Where to?</label>
                                            <input id="hol-dest" type="text" placeholder="Destination or Region"
                                                className={inputClass} value={holidayDest}
                                                onChange={(e) => setHolidayDest(e.target.value)} required />
                                        </div>
                                    </div>
                                </div>

                                {/* Travelers */}
                                {renderPaxDropdown(holidayAdults, setHolidayAdults, holidayChildren, setHolidayChildren, showHolidayPaxDrop, setShowHolidayPaxDrop, holidayPaxRef)}

                                {/* Budget */}
                                <div ref={budgetRef} className={wrapClass}>
                                    {/* Trigger */}
                                    <div className={`${triggerClass} cursor-pointer active:bg-stone-50 lg:hover:bg-stone-50/60`}
                                        onClick={() => setShowBudgetDrop(!showBudgetDrop)}>
                                        <Wallet className="h-5 w-5 text-brand-600 flex-shrink-0" />
                                        <div className="flex flex-col w-full text-left">
                                            <span className={labelClass}>Budget</span>
                                            <div className="flex items-center justify-between w-full">
                                                <span className={`text-[15px] font-semibold ${holidayBudget ? "text-brand-950" : "text-stone-300 font-normal"}`}>
                                                    {holidayBudget || "Select Range"}
                                                </span>
                                                <ChevronDown className={`h-4 w-4 text-stone-400 transition-transform flex-shrink-0 ${showBudgetDrop ? "rotate-180" : ""}`} />
                                            </div>
                                        </div>
                                    </div>
                                    {/* Dropdown panel — sibling of trigger */}
                                    {showBudgetDrop && (
                                        <div className="absolute top-[calc(100%+8px)] left-4 right-4 lg:left-auto lg:right-0 lg:w-[240px] bg-white rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.15)] border border-stone-100 p-2 z-[60] animate-in fade-in zoom-in-95 duration-200">
                                            {["Under £1,000", "£1,000 – £3,000", "£3,000 – £5,000", "Above £5,000"].map((range) => (
                                                <button key={range} type="button"
                                                    className="w-full text-left px-4 py-3 hover:bg-stone-50 active:bg-stone-100 rounded-2xl text-sm font-semibold text-brand-950 transition-colors flex items-center justify-between"
                                                    onClick={() => { setHolidayBudget(range); setShowBudgetDrop(false); }}>
                                                    {range}
                                                    {holidayBudget === range && <div className="h-2 w-2 rounded-full bg-brand-600 flex-shrink-0" />}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Submit */}
                                <div className="px-4 pb-5 pt-3 lg:p-2 lg:flex-shrink-0">
                                    <button type="submit" className="w-full lg:w-auto bg-gradient-to-r from-brand-900 to-brand-800 hover:from-brand-800 hover:to-brand-700 text-white font-semibold rounded-2xl lg:rounded-full px-8 py-4 lg:py-3.5 transition-all text-sm flex justify-center items-center gap-2 group shadow-lg shadow-brand-900/20 hover:shadow-xl active:scale-[.98]">
                                        Continue <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* ── FLIGHTS ── */}
                        {activeTab === "flights" && (
                            <form onSubmit={handleNextStep} className={formClass}>

                                {/* FROM */}
                                <div ref={fromRef} className={wrapClass}>
                                    {/* Trigger */}
                                    <div className={`${triggerClass} cursor-text lg:hover:bg-stone-50/60`}
                                        onClick={() => document.getElementById("fl-from")?.focus()}>
                                        <Plane className="h-5 w-5 text-brand-600 flex-shrink-0" style={{ transform: "rotate(45deg)" }} />
                                        <div className="flex flex-col w-full min-w-0">
                                            <label htmlFor="fl-from" className={labelClass}>From</label>
                                            <input id="fl-from" type="text" placeholder="City or Airport"
                                                className={inputClass} value={fromQuery}
                                                onChange={(e) => { setFromQuery(e.target.value); setShowFromDrop(true); setFromAirport(""); }}
                                                onBlur={() => setTimeout(() => setShowFromDrop(false), 150)}
                                                required />
                                        </div>
                                    </div>
                                    {/* Dropdown panel — sibling of trigger */}
                                    {showFromDrop && fromQuery && (
                                        <div className="absolute top-[calc(100%+8px)] left-0 right-0 sm:right-auto sm:w-[340px] bg-white rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.15)] border border-stone-100 overflow-hidden z-[60]">
                                            <AirportList airports={filteredFromAirports} onSelect={(a) => { setFromQuery(`${a.city} (${a.iata_code})`); setFromAirport(a.iata_code); setShowFromDrop(false); }} />
                                        </div>
                                    )}
                                </div>

                                {/* TO */}
                                <div ref={toRef} className={wrapClass}>
                                    {/* Trigger */}
                                    <div className={`${triggerClass} cursor-text lg:hover:bg-stone-50/60`}
                                        onClick={() => document.getElementById("fl-to")?.focus()}>
                                        <MapPin className="h-5 w-5 text-brand-600 flex-shrink-0" />
                                        <div className="flex flex-col w-full min-w-0">
                                            <label htmlFor="fl-to" className={labelClass}>To</label>
                                            <input id="fl-to" type="text" placeholder="City or Airport"
                                                className={inputClass} value={toQuery}
                                                onChange={(e) => { setToQuery(e.target.value); setShowToDrop(true); setToAirport(""); }}
                                                onBlur={() => setTimeout(() => setShowToDrop(false), 150)}
                                                required />
                                        </div>
                                    </div>
                                    {/* Dropdown panel — sibling of trigger */}
                                    {showToDrop && toQuery && (
                                        <div className="absolute top-[calc(100%+8px)] left-0 right-0 sm:right-auto sm:w-[340px] bg-white rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.15)] border border-stone-100 overflow-hidden z-[60]">
                                            <AirportList airports={filteredToAirports} onSelect={(a) => { setToQuery(`${a.city} (${a.iata_code})`); setToAirport(a.iata_code); setShowToDrop(false); }} />
                                        </div>
                                    )}
                                </div>

                                {/* Dates — side-by-side */}
                                <div className="grid grid-cols-2 divide-x divide-stone-100 lg:flex lg:items-stretch lg:w-auto lg:flex-shrink-0 lg:divide-x lg:divide-stone-200">

                                    {/* DEPART */}
                                    <div suppressHydrationWarning ref={departRef} className="relative">
                                        {/* Trigger */}
                                        <div className="flex items-center gap-3 px-4 py-[18px] sm:px-5 lg:px-6 lg:py-0 lg:h-[68px] lg:w-[170px] w-full cursor-pointer transition-colors active:bg-stone-50 lg:hover:bg-stone-50/60"
                                            onClick={() => setShowDepartDrop(!showDepartDrop)}>
                                            <Calendar className="h-5 w-5 text-brand-600 flex-shrink-0" />
                                            <div className="flex flex-col w-full min-w-0 text-left">
                                                <span className={`${labelClass} cursor-pointer`}>Depart</span>
                                                <div className="flex items-center justify-between">
                                                    <span className={`text-sm lg:text-[15px] font-semibold truncate ${departDate ? "text-brand-950" : "text-stone-300 font-normal"}`}>
                                                        {departDate ? format(departDate, "dd MMM yy") : "Select"}
                                                    </span>
                                                    <ChevronDown className={`h-4 w-4 text-stone-400 flex-shrink-0 transition-transform ml-1 ${showDepartDrop ? "rotate-180" : ""}`} />
                                                </div>
                                            </div>
                                        </div>
                                        {/* Dropdown panel — sibling of trigger */}
                                        {showDepartDrop && (
                                            <div className="absolute top-[calc(100%+8px)] left-0 bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.15)] border border-stone-100 z-[60] p-2 animate-in fade-in zoom-in-95 duration-200">
                                                <MiniCalendar selected={departDate}
                                                    onSelect={(d) => { setDepartDate(d); setShowDepartDrop(false); }}
                                                    minDate={new Date()} />
                                            </div>
                                        )}
                                    </div>

                                    {/* RETURN */}
                                    <div suppressHydrationWarning ref={returnRef} className="relative">
                                        {/* Trigger */}
                                        <div className="flex items-center gap-3 px-4 py-[18px] sm:px-5 lg:px-6 lg:py-0 lg:h-[68px] lg:w-[170px] w-full cursor-pointer transition-colors active:bg-stone-50 lg:hover:bg-stone-50/60"
                                            onClick={() => setShowReturnDrop(!showReturnDrop)}>
                                            <Calendar className="h-5 w-5 text-brand-600 flex-shrink-0" />
                                            <div className="flex flex-col w-full min-w-0 text-left">
                                                <span className={`${labelClass} cursor-pointer`}>Return</span>
                                                <div className="flex items-center justify-between">
                                                    <span className={`text-sm lg:text-[15px] font-semibold truncate ${returnDate ? "text-brand-950" : "text-stone-300 font-normal"}`}>
                                                        {returnDate ? format(returnDate, "dd MMM yy") : "One way"}
                                                    </span>
                                                    <ChevronDown className={`h-4 w-4 text-stone-400 flex-shrink-0 transition-transform ml-1 ${showReturnDrop ? "rotate-180" : ""}`} />
                                                </div>
                                            </div>
                                        </div>
                                        {/* Dropdown panel — sibling of trigger */}
                                        {showReturnDrop && (
                                            <div className="absolute top-[calc(100%+8px)] left-0 bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.15)] border border-stone-100 z-[60] p-2 animate-in fade-in zoom-in-95 duration-200">
                                                <MiniCalendar selected={returnDate}
                                                    onSelect={(d) => { setReturnDate(d); setShowReturnDrop(false); }}
                                                    minDate={departDate || new Date()} />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Travelers */}
                                {renderPaxDropdown(flightAdults, setFlightAdults, flightChildren, setFlightChildren, showFlightPaxDrop, setShowFlightPaxDrop, flightPaxRef)}

                                {/* Submit */}
                                <div className="px-4 pb-5 pt-3 lg:p-2 lg:flex-shrink-0">
                                    <button type="submit" className="w-full lg:w-auto bg-gradient-to-r from-brand-900 to-brand-800 hover:from-brand-800 hover:to-brand-700 text-white font-semibold rounded-2xl lg:rounded-full px-8 py-4 lg:py-3.5 transition-all text-sm flex justify-center items-center gap-2 group shadow-lg shadow-brand-900/20 hover:shadow-xl active:scale-[.98]">
                                        Continue <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </button>
                                </div>
                            </form>
                        )}
                    </>
                ) : (
                    /* ── STEP 2: Contact ── */
                    <form onSubmit={handleFinalSubmit} className={`${formClass} animate-in fade-in zoom-in-95 duration-300`}>

                        <div className="flex items-center gap-4 px-5 py-5 lg:px-6 lg:py-0 lg:h-[68px] lg:w-[220px] lg:flex-shrink-0">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700 shadow-inner">
                                {activeTab === "holidays" ? <Palmtree className="h-5 w-5" /> : <Plane className="h-5 w-5" />}
                            </div>
                            <div className="min-w-0">
                                <h4 className="font-semibold text-brand-950 text-sm tracking-tight">Almost there!</h4>
                                <p className="text-[10px] text-stone-400 uppercase tracking-wider font-bold mt-0.5">Where to send quote?</p>
                            </div>
                        </div>

                        {/* Name */}
                        <div className={wrapClass} onClick={() => document.getElementById("usr-name")?.focus()}>
                            <div className={`${triggerClass} cursor-text lg:hover:bg-stone-50/60`}>
                                <User className="h-5 w-5 text-brand-600 flex-shrink-0" />
                                <div className="flex flex-col w-full min-w-0">
                                    <label htmlFor="usr-name" className={labelClass}>Full Name</label>
                                    <input id="usr-name" type="text" placeholder="Rahul Sharma"
                                        className={inputClass} value={name}
                                        onChange={(e) => setName(e.target.value)} required />
                                </div>
                            </div>
                        </div>

                        {/* Phone */}
                        <div className={wrapClass} onClick={() => document.getElementById("usr-phone")?.focus()}>
                            <div className={`${triggerClass} cursor-text lg:hover:bg-stone-50/60`}>
                                <Phone className="h-5 w-5 text-brand-600 flex-shrink-0" />
                                <div className="flex flex-col w-full min-w-0">
                                    <label htmlFor="usr-phone" className={labelClass}>Mobile No.</label>
                                    <input id="usr-phone" type="tel" placeholder="+91 98765 43210"
                                        className={inputClass} value={phone}
                                        onChange={(e) => setPhone(e.target.value)} required />
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center px-4 pb-5 pt-3 gap-3 lg:p-2 lg:flex-shrink-0">
                            <button type="button" onClick={(e) => { e.preventDefault(); setStep(1); }}
                                className="flex-none px-6 py-4 lg:py-3.5 rounded-2xl lg:rounded-full border border-stone-200 text-stone-600 text-sm font-bold active:bg-stone-50 transition-colors">
                                Back
                            </button>
                            <button type="submit" disabled={loading}
                                className="flex-1 lg:flex-none bg-gold-400 hover:bg-gold-500 active:bg-gold-600 text-brand-950 font-bold rounded-2xl lg:rounded-full px-8 py-4 lg:py-3.5 transition-colors text-sm flex justify-center items-center gap-2 shadow-lg shadow-gold-500/20 hover:shadow-gold-500/40 whitespace-nowrap">
                                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Request Quote"}
                            </button>
                        </div>
                    </form>
                )}

            </div>
        </div>
    );
}
