import type { Metadata } from "next";
import Navbar from "@/components/layout/Header/Navbar";
import { Footer } from "@/components/layout/Footer/Footer";
import { MapPin, Globe, Heart, Shield, Users, Trophy, Star, Plane } from "lucide-react";

export const metadata: Metadata = {
    title: "Best Travel Agency in Manchester | My Perfect Trips",
    description:
        "Manchester's budget-friendly travel company for bespoke holidays. From Dubai to New York, we craft the perfect itinerary for you.",
    keywords: [
        "best travel agency in manchester",
        "manchesters budget friendly travel company",
        "travel dubai",
        "travel usa",
        "travel europe",
        "cheap flights manchester"
    ]
};

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-white font-sans text-slate-800">
            <Navbar />

            {/* 1. HERO - Minimal */}
            <section className="pt-40 pb-20 container mx-auto px-4 max-w-4xl text-center">
                <p className="text-blue-600 font-bold tracking-widest uppercase text-xs mb-4">Our Story</p>
                <h1 className="text-4xl md:text-6xl font-black mb-8 leading-tight text-slate-900">
                    We Make the World <br /> Accessbile to You.
                </h1>
                <p className="text-xl text-slate-500 leading-relaxed font-light">
                    We started with a simple belief: Luxury travel shouldn't cost the Earth. Today, we are proud to be recognized as the <strong>best travel agency in Manchester</strong> for personalized, value-driven experiences.
                </p>
            </section>

            {/* 2. IMAGE STRIP */}
            <section className="w-full h-[400px] md:h-[500px] relative overflow-hidden bg-slate-100">
                {/* Placeholder for team/office/travel collage */}
                <div className="absolute inset-0 bg-neutral-200 flex items-center justify-center text-neutral-400">
                    <span className="text-sm uppercase tracking-widest">Travel & Team Imagery</span>
                </div>
            </section>

            {/* 3. CORE NARRATIVE - SEO Rich */}
            <section className="py-24 container mx-auto px-4 max-w-3xl">
                <div className="mx-auto space-y-6 text-lg text-slate-600 leading-relaxed">
                    <h2 className="text-3xl font-bold mb-6 text-slate-900">Manchester's Budget Friendly Travel Company</h2>
                    <p>
                        At My Perfect Trips, we understand that every penny counts. Whether you're looking to <strong className="text-slate-900 font-semibold">travel Dubai</strong> for a luxury shopping spree or explore the historic streets of Rome, we leverage our global network to get you unbeatable rates. We don't just book flights; we curate experiences that fit your budget without compromising on quality.
                    </p>
                    <p>
                        Our consultants are locals, based right here in Altrincham, but our reach is global. We've sent thousands of happy travellers to destinations as diverse as:
                    </p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 font-medium text-slate-700 py-4">
                        <li className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg"><Globe className="w-5 h-5 text-blue-500" /> Travel Dubai & Emirates</li>
                        <li className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg"><Globe className="w-5 h-5 text-blue-500" /> Travel USA & Florida</li>
                        <li className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg"><Globe className="w-5 h-5 text-blue-500" /> Travel Thailand & Asia</li>
                        <li className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg"><Globe className="w-5 h-5 text-blue-500" /> Travel Europe & Mediterranean</li>
                    </ul>
                    <p>
                        The world is vast, and "travel here, travel there" can be overwhelming. We simplify it. We allow you to "travel there" with confidence, knowing every transfer, hotel, and visa is sorted.
                    </p>
                </div>
            </section>

            {/* 4. VALUES GRID */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="grid md:grid-cols-3 gap-10">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-6">
                                <Heart className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Customer First</h3>
                            <p className="text-slate-500 leading-relaxed">
                                We are 100% independent, meaning we work for you, not the airlines. Your satisfaction is our only KPI.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-6">
                                <Shield className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Secure Booking</h3>
                            <p className="text-slate-500 leading-relaxed">
                                Complete financial protection on package holidays. Travel with total peace of mind.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center mb-6">
                                <MapPin className="w-6 h-6 text-orange-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Local Expert</h3>
                            <p className="text-slate-500 leading-relaxed">
                                Born and bred in Manchester. Pop into our office for a coffee and a chat about your next adventure.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. TEAM */}
            <section className="py-24">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center mb-16">
                        <p className="text-blue-600 font-bold uppercase text-xs mb-4 tracking-widest">Our People</p>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900">Meet The Experts</h2>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="group cursor-pointer">
                                <div className="h-80 bg-slate-100 rounded-2xl mb-6 relative overflow-hidden">
                                    {/* Placeholder for real team images */}
                                    <div className="absolute inset-0 bg-slate-200 flex items-center justify-center text-slate-400">
                                        <Users className="w-12 h-12" />
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">Expert Consultant {i}</h3>
                                <p className="text-sm text-blue-600 font-medium mb-2">Dubai & Asia Specialist</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. TESTIMONIALS */}
            <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
                <div className="container mx-auto px-4 max-w-4xl relative z-10 text-center">
                    <Star className="w-12 h-12 text-yellow-500 mx-auto mb-8" />
                    <h2 className="text-3xl md:text-5xl font-bold mb-10 leading-snug">
                        "We booked our honeymoon to Maldives with My Perfect Trips. The team in Manchester were incredible, sorting everything from flights to a surprise candlelit dinner. Truly the best travel agency we've used!"
                    </h2>
                    <div className="flex items-center justify-center gap-4">
                        <div className="w-12 h-12 bg-slate-700 h-1 rounded-full" />
                        <div className="text-left">
                            <div className="font-bold text-lg">Sarah & James</div>
                            <div className="text-slate-400 text-sm">Travelled to Maldives, Oct 2024</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 7. PARTNERS */}
            <section className="py-20 border-t border-slate-100">
                <div className="container mx-auto px-4">
                    <p className="text-center text-slate-400 font-semibold uppercase tracking-widest text-xs mb-10">Trusted By World's Leading Airlines</p>
                    <div className="flex flex-wrap justify-center gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Text placeholders for Airline Logos to avoid broken images */}
                        <div className="flex items-center gap-2 text-xl font-bold text-slate-800"><Plane className="w-6 h-6" /> Emirates</div>
                        <div className="flex items-center gap-2 text-xl font-bold text-slate-800"><Plane className="w-6 h-6" /> Qatar Airways</div>
                        <div className="flex items-center gap-2 text-xl font-bold text-slate-800"><Plane className="w-6 h-6" /> British Airways</div>
                        <div className="flex items-center gap-2 text-xl font-bold text-slate-800"><Plane className="w-6 h-6" /> Etihad</div>
                        <div className="flex items-center gap-2 text-xl font-bold text-slate-800"><Plane className="w-6 h-6" /> Virgin Atlantic</div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
