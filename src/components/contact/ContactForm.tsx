"use client";

import { useActionState, useState } from "react";
import { Send, Loader2, Phone, ChevronDown } from "lucide-react";
import { submitGeneralEnquiry } from "@/app/actions/enquiry";

export default function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitGeneralEnquiry, null);
  const [phoneError, setPhoneError] = useState("");

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
      <div className="text-center py-10">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <div className="w-10 h-10 bg-green-500 rounded-full" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Message Sent!</h3>
        <p className="text-slate-500">Our team will get back to you within 24 hours.</p>
        <button onClick={() => window.location.reload()} className="mt-8 text-blue-600 font-bold text-xs uppercase tracking-widest">Send another message</button>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      {/* Honeypot Field (Spam Protection) */}
      <input type="text" name="website_url" className="opacity-0 absolute -z-10 h-0 w-0" tabIndex={-1} autoComplete="off" />

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">First Name</label>
          <input required name="first_name" type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600/50 transition-all" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Last Name</label>
          <input required name="last_name" type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600/50 transition-all" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
        <input required name="email" type="email" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600/50 transition-all" />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</label>
        <div className="relative">
          <Phone className={`absolute left-4 top-3.5 w-4 h-4 ${phoneError ? "text-red-500" : "text-slate-400"}`} />
          <input
            required
            name="phone"
            type="tel"
            placeholder="Mobile Number"
            onChange={handlePhoneChange}
            onBlur={handlePhoneBlur}
            className={`w-full bg-slate-50 border rounded-xl px-4 py-3 pl-11 text-sm focus:outline-none focus:ring-1 transition-all ${phoneError ? "border-red-500 focus:ring-red-200" : "border-slate-200 focus:ring-blue-600/50"}`}
          />
        </div>
        {phoneError && <p className="text-[10px] text-red-500 ml-1 font-bold">{phoneError}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Service Required</label>
        <div className="relative">
          <select required name="service_type" defaultValue="" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600/50 transition-all appearance-none cursor-pointer">
            <option value="" disabled>Select a Service</option>
            <option value="Holiday Package">Holiday Package</option>
            <option value="Flight Booking">Flight Booking</option>
            <option value="Hotel Booking">Hotel Booking</option>
            <option value="Visa Assistance">Visa Assistance</option>
            <option value="Other">Other</option>
          </select>
          <div className="absolute right-4 top-3.5 pointer-events-none">
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Your Message</label>
        <textarea required name="message" rows={4} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600/50 transition-all resize-none" />
      </div>

      {state?.message && !state.success && (
        <p className="text-red-500 text-sm text-center font-bold">{state.message}</p>
      )}

      <button
        disabled={isPending}
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all disabled:opacity-70 group"
      >
        {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : (
          <>
            <span className="text-xs uppercase tracking-[0.2em]">Send Enquiry</span>
            <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </>
        )}
      </button>
    </form>
  );
}