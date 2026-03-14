"use client";

import { useState } from "react";
import { submitServiceInquiryAction } from "@/actions/serviceInquiry";
import { Send, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

interface Props {
    serviceType: string;
    isCorporate?: boolean;
    darkMode?: boolean;
}

export default function ServiceLeadForm({ serviceType, isCorporate = false, darkMode = false }: Props) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const inputClass = darkMode
        ? "w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all border border-white/10 bg-white/5 text-white placeholder-white/30 focus:border-white/30 focus:ring-2 focus:ring-white/10 disabled:opacity-50"
        : "w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all border border-stone-200 bg-white text-stone-800 placeholder-stone-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-400/10 disabled:opacity-50";

    const labelClass = `text-[10px] font-bold uppercase tracking-widest block mb-1.5 ${darkMode ? "text-white/40" : "text-stone-500"}`;

    async function clientAction(formData: FormData) {
        setIsSubmitting(true);
        setStatus("idle");
        setErrorMessage("");
        try {
            const result = await submitServiceInquiryAction(formData);
            if (result.success) setStatus("success");
            else { setStatus("error"); setErrorMessage(result.error || "Submission failed."); }
        } catch {
            setStatus("error");
            setErrorMessage("An unexpected error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    }

    if (status === "success") {
        return (
            <div className={`rounded-2xl p-8 text-center ${darkMode ? "bg-white/5 border border-white/10" : "bg-brand-50 border border-brand-100"}`}>
                <div className={`flex h-14 w-14 mx-auto mb-4 items-center justify-center rounded-full ${darkMode ? "bg-white/10" : "bg-brand-100"}`}>
                    <CheckCircle2 className={`h-7 w-7 ${darkMode ? "text-gold-400" : "text-brand-700"}`} />
                </div>
                <h4 className={`font-serif text-xl font-medium mb-2 ${darkMode ? "text-white" : "text-brand-950"}`}>Enquiry Received!</h4>
                <p className={`text-sm mb-4 ${darkMode ? "text-white/50" : "text-stone-500"}`}>
                    Our team will reach out within 24 hours.
                </p>
                <button onClick={() => setStatus("idle")} className={`text-sm font-semibold hover:underline ${darkMode ? "text-gold-400" : "text-brand-700"}`}>
                    Submit another enquiry
                </button>
            </div>
        );
    }

    return (
        <form action={clientAction} className="space-y-3">
            <input type="hidden" name="service_type" value={serviceType} />

            {status === "error" && (
                <div className="p-3 rounded-xl flex items-start gap-2 text-sm bg-red-500/10 border border-red-500/20 text-red-400">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <p>{errorMessage}</p>
                </div>
            )}

            <div>
                <label className={labelClass}>Full Name *</label>
                <input type="text" name="name" required disabled={isSubmitting} className={inputClass} placeholder="Your full name" />
            </div>
            <div>
                <label className={labelClass}>Email Address *</label>
                <input type="email" name="email" required disabled={isSubmitting} className={inputClass} placeholder="your@email.com" />
            </div>
            <div>
                <label className={labelClass}>Phone Number</label>
                <input type="tel" name="phone" disabled={isSubmitting} className={inputClass} placeholder="+91 98765 43210" />
            </div>
            {isCorporate && (
                <div>
                    <label className={labelClass}>Company Name</label>
                    <input type="text" name="company_name" disabled={isSubmitting} className={inputClass} placeholder="Your company" />
                </div>
            )}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className={labelClass}>Participants</label>
                    <input type="number" name="num_people" min="1" disabled={isSubmitting} className={inputClass} placeholder="10" />
                </div>
                <div>
                    <label className={labelClass}>Preferred Date</label>
                    <input type="date" name="preferred_date" disabled={isSubmitting} className={inputClass} />
                </div>
            </div>
            <div>
                <label className={labelClass}>Requirements</label>
                <textarea
                    name="message"
                    disabled={isSubmitting}
                    className={`${inputClass} resize-none`}
                    rows={3}
                    placeholder="Tell us about your requirements..."
                />
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gold-400 px-6 py-3 text-sm font-bold text-stone-950 transition-all hover:bg-gold-500 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
            >
                {isSubmitting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
                ) : (
                    <><Send className="w-4 h-4" /> Send Enquiry</>
                )}
            </button>

            <p className={`text-center text-[10px] ${darkMode ? "text-white/25" : "text-stone-400"}`}>
                We respond within 24 hours · No spam, ever
            </p>
        </form>
    );
}
