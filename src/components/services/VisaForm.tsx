"use client";

import { useState } from "react";
import directus from "@/lib/directus/client";
import { createItem } from "@directus/sdk";
import { Loader2 } from "lucide-react";

export default function VisaForm() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    
    const fd = new FormData(e.currentTarget);
    const payload = {
      full_name: fd.get("name"),
      people_count: fd.get("people"),
      destination: fd.get("destination"),
      travel_date: fd.get("date"),
      phone: fd.get("phone"),
      type: "Schengen Visa"
    };

    try {
      // Sending to package_enquiries
      await directus.request(createItem("package_enquiries", payload));
      setSent(true);
    } catch (err) {
      alert("Error sending request. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) return (
    <div className="text-center py-10 text-green-600 font-bold">
      Thank you! Our visa experts will call you shortly.
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <input required name="name" type="text" placeholder="Full Name" className="w-full border border-slate-200 rounded-xl px-5 py-4 text-slate-900 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" />
      
      <div className="grid grid-cols-2 gap-4">
        <input required name="people" type="number" placeholder="No. of People" className="w-full border border-slate-200 rounded-xl px-5 py-4 text-slate-900 outline-none" />
        <select required name="destination" className="w-full border border-slate-200 rounded-xl px-5 py-4 text-slate-500 outline-none bg-white">
          <option value="Spain">Spain</option>
          <option value="France">France</option>
          <option value="Italy">Italy</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Travel Date</label>
          <input required name="date" type="date" className="w-full border border-slate-200 rounded-xl px-5 py-4 text-slate-500 outline-none" />
        </div>
        <div className="flex flex-col justify-end">
           <input required name="phone" type="tel" placeholder="Phone Number" className="w-full border border-slate-200 rounded-xl px-5 py-4 text-slate-900 outline-none" />
        </div>
      </div>

      <button 
        disabled={loading}
        className="w-full bg-gradient-to-r from-[#2563eb] to-[#38bdf8] text-white font-bold py-5 rounded-xl shadow-lg hover:opacity-90 transition-all flex items-center justify-center"
      >
        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Check Availability"}
      </button>
    </form>
  );
}