import { getSiteSettings } from "@/lib/directus";
import { unstable_noStore as noStore } from "next/cache";
import { MapPin, Mail } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import type { Metadata } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://myperfecttrips.com";

export const metadata: Metadata = {
    title: "Contact Us | My Perfect Trips – Travel Enquiries & Bookings",
    description: "Get in touch with My Perfect Trips for holiday packages, group bookings, visa assistance, and corporate travel. Call, WhatsApp, or email our expert travel consultants.",
    keywords: "contact My Perfect Trips, travel enquiry India, holiday booking contact, travel agent Chennai",
    alternates: { canonical: `${BASE}/contact` },
    openGraph: {
        title: "Contact Us | My Perfect Trips – Travel Enquiries & Bookings",
        description: "Reach our expert travel team for holiday packages, group bookings, and corporate travel enquiries.",
        url: `${BASE}/contact`,
        siteName: "My Perfect Trips",
        type: "website",
    },
    twitter: {
        card: "summary",
        title: "Contact Us | My Perfect Trips",
        description: "Reach our expert travel team for holiday packages, group bookings, and corporate travel enquiries.",
    },
};

export const dynamic = "force-dynamic";

export default async function ContactPage() {
    noStore();
    let s: any = null;
    try {
        s = await getSiteSettings();
    } catch { }

    const email = s?.contact_email || "info@myperfecttrips.com";
    const phone = s?.contact_phone || "+91 98765 43210";
    const address = s?.office_address || "Tamil Nadu, India";
    const whatsapp = s?.whatsapp_number || "+91 98765 43210";

    return (
        <main className="min-h-screen bg-stone-50 pb-24">
            {/* SECTION 1: HEADER */}
            <section className="bg-brand-950 pt-20 pb-14 border-b border-white/[0.06]">
                <div className="container-inner">
                    <p className="text-gold-400 text-[10px] font-bold uppercase tracking-[0.25em] mb-2 flex items-center gap-2">
                        <span className="h-px w-6 bg-gold-400" />
                        Get in Touch
                    </p>
                    <h1 className="font-serif text-3xl sm:text-4xl font-medium text-white">
                        We&apos;re Here to Help
                    </h1>
                    <p className="text-stone-400 text-sm mt-2 max-w-xl">
                        Have a question or want a bespoke itinerary? Contact our travel experts today.
                    </p>
                </div>
            </section>

            {/* SECTION 2: CONTACT GRID */}
            <section className="container-inner -mt-6 relative z-20">
                <div className="grid gap-8 lg:grid-cols-3">

                    {/* Contact Info Sidebar */}
                    <div className="flex flex-col gap-6 lg:col-span-1">

                        {/* Direct Contact */}
                        <div className="rounded-[2rem] bg-white p-8 sm:p-10 shadow-xl shadow-stone-200/50 border border-stone-100 flex-1">
                            <h2 className="mb-8 font-serif text-3xl font-medium text-brand-950">Contact Details</h2>

                            <ul className="space-y-8 text-stone-600">
                                <li className="flex gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366]">
                                        <WhatsAppIcon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="mb-1 text-sm font-bold uppercase tracking-wider text-brand-950">WhatsApp Us</h3>
                                        <a href={`tel:${phone}`} className="text-lg font-medium hover:text-brand-700 transition-colors">{phone}</a>
                                        <p className="mt-1 text-sm text-stone-500">Available 9am to 6pm, Mon-Sat</p>
                                    </div>
                                </li>

                                <li className="flex gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="mb-1 text-sm font-bold uppercase tracking-wider text-brand-950">Email Us</h3>
                                        <a href="mailto:info@myperfecttrips.com" className="text-lg font-medium hover:text-brand-700 transition-colors">info@myperfecttrips.com</a>
                                        <p className="mt-1 text-sm text-stone-500">We aim to reply within 24 hours</p>
                                    </div>
                                </li>

                                <li className="flex gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                                        <MapPin className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="mb-1 text-sm font-bold uppercase tracking-wider text-brand-950">Head Office</h3>
                                        <p className="text-lg font-medium">{address}</p>
                                        <p className="mt-1 text-sm text-stone-500">Visits by appointment only</p>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        {/* My Perfect Trips Brand Statement */}
                        <div className="rounded-[2rem] bg-stone-100 border border-stone-200 p-6 text-center">
                            <p className="text-xs text-stone-500 leading-relaxed">
                                <strong className="text-stone-700">My Perfect Trips</strong> is an official brand of{" "}
                                <strong className="text-stone-700">Infygru Private Limited</strong>.
                            </p>
                            <div className="flex flex-wrap items-center justify-center gap-3 mt-3 text-xs text-brand-600">
                                <a href="/terms" className="hover:underline">Terms</a>
                                <span className="text-stone-300">·</span>
                                <a href="/privacy-policy" className="hover:underline">Privacy</a>
                                <span className="text-stone-300">·</span>
                                <a href="/cookie-policy" className="hover:underline">Cookies</a>
                                <span className="text-stone-300">·</span>
                                <a href="/refund-policy" className="hover:underline">Refund Policy</a>
                            </div>
                        </div>

                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <ContactForm />
                    </div>

                </div>
            </section>
        </main>
    );
}
