import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import { Briefcase, Users, GraduationCap, Building2, FileText, PlaneTakeoff, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
    noStore();

    const services = [
        {
            icon: Building2,
            title: "Corporate MICE",
            description: "End-to-end planning and execution for Meetings, Incentives, Conferences, and Exhibitions globally. We ensure your corporate events run flawlessly and professionally."
        },
        {
            icon: Briefcase,
            title: "Corporate Travel Packages",
            description: "Tailored business travel solutions designed for executives and corporate teams. Enjoy seamless logistics, premium accommodations, and 24/7 dedicated support."
        },
        {
            icon: Users,
            title: "Group Travel Bookings",
            description: "Whether it's a family reunion or a massive social getaway, we handle the complexities of bulk airfare, multi-room hotel bookings, and custom group itineraries."
        },
        {
            icon: GraduationCap,
            title: "College Tours & Excursions",
            description: "Educational and leisure trips curated specifically for students and faculty. We prioritize safety, learning experiences, and budget-friendly premium arrangements."
        },
        {
            icon: FileText,
            title: "Visa Assistance",
            description: "Navigate global borders with ease. Our experts provide comprehensive visa consultation, documentation checking, and processing tracking for hassle-free approvals."
        },
        {
            icon: PlaneTakeoff,
            title: "Bespoke Holiday Planning",
            description: "For individuals and couples seeking the extraordinary. We craft personalized, luxury domestic and international itineraries that match your precise travel style."
        }
    ];

    return (
        <main className="min-h-screen bg-stone-50 pb-24">
            {/* ──────────────────────────────────────────────────────────
          SECTION 1: HERO
          ────────────────────────────────────────────────────────── */}
            <section className="relative bg-stone-950 px-4 pt-20 pb-24 sm:px-6 lg:px-8 shadow-sm">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-stone-800 via-stone-950 to-stone-950 opacity-80" />
                <div className="container-inner relative z-10 flex flex-col items-center text-center">
                    <span className="section-label !text-gold-400 before:!bg-gold-400/30 after:!bg-gold-400/30">
                        Our Services
                    </span>
                    <h1 className="mb-6 font-serif text-5xl font-medium text-white sm:text-6xl md:text-7xl tracking-tight leading-[1.1]">
                        Complete Travel <em className="bg-gradient-to-r from-yellow-100 via-yellow-400 to-amber-600 bg-clip-text text-transparent italic font-semibold">Solutions.</em>
                    </h1>
                    <p className="max-w-2xl text-lg text-stone-300 font-light leading-relaxed">
                        From large-scale corporate MICE events to seamless visa processing, we provide premium, end-to-end travel management across India.
                    </p>
                </div>
            </section>

            {/* ──────────────────────────────────────────────────────────
          SECTION 2: SERVICES GRID
          ────────────────────────────────────────────────────────── */}
            <section className="container-inner -mt-12 relative z-20">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {services.map((svc, idx) => (
                        <div
                            key={idx}
                            className="group flex flex-col overflow-hidden rounded-[2rem] bg-white border border-stone-200 transition-all hover:-translate-y-1.5 hover:shadow-xl hover:border-stone-300 p-8 sm:p-10"
                        >
                            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                                <svc.icon className="h-8 w-8" />
                            </div>
                            <h3 className="mb-4 font-serif text-2xl font-medium leading-tight text-brand-950">
                                {svc.title}
                            </h3>
                            <p className="text-stone-600 leading-relaxed text-sm">
                                {svc.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ──────────────────────────────────────────────────────────
          SECTION 3: WHY CHOOSE OUR SERVICES
          ────────────────────────────────────────────────────────── */}
            <section className="container-inner mt-24">
                <div className="rounded-[2.5rem] bg-stone-900 px-8 py-16 sm:p-20 relative overflow-hidden text-center sm:text-left">
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-gold-500/10 blur-3xl mix-blend-screen" />
                    <div className="relative z-10 grid gap-12 lg:grid-cols-2 lg:items-center">
                        <div>
                            <h2 className="mb-6 font-serif text-4xl font-medium text-white sm:text-5xl">
                                Dedicated support from departure to return.
                            </h2>
                            <p className="mb-8 text-lg text-stone-300 font-light">
                                Our pan-India network and deep industry connections allow us to negotiate the best rates and provide an unparalleled level of service, ensuring your travel is stress-free and spectacular.
                            </p>
                            <ul className="mb-10 space-y-4 text-left text-sm font-medium text-stone-200">
                                <li className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-gold-400" /> 24/7 dedicated travel concierge</li>
                                <li className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-gold-400" /> Transparent pricing and no hidden fees</li>
                                <li className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-gold-400" /> Expert visa and documentation parsing</li>
                            </ul>
                            <Link href="/contact" className="btn-gold">
                                Consult an Expert Today
                            </Link>
                        </div>
                        <div className="hidden lg:flex justify-end">
                            {/* Decorative element */}
                            <div className="w-full max-w-sm rounded-[2rem] bg-stone-800 p-8 border border-stone-700 shadow-2xl">
                                <div className="space-y-6">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-full bg-brand-900/50 flex items-center justify-center">
                                                <PlaneTakeoff className="h-5 w-5 text-gold-500" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="h-2 w-full rounded bg-stone-700/50 mb-2"></div>
                                                <div className="h-2 w-2/3 rounded bg-stone-700/30"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
