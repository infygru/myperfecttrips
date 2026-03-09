"use client";

import { useState, useRef, useEffect } from "react";
import { Plane, Palmtree, Users, Calendar, Wallet, MapPin, Loader2, CheckCircle2 } from "lucide-react";
import { submitFlightEnquiry, submitHolidayEnquiry } from "@/actions/enquiry";

export default function HeroSearchTabs() {
    const [activeTab, setActiveTab] = useState<"flights" | "holidays">("holidays");

    // Flight State
    const [fromAirport, setFromAirport] = useState("");
    const [toAirport, setToAirport] = useState("");
    const [departDate, setDepartDate] = useState("");
    const [returnDate, setReturnDate] = useState("");
    const [flightPax, setFlightPax] = useState("1");

    // Holiday State
    const [holidayDest, setHolidayDest] = useState("");
    const [holidayPax, setHolidayPax] = useState("2");
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
    const fromRef = useRef<HTMLDivElement>(null);
    const toRef = useRef<HTMLDivElement>(null);

    // Fetch Global Airports DB & Setup Click Outside
    useEffect(() => {
        async function fetchAirports() {
            try {
                // Use a cache-buster query string and no-store to force bypass the corrupted browser cache
                const res = await fetch("/data/airports.json?v=" + new Date().getTime(), { cache: "no-store" });
                const data = await res.json();
                // Algolia dataset is an array of objects
                const arr = data.filter((a: any) => a.iata_code && a.iata_code !== "\\N");
                setAirportsList(arr);
            } catch (err) {
                console.error("Failed to load global airports", err);
            }
        }
        fetchAirports();

        function handleClickOutside(event: MouseEvent) {
            if (fromRef.current && !fromRef.current.contains(event.target as Node)) {
                setShowFromDrop(false);
            }
            if (toRef.current && !toRef.current.contains(event.target as Node)) {
                setShowToDrop(false);
            }
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

    const handleFlightSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");
        setSuccessMsg("");

        const formData = new FormData();
        formData.append("from_airport", fromAirport || fromQuery);
        formData.append("to_airport", toAirport || toQuery);
        formData.append("depart_date", departDate);
        formData.append("return_date", returnDate);
        formData.append("pax", flightPax);

        const res = await submitFlightEnquiry(formData);
        setLoading(false);

        if (res.success) {
            setSuccessMsg("Flight enquiry received! We'll contact you shortly.");
            setFromQuery(""); setFromAirport("");
            setToQuery(""); setToAirport("");
            setDepartDate(""); setReturnDate("");
        } else {
            setErrorMsg(res.error || "Failed to submit.");
        }
    };

    const handleHolidaySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");
        setSuccessMsg("");

        const formData = new FormData();
        formData.append("destination", holidayDest);
        formData.append("pax", holidayPax);
        formData.append("budget", holidayBudget);

        const res = await submitHolidayEnquiry(formData);
        setLoading(false);

        if (res.success) {
            setSuccessMsg("Holiday enquiry received! We'll craft the perfect itinerary.");
            setHolidayDest("");
            setHolidayBudget("");
        } else {
            setErrorMsg(res.error || "Failed to submit.");
        }
    };

    return (
        <div className={`w-full mx-auto flex flex-col items-center transition-all duration-300 ${activeTab === 'flights' ? 'max-w-6xl' : 'max-w-4xl'}`}>
            {successMsg && (
                <div className="mb-4 flex items-center gap-2 rounded-lg bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-400 border border-emerald-500/20 backdrop-blur-md w-full max-w-lg justify-center">
                    <CheckCircle2 className="h-5 w-5" />
                    {successMsg}
                </div>
            )}
            {errorMsg && (
                <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400 border border-red-500/20 backdrop-blur-md w-full max-w-lg justify-center">
                    {errorMsg}
                </div>
            )}

            {/* Tabs */}
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

            {/* Content Container (Mobile Stacked / Desktop Pill) */}
            <div className="w-full bg-white rounded-[2rem] lg:rounded-full p-2 shadow-2xl border border-stone-200">

                {/* ---------------- HOLIDAYS TAB ---------------- */}
                {activeTab === "holidays" && (
                    <form onSubmit={handleHolidaySubmit} className="flex flex-col lg:flex-row w-full items-center divide-y lg:divide-y-0 lg:divide-x divide-stone-200">
                        {/* Destination */}
                        <div className="flex-1 flex items-center px-4 py-3 lg:py-2 gap-3 w-full">
                            <MapPin className="h-5 w-5 text-brand-600 flex-shrink-0" />
                            <div className="flex flex-col w-full">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Where to?</span>
                                <input
                                    type="text"
                                    placeholder="Destination or Region"
                                    className="w-full bg-transparent text-sm font-semibold text-brand-950 placeholder:text-stone-300 placeholder:font-normal focus:outline-none"
                                    value={holidayDest}
                                    onChange={(e) => setHolidayDest(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Pax */}
                        <div className="flex items-center px-4 py-3 lg:py-2 gap-3 w-full lg:w-32">
                            <Users className="h-5 w-5 text-brand-600 flex-shrink-0" />
                            <div className="flex flex-col w-full">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Travelers</span>
                                <select
                                    className="w-full bg-transparent text-sm font-semibold text-brand-950 focus:outline-none cursor-pointer"
                                    value={holidayPax}
                                    onChange={(e) => setHolidayPax(e.target.value)}
                                >
                                    {[1, 2, 3, 4, 5, 6, 7, 8, "9+"].map(n => <option key={n} value={n}>{n} Pax</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Budget */}
                        <div className="flex items-center px-4 py-3 lg:py-2 gap-3 w-full lg:w-48">
                            <Wallet className="h-5 w-5 text-brand-600 flex-shrink-0" />
                            <div className="flex flex-col w-full">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Budget Rate</span>
                                <select
                                    className="w-full bg-transparent text-sm font-semibold text-brand-950 focus:outline-none cursor-pointer"
                                    value={holidayBudget}
                                    onChange={(e) => setHolidayBudget(e.target.value)}
                                    required
                                >
                                    <option value="" disabled>Select Tier</option>
                                    <option value="economy">Economy</option>
                                    <option value="premium">Premium</option>
                                    <option value="luxury">Luxury (5-Star)</option>
                                </select>
                            </div>
                        </div>

                        {/* Search Button */}
                        <div className="w-full lg:w-auto p-3 lg:p-1 lg:pl-2">
                            <button type="submit" disabled={loading} className="w-full lg:w-auto bg-brand-900 hover:bg-brand-800 text-white font-semibold rounded-full px-8 py-3 lg:py-3 transition-colors text-sm disabled:opacity-70 flex justify-center items-center">
                                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Search Holidays"}
                            </button>
                        </div>
                    </form>
                )}


                {/* ---------------- FLIGHTS TAB ---------------- */}
                {activeTab === "flights" && (
                    <form onSubmit={handleFlightSubmit} className="flex flex-col lg:flex-row w-full items-center divide-y lg:divide-y-0 lg:divide-x divide-stone-200">

                        {/* FROM (Autocomplete) */}
                        <div className="relative flex-1 lg:min-w-[220px] flex items-center px-4 py-3 lg:py-2 gap-3 w-full" ref={fromRef}>
                            <Plane className="h-5 w-5 text-brand-600 flex-shrink-0 rotate-45" />
                            <div className="flex flex-col w-full">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">From</span>
                                <input
                                    type="text"
                                    placeholder="City or Airport"
                                    className="w-full bg-transparent text-sm font-semibold text-brand-950 placeholder:text-stone-300 placeholder:font-normal focus:outline-none"
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

                            {/* Dropdown */}
                            {showFromDrop && fromQuery && (
                                <div className="absolute top-full left-0 mt-2 w-full lg:w-[300px] bg-white rounded-xl shadow-xl border border-stone-200 overflow-hidden z-50">
                                    {filteredFromAirports.length > 0 ? (
                                        filteredFromAirports.map(a => (
                                            <button
                                                key={a.iata_code}
                                                type="button"
                                                className="w-full text-left px-4 py-3 hover:bg-stone-50 border-b border-stone-100 last:border-0 flex items-center justify-between"
                                                onClick={() => {
                                                    setFromQuery(`${a.city} (${a.iata_code})`);
                                                    setFromAirport(a.iata_code);
                                                    setShowFromDrop(false);
                                                }}
                                            >
                                                <div className="flex-1 pr-4">
                                                    <p className="font-semibold text-brand-950 text-sm truncate">{a.city}, {a.country}</p>
                                                    <p className="text-xs text-stone-500 truncate">{a.name}</p>
                                                </div>
                                                <span className="text-xs font-bold text-stone-400 bg-stone-100 px-2 py-1 rounded flex-shrink-0">{a.iata_code}</span>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="p-4 text-sm text-stone-500 text-center">No airports found.</div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* TO (Autocomplete) */}
                        <div className="relative flex-1 lg:min-w-[220px] flex items-center px-4 py-3 lg:py-2 gap-3 w-full" ref={toRef}>
                            <MapPin className="h-5 w-5 text-brand-600 flex-shrink-0" />
                            <div className="flex flex-col w-full">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">To</span>
                                <input
                                    type="text"
                                    placeholder="City or Airport"
                                    className="w-full bg-transparent text-sm font-semibold text-brand-950 placeholder:text-stone-300 placeholder:font-normal focus:outline-none"
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

                            {/* Dropdown */}
                            {showToDrop && toQuery && (
                                <div className="absolute top-full left-0 mt-2 w-full lg:w-[300px] bg-white rounded-xl shadow-xl border border-stone-200 overflow-hidden z-50">
                                    {filteredToAirports.length > 0 ? (
                                        filteredToAirports.map(a => (
                                            <button
                                                key={a.iata_code}
                                                type="button"
                                                className="w-full text-left px-4 py-3 hover:bg-stone-50 border-b border-stone-100 last:border-0 flex items-center justify-between"
                                                onClick={() => {
                                                    setToQuery(`${a.city} (${a.iata_code})`);
                                                    setToAirport(a.iata_code);
                                                    setShowToDrop(false);
                                                }}
                                            >
                                                <div className="flex-1 pr-4">
                                                    <p className="font-semibold text-brand-950 text-sm truncate">{a.city}, {a.country}</p>
                                                    <p className="text-xs text-stone-500 truncate">{a.name}</p>
                                                </div>
                                                <span className="text-xs font-bold text-stone-400 bg-stone-100 px-2 py-1 rounded flex-shrink-0">{a.iata_code}</span>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="p-4 text-sm text-stone-500 text-center">No airports found.</div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Dates */}
                        <div className="flex items-center px-4 py-3 lg:py-2 gap-3 w-full lg:w-auto flex-shrink-0">
                            <Calendar className="h-5 w-5 text-brand-600 flex-shrink-0" />
                            <div className="flex flex-col w-full">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Depart / Return</span>
                                <div className="flex items-center gap-1 mt-0.5 w-full lg:w-auto">
                                    <div className="relative flex-1 lg:flex-none">
                                        <input
                                            type="text"
                                            placeholder="Depart Date"
                                            onFocus={(e) => (e.target.type = "date")}
                                            onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }}
                                            className={`w-full lg:w-[105px] bg-transparent text-sm font-semibold focus:outline-none appearance-none cursor-pointer placeholder:text-stone-300 placeholder:font-normal ${departDate ? "text-brand-950" : "text-stone-400"} [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer`}
                                            value={departDate}
                                            onChange={(e) => setDepartDate(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <span className="text-stone-300 mx-1 flex-shrink-0">-</span>
                                    <div className="relative flex-1 lg:flex-none">
                                        <input
                                            type="text"
                                            placeholder="Return Date"
                                            onFocus={(e) => (e.target.type = "date")}
                                            onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }}
                                            className={`w-full lg:w-[105px] bg-transparent text-sm font-semibold focus:outline-none appearance-none cursor-pointer placeholder:text-stone-300 placeholder:font-normal ${returnDate ? "text-brand-950" : "text-stone-400"} [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer`}
                                            value={returnDate}
                                            onChange={(e) => setReturnDate(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pax */}
                        <div className="flex items-center px-3 lg:px-4 py-3 lg:py-2 gap-2 w-full lg:w-28 flex-shrink-0">
                            <Users className="h-5 w-5 text-brand-600 flex-shrink-0" />
                            <div className="flex flex-col w-full">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Pax</span>
                                <div className="relative mt-0.5">
                                    <select
                                        className="w-full bg-transparent text-sm font-semibold text-brand-950 focus:outline-none cursor-pointer appearance-none pr-4"
                                        value={flightPax}
                                        onChange={(e) => setFlightPax(e.target.value)}
                                    >
                                        {[1, 2, 3, 4, 5, 6, 7, 8, "9+"].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Pax' : 'Pax'}</option>)}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center text-stone-400">
                                        <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Search Button */}
                        <div className="w-full lg:w-auto p-3 lg:p-1 lg:pl-2">
                            <button type="submit" disabled={loading} className="w-full lg:w-auto bg-brand-900 hover:bg-brand-800 text-white font-semibold rounded-full px-8 py-3 lg:py-3 transition-colors text-sm disabled:opacity-70 flex justify-center items-center">
                                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Search Flights"}
                            </button>
                        </div>
                    </form>
                )}

            </div>
        </div>
    );
}
