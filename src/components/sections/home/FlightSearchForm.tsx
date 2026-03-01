"use client";

import { useState, useRef, useEffect, useActionState } from "react";
import {
    ChevronDown,
    CheckCircle,
    Loader2,
    User,
    ArrowRightLeft,
    Calendar,
    Search,
    Phone,
    MapPin,
    Plane,
    ArrowRight,
    PlaneTakeoff,
    PlaneLanding,
    CalendarDays,
    Users
} from "lucide-react";
import { POPULAR_AIRPORTS, Airport } from "@/lib/airports";
import { submitFlightEnquiry } from "@/app/actions/enquiry";
import SimpleCalendar from "@/components/ui/SimpleCalendar";

export default function FlightSearchForm() {
    const [state, formAction, isPending] = useActionState(submitFlightEnquiry, null);

    // Feedback Effect
    useEffect(() => {
        if (state) {
            if (state.success) {
                alert(state.message); // Temporary simple feedback or a nice modal
                // Optional: Reset form or step
                // setStep(1);
            } else {
                setFormError(state.message);
            }
        }
    }, [state]);

    // Steps: 1 = Details, 2 = Contact
    const [step, setStep] = useState(1);
    const [formError, setFormError] = useState("");

    const [flightForm, setFlightForm] = useState({
        from: "", fromCode: "", fromName: "",
        to: "", toCode: "", toName: "",
        date: "", return_date: "",
        name: "", phone: "",
        adults: 1, children: 0,
        tripType: "OneWay", class: "Economy"
    });

    const [showFromSuggestions, setShowFromSuggestions] = useState(false);
    const [showToSuggestions, setShowToSuggestions] = useState(false);
    const [showTravellers, setShowTravellers] = useState(false);
    const [showDepartCalendar, setShowDepartCalendar] = useState(false);
    const [showReturnCalendar, setShowReturnCalendar] = useState(false);

    // Suggestion logic
    const fromSuggestions = POPULAR_AIRPORTS.filter(a => {
        const query = flightForm.from.toLowerCase().trim();
        if (!query) return false;
        return a.city.toLowerCase().includes(query) ||
            a.code.toLowerCase().includes(query) ||
            a.name.toLowerCase().includes(query);
    }).slice(0, 5);

    const toSuggestions = POPULAR_AIRPORTS.filter(a => {
        const query = flightForm.to.toLowerCase().trim();
        if (!query) return false;
        return a.city.toLowerCase().includes(query) ||
            a.code.toLowerCase().includes(query) ||
            a.name.toLowerCase().includes(query);
    }).slice(0, 5);

    const fromRef = useRef<HTMLDivElement>(null);
    const toRef = useRef<HTMLDivElement>(null);
    const travellersRef = useRef<HTMLDivElement>(null);
    const departRef = useRef<HTMLDivElement>(null);
    const returnRef = useRef<HTMLDivElement>(null);

    // Helpers
    const handleSelectAirport = (type: 'from' | 'to', airport: Airport) => {
        if (type === 'from') {
            setFlightForm(p => ({ ...p, from: `${airport.city} (${airport.code})`, fromCode: airport.code, fromName: airport.name }));
            setShowFromSuggestions(false);
        } else {
            setFlightForm(p => ({ ...p, to: `${airport.city} (${airport.code})`, toCode: airport.code, toName: airport.name }));
            setShowToSuggestions(false);
        }
    };
    const updateTravellers = (type: 'adults' | 'children', op: 'inc' | 'dec') => {
        setFlightForm(p => {
            const current = p[type];
            if (op === 'dec' && ((type === 'adults' && current <= 1) || (type === 'children' && current <= 0))) return p;
            return { ...p, [type]: op === 'inc' ? current + 1 : current - 1 };
        });
    };

    const handleContinue = () => {
        // Validate Flight Details
        if (!flightForm.from || !flightForm.to) {
            setFormError("Please select Origin and Destination");
            return;
        }
        if (!flightForm.date) {
            setFormError("Please select a Departure Date");
            return;
        }
        if (flightForm.tripType === "Return" && !flightForm.return_date) {
            setFormError("Please select a Return Date");
            return;
        }

        setFormError("");
        setStep(2);
    };

    // Outside Click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (fromRef.current && !fromRef.current.contains(event.target as Node)) setShowFromSuggestions(false);
            if (toRef.current && !toRef.current.contains(event.target as Node)) setShowToSuggestions(false);
            if (travellersRef.current && !travellersRef.current.contains(event.target as Node)) setShowTravellers(false);
            if (departRef.current && !departRef.current.contains(event.target as Node)) setShowDepartCalendar(false);
            if (returnRef.current && !returnRef.current.contains(event.target as Node)) setShowReturnCalendar(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (state?.success) {
        return (
            <div className="bg-white rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-300 min-h-[250px]">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Enquiry Received</h3>
                <p className="text-slate-600 mt-1 text-sm">We'll find the best flights for you and get in touch.</p>
                <button onClick={() => window.location.reload()} className="mt-4 px-5 py-2 bg-slate-900 text-white rounded-lg font-bold text-sm hover:bg-slate-800 transition-colors">Search Again</button>
            </div>
        );
    }

    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
                @media (min-width: 768px) {
                    .desktop-flex-1 { flex: 1 1 0% !important; min-width: 0 !important; }
                    .desktop-w-20 { flex: 0 0 20% !important; max-width: 20% !important; }
                }
            `}} />
            <form action={formAction} className="relative transition-all duration-500">

                {/* --- ERROR MESSAGE (Global) --- */}
                {formError && (
                    <div className="absolute -top-12 left-0 right-0 z-10 flex justify-center">
                        <div className="flex items-center gap-2 text-red-600 text-xs font-bold bg-white border border-red-100 px-4 py-2 rounded-full shadow-lg animate-in fade-in slide-in-from-bottom-2">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            {formError}
                        </div>
                    </div>
                )}

                {/* --- FLIGHT SEARCH FORM --- */}
                <div className={`transition-all duration-500 ${step === 1 ? 'opacity-100' : 'opacity-0 hidden'}`}>

                    <div className="grid grid-cols-2 md:flex md:flex-row md:flex-nowrap items-center bg-white md:rounded-full rounded-2xl shadow-lg border border-slate-200 relative z-20 md:p-2">

                        {/* 1. FROM */}
                        <div className="desktop-flex-1 relative group p-3 md:p-4 border-r border-slate-100 md:border-slate-200 md:hover:bg-slate-50 md:rounded-l-full transition-colors rounded-tl-2xl md:rounded-l-full" ref={fromRef}>
                            <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                                <PlaneTakeoff className="w-3.5 h-3.5" /> From
                            </label>
                            <input
                                value={flightForm.from}
                                onChange={(e) => {
                                    setFlightForm(p => ({ ...p, from: e.target.value, fromCode: "" }));
                                    if (e.target.value.length > 0) setShowFromSuggestions(true);
                                }}
                                className="w-full bg-transparent outline-none text-sm md:text-lg font-bold text-slate-900 placeholder:text-slate-300 truncate font-mono ml-1"
                                placeholder="Origin City"
                                autoComplete="off"
                            />
                            {/* Suggestions */}
                            {showFromSuggestions && (
                                <div className="absolute top-[100%] left-0 w-full min-w-[300px] bg-white shadow-2xl rounded-2xl border border-slate-100 mt-1 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                                    <div className="max-h-[300px] overflow-y-auto">
                                        {fromSuggestions.length > 0 ? fromSuggestions.map(a => (
                                            <button type="button" key={a.code} onClick={() => handleSelectAirport('from', a)} className="w-full text-left px-5 py-3 hover:bg-slate-50 flex items-center justify-between border-b border-slate-50 last:border-0 group/item transition-colors">
                                                <div>
                                                    <div className="font-bold text-slate-800">{a.city}</div>
                                                    <div className="text-xs text-slate-500">{a.name}</div>
                                                </div>
                                                <span className="font-mono font-bold text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">{a.code}</span>
                                            </button>
                                        )) : <div className="p-4 text-center text-slate-400 text-sm">No airports found</div>}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 2. TO */}
                        <div className="desktop-flex-1 relative group p-3 md:p-4 border-r border-slate-100 md:border-slate-200 md:hover:bg-slate-50 transition-colors rounded-tr-2xl md:rounded-none" ref={toRef}>
                            <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                                <PlaneLanding className="w-3.5 h-3.5" /> To
                            </label>
                            <input
                                value={flightForm.to}
                                onChange={(e) => {
                                    setFlightForm(p => ({ ...p, to: e.target.value, toCode: "" }));
                                    if (e.target.value.length > 0) setShowToSuggestions(true);
                                }}
                                className="w-full bg-transparent outline-none text-sm md:text-lg font-bold text-slate-900 placeholder:text-slate-300 truncate font-mono ml-1"
                                placeholder="Dest City"
                                autoComplete="off"
                            />
                            {/* Suggestions */}
                            {showToSuggestions && (
                                <div className="absolute top-[100%] left-0 w-full min-w-[300px] bg-white shadow-2xl rounded-2xl border border-slate-100 mt-1 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                                    <div className="max-h-[300px] overflow-y-auto">
                                        {toSuggestions.length > 0 ? toSuggestions.map(a => (
                                            <button type="button" key={a.code} onClick={() => handleSelectAirport('to', a)} className="w-full text-left px-5 py-3 hover:bg-slate-50 flex items-center justify-between border-b border-slate-50 last:border-0 group/item transition-colors">
                                                <div>
                                                    <div className="font-bold text-slate-800">{a.city}</div>
                                                    <div className="text-xs text-slate-500">{a.name}</div>
                                                </div>
                                                <span className="font-mono font-bold text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">{a.code}</span>
                                            </button>
                                        )) : <div className="p-4 text-center text-slate-400 text-sm">No airports found</div>}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 3. DEPART */}
                        <div className="desktop-flex-1 relative group p-3 md:p-4 border-r border-slate-100 md:border-slate-200 md:hover:bg-slate-50 transition-colors cursor-pointer" ref={departRef} onClick={() => setShowDepartCalendar(!showDepartCalendar)}>
                            <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                                <CalendarDays className="w-3.5 h-3.5" /> Depart
                            </label>
                            <div className={`text-sm md:text-lg font-bold truncate font-mono ml-1 ${flightForm.date ? "text-slate-900" : "text-slate-300"}`}>
                                {flightForm.date ? new Date(flightForm.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }) : "Add Date"}
                            </div>
                            {showDepartCalendar && (
                                <div className="absolute top-[100%] left-0 z-50 mt-1">
                                    <SimpleCalendar
                                        selected={flightForm.date ? new Date(flightForm.date) : undefined}
                                        onSelect={(d) => {
                                            const offsetDate = new Date(d.getTime() - (d.getTimezoneOffset() * 60000));
                                            setFlightForm(p => ({ ...p, date: offsetDate.toISOString().split('T')[0] }));
                                            setShowDepartCalendar(false);
                                        }}
                                        minDate={new Date()}
                                    />
                                </div>
                            )}
                        </div>

                        {/* 4. RETURN */}
                        <div className="desktop-flex-1 relative group p-3 md:p-4 border-r border-slate-100 md:border-slate-200 md:hover:bg-slate-50 transition-colors cursor-pointer"
                            ref={returnRef}
                            onClick={() => setShowReturnCalendar(!showReturnCalendar)}
                        >
                            <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                                <CalendarDays className="w-3.5 h-3.5" /> Return
                            </label>
                            <div className="flex items-center justify-between ml-1">
                                <div className={`text-sm md:text-lg font-bold truncate font-mono ${flightForm.return_date ? "text-slate-900" : "text-slate-300"}`}>
                                    {flightForm.return_date ? new Date(flightForm.return_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }) : "Add Return"}
                                </div>
                                {flightForm.return_date && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setFlightForm(p => ({ ...p, return_date: "", tripType: "OneWay" }));
                                        }}
                                        className="p-1 hover:bg-slate-200 rounded-full transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                    </button>
                                )}
                            </div>

                            {showReturnCalendar && (
                                <div className="absolute top-[100%] left-0 z-50 mt-1">
                                    <SimpleCalendar
                                        selected={flightForm.return_date ? new Date(flightForm.return_date) : undefined}
                                        onSelect={(d) => {
                                            const offsetDate = new Date(d.getTime() - (d.getTimezoneOffset() * 60000));
                                            setFlightForm(p => ({ ...p, return_date: offsetDate.toISOString().split('T')[0], tripType: "Return" }));
                                            setShowReturnCalendar(false);
                                        }}
                                        minDate={flightForm.date ? new Date(flightForm.date) : new Date()}
                                    />
                                </div>
                            )}
                        </div>

                        {/* 5. TRAVELLERS */}
                        <div className="desktop-flex-1 relative group p-3 md:p-4 border-r border-slate-100 md:border-slate-200 md:hover:bg-slate-50 transition-colors cursor-pointer rounded-bl-2xl md:rounded-none" ref={travellersRef} onClick={() => setShowTravellers(!showTravellers)}>
                            <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                                <Users className="w-3.5 h-3.5" /> Travellers
                            </label>
                            <div className="flex items-center justify-between ml-1">
                                <span className="text-slate-900 text-sm md:text-lg font-bold font-mono">
                                    {flightForm.adults + flightForm.children} <span className="text-sm text-slate-400 font-sans">Pax</span>
                                </span>
                                <ChevronDown className="w-4 h-4 text-slate-400" />
                            </div>
                            {showTravellers && (
                                <div className="absolute top-[100%] right-0 w-[280px] bg-white shadow-2xl rounded-xl border border-slate-100 p-5 z-50 mt-1 cursor-default animate-in fade-in slide-in-from-top-2">
                                    <div className="flex justify-between items-center mb-4">
                                        <div><span className="font-bold text-slate-800 text-sm block">Adults</span><span className="text-xs text-slate-400">(12+ yrs)</span></div>
                                        <div className="flex items-center gap-3">
                                            <button type="button" onClick={(e) => { e.stopPropagation(); updateTravellers('adults', 'dec'); }} className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 text-lg leading-none pb-1 transition-colors">-</button>
                                            <span className="font-bold text-slate-900 w-4 text-center">{flightForm.adults}</span>
                                            <button type="button" onClick={(e) => { e.stopPropagation(); updateTravellers('adults', 'inc'); }} className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:border-blue-600 hover:text-blue-600 text-lg leading-none pb-1 transition-colors">+</button>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div><span className="font-bold text-slate-800 text-sm block">Children</span><span className="text-xs text-slate-400">(2-12 yrs)</span></div>
                                        <div className="flex items-center gap-3">
                                            <button type="button" onClick={(e) => { e.stopPropagation(); updateTravellers('children', 'dec'); }} className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 text-lg leading-none pb-1 transition-colors">-</button>
                                            <span className="font-bold text-slate-900 w-4 text-center">{flightForm.children}</span>
                                            <button type="button" onClick={(e) => { e.stopPropagation(); updateTravellers('children', 'inc'); }} className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:border-blue-600 hover:text-blue-600 text-lg leading-none pb-1 transition-colors">+</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 6. SEARCH BUTTON */}
                        <div className="w-full desktop-w-20 p-1 col-span-1 rounded-br-2xl md:rounded-none">
                            <button
                                type="button"
                                onClick={handleContinue}
                                style={{ backgroundColor: '#0056D2' }}
                                className="w-full h-12 md:h-14 text-white font-bold text-base md:text-lg shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 group rounded-xl md:rounded-full"
                            >
                                <Search className="w-5 h-5 md:w-6 md:h-6" />
                                <span>Search</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- STEP 2: CONTACT DETAILS --- */}
                {
                    step === 2 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Summary of Selection */}
                            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-6 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 text-brand-blue flex items-center justify-center">
                                        <Plane className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                                            {flightForm.fromCode || "Origin"} <ArrowRightLeft className="w-3 h-3 text-slate-400" /> {flightForm.toCode || "Dest"}
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            {new Date(flightForm.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} • {flightForm.adults + flightForm.children} Traveller(s)
                                        </div>
                                    </div>
                                </div>
                                <button type="button" onClick={() => setStep(1)} className="text-xs font-bold text-brand-blue hover:underline">
                                    Edit
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                {/* Name */}
                                <div className="relative group bg-white border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-brand-blue/20 transition-all">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-brand-blue transition-colors pointer-events-none" />
                                    <input
                                        name="name" required
                                        value={flightForm.name}
                                        onChange={(e) => setFlightForm(p => ({ ...p, name: e.target.value }))}
                                        className="w-full h-14 pr-4 bg-transparent outline-none text-[15px] font-semibold text-slate-800 placeholder:text-slate-400 rounded-xl"
                                        style={{ paddingLeft: '60px' }}
                                        placeholder="Passenger Name"
                                        autoFocus
                                    />
                                </div>

                                {/* Phone */}
                                <div className="relative group bg-white border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-brand-blue/20 transition-all">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-brand-blue transition-colors pointer-events-none" />
                                    <input
                                        name="phone" required
                                        value={flightForm.phone}
                                        onChange={(e) => { const v = e.target.value.replace(/\D/g, ''); if (v.length <= 12) setFlightForm(p => ({ ...p, phone: v })); }}
                                        className="w-full h-14 pr-4 bg-transparent outline-none text-[15px] font-semibold text-slate-800 placeholder:text-slate-400 rounded-xl"
                                        style={{ paddingLeft: '60px' }}
                                        placeholder="Mobile Number"
                                    />
                                </div>
                            </div>

                            <p className="text-xs text-slate-400 text-center mb-4">
                                We'll send the best flight options to your contact details.
                            </p>

                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full h-14 bg-brand-blue hover:bg-brand-blue-hover text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <> View Flight Prices <ArrowRight className="w-5 h-5" /> </>}
                            </button>

                            {/* Hidden Inputs for Server Action */}
                            <input type="hidden" name="tripType" value={flightForm.tripType} />
                            <input type="hidden" name="from" value={flightForm.from} />
                            <input type="hidden" name="to" value={flightForm.to} />
                            <input type="hidden" name="date" value={flightForm.date} />
                            <input type="hidden" name="return_date" value={flightForm.return_date || ""} />
                            <input type="hidden" name="adults" value={flightForm.adults} />
                            <input type="hidden" name="children" value={flightForm.children} />
                        </div>
                    )
                }

            </form >
        </>
    );
}
