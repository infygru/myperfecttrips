import type { Metadata } from "next";
import Navbar from "@/components/layout/Header/Navbar";
import { Footer } from "@/components/layout/Footer/Footer";
import Link from "next/link";
import { ArrowRight, Users, Mic, Presentation, Award, Globe, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
    title: "MICE Services | Meetings, Incentives, Conferences & Exhibitions",
    description:
        "End-to-end MICE travel solutions. We organize successful corporate meetings, memorable incentive trips, large-scale conferences, and exhibitions worldwide.",
};

export default function MicePage() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            {/* HERO SECTION */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 bg-slate-900 overflow-hidden text-white">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2" />
                </div>

                <div className="container mx-auto px-4 relative z-20 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 backdrop-blur-md border border-indigo-500/20 text-xs font-bold uppercase tracking-[0.2em] mb-8 text-indigo-300">
                        <Globe className="w-4 h-4" />
                        Global Business Events
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight">
                        Start Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                            Next Success Story
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10">
                        From intimate board meetings to grand international conferences. We handle the logistics so you can focus on the agenda.
                    </p>

                    <Link href="/contact" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-10 py-4 rounded-full transition-all flex items-center gap-2 mx-auto shadow-lg shadow-indigo-600/25">
                        Plan Your Event <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>

            {/* CORE SERVICES */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                icon: Users,
                                title: "Meetings",
                                subtitle: "Board Meetings & AGMs",
                                desc: "Seamless organization of offsite meetings with AV support, catering, and accommodation."
                            },
                            {
                                icon: Award,
                                title: "Incentives",
                                subtitle: "Reward Programs",
                                desc: "Unforgettable travel experiences to motivate your top performers and boost team morale."
                            },
                            {
                                icon: Mic,
                                title: "Conferences",
                                subtitle: "Global Summits",
                                desc: "End-to-end management of large scale participants, venue selection, and logistics."
                            },
                            {
                                icon: Presentation,
                                title: "Exhibitions",
                                subtitle: "Trade Shows",
                                desc: "Strategic booth designs and travel coordination to showcase your brand globally."
                            },
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 hover:-translate-y-2 transition-transform duration-300 group">
                                <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors duration-300">
                                    <item.icon className="w-7 h-7 text-indigo-600 group-hover:text-white transition-colors" />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-wider text-indigo-500 mb-2 block">{item.subtitle}</span>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4">{item.title}</h3>
                                <p className="text-slate-500 leading-relaxed text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CAPABILITIES */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row gap-16 items-center">
                        <div className="flex-1">
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-8 leading-tight">
                                Why Choose Us <br />
                                <span className="text-indigo-600">For MICE?</span>
                            </h2>
                            <div className="space-y-6">
                                {[
                                    { title: "Global Vendor Network", desc: "Access to exclusive venues and negotiated rates worldwide." },
                                    { title: "Technology Integration", desc: "Event apps, registration portals, and live polling systems." },
                                    { title: "Creative Theming", desc: "Immersive experiences tailored to your brand identity." },
                                    { title: "On-Site Management", desc: "Dedicated ground staff to ensure flawless execution." }
                                ].map((feat, i) => (
                                    <div key={i} className="flex gap-4">
                                        <CheckCircle className="w-6 h-6 text-indigo-600 shrink-0 mt-1" />
                                        <div>
                                            <h4 className="text-lg font-bold text-slate-900">{feat.title}</h4>
                                            <p className="text-slate-500">{feat.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 w-full max-w-md bg-slate-900 rounded-[2rem] p-8 md:p-12 text-center text-white relative overflow-hidden flex flex-col justify-center items-center">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-[60px]" />
                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold mb-4">Start Planning</h3>
                                <p className="text-slate-300 mb-8">Tell us your requirements and get a customized proposal within 24 hours.</p>
                                <Link href="/contact" className="inline-block bg-white text-slate-900 font-bold px-8 py-4 rounded-xl hover:bg-indigo-50 transition-colors">
                                    Contact Us
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
