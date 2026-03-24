"use client";

import { useState } from "react";
import { submitLeadAction } from "@/actions/lead";
import { Send, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

const inputClass = `
  w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all
  disabled:opacity-50
  border border-[#EEE0C0] bg-[#FDFAF4] text-[#1A120B]
  placeholder-[#A08060] focus:border-[#4A6741]
  focus:ring-2 focus:ring-[#4A6741]/20
`;
const labelClass = "text-xs font-bold uppercase tracking-widest block mb-1.5" as const;

export default function LeadForm({ prefilledPackage }: { prefilledPackage?: string }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    async function clientAction(formData: FormData) {
        setIsSubmitting(true);
        setStatus("idle");
        setErrorMessage("");
        try {
            const result = await submitLeadAction(formData);
            if (result.success) {
                setStatus("success");
            } else {
                setStatus("error");
                setErrorMessage(result.error || "Submission failed.");
            }
        } catch {
            setStatus("error");
            setErrorMessage("An unexpected network error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    }

    if (status === "success") {
        return (
            <div className="rounded-2xl p-6 text-center" style={{ background: "#EDF4EB", border: "1px solid #C6D9C2" }}>
                <CheckCircle2 className="w-10 h-10 mx-auto mb-3" style={{ color: "#3A5332" }} />
                <h4 className="text-xl font-bold mb-2" style={{ fontFamily: "var(--font-cormorant), Georgia, serif", color: "#1A120B" }}>
                    Request Received!
                </h4>
                <p className="text-sm mb-4" style={{ color: "#6B4F3A" }}>
                    One of our travel experts will contact you shortly.
                </p>
                <button onClick={() => setStatus("idle")} className="text-sm font-semibold hover:underline" style={{ color: "#3A5332" }}>
                    Submit another request
                </button>
            </div>
        );
    }

    return (
        <form action={clientAction} className="rounded-2xl p-6" style={{ background: "#FDFAF4", border: "1px solid #EEE0C0", boxShadow: "0 8px 32px rgba(26,18,11,0.08)" }}>
            <h4 className="font-bold mb-5" style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "1.4rem", color: "#1A120B" }}>
                Get a Free Quote
            </h4>

            {status === "error" && (
                <div className="mb-4 p-3 rounded-lg flex items-start gap-2 text-sm" style={{ background: "#FBF0EA", border: "1px solid #E07B54", color: "#A84B21" }}>
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <p className="font-medium">{errorMessage}</p>
                </div>
            )}

            <div className="space-y-4">
                <div>
                    <label htmlFor="name" className={labelClass} style={{ color: "#6B4F3A" }}>Name *</label>
                    <input type="text" id="name" name="name" required disabled={isSubmitting} className={inputClass} placeholder="Your full name" />
                </div>
                <div>
                    <label htmlFor="email" className={labelClass} style={{ color: "#6B4F3A" }}>Email *</label>
                    <input type="email" id="email" name="email" required disabled={isSubmitting} className={inputClass} placeholder="your@email.com" />
                </div>
                <div>
                    <label htmlFor="phone" className={labelClass} style={{ color: "#6B4F3A" }}>Phone</label>
                    <input type="tel" id="phone" name="phone" disabled={isSubmitting} className={inputClass} placeholder="+91 98765 43210" />
                </div>

                <input type="hidden" name="package_interest" value={prefilledPackage || "General Enquiry"} />

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label htmlFor="travel_date" className={labelClass} style={{ color: "#6B4F3A" }}>Travel Date</label>
                        <input type="date" id="travel_date" name="travel_date" disabled={isSubmitting} className={inputClass} />
                    </div>
                    <div>
                        <label htmlFor="trip_type" className={labelClass} style={{ color: "#6B4F3A" }}>Trip Type</label>
                        <select id="trip_type" name="trip_type" disabled={isSubmitting} className={inputClass}>
                            <option value="">Select Type</option>
                            <option value="Honeymoon">Honeymoon</option>
                            <option value="Family">Family</option>
                            <option value="Corporate">Corporate</option>
                            <option value="Solo">Solo</option>
                            <option value="Friends">Friends</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label htmlFor="num_adults" className={labelClass} style={{ color: "#6B4F3A" }}>Adults</label>
                        <input type="number" id="num_adults" name="num_adults" min="1" disabled={isSubmitting} className={inputClass} placeholder="2" />
                    </div>
                    <div>
                        <label htmlFor="num_children" className={labelClass} style={{ color: "#6B4F3A" }}>Children</label>
                        <input type="number" id="num_children" name="num_children" min="0" disabled={isSubmitting} className={inputClass} placeholder="0" />
                    </div>
                </div>

                <div>
                    <label htmlFor="budget" className={labelClass} style={{ color: "#6B4F3A" }}>Estimated Budget (£)</label>
                    <select id="budget" name="budget" disabled={isSubmitting} className={inputClass}>
                        <option value="Not Sure">Not Sure</option>
                        <option value="< 50,000">Less than £50,000</option>
                        <option value="50k - 1L">£50,000 – £1,00,000</option>
                        <option value="1L - 3L">£1,00,000 – £3,00,000</option>
                        <option value="3L+">More than £3,00,000</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
                    ) : (
                        <>Request Details <Send className="w-4 h-4" /></>
                    )}
                </button>
            </div>
        </form>
    );
}
