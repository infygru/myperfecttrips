"use client";

import { useActionState, useEffect, useState } from "react";
import { User, Phone, Calendar, ArrowRight, ShieldCheck, CheckCircle, Loader2, ChevronDown, Plane, MapPin } from "lucide-react";
import { submitPackageEnquiry } from "@/app/actions/enquiry";

export default function EnquiryForm({
  packageTitle,
  price,
  priceWithoutFlight
}: {
  packageTitle: string;
  price: number;
  priceWithoutFlight?: number;
}) {
  const [state, formAction, isPending] = useActionState(submitPackageEnquiry, null);
  const [phoneError, setPhoneError] = useState("");
  const [priceType, setPriceType] = useState<"with_flight" | "without_flight">("with_flight");

  const currentPrice = priceType === "with_flight" ? price : (priceWithoutFlight || price);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-digits
    if (value.length <= 12) { // Enforce max length
      e.target.value = value;
      setPhoneError(""); // Clear error while typing valid input
    } else {
      e.target.value = value.slice(0, 12); // Truncate if somehow larger
    }
  };

  const handlePhoneBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > 0 && (value.length < 10 || value.length > 12)) {
      setPhoneError("Please input valid mobile number");
    }
  };

  if (state?.success) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-8 text-center">
        <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-slate-900 mb-2">Enquiry Sent!</h3>
        <p className="text-sm text-slate-500 mb-6">Our expert will contact you shortly.</p>
        <button onClick={() => window.location.reload()} className="text-blue-600 font-bold text-sm hover:underline">Send another enquiry</button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">

      {/* Price Selection - Logic: Two stacked cards */}
      <div className="p-4 space-y-3 border-b border-slate-100">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Select Package Type</p>

        {/* Option 1: With Flight */}
        <div
          onClick={() => setPriceType("with_flight")}
          className={`relative flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${priceType === "with_flight" ? "border-blue-600 bg-blue-50/50" : "border-slate-100 hover:border-slate-200 bg-white"}`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${priceType === "with_flight" ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300 bg-white"}`}>
              {priceType === "with_flight" && <div className="w-2 h-2 rounded-full bg-white" />}
            </div>
            <div>
              <p className={`text-sm font-bold ${priceType === "with_flight" ? "text-blue-900" : "text-slate-700"}`}>With Flight</p>
              <p className="text-[10px] text-slate-500 font-medium">Flight + Hotel + Activities</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Starts from</p>
            <p className="text-xl font-extrabold text-slate-900 leading-none">£{price}<span className="text-[10px] relative -top-2">*</span></p>
            <p className="text-[10px] text-slate-500 font-medium lowercase">per person</p>
          </div>
        </div>

        {/* Option 2: Without Flight (Only if available) */}
        {priceWithoutFlight && (
          <div
            onClick={() => setPriceType("without_flight")}
            className={`relative flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${priceType === "without_flight" ? "border-blue-600 bg-blue-50/50" : "border-slate-100 hover:border-slate-200 bg-white"}`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${priceType === "without_flight" ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300 bg-white"}`}>
                {priceType === "without_flight" && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              <div>
                <p className={`text-sm font-bold ${priceType === "without_flight" ? "text-blue-900" : "text-slate-700"}`}>Without Flight</p>
                <p className="text-[10px] text-slate-500 font-medium">Hotel + Activities Only</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Starts from</p>
              <p className="text-xl font-extrabold text-slate-900 leading-none">£{priceWithoutFlight}<span className="text-[10px] relative -top-2">*</span></p>
              <p className="text-[10px] text-slate-500 font-medium lowercase">per person</p>
            </div>
          </div>
        )}
      </div>

      <form action={formAction} className="p-6 space-y-4">
        {/* Hidden Fields */}
        <input type="hidden" name="package_name" value={packageTitle} />
        <input type="hidden" name="enquiry_type" value={priceType} />
        {/* Honeypot */}
        <input type="text" name="website_url" className="opacity-0 absolute -z-10 h-0 w-0" tabIndex={-1} autoComplete="off" />

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input required name="name" type="text" placeholder="Your Name" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 pl-10 text-sm focus:ring-2 focus:ring-blue-600 outline-none" />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase">Contact Number</label>
          <div className="relative">
            <Phone className={`absolute left-3 top-3 w-4 h-4 ${phoneError ? "text-red-500" : "text-slate-400"}`} />
            <input
              required
              name="phone"
              type="tel"
              placeholder="Mobile Number"
              onChange={handlePhoneChange}
              onBlur={handlePhoneBlur}
              className={`w-full bg-white border rounded-xl px-4 py-2.5 pl-10 text-sm focus:ring-2 outline-none ${phoneError ? "border-red-500 focus:ring-red-200" : "border-slate-200 focus:ring-blue-600"}`}
            />
          </div>
          {phoneError && <p className="text-[10px] text-red-500 ml-1 font-bold">{phoneError}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase">Travel Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              required
              name="travel_date"
              type="date"
              min={new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 pl-10 text-sm focus:ring-2 focus:ring-blue-600 outline-none appearance-none cursor-pointer"
            />
            <p className="text-[10px] text-slate-400 mt-1 ml-1">Must be at least 15 days in advance</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Adults</label>
            <div className="relative">
              <select name="adults" defaultValue="2" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-600 outline-none appearance-none cursor-pointer">
                {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} Adult{n > 1 ? 's' : ''}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Kids</label>
            <div className="relative">
              <select name="kids" defaultValue="0" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-600 outline-none appearance-none cursor-pointer">
                {[0, 1, 2, 3, 4].map(n => <option key={n} value={n}>{n} Kid{n !== 1 ? 's' : ''}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {state?.message && !state.success && (
          <p className="text-red-500 text-xs text-center">{state.message}</p>
        )}

        <button type="submit" disabled={isPending} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-red-600/20 transition-all flex items-center justify-center gap-2">
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Enquire Now <ArrowRight className="w-4 h-4" /></>}
        </button>
        <p className="text-[10px] text-center text-slate-400 mt-2"><ShieldCheck className="w-3 h-3 inline mr-1" />Best Price Guaranteed. No booking fees.</p>
      </form>
    </div>
  );
}
