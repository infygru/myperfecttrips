"use client";

import React, { useState } from "react";
import { Phone, ChevronDown, CheckCircle, AlertCircle, FileText, Calendar } from "lucide-react";

export default function SchengenVisaForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [phoneError, setPhoneError] = useState("");

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, ""); // Remove non-digits
        if (value.length <= 12) {
            e.target.value = value;
            setPhoneError("");
        } else {
            e.target.value = value.slice(0, 12);
        }
    };

    const handlePhoneBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.length > 0 && (value.length < 10 || value.length > 12)) {
            setPhoneError("Please input valid mobile number");
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setIsSubmitting(false);
        setIsSuccess(true);
    };

    if (isSuccess) {
        return (
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center animate-in fade-in zoom-in-95 duration-500 border border-green-100">
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-12 h-12 text-green-500" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">Enquiry Received!</h3>
                <p className="text-slate-600 mb-8 max-w-sm mx-auto">
                    Our specialized Visa Team will review your details and contact you within 2 hours to discuss your Spain appointment.
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-blue-600/20"
                >
                    Submit Another Enquiry
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 border border-slate-100 relative overflow-hidden">
            {/* Decorative Top Bar */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 via-yellow-400 to-red-500 opacity-80" />

            <div className="mb-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Book Visa Appointment</h3>
                <p className="text-slate-500 text-sm">Fast-track Spain appointments available now.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Fields */}
                <div className="grid md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">First Name</label>
                        <input required name="first_name" type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all placeholder:text-slate-300" placeholder="John" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Last Name</label>
                        <input required name="last_name" type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all placeholder:text-slate-300" placeholder="Doe" />
                    </div>
                </div>

                {/* Contact Fields */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                    <input required name="email" type="email" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all placeholder:text-slate-300" placeholder="john@example.com" />
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
                            className={`w-full bg-slate-50 border rounded-xl px-4 py-3 pl-11 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 transition-all ${phoneError ? "border-red-500 focus:ring-red-200" : "border-slate-200 focus:ring-blue-600/20 focus:border-blue-600"}`}
                        />
                    </div>
                    {phoneError && <p className="text-[10px] text-red-500 ml-1 font-bold">{phoneError}</p>}
                </div>

                {/* Visa Specific Fields */}
                <div className="grid md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Appointment Center</label>
                        <div className="relative">
                            <select required name="center" defaultValue="" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all appearance-none cursor-pointer">
                                <option value="" disabled>Select Center</option>
                                <option value="London">London (BLS)</option>
                                <option value="Manchester">Manchester (BLS)</option>
                                <option value="Edinburgh">Edinburgh (BLS)</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Travel Date (Approx)</label>
                        <div className="relative">
                            <Calendar className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                            <input required name="travel_date" type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pl-11 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all cursor-pointer" />
                        </div>
                    </div>
                </div>

                <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 flex gap-3 text-amber-800 text-xs leading-relaxed">
                    <AlertCircle className="w-5 h-5 shrink-0 text-amber-600" />
                    <p>
                        <strong>Note:</strong> Premium appointments for Spain are currently in high demand. We recommend booking at least 15-20 days in advance of your intended travel.
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-slate-900 hover:bg-black text-white font-bold text-lg py-4 rounded-xl shadow-xl shadow-slate-900/20 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isSubmitting ? (
                        <>Processing...</>
                    ) : (
                        <>Check Availability <FileText className="w-5 h-5 opacity-80" /></>
                    )}
                </button>
            </form>
        </div>
    );
}
