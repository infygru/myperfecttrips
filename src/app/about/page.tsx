import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import type { Metadata } from "next";
import { Compass, Globe2, Award, Headset, CheckCircle2, MapPin, Users, Star } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "About Us | IG Holidays – Best Travel Agency in India",
    description: "Book your holiday with IG Holidays – India's premier travel agency specializing in luxury international packages, honeymoon tours, corporate MICE, and domestic getaways. 15+ years of trusted travel planning.",
    alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "https://igholidays.com"}/about` },
};

export default async function AboutPage() {
    noStore();

    return (
        <main className="min-h-screen bg-white">

            {/* ── COMPACT PAGE HEADER ── */}
            <section className="bg-brand-950 pt-20 pb-8 border-b border-white/[0.06]">
                <div className="container-inner">
                    <p className="text-gold-400 text-[10px] font-bold uppercase tracking-[0.25em] mb-2 flex items-center gap-2">
                        <span className="h-px w-6 bg-gold-400" />
                        About IGHolidays
                    </p>
                    <h1 className="font-serif text-3xl sm:text-4xl font-medium text-white">
                        Redefining Luxury <em className="text-gold-400 not-italic">Travel</em>
                    </h1>
                    <p className="text-stone-400 text-sm mt-2 max-w-xl">
                        Premier travel management — bespoke vacations, corporate retreats, and expert facilitation across India and the world.
                    </p>
                </div>
            </section>

            {/* ── STATS ── */}
            <section className="bg-white border-b border-stone-100">
                <div className="container-inner">
                    <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-stone-100">
                        {[
                            { value: "15+", label: "Years Experience" },
                            { value: "10K+", label: "Happy Travellers" },
                            { value: "50+", label: "Destinations" },
                            { value: "500+", label: "Packages Sold" },
                        ].map((s) => (
                            <div key={s.label} className="flex flex-col items-center py-8 px-4 text-center">
                                <span className="font-serif text-3xl sm:text-4xl font-bold text-brand-950">{s.value}</span>
                                <span className="text-xs font-medium uppercase tracking-widest text-stone-400 mt-1">{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── OUR STORY ── */}
            <section className="py-16 lg:py-20 bg-stone-50">
                <div className="container-inner">
                    <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                        <div>
                            <span className="section-label">Our Story</span>
                            <h2 className="mb-6 font-serif text-3xl sm:text-4xl font-medium text-brand-950">
                                15 Years of Crafting Unforgettable Journeys
                            </h2>
                            <div className="space-y-4 text-stone-600 leading-relaxed text-sm sm:text-base">
                                <p>
                                    Welcome to <strong>IGHolidays</strong>, officially recognized as the <strong>Best Travel Agency in India</strong> for curating impeccable, tailor-made journeys. What began as a passionate endeavor to simplify global travel has since evolved into India&apos;s leading premium travel management company.
                                </p>
                                <p>
                                    As <strong>Top Luxury Tour Operators</strong>, we specialize in crafting <em>Customized International Tour Packages</em> and bespoke domestic retreats across India&apos;s most beautiful destinations like Kerala, Kashmir, Rajasthan, and the Andaman Islands.
                                </p>
                                <p>
                                    Today, IGHolidays is the most trusted name in B2B and B2C travel — handling everything from intimate honeymoons to corporate MICE events for 500+ attendees across the globe.
                                </p>
                            </div>
                            <div className="mt-8 flex flex-wrap gap-3">
                                <Link href="/packages" className="btn-gold text-sm">Browse Packages</Link>
                                <Link href="/contact" className="btn-outline text-sm">Talk to an Expert</Link>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <div className="aspect-[3/4] rounded-3xl bg-gradient-to-br from-brand-800 to-brand-950 overflow-hidden relative flex items-end p-5">
                                    <div className="text-white">
                                        <MapPin className="h-6 w-6 text-gold-400 mb-2" />
                                        <p className="font-serif text-xl font-medium">50+ Destinations</p>
                                        <p className="text-xs text-stone-400">Worldwide coverage</p>
                                    </div>
                                </div>
                                <div className="aspect-square rounded-3xl bg-gold-50 border border-gold-100 flex items-center justify-center p-6 text-center">
                                    <div>
                                        <div className="font-serif text-4xl font-bold text-gold-700 mb-1">15+</div>
                                        <div className="text-xs font-bold uppercase tracking-wider text-gold-900/60">Years Experience</div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4 pt-8">
                                <div className="aspect-square rounded-3xl bg-brand-950 flex items-center justify-center p-6 text-center">
                                    <div>
                                        <div className="font-serif text-4xl font-bold text-white mb-1">10K+</div>
                                        <div className="text-xs font-bold uppercase tracking-wider text-stone-400">Happy Travelers</div>
                                    </div>
                                </div>
                                <div className="aspect-[3/4] rounded-3xl bg-gradient-to-br from-stone-700 to-stone-900 overflow-hidden relative flex items-end p-5">
                                    <div className="text-white">
                                        <Star className="h-6 w-6 text-gold-400 mb-2 fill-gold-400" />
                                        <p className="font-serif text-xl font-medium">5-Star Rated</p>
                                        <p className="text-xs text-stone-400">By verified clients</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── SEO SECTION: Book Your Holiday ── */}
            <section className="py-16 lg:py-20 bg-white">
                <div className="container-inner">
                    <div className="max-w-4xl mx-auto">
                        <span className="section-label">Plan Your Trip</span>
                        <h2 className="mb-6 font-serif text-3xl sm:text-4xl font-medium text-brand-950">
                            Book Your Holiday with IG Holidays
                        </h2>
                        <div className="prose prose-stone max-w-none text-stone-600 leading-relaxed text-sm sm:text-base space-y-4">
                            <p>
                                Planning your next holiday has never been easier. At <strong>IG Holidays</strong>, we believe every traveller deserves a seamless, personalized, and truly memorable vacation — whether it&apos;s a romantic Maldives honeymoon, a thrilling Bali adventure, an iconic European grand tour, or a serene Kerala backwater escape. As one of India&apos;s most trusted travel agencies, we handle every detail so you can focus on the joy of discovery.
                            </p>
                            <p>
                                Our team of expert <strong>travel consultants</strong> brings together deep destination knowledge, exclusive hotel partnerships, and years of experience planning holidays for thousands of Indian travellers. We offer <strong>customized holiday packages</strong> tailored precisely to your budget, travel style, and preferences — from budget-friendly group tours to ultra-luxury private escapes.
                            </p>
                            <p>
                                When you <strong>book your holiday with IG Holidays</strong>, you get end-to-end support: visa assistance, flight bookings, hotel reservations, airport transfers, guided tours, and 24/7 on-trip concierge support. We are accredited by leading tourism boards and partner with the world&apos;s finest hotels and airlines to guarantee you the best value with zero hidden charges.
                            </p>
                            <p>
                                Whether you are planning a <strong>honeymoon in the Maldives</strong>, a <strong>family trip to Singapore</strong>, a <strong>corporate MICE event in Dubai</strong>, or an <strong>educational tour across Europe</strong> — IG Holidays is your one-stop travel partner. Our packages cover 50+ international destinations and all major domestic circuits including Goa, Rajasthan, Himachal Pradesh, Uttarakhand, Kerala, and the Andaman & Nicobar Islands.
                            </p>
                            <p>
                                Start planning today. Reach out to our travel experts and receive a <strong>free customized holiday quote</strong> within 24 hours. With IG Holidays, your dream vacation is just one conversation away.
                            </p>
                        </div>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link href="/packages" className="btn-gold text-sm">Explore Packages</Link>
                            <Link href="/contact" className="btn-outline text-sm">Get Free Quote</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── EXPERTISE ── */}
            <section className="py-16 lg:py-20 bg-stone-50">
                <div className="container-inner">
                    <div className="text-center mb-12">
                        <span className="section-label mx-auto">What We Do</span>
                        <h2 className="font-serif text-3xl sm:text-4xl font-medium text-brand-950">Our Core Expertise</h2>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-3">
                        {[
                            {
                                icon: Star,
                                title: "Luxury Honeymoon & Family Packages",
                                desc: "From Maldives water villas to European grand tours — we are the best honeymoon planners in India, ensuring every detail of your romantic escape is flawless.",
                                tag: "Most Popular",
                            },
                            {
                                icon: Users,
                                title: "Corporate MICE & Group Travel",
                                desc: "Top Corporate MICE event planners in India. We coordinate flights, visas, and luxury stays for corporate delegations of 50 to 500+ attendees, anywhere in the world.",
                                tag: "Enterprise",
                            },
                            {
                                icon: Globe2,
                                title: "International Visa & Flight Assistance",
                                desc: "Complete end-to-end B2B and B2C travel facilitation. We secure the best flight deals and provide expert visa consultation for the US, UK, Schengen, and Dubai.",
                                tag: "Hassle-Free",
                            },
                        ].map((item, i) => (
                            <div key={i} className="rounded-2xl bg-white border border-stone-200 p-6 sm:p-8 flex flex-col">
                                <span className="inline-block rounded-full bg-gold-50 border border-gold-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gold-700 mb-5 self-start">
                                    {item.tag}
                                </span>
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-950 text-white mb-5">
                                    <item.icon className="h-5 w-5" />
                                </div>
                                <h3 className="font-serif text-xl font-medium text-brand-950 mb-3">{item.title}</h3>
                                <p className="text-sm text-stone-600 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── WHY TRAVEL WITH US ── */}
            <section className="py-16 lg:py-20 bg-white">
                <div className="container-inner">
                    <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                        <div>
                            <span className="section-label">Our Promise</span>
                            <h2 className="mb-6 font-serif text-3xl sm:text-4xl font-medium text-brand-950">Why Travel With Us</h2>
                            <ul className="space-y-4">
                                {[
                                    "100% Customisable Itineraries tailored to your style",
                                    "Best Price Guarantee — no hidden charges ever",
                                    "24/7 On-Trip Concierge & emergency support",
                                    "Expert Visa & Documentation Assistance",
                                    "Trusted by 10,000+ Travellers across India",
                                    "Accredited by leading international tourism boards",
                                ].map((item) => (
                                    <li key={item} className="flex items-start gap-3 text-sm text-stone-600">
                                        <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { icon: Compass, title: "Expert Navigation", desc: "Deep knowledge of global destinations." },
                                { icon: Award, title: "Premium Quality", desc: "Vetted luxury partners & top-tier hotels." },
                                { icon: Globe2, title: "Pan-India Reach", desc: "Multi-city departures & group logistics." },
                                { icon: Headset, title: "24/7 Concierge", desc: "Unwavering support throughout your journey." },
                            ].map((val, i) => (
                                <div key={i} className="rounded-2xl bg-stone-50 border border-stone-100 p-5 sm:p-6 text-center">
                                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-950 text-white">
                                        <val.icon className="h-5 w-5" />
                                    </div>
                                    <h3 className="font-serif text-sm font-medium text-brand-950 mb-1">{val.title}</h3>
                                    <p className="text-xs text-stone-500">{val.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="py-16 bg-brand-950">
                <div className="container-inner text-center">
                    <h2 className="mb-4 font-serif text-3xl sm:text-4xl font-medium text-white">Let&apos;s craft your next adventure.</h2>
                    <p className="mb-8 text-stone-300 max-w-xl mx-auto text-sm sm:text-base">
                        Whether it&apos;s a corporate retreat for hundreds or an intimate honeymoon, our experts are ready to begin planning.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link href="/contact" className="btn-gold w-full sm:w-auto text-sm">Contact Our Experts</Link>
                        <a href="mailto:info@igholidays.com" className="btn-outline w-full sm:w-auto !bg-transparent !text-white !border-white/30 hover:!bg-white/10 text-sm">
                            info@igholidays.com
                        </a>
                    </div>
                    <p className="text-xs text-stone-500 mt-8">
                        IG Holidays is an official brand of <strong className="text-stone-400">Infygru Private Limited</strong> — Registered in India.
                    </p>
                </div>
            </section>
        </main>
    );
}
