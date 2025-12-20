"use client";

import { useState } from "react";
import { User, Phone, Calendar, ArrowRight, ShieldCheck, CheckCircle, Loader2, Users } from "lucide-react";
import { createItem } from "@directus/sdk";
import directus from "@/lib/directus/client";

export default function EnquiryForm({ 
  packageTitle, 
  price 
}: { 
  packageTitle: string; 
  price: number 
}) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    travel_date: "",
    adults: "2",
    kids: "0"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await directus.request(createItem("package_enquiries", {
        name: formData.name,
        phone: formData.phone,
        travel_date: formData.travel_date,
        adults: parseInt(formData.adults),
        kids: parseInt(formData.kids),
        package_name: packageTitle, 
      }));
      setSuccess(true);
    } catch (error) {
      console.error("Submission error:", error);
      alert("Something went wrong. Please check your connection or call us directly.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-8 text-center">
        <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-slate-900 mb-2">Enquiry Sent!</h3>
        <p className="text-sm text-slate-500 mb-6">Our expert will contact you shortly on <b>{formData.phone}</b>.</p>
        <button onClick={() => setSuccess(false)} className="text-blue-600 font-bold text-sm hover:underline">Send another enquiry</button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
      <div className="p-6 bg-slate-50/80 border-b border-slate-100">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Package Price</p>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-extrabold text-slate-900">£{price}</span>
          <span className="text-sm text-slate-500 font-medium">/ person</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input required type="text" placeholder="Your Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 pl-10 text-sm focus:ring-2 focus:ring-blue-600 outline-none" />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase">Contact Number</label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input required type="tel" placeholder="Mobile Number" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 pl-10 text-sm focus:ring-2 focus:ring-blue-600 outline-none" />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase">Travel Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input required type="date" value={formData.travel_date} onChange={(e) => setFormData({...formData, travel_date: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 pl-10 text-sm focus:ring-2 focus:ring-blue-600 outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Adults</label>
            <select value={formData.adults} onChange={(e) => setFormData({...formData, adults: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-600 outline-none">
              {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Adult{n>1?'s':''}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Kids</label>
            <select value={formData.kids} onChange={(e) => setFormData({...formData, kids: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-600 outline-none">
              {[0,1,2,3,4].map(n => <option key={n} value={n}>{n} Kid{n!==1?'s':''}</option>)}
            </select>
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-red-600/20 transition-all flex items-center justify-center gap-2">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Enquire Now <ArrowRight className="w-4 h-4" /></>}
        </button>
        <p className="text-[10px] text-center text-slate-400 mt-2"><ShieldCheck className="w-3 h-3 inline mr-1" />Best Price Guaranteed. No booking fees.</p>
      </form>
    </div>
  );
}