import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import { Compass, Globe2, Award, Headset } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
    noStore();

    return (
        <main className="min-h-screen bg-stone-50 pb-24">
            {/* ──────────────────────────────────────────────────────────
          SECTION 1: HERO
          ────────────────────────────────────────────────────────── */}
            <section className="relative bg-stone-950 px-4 pt-20 pb-32 sm:px-6 lg:px-8 shadow-sm">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-stone-800 via-stone-950 to-stone-950 opacity-80" />
                <div className="container-inner relative z-10 flex flex-col items-center text-center">
                    <span className="section-label !text-gold-400 before:!bg-gold-400/30 after:!bg-gold-400/30">
                        About IGHolidays
                    </span>
                    <h1 className="mb-6 font-serif text-5xl font-medium text-white sm:text-6xl md:text-7xl tracking-tight leading-[1.1]">
                        Redefining Luxury <br /><em className="bg-gradient-to-r from-yellow-100 via-yellow-400 to-amber-600 bg-clip-text text-transparent italic font-semibold">Travel.</em>
                    </h1>
                    <p className="max-w-2xl text-lg text-stone-300 font-light leading-relaxed">
                        We are a premier travel management company, providing extraordinary bespoke vacations, flawless corporate retreats, and expert travel facilitation across India and the world.
                    </p>
                </div>
            </section>

            {/* ──────────────────────────────────────────────────────────
          SECTION 2: OUR STORY
          ────────────────────────────────────────────────────────── */}
            <section className="container-inner -mt-16 relative z-20">
                <div className="rounded-[2.5rem] bg-white p-8 sm:p-16 shadow-2xl shadow-stone-200/50 border border-stone-100 grid gap-12 lg:grid-cols-2 lg:items-center">
                    <div>
                        <h2 className="mb-6 font-serif text-3xl font-medium text-brand-950 sm:text-4xl">
                            Our Journey
                        </h2>
                        <div className="space-y-6 text-stone-600 leading-relaxed text-sm sm:text-base">
                            <p>
                                Welcome to <strong>IGHolidays</strong>, officially recognized as the <strong>Best Travel Agency in India</strong> for curating impeccable, tailor-made journeys. What began as a passionate endeavor to simplify global travel has since evolved into India&apos;s leading premium travel management company.
                            </p>
                            <p>
                                As <strong>Top Luxury Tour Operators</strong>, we specialize in crafting <em>Customized International Tour Packages</em> and bespoke domestic retreats across India&apos;s most beautiful destinations like Kerala, Kashmir, Rajasthan, and the Andaman Islands. We believe travel isn&apos;t just about the destination; it&apos;s about the seamlessness of the journey, exclusive hand-picked accommodations, and rich cultural experiences.
                            </p>
                            <p>
                                Today, IGHolidays is the most trusted name in B2B and B2C travel. As expert <strong>Corporate MICE Organizers (Meetings, Incentives, Conferences, and Exhibitions)</strong>, we handle massive group logistics, international college industrial visits, and corporate offsites for leading enterprises pan-India.
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-4">
                            <div className="aspect-[4/5] rounded-3xl bg-stone-200 overflow-hidden relative">
                                {/* Placeholder for lifestyle image */}
                                <div className="absolute inset-0 bg-gradient-to-br from-brand-800 to-brand-950 opacity-90"></div>
                            </div>
                            <div className="aspect-square rounded-3xl bg-gold-100 flex items-center justify-center p-6 text-center">
                                <div>
                                    <div className="font-serif text-4xl font-semibold text-gold-700 mb-1">15+</div>
                                    <div className="text-xs font-bold uppercase tracking-wider text-gold-900/60">Years Experience</div>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4 pt-8">
                            <div className="aspect-square rounded-3xl bg-brand-50 flex items-center justify-center p-6 text-center">
                                <div>
                                    <div className="font-serif text-4xl font-semibold text-brand-700 mb-1">5k+</div>
                                    <div className="text-xs font-bold uppercase tracking-wider text-brand-900/60">Happy Travelers</div>
                                </div>
                            </div>
                            <div className="aspect-[4/5] rounded-3xl bg-stone-200 overflow-hidden relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-stone-800 to-stone-900 opacity-90"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ──────────────────────────────────────────────────────────
          SECTION 2.5: OUR EXPERTISE (SEO KEYWORDS)
          ────────────────────────────────────────────────────────── */}
            <section className="container-inner mt-24">
                <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                    <div className="order-2 lg:order-1 relative h-full min-h-[400px] w-full rounded-3xl overflow-hidden shadow-2xl">
                        <div className="absolute inset-0 bg-stone-900 flex items-center justify-center p-8 text-center border overflow-hidden">
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold-900/40 via-stone-950 to-stone-950 opacity-90" />
                            <div className="relative z-10">
                                <Compass className="h-16 w-16 text-gold-500 mx-auto mb-6 opacity-30" />
                                <h3 className="font-serif text-3xl text-white mb-4">India&apos;s Premier Destination Management Company</h3>
                                <p className="text-stone-400 font-light">Accredited by major domestic and international tourism boards.</p>
                            </div>
                        </div>
                    </div>
                    <div className="order-1 lg:order-2">
                        <h2 className="mb-6 font-serif text-3xl font-medium text-brand-950 sm:text-4xl">
                            Our Core Expertise
                        </h2>
                        <ul className="space-y-6">
                            <li className="flex gap-4">
                                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-100 text-gold-700">
                                    <span className="font-bold">1</span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-brand-950">Luxury Honeymoon & Family Packages</h3>
                                    <p className="mt-1 text-sm text-stone-600">From Maldives water villas to European grand tours, we are the best honeymoon planners in India, ensuring every detail of your romantic escape is perfect.</p>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-100 text-gold-700">
                                    <span className="font-bold">2</span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-brand-950">Corporate MICE & Group Travel Logistics</h3>
                                    <p className="mt-1 text-sm text-stone-600">Top Corporate MICE event planners in India. We coordinate flights, visas, and luxury stays for corporate delegations of 50 to 500+ attendees anywhere in the world.</p>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-100 text-gold-700">
                                    <span className="font-bold">3</span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-brand-950">International Visa & Flight Assistance</h3>
                                    <p className="mt-1 text-sm text-stone-600">Complete end-to-end B2B and B2C travel facilitation. We secure the best flight deals in India and provide expert visa consultation for the US, UK, Schengen, and Dubai.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* ──────────────────────────────────────────────────────────
          SECTION 3: VALUES / WHY US
          ────────────────────────────────────────────────────────── */}
            <section className="container-inner mt-24 bg-stone-100 rounded-[3rem] p-8 sm:p-16">
                <div className="text-center mb-16">
                    <h2 className="font-serif text-4xl font-medium text-brand-950 mb-4">Why Travel With Us</h2>
                    <p className="text-stone-500 max-w-2xl mx-auto">As the top-rated travel agency in India, we don&apos;t just book tickets; we engineer unforgettable experiences backed by round-the-clock premium support.</p>
                </div>

                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        { icon: Compass, title: "Expert Navigation", desc: "Deep knowledge of global destinations ensuring authentic, safe, and remarkable journeys." },
                        { icon: Award, title: "Premium Quality", desc: "Vetted luxury partners, top-tier hotels, and exclusive access to premium amenities." },
                        { icon: Globe2, title: "Pan-India Reach", desc: "Operating across India, we handle complex multi-city departures and massive group logistics." },
                        { icon: Headset, title: "24/7 Concierge", desc: "Unwavering support throughout your entire journey. You are never alone when traveling with us." }
                    ].map((val, i) => (
                        <div key={i} className="text-center p-6">
                            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-stone-100 text-brand-700">
                                <val.icon className="h-8 w-8" />
                            </div>
                            <h3 className="mb-3 font-serif text-xl font-medium text-brand-950">{val.title}</h3>
                            <p className="text-stone-500 text-sm leading-relaxed">{val.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ──────────────────────────────────────────────────────────
          SECTION 4: CTA
          ────────────────────────────────────────────────────────── */}
            <section className="container-inner mt-24">
                <div className="rounded-[2.5rem] bg-brand-950 p-12 text-center shadow-xl">
                    <h2 className="mb-6 font-serif text-4xl font-medium text-white">Let's craft your next adventure.</h2>
                    <p className="mb-8 text-stone-300 max-w-xl mx-auto">
                        Whether it's a corporate retreat for hundreds or an intimate honeymoon, our experts are ready to begin planning.
                    </p>
                    <Link href="/contact" className="btn-gold inline-flex">
                        Contact Our Experts
                    </Link>
                </div>
            </section>
        </main>
    );
}
