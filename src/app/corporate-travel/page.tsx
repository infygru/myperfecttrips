import type { Metadata } from "next";
import Navbar from "@/components/layout/Header/Navbar";
import { ArrowRight, BarChart, Briefcase, Globe, Hotel, Plane, Shield, Check } from "lucide-react";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
    title: "Corporate Travel Management | My Perfect Trips",
    description:
        "Expert corporate travel management for businesses. Seamless flight bookings, hotel partnerships, and 24/7 expense management support.",
};

export default function CorporateTravelPage() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            {/* HERO SECTION */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 bg-slate-950 overflow-hidden text-white">
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent z-10" />

                {/* Background Image Placeholder */}
                <div className="absolute inset-0 opacity-40">
                    {/* Ideally a sleek office or business class flight image here */}
                    <div className="w-full h-full bg-slate-800" />
                </div>

                <div className="container mx-auto px-4 relative z-20 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold uppercase tracking-[0.2em] mb-8">
                        <Briefcase className="w-4 h-4 text-blue-400" />
                        Business Solutions
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight">
                        Corporate Travel <br />
                        <span className="text-blue-500">Redefined.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10">
                        Streamline your business trips with our bespoke travel management solutions.
                        Cost-effective, efficient, and reliable global support.
                    </p>

                    <button className="bg-white text-slate-900 hover:bg-slate-100 font-bold px-8 py-4 rounded-full transition-all flex items-center gap-2 mx-auto">
                        Request Consultation <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </section>

            {/* SERVICES GRID */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl font-black text-slate-900 mb-4">Comprehensive Management</h2>
                        <p className="text-slate-500">Everything your team needs to travel with confidence.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: Plane, title: "Global Flights", desc: "Access corporate rates on all major airlines with flexible change policies." },
                            { icon: Hotel, title: "Premium Hotels", desc: "Curated selection of business hotels with prioritized check-ins and perks." },
                            { icon: Shield, title: "Duty of Care", desc: "24/7 traveller tracking and emergency support for peace of mind." },
                            { icon: BarChart, title: "Cost Control", desc: "Detailed expense reporting and policy formulation to save budget." },
                            { icon: Globe, title: "Visa Assistance", desc: "Expedited visa processing for international business delegations." },
                            { icon: Briefcase, title: "MICE Services", desc: "End-to-end planning for Meetings, Incentives, Conferences, and Events." },
                        ].map((service, idx) => (
                            <div key={idx} className="group p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-300">
                                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                                    <service.icon className="w-7 h-7 text-slate-900" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
                                <p className="text-slate-500 leading-relaxed">{service.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* STATS STRIP */}
            <section className="py-16 bg-blue-600 text-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/20">
                        <div>
                            <div className="text-4xl font-black mb-1">50+</div>
                            <div className="text-sm opacity-80 uppercase tracking-wider">Corporate Clients</div>
                        </div>
                        <div>
                            <div className="text-4xl font-black mb-1">24/7</div>
                            <div className="text-sm opacity-80 uppercase tracking-wider">Support Team</div>
                        </div>
                        <div>
                            <div className="text-4xl font-black mb-1">15%</div>
                            <div className="text-sm opacity-80 uppercase tracking-wider">Avg. Savings</div>
                        </div>
                        <div>
                            <div className="text-4xl font-black mb-1">100%</div>
                            <div className="text-sm opacity-80 uppercase tracking-wider">Compliance</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CONTACT SECTION */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 mb-6">Partner with Us</h2>
                            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                                Ready to optimize your company's travel? Fill out the form to request a callback from our dedicated account managers.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Dedicated Account Manager",
                                    "No Hidden Fees",
                                    "Flexible Credit Terms",
                                    "Monthly Performance Reviews"
                                ].map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-3 font-semibold text-slate-700">
                                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                                            <Check className="w-3 h-3 text-green-600" />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
                            <ContactForm />
                        </div>
                    </div>
                </div>
            </section>

        </main>
    );
}
