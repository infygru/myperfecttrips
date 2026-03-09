"use client";

import { useState } from "react";
import { directus } from "@/lib/directus";
import { createItem } from "@directus/sdk";
import { Send, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

const inputCls = `
  w-full px-4 py-3 rounded-xl outline-none transition-all disabled:opacity-50
  border border-[#EEE0C0] bg-[#FDFAF4] text-[#1A120B] placeholder-[#A08060]
  focus:border-[#4A6741] focus:ring-2 focus:ring-[#4A6741]/20
`;

export default function ContactForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus("idle");
        setErrorMessage("");
        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            phone: formData.get("phone") as string,
            message: formData.get("message") as string,
        };
        try {
            await directus.request(createItem("enquiries", data));
            setStatus("success");
            (e.target as HTMLFormElement).reset();
        } catch (error: unknown) {
            console.error("Form submission error:", error);
            setStatus("error");
            const err = error as Error;
            setErrorMessage(err.message || "Failed to submit. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    if (status === "success") {
        return (
            <div className="rounded-3xl p-8 text-center" style={{ background: "#EDF4EB", border: "1px solid #C6D9C2" }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "#D4EAD0" }}>
                    <CheckCircle2 className="w-8 h-8" style={{ color: "#3A5332" }} />
                </div>
                <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-cormorant), Georgia, serif", color: "#1A120B" }}>
                    Message Sent!
                </h3>
                <p className="mb-4" style={{ color: "#6B4F3A" }}>
                    Thank you for reaching out — one of our travel experts will be in touch shortly.
                </p>
                <button onClick={() => setStatus("idle")} className="text-sm font-semibold hover:underline" style={{ color: "#3A5332" }}>
                    Send another message
                </button>
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-3xl p-8 lg:p-10 relative"
            style={{ background: "#FDFAF4", border: "1px solid #EEE0C0", boxShadow: "0 12px 48px rgba(26,18,11,0.08)" }}
        >
            <h3 className="font-bold mb-6" style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "1.8rem", color: "#1A120B" }}>
                Start Planning Your Trip
            </h3>

            {status === "error" && (
                <div className="mb-5 p-4 rounded-xl flex items-start gap-3" style={{ background: "#FBF0EA", border: "1px solid #E07B54", color: "#A84B21" }}>
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <p className="text-sm font-medium">{errorMessage}</p>
                </div>
            )}

            <div className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                    <div>
                        <label htmlFor="name" className="text-xs font-bold uppercase tracking-widest block mb-1.5" style={{ color: "#6B4F3A" }}>
                            Full Name <span style={{ color: "#C8602E" }}>*</span>
                        </label>
                        <input type="text" id="name" name="name" required disabled={isSubmitting} className={inputCls} placeholder="John Doe" />
                    </div>
                    <div>
                        <label htmlFor="phone" className="text-xs font-bold uppercase tracking-widest block mb-1.5" style={{ color: "#6B4F3A" }}>
                            Phone Number
                        </label>
                        <input type="tel" id="phone" name="phone" disabled={isSubmitting} className={inputCls} placeholder="+91 98765 43210" />
                    </div>
                </div>

                <div>
                    <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest block mb-1.5" style={{ color: "#6B4F3A" }}>
                        Email Address <span style={{ color: "#C8602E" }}>*</span>
                    </label>
                    <input type="email" id="email" name="email" required disabled={isSubmitting} className={inputCls} placeholder="john@example.com" />
                </div>

                <div>
                    <label htmlFor="message" className="text-xs font-bold uppercase tracking-widest block mb-1.5" style={{ color: "#6B4F3A" }}>
                        Destination / Requirements <span style={{ color: "#C8602E" }}>*</span>
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        required
                        rows={4}
                        disabled={isSubmitting}
                        className={inputCls + " resize-none"}
                        placeholder="Tell us your dream destination, dates, and any special wishes..."
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group text-base"
                >
                    {isSubmitting ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</>
                    ) : (
                        <>Send Enquiry <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                    )}
                </button>
            </div>
        </form>
    );
}
