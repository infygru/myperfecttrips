import type { Metadata } from "next";
import Navbar from "@/components/layout/Header/Navbar";
import { Footer } from "@/components/layout/Footer/Footer";
import Link from "next/link";
import { ArrowRight, Music, Calendar, Star, Heart, Camera, Check } from "lucide-react";

export const metadata: Metadata = {
    title: "Event Management Services | Corporate & Private Events",
    description:
        "Premium event management for corporate galas, product launches, weddings, and private parties. We bring your vision to life.",
};

export default function EventManagementPage() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            {/* HERO SECTION */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 bg-black overflow-hidden text-white">
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-pink-600 rounded-full blur-[100px]" />
                    <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-purple-600 rounded-full blur-[100px]" />
                </div>

                <div className="container mx-auto px-4 relative z-20 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 backdrop-blur-md border border-pink-500/20 text-xs font-bold uppercase tracking-[0.2em] mb-8 text-pink-300">
                        <Star className="w-4 h-4" />
                        Premium Experiences
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight">
                        Crafting Unforgettable <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                            Moments.
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10">
                        From spectacular product launches to intimate luxury weddings. We design events that leave a lasting impression.
                    </p>

                    <Link href="/contact" className="bg-white text-black hover:bg-slate-200 font-bold px-10 py-4 rounded-full transition-all flex items-center gap-2 mx-auto">
                        Get a Quote <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>

            {/* EVENT TYPES */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Our Expertise</h2>
                        <p className="text-slate-500">Tailored solutions for every occasion.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Star,
                                title: "Product Launches",
                                desc: "High-impact events to unveil your latest innovations to the world."
                            },
                            {
                                icon: Heart,
                                title: "Luxury Weddings",
                                desc: "Bespoke destination weddings with end-to-end guest management."
                            },
                            {
                                icon: Music,
                                title: "Gala Dinners",
                                desc: "Sophisticated awards nights and charity balls with premium entertainment."
                            },
                            {
                                icon: Calendar,
                                title: "Corporate Parties",
                                desc: "Staff parties and team celebrations that bring people together."
                            },
                            {
                                icon: Camera,
                                title: "Brand Activations",
                                desc: "Immersive pop-up experiences to engage your target audience."
                            },
                            {
                                icon: Star,
                                title: "Private Celebrations",
                                desc: "Milestone birthdays and anniversaries planned to perfection."
                            },
                        ].map((item, idx) => (
                            <div key={idx} className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all group">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform">
                                    <item.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                                <p className="text-slate-500 leading-relaxed text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* PROCESS */}
            <section className="py-20 bg-slate-900 text-white">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-black mb-6">
                                From Concept <br />
                                <span className="text-pink-500">To Reality.</span>
                            </h2>
                            <p className="text-slate-400 text-lg mb-8">
                                We handle every detail, so you can host with confidence. Our dedicated event managers are with you every step of the way.
                            </p>
                            <div className="space-y-4">
                                {[
                                    "Venue Finder & Selection",
                                    "Catering & Menu Design",
                                    "Audio Visual & Lighting Production",
                                    "Entertainment Booking",
                                    "Guest List Management"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                                            <Check className="w-3 h-3 text-green-400" />
                                        </div>
                                        <span className="font-semibold">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-[2rem] p-8 text-slate-900 shadow-xl border border-slate-100 text-center">
                            <h3 className="text-2xl font-bold mb-4">Let's Discuss Your Event</h3>
                            <p className="text-slate-500 mb-8">Ready to bring your vision to life? Get in touch with our event specialists.</p>
                            <Link href="/contact" className="inline-block bg-pink-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-pink-700 transition-colors shadow-lg shadow-pink-600/20">
                                Get a Quote
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
