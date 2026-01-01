"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { POPULAR_AIRPORTS, Airport } from "@/lib/airports";
import {
  Plane,
  Globe,
  MapPin,
  Calendar,
  Search,
  CreditCard,
  ChevronDown,
  ArrowRight,
  Check,
} from "lucide-react";

export default function HeroClient({ data }: { data: any }) {
  const router = useRouter();
  const [activeTab, setActiveTab] =
    useState<"flights" | "packages">("packages");

  /* ---------------- FLIGHT STATE ---------------- */
  const [flightForm, setFlightForm] = useState({
    from: "",
    fromCode: "",
    to: "",
    toCode: "",
    date: "",
  });
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);

  // Filtered Suggestions
  const fromSuggestions = POPULAR_AIRPORTS.filter(a =>
    a.city.toLowerCase().includes(flightForm.from.toLowerCase()) ||
    a.code.toLowerCase().includes(flightForm.from.toLowerCase()) ||
    a.name.toLowerCase().includes(flightForm.from.toLowerCase())
  ).slice(0, 5);

  const toSuggestions = POPULAR_AIRPORTS.filter(a =>
    a.city.toLowerCase().includes(flightForm.to.toLowerCase()) ||
    a.code.toLowerCase().includes(flightForm.to.toLowerCase()) ||
    a.name.toLowerCase().includes(flightForm.to.toLowerCase())
  ).slice(0, 5);

  const handleSelectAirport = (type: 'from' | 'to', airport: Airport) => {
    if (type === 'from') {
      setFlightForm(prev => ({ ...prev, from: `${airport.city} (${airport.code})`, fromCode: airport.code }));
      setShowFromSuggestions(false);
    } else {
      setFlightForm(prev => ({ ...prev, to: `${airport.city} (${airport.code})`, toCode: airport.code }));
      setShowToSuggestions(false);
    }
  };

  // Close suggestions on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (fromRef.current && !fromRef.current.contains(event.target as Node)) {
        setShowFromSuggestions(false);
      }
      if (toRef.current && !toRef.current.contains(event.target as Node)) {
        setShowToSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------------- PACKAGE STATE ---------------- */
  const [packageQuery, setPackageQuery] = useState("");
  const [packageBudget, setPackageBudget] = useState("Any Budget");
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);

  const budgetOptions = ["Any Budget", "£500 - £1000", "£1000 - £2000", "£2000+"];
  const budgetRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (budgetRef.current && !budgetRef.current.contains(event.target as Node)) {
        setIsBudgetOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------------- BACKGROUND MEDIA ---------------- */
  const renderBackgroundMedia = () => {
    const videoObj = data?.background_video;
    const videoId = typeof videoObj === "object" ? videoObj?.id : videoObj;

    const imageObj = data?.background_image;
    let imageUrl = "";

    if (typeof imageObj === "object" && imageObj?.id) {
      imageUrl = `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${imageObj.id}`;
    } else if (typeof imageObj === "string") {
      imageUrl = imageObj.startsWith("http")
        ? imageObj
        : `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${imageObj}`;
    }

    const videoUrl = videoId
      ? `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${videoId}`
      : null;

    if (videoUrl) {
      return (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      );
    }

    return (
      <Image
        src={imageUrl}
        alt="Hero Background"
        fill
        priority
        className="object-cover"
      />
    );
  };

  /* ---------------- ACTIONS ---------------- */
  /* ---------------- ACTIONS ---------------- */
  const handleFlightSearch = () => {
    // Construct Skyscanner URL: https://www.skyscanner.net/transport/flights/{origin}/{destination}/{date}
    // Date format needed: YYMMDD usually, but Skyscanner handles YYYY-MM-DD standard format well in paths too active
    // Let's use the format: /transport/flights/lond/nyca/240502/ (YYMMDD)

    // Fallback if no code selected (use the text input) - simpler for implementation to try generic search or just alert
    const origin = flightForm.fromCode || flightForm.from;
    const dest = flightForm.toCode || flightForm.to;
    const date = flightForm.date ? new Date(flightForm.date).toISOString().slice(2, 10).replace(/-/g, '') : ""; // YYMMDD

    if (!origin || !dest) return;

    // Direct linking format
    const url = `https://www.skyscanner.net/transport/flights/${origin.toLowerCase()}/${dest.toLowerCase()}/${date}`;
    window.open(url, '_blank');
  };

  const handlePackageSearch = () => {
    const params = new URLSearchParams();
    if (packageQuery) params.set("search", packageQuery);
    if (packageBudget && packageBudget !== "Any Budget") params.set("budget", packageBudget);
    router.push(`/packages?${params.toString()}`);
  };

  /* ---------------- CONTENT ---------------- */
  const title = data?.title || "Discover the World,<br/>Your Way";
  const description =
    data?.description ||
    "Manchester's premier travel consultancy. From seamless Schengen visas to luxury bespoke itineraries.";
  const ratingsText = data?.ratings_text || "Rated 4.9/5 by Travellers";

  return (
    <section className="relative min-h-screen w-full overflow-hidden flex flex-col justify-center pt-32 pb-20">
      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0">
        {renderBackgroundMedia()}
        {/* Lux gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-black/70" />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 w-full h-full flex flex-col justify-center">
        <div className="container mx-auto px-4">

          {/* HERO TEXT */}
          <div className="text-center mb-12 animate-in slide-in-from-bottom-8 duration-700 fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs md:text-sm font-medium mb-8 shadow-xl ring-1 ring-white/10">
              <span className="text-amber-400 drop-shadow-sm">★</span> {ratingsText}
            </div>

            <h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-6 drop-shadow-2xl"
              dangerouslySetInnerHTML={{ __html: title }}
            />

            <div
              className="text-lg md:text-xl text-slate-100 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-lg opacity-90"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </div>

          {/* ================= PREMIUM SEARCH WIDGET ('GLOSSY PILLS') ================= */}
          <div className="max-w-5xl mx-auto">

            {/* TABS - GLOSSY FLOATING PILLS */}
            <div className="flex justify-center mb-6">
              <div className="bg-white/10 backdrop-blur-md p-1.5 rounded-full border border-white/20 inline-flex shadow-2xl relative z-20 ring-1 ring-white/10">
                {[
                  { key: "packages", icon: Globe, label: "Holidays" },
                  { key: "flights", icon: Plane, label: "Flights" },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key as any)}
                      className={`flex items-center gap-2.5 px-6 py-2.5 rounded-full text-sm md:text-base font-bold transition-all duration-500
                        ${isActive
                          ? "bg-white text-slate-900 shadow-lg scale-100"
                          : "text-white/80 hover:text-white hover:bg-white/10"
                        }`}
                    >
                      <Icon className={`w-4 h-4 md:w-5 md:h-5 ${isActive ? "text-brand-blue" : "text-current"}`} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* MAIN SEARCH CARD */}
            <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] p-2 animate-in fade-in slide-in-from-bottom-4 duration-500 ring-1 ring-white/50 backdrop-blur-sm">
              <div className="bg-white rounded-[1.5rem] border border-slate-100 p-6 md:p-8">

                {/* FLIGHTS FORM */}
                {activeTab === "flights" && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-y-4 md:gap-y-0 items-center">

                    {/* FROM */}
                    <div className="md:col-span-3 md:pr-6 relative group" ref={fromRef}>
                      <label className="text-[10px] md:text-[11px] uppercase tracking-[0.15em] font-bold text-slate-400 mb-2 block transition-colors group-hover:text-brand-blue">
                        From
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-hover:text-slate-800 transition-colors" />
                        <input
                          value={flightForm.from}
                          onChange={(e) => {
                            setFlightForm({ ...flightForm, from: e.target.value, fromCode: "" });
                            setShowFromSuggestions(true);
                          }}
                          onFocus={() => setShowFromSuggestions(true)}
                          placeholder="City or Airport"
                          className="w-full pl-8 text-base md:text-lg font-bold text-slate-800 placeholder:text-slate-400 outline-none bg-transparent group-hover:placeholder:text-brand-blue transition-all"
                        />
                      </div>
                      <div className="absolute right-0 top-2 bottom-2 w-px bg-slate-100 hidden md:block" />

                      {/* Suggestions Dropdown */}
                      {showFromSuggestions && flightForm.from.length > 0 && (
                        <div className="absolute top-full left-0 w-full md:w-[250px] bg-white rounded-xl shadow-xl border border-slate-100 mt-2 z-50 overflow-hidden max-h-60 overflow-y-auto">
                          {fromSuggestions.length > 0 ? (
                            fromSuggestions.map((airport) => (
                              <button
                                key={airport.code}
                                onClick={() => handleSelectAirport('from', airport)}
                                className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50 border-b border-slate-50 last:border-0 transition-colors flex items-center justify-between group/item"
                              >
                                <div>
                                  <span className="font-bold text-slate-700 block">{airport.city}</span>
                                  <span className="text-xs text-slate-400">{airport.name}</span>
                                </div>
                                <span className="text-xs font-black bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded group-hover/item:bg-brand-blue group-hover/item:text-white transition-colors">{airport.code}</span>
                              </button>
                            ))
                          ) : (
                            <div className="px-4 py-3 text-xs text-slate-400 italic">No airports found</div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* TO */}
                    <div className="md:col-span-3 md:px-6 relative group pt-4 md:pt-0" ref={toRef}>
                      <label className="text-[10px] md:text-[11px] uppercase tracking-[0.15em] font-bold text-slate-400 mb-2 block transition-colors group-hover:text-brand-blue">
                        To
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-hover:text-slate-800 transition-colors" />
                        <input
                          value={flightForm.to}
                          onChange={(e) => {
                            setFlightForm({ ...flightForm, to: e.target.value, toCode: "" });
                            setShowToSuggestions(true);
                          }}
                          onFocus={() => setShowToSuggestions(true)}
                          placeholder="Destination"
                          className="w-full pl-8 text-base md:text-lg font-bold text-slate-800 placeholder:text-slate-400 outline-none bg-transparent group-hover:placeholder:text-brand-blue transition-all"
                        />
                      </div>
                      <div className="absolute right-0 top-2 bottom-2 w-px bg-slate-100 hidden md:block" />

                      {/* Suggestions Dropdown */}
                      {showToSuggestions && flightForm.to.length > 0 && (
                        <div className="absolute top-full left-0 w-full md:w-[250px] bg-white rounded-xl shadow-xl border border-slate-100 mt-2 z-50 overflow-hidden max-h-60 overflow-y-auto">
                          {toSuggestions.length > 0 ? (
                            toSuggestions.map((airport) => (
                              <button
                                key={airport.code}
                                onClick={() => handleSelectAirport('to', airport)}
                                className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50 border-b border-slate-50 last:border-0 transition-colors flex items-center justify-between group/item"
                              >
                                <div>
                                  <span className="font-bold text-slate-700 block">{airport.city}</span>
                                  <span className="text-xs text-slate-400">{airport.name}</span>
                                </div>
                                <span className="text-xs font-black bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded group-hover/item:bg-brand-blue group-hover/item:text-white transition-colors">{airport.code}</span>
                              </button>
                            ))
                          ) : (
                            <div className="px-4 py-3 text-xs text-slate-400 italic">No airports found</div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* DATE */}
                    <div
                      className="md:col-span-3 md:px-6 relative group pt-4 md:pt-0 cursor-pointer"
                      onClick={() => dateRef.current?.showPicker()}
                    >
                      <label className="text-[10px] md:text-[11px] uppercase tracking-[0.15em] font-bold text-slate-400 mb-2 block transition-colors group-hover:text-blue-600 cursor-pointer">
                        Departure
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-hover:text-slate-800 transition-colors pointer-events-none" />
                        <input
                          ref={dateRef}
                          type="date"
                          value={flightForm.date}
                          onChange={(e) => setFlightForm({ ...flightForm, date: e.target.value })}
                          className="w-full pl-8 text-base md:text-lg font-bold text-slate-800 outline-none bg-transparent cursor-pointer [&::-webkit-calendar-picker-indicator]:hidden"
                        />
                      </div>
                    </div>

                    {/* SUBMIT BUTTON */}
                    <div className="md:col-span-3 md:pl-6 pt-6 md:pt-0">
                      <button
                        onClick={handleFlightSearch}
                        className="w-full h-16 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-lg shadow-xl shadow-slate-900/20 hover:shadow-2xl hover:shadow-slate-900/30 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-3 group"
                      >
                        Search
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                          <ArrowRight className="w-4 h-4 text-white" />
                        </div>
                      </button>
                    </div>
                  </div>
                )}


                {/* PACKAGES FORM */}
                {activeTab === "packages" && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-y-4 md:gap-y-0 items-center">

                    {/* DESTINATION */}
                    <div className="md:col-span-5 md:pr-8 relative group">
                      <label className="text-[10px] md:text-[11px] uppercase tracking-[0.15em] font-bold text-slate-400 mb-2 block transition-colors group-hover:text-brand-blue">
                        Where to?
                      </label>
                      <div className="relative">
                        <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300 group-hover:text-slate-800 transition-colors" />
                        <input
                          value={packageQuery}
                          onChange={(e) => setPackageQuery(e.target.value)}
                          placeholder="Explore Destinations"
                          className="w-full pl-10 text-base md:text-lg font-bold text-slate-800 placeholder:text-slate-800 outline-none bg-transparent placeholder-shown:text-ellipsis group-hover:placeholder:text-brand-blue transition-all"
                        />
                      </div>
                      <div className="absolute right-0 top-2 bottom-2 w-px bg-slate-100 hidden md:block" />
                      <div className="absolute left-0 right-0 bottom-0 h-px bg-slate-100 md:hidden" />
                    </div>

                    {/* BUDGET (CUSTOM DROPDOWN) */}
                    <div className="md:col-span-4 md:px-8 relative group pt-4 md:pt-0" ref={budgetRef}>
                      <label className="text-[10px] md:text-[11px] uppercase tracking-[0.15em] font-bold text-slate-400 mb-2 block transition-colors group-hover:text-brand-blue">
                        Budget
                      </label>
                      <div className="relative">
                        <CreditCard className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-hover:text-slate-800 transition-colors" />

                        {/* Trigger Button */}
                        <button
                          type="button"
                          onClick={() => setIsBudgetOpen(!isBudgetOpen)}
                          className="w-full pl-9 text-left text-base md:text-lg font-bold text-slate-800 outline-none bg-transparent py-1 flex items-center justify-between group/btn"
                        >
                          <span className="truncate">{packageBudget}</span>
                          <ChevronDown className={`w-5 h-5 text-slate-300 transition-transform duration-300 ${isBudgetOpen ? "rotate-180 text-brand-blue" : "group-hover/btn:text-slate-500"}`} />
                        </button>

                        {/* Dropdown Menu */}
                        <div className={`absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-2xl ring-1 ring-black/5 overflow-hidden origin-top transition-all duration-200 z-50 ${isBudgetOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"}`}>
                          <div className="py-2">
                            {budgetOptions.map((option) => (
                              <button
                                key={option}
                                onClick={() => {
                                  setPackageBudget(option);
                                  setIsBudgetOpen(false);
                                }}
                                className={`w-full text-left px-6 py-3 text-xs md:text-sm font-bold transition-colors flex items-center justify-between
                                  ${packageBudget === option
                                    ? "bg-brand-light text-brand-blue"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                  }`}
                              >
                                {option}
                                {packageBudget === option && <Check className="w-4 h-4 ml-2" />}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SUBMIT BUTTON */}
                    <div className="md:col-span-3 md:pl-2 pt-6 md:pt-0 flex justify-end">
                      <button
                        onClick={handlePackageSearch}
                        className="w-full h-16 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white font-bold text-lg shadow-xl shadow-brand-blue/20 hover:shadow-2xl hover:shadow-brand-blue/30 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-3 group"
                      >
                        Explore
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                          <ArrowRight className="w-4 h-4 text-white" />
                        </div>
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
          {/* ================= END SEARCH WIDGET ================= */}

        </div>
      </div>
    </section>
  );
}
