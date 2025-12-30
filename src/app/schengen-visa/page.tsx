import type { Metadata } from "next";
import Navbar from "@/components/layout/Header/Navbar";
import SchengenVisaForm from "@/components/visa/SchengenVisaForm";
import { Check, Clock, FileText, MapPin, ShieldCheck, Plane } from "lucide-react";

export const metadata: Metadata = {
    title: "Spain Visa Appointment London & Manchester | Premium Schengen Visa Services",
    description:
        "Secure your Spain Schengen visa appointment in London or Manchester. Daily slots available. Fast-track processing and expert document assistance.",
    keywords: [
        "Spain visa appointment",
        "Schengen visa Manchester",
        "Spain visa London",
        "BLS appointment Spain",
        "Schengen visa documents",
        "fast track spain visa",
    ],
};

export default function SchengenVisaPage() {
    return (
        <main className="min-h-screen bg-slate-50">
            <Navbar />

            {/* HERO SECTION */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 bg-slate-900 overflow-hidden">
                {/* Abstract Background */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-red-600 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">

                        {/* Left Content */}
                        <div className="text-white pt-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-widest mb-6">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                Daily Appointments Available
                            </div>

                            <h1 className="text-4xl md:text-6xl font-black leading-[1.1] mb-6">
                                Spain Schengen <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500">
                                    Visa Appointment
                                </span>
                            </h1>

                            <p className="text-lg text-slate-300 leading-relaxed mb-10 max-w-xl">
                                Struggling to find a slot? We specialize in securing expedited appointment slots for Spain Schengen visas from <strong>London</strong> and <strong>Manchester</strong>.
                            </p>

                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                                    <MapPin className="w-8 h-8 text-yellow-500 mb-3" />
                                    <h4 className="text-lg font-bold mb-1">London & Manchester</h4>
                                    <p className="text-sm text-slate-400">Primary submission centers handled directly.</p>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                                    <Clock className="w-8 h-8 text-blue-500 mb-3" />
                                    <h4 className="text-lg font-bold mb-1">Fast Processing</h4>
                                    <p className="text-sm text-slate-400">Get your visa in approx 15 calendar days.</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Form */}
                        <div>
                            <SchengenVisaForm />
                        </div>

                    </div>
                </div>
            </section>

            {/* DOCUMENT CHECKLIST SECTION */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Required Documents</h2>
                            <p className="text-slate-500 text-lg">Prepare these essentials for a smooth Spain visa application process.</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {[
                                { title: "Original Passport", desc: "Valid for at least 3 months beyond travel, with 2 blank pages." },
                                { title: "Two Photos", desc: "Recent passport-sized photos (35x45mm) with white background." },
                                { title: "Trip Itinerary", desc: "Confirmed round-trip flight bookings and hotel reservations." },
                                { title: "Travel Insurance", desc: "Minimum coverage of €30,000 for medical emergencies." },
                                { title: "Financial Proof", desc: "Last 3 months bank statements showing sufficient funds." },
                                { title: "Employment Proof", desc: "Employer letter (NOC) or tax returns if self-employed." },
                            ].map((item, idx) => (
                                <div key={idx} className="flex gap-4 p-6 rounded-2xl bg-slate-50 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all border border-slate-100">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                        <FileText className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h4>
                                        <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* WHY CHOOSE US */}
            <section className="py-20 bg-slate-900 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-black mb-16">Why Premium Service?</h2>

                    <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
                        <div className="flex flex-col items-center">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mb-6 shadow-lg shadow-orange-500/20">
                                <Check className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">98% Success Rate</h3>
                            <p className="text-slate-400">Our expert checking ensures your file is error-free before submission.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
                                <ShieldCheck className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">End-to-End Support</h3>
                            <p className="text-slate-400">From appointment booking to passport collection updates.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center mb-6 shadow-lg shadow-pink-500/20">
                                <Plane className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Flight & Hotel Dummy</h3>
                            <p className="text-slate-400">We provide verifiable itinerary proofs for your application.</p>
                        </div>
                    </div>
                </div>
            </section>


        </main>
    );
}
