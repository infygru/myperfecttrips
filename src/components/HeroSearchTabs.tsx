"use client";

import { useState, useRef, useEffect } from "react";
import { Plane, Palmtree, Users, Calendar, Wallet, MapPin, Loader2, CheckCircle2, ArrowRight, User, Phone, ChevronDown, ChevronLeft, ChevronRight as ChevronRightIcon } from "lucide-react";
import { submitFlightEnquiry, submitHolidayEnquiry } from "@/actions/enquiry";
import { format } from "date-fns";
import MiniCalendar from "./MiniCalendar";

export default function HeroSearchTabs() {
    const [activeTab, setActiveTab] = useState<"flights" | "holidays">("holidays");
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

    // Dropdown state for Inputs
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

    // Fetch Global Airports DB & Setup Click Outside
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

    const filteredFromAirports = airportsList.filter(a =>
        a.name?.toLowerCase().includes(fromQuery.toLowerCase()) ||
        a.city?.toLowerCase().includes(fromQuery.toLowerCase()) ||
        a.iata_code?.toLowerCase().includes(fromQuery.toLowerCase())
    ).slice(0, 8);

    const filteredToAirports = airportsList.filter(a =>
        a.name?.toLowerCase().includes(toQuery.toLowerCase()) ||
        a.city?.toLowerCase().includes(toQuery.toLowerCase()) ||
        a.iata_code?.toLowerCase().includes(toQuery.toLowerCase())
    ).slice(0, 8);

    const handleNextStep = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");

        if (activeTab === "holidays") {
            if (!holidayDest || !holidayBudget) {
                setErrorMsg("Please fill all required holiday details");
                return;
            }
        } else {
            if (!fromQuery || !toQuery || !departDate) {
                setErrorMsg("Please fill all required flight details");
                return;
            }
        }

        setStep(2);
    };

    const handleFinalSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !phone) {
            setErrorMsg("Please provide your name and phone number");
            return;
        }

        setLoading(true);
        setErrorMsg("");
        setSuccessMsg("");

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
            if (res.success) {
                setSuccessMsg("Flight enquiry received! We'll contact you shortly.");
                resetForm();
            } else {
                setErrorMsg(res.error || "Failed to submit.");
            }
        } else {
            const formData = new FormData();
            formData.append("destination", holidayDest);
            formData.append("adults", holidayAdults);
            formData.append("children", holidayChildren);
            formData.append("budget", holidayBudget);
            formData.append("name", name);
            formData.append("phone", phone);

            const res = await submitHolidayEnquiry(formData);
            if (res.success) {
                setSuccessMsg("Holiday enquiry received! We'll craft the perfect itinerary.");
                resetForm();
            } else {
                setErrorMsg(res.error || "Failed to submit.");
            }
        }
        setLoading(false);
    };

    const resetForm = () => {
        setStep(1);
        setName("");
        setPhone("");
        setFromQuery(""); setFromAirport("");
        setToQuery(""); setToAirport("");
        setDepartDate(undefined); setReturnDate(undefined);
        setHolidayDest(""); setHolidayBudget("");
    };

    // Shared CSS classes for inputs
    const inputContainerClass = "flex-1 min-w-0 flex items-start px-5 py-4 lg:py-3 gap-4 w-full cursor-text transition-colors";
    const labelClass = "text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1 block text-left truncate w-full";
    const inputClass = "w-full bg-transparent text-base font-semibold text-brand-950 placeholder:text-stone-300 placeholder:font-normal focus:outline-none truncate";

    const renderPaxDropdown = (
        adults: string, setAdults: (v: string) => void,
        children: string, setChildren: (v: string) => void,
        showDrop: boolean, setShowDrop: (v: boolean) => void,
        dropRef: React.RefObject<HTMLDivElement | null>
    ) => (
        <div className={`relative ${inputContainerClass} hover:bg-stone-50/50 cursor-pointer`} ref={dropRef} onClick={() => setShowDrop(true)}>
            <Users className="h-5 w-5 text-brand-600 flex-shrink-0 mt-1" />
            <div className="flex flex-col w-full text-left">
                <label className={`${labelClass} cursor-pointer`}>Travelers</label>
                <div className="w-full bg-transparent text-base font-semibold text-brand-950 truncate flex items-center justify-between">
                    <span>{parseInt(adults || '0') + parseInt(children || '0')} Pax</span>
                    <ChevronDown className={`h-4 w-4 text-stone-400 transition-transform ${showDrop ? "rotate-180" : ""}`} />
                </div>
            </div>

            {showDrop && (
                <div className="absolute top-[100%] left-0 lg:left-auto lg:right-0 mt-2 w-[280px] bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-stone-100 z-50 p-6 flex flex-col gap-6 cursor-default animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-bold text-brand-950 text-left text-sm">Adults</p>
                            <p className="text-[11px] text-stone-500 text-left font-medium">Ages 12 or above</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button type="button" onClick={() => setAdults(Math.max(1, parseInt(adults) - 1).toString())} className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-brand-950 font-medium transition-colors">-</button>
                            <span className="font-semibold text-brand-950 w-4 text-center">{adults}</span>
                            <button type="button" onClick={() => setAdults((parseInt(adults) + 1).toString())} className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-brand-950 font-medium transition-colors">+</button>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-bold text-brand-950 text-left text-sm">Children</p>
                            <p className="text-[11px] text-stone-500 text-left font-medium">Ages 2 - 11</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button type="button" onClick={() => setChildren(Math.max(0, parseInt(children) - 1).toString())} className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-brand-950 font-medium transition-colors">-</button>
                            <span className="font-semibold text-brand-950 w-4 text-center">{children}</span>
                            <button type="button" onClick={() => setChildren((parseInt(children) + 1).toString())} className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-brand-950 font-medium transition-colors">+</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className={`w-full mx-auto flex flex-col items-center transition-all duration-500 ${activeTab === 'flights' ? 'lg:max-w-6xl' : 'lg:max-w-5xl'}`}>
            {successMsg && (
                <div className="mb-4 flex items-center gap-2 rounded-lg bg-emerald-500/90 px-4 py-3 text-sm font-medium text-white shadow-lg w-full max-w-lg justify-center animate-in fade-in slide-in-from-bottom-2">
                    <CheckCircle2 className="h-5 w-5" />
                    {successMsg}
                </div>
            )}
            {errorMsg && (
                <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-500/90 px-4 py-3 text-sm font-medium text-white shadow-lg w-full max-w-lg justify-center animate-in fade-in slide-in-from-bottom-2">
                    {errorMsg}
                </div>
            )}

            {/* Tabs (Only show in Step 1) */}
            {step === 1 && (
                <div className="flex bg-white/10 backdrop-blur-md rounded-full p-1 mb-6 border border-white/20 shadow-lg">
                    <button
                        onClick={() => setActiveTab("holidays")}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${activeTab === "holidays" ? "bg-white text-brand-950 shadow-md scale-105" : "text-white hover:bg-white/10"}`}
                    >
                        <Palmtree className="h-4 w-4" /> Holidays
                    </button>
                    <button
                        onClick={() => setActiveTab("flights")}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${activeTab === "flights" ? "bg-white text-brand-950 shadow-md scale-105" : "text-white hover:bg-white/10"}`}
                    >
                        <Plane className="h-4 w-4" /> Flights
                    </button>
                </div>
            )}

            {/* Content Container (Mobile Stacked / Desktop Pill) */}
            <div className="w-full bg-white rounded-[2rem] lg:rounded-full p-2 shadow-2xl border border-stone-200 relative overflow-visible">

                {/* ---------------- STEP 1: Search Criteria ---------------- */}
                {step === 1 ? (
                    <>
                        {/* ---------------- HOLIDAYS TAB ---------------- */}
                        {activeTab === "holidays" && (
                            <form onSubmit={handleNextStep} className="flex flex-col lg:flex-row w-full items-center divide-y lg:divide-y-0 lg:divide-x divide-stone-200">
                                {/* Destination */}
                                <div className={inputContainerClass} onClick={() => document.getElementById('hol-dest')?.focus()}>
                                    <MapPin className="h-5 w-5 text-brand-600 flex-shrink-0 mt-1" />
                                    <div className="flex flex-col w-full min-w-0">
                                        <label htmlFor="hol-dest" className={labelClass}>Where to?</label>
                                        <input
                                            id="hol-dest"
                                            type="text"
                                            placeholder="Destination or Region"
                                            className={inputClass}
                                            value={holidayDest}
                                            onChange={(e) => setHolidayDest(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Pax */}
                                {renderPaxDropdown(holidayAdults, setHolidayAdults, holidayChildren, setHolidayChildren, showHolidayPaxDrop, setShowHolidayPaxDrop, holidayPaxRef)}

                                {/* Budget Dropdown */}
                                <div className={`relative ${inputContainerClass}`} ref={budgetRef} onClick={() => setShowBudgetDrop(!showBudgetDrop)}>
                                    <Wallet className="h-5 w-5 text-brand-600 flex-shrink-0 mt-1" />
                                    <div className="flex flex-col w-full text-left cursor-pointer">
                                        <label className={`${labelClass} cursor-pointer`}>Budget Rate</label>
                                        <div className="w-full bg-transparent text-base font-semibold text-brand-950 truncate flex items-center justify-between">
                                            <span className={holidayBudget ? "text-brand-950 capitalize" : "text-stone-300 font-normal"}>{holidayBudget || "Select Tier"}</span>
                                            <ChevronDown className={`h-4 w-4 text-stone-400 transition-transform ${showBudgetDrop ? "rotate-180" : ""}`} />
                                        </div>
                                    </div>

                                    {showBudgetDrop && (
                                        <div className="absolute top-[100%] left-0 mt-2 w-full min-w-[200px] bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-stone-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                                            {[
                                                { value: "economy", label: "Economy" },
                                                { value: "premium", label: "Premium" },
                                                { value: "luxury", label: "Luxury (5-Star)" }
                                            ].map((tier) => (
                                                <button
                                                    key={tier.value}
                                                    type="button"
                                                    className="w-full text-left px-4 py-3 hover:bg-stone-50 rounded-2xl text-sm font-semibold text-brand-950 transition-colors flex items-center justify-between"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setHolidayBudget(tier.value);
                                                        setShowBudgetDrop(false);
                                                    }}
                                                >
                                                    {tier.label}
                                                    {holidayBudget === tier.value && <div className="h-2 w-2 rounded-full bg-brand-600" />}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Next Button */}
                                <div className="flex w-full lg:w-auto p-3 lg:p-2 bg-transparent justify-center items-center flex-shrink-0">
                                    <button type="submit" className="w-full lg:w-auto bg-brand-900 hover:bg-brand-800 text-white font-semibold rounded-full px-8 py-4 lg:py-4 transition-colors text-sm flex justify-center items-center gap-2 group shadow-lg shadow-brand-900/20 hover:shadow-xl">
                                        Continue <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* ---------------- FLIGHTS TAB ---------------- */}
                        {activeTab === "flights" && (
                            <form onSubmit={handleNextStep} className="flex flex-col lg:flex-row w-full items-center divide-y lg:divide-y-0 lg:divide-x divide-stone-200">
                                {/* FROM */}
                                <div className={`relative ${inputContainerClass}`} ref={fromRef} onClick={() => document.getElementById('fl-from')?.focus()}>
                                    <Plane className="h-5 w-5 text-brand-600 flex-shrink-0 mt-1" style={{ transform: "rotate(45deg)" }} />
                                    <div className="flex flex-col w-full min-w-0">
                                        <label htmlFor="fl-from" className={labelClass}>From</label>
                                        <input
                                            id="fl-from"
                                            type="text"
                                            placeholder="City or Airport"
                                            className={inputClass}
                                            value={fromQuery}
                                            onChange={(e) => {
                                                setFromQuery(e.target.value);
                                                setShowFromDrop(true);
                                                setFromAirport('');
                                            }}
                                            onFocus={() => setShowFromDrop(true)}
                                            required
                                        />
                                    </div>
                                    {showFromDrop && fromQuery && (
                                        <div className="absolute top-full left-0 mt-4 w-[320px] bg-white rounded-3xl shadow-2xl border border-stone-100 overflow-hidden z-50 py-2">
                                            {filteredFromAirports.length > 0 ? (
                                                filteredFromAirports.map(a => (
                                                    <button key={a.iata_code} type="button" className="w-full text-left px-4 py-3 hover:bg-stone-50 transition-colors flex items-center justify-between mx-auto" onClick={() => { setFromQuery(`${a.city} (${a.iata_code})`); setFromAirport(a.iata_code); setShowFromDrop(false); }}>
                                                        <div className="flex-1 pr-4 min-w-0">
                                                            <p className="font-semibold text-brand-950 text-sm truncate">{a.city}, {a.country}</p>
                                                            <p className="text-xs text-stone-500 truncate">{a.name}</p>
                                                        </div>
                                                        <span className="text-[10px] font-bold text-stone-400 bg-stone-100 px-2 py-1 rounded-md flex-shrink-0">{a.iata_code}</span>
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="p-4 text-sm text-stone-500 text-center">No airports found.</div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* TO */}
                                <div className={`relative ${inputContainerClass}`} ref={toRef} onClick={() => document.getElementById('fl-to')?.focus()}>
                                    <MapPin className="h-5 w-5 text-brand-600 flex-shrink-0 mt-1" />
                                    <div className="flex flex-col w-full min-w-0">
                                        <label htmlFor="fl-to" className={labelClass}>To</label>
                                        <input
                                            id="fl-to"
                                            type="text"
                                            placeholder="City or Airport"
                                            className={inputClass}
                                            value={toQuery}
                                            onChange={(e) => {
                                                setToQuery(e.target.value);
                                                setShowToDrop(true);
                                                setToAirport('');
                                            }}
                                            onFocus={() => setShowToDrop(true)}
                                            required
                                        />
                                    </div>
                                    {showToDrop && toQuery && (
                                        <div className="absolute top-full left-0 mt-4 w-[320px] bg-white rounded-3xl shadow-2xl border border-stone-100 overflow-hidden z-50 py-2">
                                            {filteredToAirports.length > 0 ? (
                                                filteredToAirports.map(a => (
                                                    <button key={a.iata_code} type="button" className="w-full text-left px-4 py-3 hover:bg-stone-50 transition-colors flex items-center justify-between mx-auto" onClick={() => { setToQuery(`${a.city} (${a.iata_code})`); setToAirport(a.iata_code); setShowToDrop(false); }}>
                                                        <div className="flex-1 pr-4 min-w-0">
                                                            <p className="font-semibold text-brand-950 text-sm truncate">{a.city}, {a.country}</p>
                                                            <p className="text-xs text-stone-500 truncate">{a.name}</p>
                                                        </div>
                                                        <span className="text-[10px] font-bold text-stone-400 bg-stone-100 px-2 py-1 rounded-md flex-shrink-0">{a.iata_code}</span>
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="p-4 text-sm text-stone-500 text-center">No airports found.</div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Dates */}
                                <div className={`flex flex-col lg:flex-row items-stretch w-full lg:w-auto flex-shrink-0 relative`}>
                                    
                                    {/* DEPART */}
                                    <div className={`relative flex-1 min-w-0 flex items-start px-5 py-4 lg:py-3 gap-4 lg:w-[180px] cursor-pointer transition-colors border-b lg:border-b-0 lg:border-r border-stone-200 hover:bg-stone-50/50`} ref={departRef} onClick={() => setShowDepartDrop(!showDepartDrop)}>
                                        <Calendar className="h-5 w-5 text-brand-600 flex-shrink-0 mt-1" />
                                        <div className="flex flex-col w-full min-w-0 text-left">
                                            <label className={`${labelClass} cursor-pointer`}>Depart</label>
                                            <div className="w-full bg-transparent text-base font-semibold text-brand-950 truncate flex items-center justify-between">
                                                <span className={departDate ? "text-brand-950 capitalize" : "text-stone-300 font-normal"}>{departDate ? format(departDate, "dd MMM yyyy") : "Select Date"}</span>
                                            </div>
                                        </div>
                                        {showDepartDrop && (
                                            <div className="absolute top-[100%] left-0 lg:left-1/2 lg:-translate-x-1/2 mt-2 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-stone-100 z-50 p-2 animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                                                <MiniCalendar
                                                    selected={departDate}
                                                    onSelect={(d) => { setDepartDate(d); setShowDepartDrop(false); }}
                                                    minDate={new Date()}
                                                />
                                            </div>
                                        )}

                                        {/* Visual separator dot visible on desktop */}
                                        <div className="hidden lg:block absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border border-stone-200 z-10 shadow-sm flex items-center justify-center">
                                            <div className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                                        </div>
                                    </div>

                                    {/* RETURN */}
                                    <div className={`relative flex-1 min-w-0 flex items-start px-5 py-4 lg:py-3 gap-4 lg:w-[180px] cursor-pointer transition-colors hover:bg-stone-50/50`} ref={returnRef} onClick={() => setShowReturnDrop(!showReturnDrop)}>
                                        <div className="flex flex-col w-full min-w-0 text-left">
                                            <label className={`${labelClass} cursor-pointer`}>Return</label>
                                            <div className="w-full bg-transparent text-base font-semibold text-brand-950 truncate flex items-center justify-between">
                                                <span className={returnDate ? "text-brand-950 capitalize" : "text-stone-300 font-normal"}>{returnDate ? format(returnDate, "dd MMM yyyy") : "One Way"}</span>
                                            </div>
                                        </div>
                                        {showReturnDrop && (
                                            <div className="absolute top-[100%] left-0 lg:left-1/2 lg:-translate-x-1/2 mt-2 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-stone-100 z-50 p-2 animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                                                <MiniCalendar
                                                    selected={returnDate}
                                                    onSelect={(d) => { setReturnDate(d); setShowReturnDrop(false); }}
                                                    minDate={departDate || new Date()}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Pax */}
                                {renderPaxDropdown(flightAdults, setFlightAdults, flightChildren, setFlightChildren, showFlightPaxDrop, setShowFlightPaxDrop, flightPaxRef)}

                                {/* Next Button */}
                                <div className="flex w-full lg:w-auto p-3 lg:p-2 bg-transparent justify-center items-center flex-shrink-0">
                                    <button type="submit" className="w-full lg:w-[140px] bg-brand-900 hover:bg-brand-800 text-white font-semibold rounded-full px-4 py-4 lg:py-4 transition-colors text-sm flex justify-center items-center gap-2 group shadow-lg shadow-brand-900/20 hover:shadow-xl">
                                        Continue <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </button>
                                </div>
                            </form>
                        )}
                    </>
                ) : (
                    /* ---------------- STEP 2: Contact Details ---------------- */
                    <form onSubmit={handleFinalSubmit} className="flex flex-col lg:flex-row w-full items-center divide-y lg:divide-y-0 lg:divide-x divide-stone-200 animate-in fade-in zoom-in-95 duration-300">

                        <div className="w-full lg:w-[240px] px-5 py-4 flex items-center gap-3 flex-shrink-0">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700 shadow-inner">
                                {activeTab === "holidays" ? <Palmtree className="h-5 w-5" /> : <Plane className="h-5 w-5" />}
                            </div>
                            <div className="min-w-0">
                                <h4 className="font-semibold text-brand-950 tracking-tight text-sm">Almost there!</h4>
                                <p className="text-[10px] text-stone-500 uppercase tracking-wider font-bold">Where to send quote?</p>
                            </div>
                        </div>

                        {/* Name */}
                        <div className="flex-1 min-w-0 lg:min-w-[180px] flex items-start px-5 py-4 lg:py-3 gap-3 w-full cursor-text transition-colors hover:bg-stone-50/50" onClick={() => document.getElementById('usr-name')?.focus()}>
                            <User className="h-5 w-5 text-brand-600 flex-shrink-0 mt-1" />
                            <div className="flex flex-col w-full min-w-0 text-left">
                                <label htmlFor="usr-name" className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1 block text-left">Full Name</label>
                                <input
                                    id="usr-name"
                                    type="text"
                                    placeholder="e.g. Rahul Sharma"
                                    className="w-full bg-transparent text-base font-semibold text-brand-950 placeholder:text-stone-300 placeholder:font-normal focus:outline-none"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="flex-1 min-w-0 lg:min-w-[180px] flex items-start px-5 py-4 lg:py-3 gap-3 w-full cursor-text transition-colors hover:bg-stone-50/50" onClick={() => document.getElementById('usr-phone')?.focus()}>
                            <Phone className="h-5 w-5 text-brand-600 flex-shrink-0 mt-1" />
                            <div className="flex flex-col w-full min-w-0 text-left">
                                <label htmlFor="usr-phone" className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1 block text-left">Mobile Number</label>
                                <input
                                    id="usr-phone"
                                    type="tel"
                                    placeholder="+91 98765 43210"
                                    className="w-full bg-transparent text-base font-semibold text-brand-950 placeholder:text-stone-300 placeholder:font-normal focus:outline-none"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Actions */}
                        <div className="flex w-full lg:w-auto p-3 lg:p-2 lg:pl-4 bg-white gap-2 flex-col sm:flex-row flex-shrink-0 lg:rounded-r-full">
                            <button type="button" onClick={(e) => { e.preventDefault(); setStep(1); }} className="px-6 py-4 lg:py-3 rounded-full border border-stone-200 text-stone-600 text-sm font-bold hover:bg-stone-50 transition-colors w-full sm:w-auto text-center flex items-center justify-center z-10 relative">
                                Back
                            </button>
                            <button type="submit" disabled={loading} className="w-full sm:w-auto bg-gold-400 hover:bg-gold-500 text-brand-950 font-bold rounded-full px-8 py-4 lg:py-3 transition-colors text-sm flex justify-center items-center shadow-lg shadow-gold-500/20 hover:shadow-gold-500/40 whitespace-nowrap z-10 relative">
                                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Request Quote"}
                            </button>
                        </div>
                    </form>
                )}

            </div>
        </div>
    );
}
