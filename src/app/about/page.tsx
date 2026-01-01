import type { Metadata } from "next";
import Navbar from "@/components/layout/Header/Navbar";
import { Footer } from "@/components/layout/Footer/Footer";
import { MapPin, Globe, Heart, Shield, Users, Trophy, Star, Plane, CheckCircle2, Wallet, Clock, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
    title: "About Us | My Perfect Trips - Manchester's Premier Travel Agency",
    description: "Discover why My Perfect Trips is Manchester's most trusted travel agency. Offering price match guarantees, low deposits, and 24/7 personal support for bespoke holidays.",
    keywords: ["travel agency near me manchester", "bespoke holidays", "cheap flights manchester", "luxury travel deals", "dubai holidays", "usa travel packages", "best travel agency manchester"]
};

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-white font-sans text-slate-800">
            <Navbar />

            {/* 1. IMMERSIVE HERO SECTION - REDESIGNED */}
            <section className="relative h-[90vh] min-h-[700px] flex items-center justify-center overflow-hidden w-full">
                {/* Background Image (Unsplash - New Hotel/Resort) */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop"
                        alt="Luxury Hotel Pool at Sunset"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-slate-900/80" />
                </div>

                {/* Content */}
                <div className="container mx-auto px-4 md:px-8 relative z-10 text-center text-white">
                    <h1 className="text-3xl md:text-5xl lg:text-7xl font-black mb-6 md:mb-10 leading-[1.1] md:leading-tight tracking-tight drop-shadow-2xl animate-in slide-in-from-bottom-6 duration-700 delay-100">
                        Your Dream Holiday, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">Curated by Locals.</span>
                    </h1>

                    <p className="text-lg md:text-2xl text-blue-100 max-w-3xl mx-auto mb-14 md:mb-20 font-light leading-relaxed animate-in slide-in-from-bottom-8 duration-700 delay-200 px-4">
                        Stop searching, start packing. We are Manchester's premier independent travel agency, finding you <span className="font-bold text-white">unbeatable deals</span> that search engines can't match.
                    </p>
                </div>
            </section>

            {/* 2. STATS BAR */}
            <section className="relative z-20 -mt-20 px-4">
                <div className="container mx-auto">
                    <div className="bg-white rounded-[2rem] shadow-2xl p-8 md:p-12 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x-0 md:divide-x divide-slate-100 max-w-5xl mx-auto border border-slate-100">
                        {[
                            { label: "Happy Travellers", value: "10k+" },
                            { label: "Destinations", value: "150+" },
                            { label: "Years Experience", value: "10+" },
                            { label: "Google Rating", value: "4.9/5" }
                        ].map((stat, i) => (
                            <div key={i} className="text-center">
                                <div className="text-3xl md:text-5xl font-black text-brand-blue mb-2">{stat.value}</div>
                                <div className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. COMPETITIVE ADVANTAGE (WHY US) - UPDATED FOR SEO & REMOVED ATOL */}
            <section className="py-20 md:py-32 bg-white px-4 md:px-8 mt-10 md:mt-0">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16 md:mb-24">
                        <span className="text-brand-blue font-bold tracking-widest uppercase text-xs mb-4 block">The Local Advantage</span>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6">Why Manchester <span className="text-brand-blue">Uses Us.</span></h2>
                        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto">Skip the call centres and chatbots. Talk to a real expert right here in Altrincham who cares about your holiday.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 md:gap-10">
                        {/* USP 1 */}
                        <div className="bg-white p-8 md:p-12 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-transform duration-300 group">
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-50 rounded-2xl flex items-center justify-center mb-8 md:mb-10 text-brand-blue group-hover:scale-110 transition-transform">
                                <Wallet className="w-8 h-8 md:w-10 md:h-10" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold mb-4 text-slate-900">Price Match Promise</h3>
                            <p className="text-slate-500 leading-relaxed mb-8">
                                Found a cheaper quote? We won't just match it; we'll do our best to beat it. Get online prices with high-street service.
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3 text-sm font-bold text-slate-700"><div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center"><CheckCircle2 className="w-3.5 h-3.5 text-green-600" /></div> Unbeatable Value</li>
                            </ul>
                        </div>

                        {/* USP 2 - REPLACED ATOL/ABTA WITH LOCAL EXPERT SEO */}
                        <div className="bg-white p-8 md:p-12 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-transform duration-300 group relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-brand-red text-white text-[10px] font-bold px-4 py-1.5 rounded-bl-2xl uppercase tracking-wider">Top Rated</div>
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-red-50 rounded-2xl flex items-center justify-center mb-8 md:mb-10 text-brand-red group-hover:scale-110 transition-transform">
                                <MapPin className="w-8 h-8 md:w-10 md:h-10" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold mb-4 text-slate-900">Manchester Experts</h3>
                            <p className="text-slate-500 leading-relaxed mb-8">
                                We aren't just a website. We are your neighbours in Altrincham, providing trusted advice and support you can rely on.
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3 text-sm font-bold text-slate-700"><div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center"><Heart className="w-3.5 h-3.5 text-brand-red" /></div> Personal Service</li>
                            </ul>
                        </div>

                        {/* USP 3 */}
                        <div className="bg-white p-8 md:p-12 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-transform duration-300 group">
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-purple-50 rounded-2xl flex items-center justify-center mb-8 md:mb-10 text-purple-600 group-hover:scale-110 transition-transform">
                                <Clock className="w-8 h-8 md:w-10 md:h-10" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold mb-4 text-slate-900">Flexible Payments</h3>
                            <p className="text-slate-500 leading-relaxed mb-8">
                                Secure your dream trip with low deposits from £99pp and spread the cost with interest-free monthly payments.
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3 text-sm font-bold text-slate-700"><div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center"><CheckCircle2 className="w-3.5 h-3.5 text-green-600" /></div> Low Deposits</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. DUBAI AUTHORITY (Keep as is) */}
            <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
                <div className="absolute inset-0 opacity-20">
                    <Image
                        src="https://images.unsplash.com/photo-1512453979798-5ea904acfb5a?q=80&w=2000&auto=format&fit=crop"
                        alt="Dubai Skyline"
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-900/40" />

                <div className="container mx-auto px-4 md:px-8 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="lg:w-1/2">
                            <span className="text-brand-blue font-bold tracking-widest uppercase text-xs mb-4 block">Destination Spotlight</span>
                            <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
                                We Are The <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-blue-400">Dubai Experts.</span>
                            </h2>
                            <p className="text-xl text-slate-400 leading-relaxed mb-8">
                                No one knows Dubai like we do. From the Palm Jumeirah to the desert dunes, we have direct partnerships with the most exclusive hotels, guaranteeing you rates and upgrades you won't find on booking sites.
                            </p>
                            <Link href="/packages?destination=dubai" className="inline-flex items-center gap-2 text-white font-bold border-b-2 border-brand-blue pb-1 hover:text-brand-blue hover:border-white transition-all">
                                View Dubai Packages <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="lg:w-1/2 grid grid-cols-2 gap-4">
                            <div className="h-64 rounded-2xl overflow-hidden relative transform translate-y-8">
                                <Image src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1000&auto=format&fit=crop" alt="The Palm" fill className="object-cover hover:scale-110 transition-transform duration-700" />
                            </div>
                            <div className="h-64 rounded-2xl overflow-hidden relative">
                                <Image src="https://images.unsplash.com/photo-1546412414-e1885259563a?q=80&w=1000&auto=format&fit=crop" alt="Burj Al Arab" fill className="object-cover hover:scale-110 transition-transform duration-700" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. BUDGET FRIENDLY GEMS (Keep as is) */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="text-center mb-16">
                        <span className="text-brand-red font-bold tracking-widest uppercase text-xs mb-4 block">Trending Now</span>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900">Affordable Luxury Gems</h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {[
                            { name: "Turkey", img: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=1000&auto=format&fit=crop" },
                            { name: "Georgia", img: "https://images.unsplash.com/photo-1565008576549-57569a4937d8?q=80&w=1000&auto=format&fit=crop" },
                            { name: "Azerbaijan", img: "https://images.unsplash.com/photo-1632976807289-4b3531fb5c9c?q=80&w=1000&auto=format&fit=crop" },
                            { name: "Armenia", img: "https://images.unsplash.com/photo-1588161747762-b91c0628e833?q=80&w=1000&auto=format&fit=crop" },
                        ].map((place, i) => (
                            <Link href={`/packages?search=${place.name}`} key={i} className="group relative h-80 rounded-[2rem] overflow-hidden cursor-pointer">
                                <Image
                                    src={place.img}
                                    alt={place.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                                <span className="absolute bottom-6 left-0 right-0 text-center text-white font-bold text-xl md:text-2xl">{place.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>


            {/* 6. OUR STORY & SEO (Keep as is) */}
            <section className="py-24 bg-slate-50 overflow-hidden">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                        {/* Image Side */}
                        <div className="lg:w-1/2 relative order-2 lg:order-1 w-full">
                            <div className="relative rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl rotate-1 hover:rotate-0 transition-transform duration-700 border-8 border-white h-[400px] md:h-[600px]">
                                <Image
                                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2301&auto=format&fit=crop"
                                    alt="My Perfect Trips Manchester Office"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-white">
                                    <div className="text-2xl md:text-3xl font-black mb-1">Manchester HQ</div>
                                    <p className="font-medium opacity-90">Visit us in Altrincham</p>
                                </div>
                            </div>
                        </div>

                        {/* Text Side with SEO Keywords */}
                        <div className="lg:w-1/2 order-1 lg:order-2">
                            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-slate-200/50">
                                <span className="text-brand-blue font-bold tracking-widest uppercase text-xs mb-4 block">Our Story</span>
                                <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 leading-tight">
                                    Bringing the <span className="text-brand-blue">Human Touch</span> Back to Travel.
                                </h2>
                                <div className="space-y-4 text-base text-slate-600 leading-relaxed font-normal mb-8">
                                    <p>
                                        My Perfect Trips started with a simple frustration: online booking sites are cold, impersonal, and often hide hidden costs. We missed the days of talking to a real expert who cared.
                                    </p>
                                    <p>
                                        We decided to build something different. A travel agency that combines the <strong>speed of the internet</strong> with the <strong>warmth of a local consultant</strong>.
                                    </p>
                                    <p>
                                        If you've been searching for the <strong>best travel agency near me in Manchester</strong>, we are proud to say we have built that reputation on trust, value, and personal service. Whether it's a budget break to Turkey or a luxury Dubai escape, we handle it all.
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden relative">
                                                <Image src={`https://images.unsplash.com/photo-${i === 1 ? '1573496359142-b8d87734a5a2' : i === 2 ? '1560250097-0b93528c311a' : '1580489944761-15a19d654956'}?q=80&w=100&auto=format&fit=crop`} alt="Agent" fill className="object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="text-sm font-bold text-slate-900">
                                        Talk to our experts today <br />
                                        <span className="text-brand-blue font-normal">No robots, just humans.</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
