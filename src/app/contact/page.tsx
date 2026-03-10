import { directus, getSiteSettings } from "@/lib/directus";
import { unstable_noStore as noStore } from "next/cache";
import { MapPin, Mail } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
    noStore();
    let s: any = null;
    try {
        s = await getSiteSettings();
    } catch { }

    const email = s?.contact_email || "hello@igholidays.com";
    const phone = s?.contact_phone || "+91 98765 43210";
    const address = s?.office_address || "Tamil Nadu, India";
    const whatsapp = s?.whatsapp_number || "+91 98765 43210";

    return (
        <main className="min-h-screen bg-stone-50 pb-24">
            {/* ──────────────────────────────────────────────────────────
          SECTION 1: HEADER
          ────────────────────────────────────────────────────────── */}
            <section className="relative bg-brand-950 px-4 pt-20 pb-24 sm:px-6 lg:px-8 shadow-sm">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-800 via-brand-950 to-brand-950 opacity-80" />
                <div className="container-inner relative z-10 flex flex-col items-center text-center">
                    <span className="section-label !text-gold-400 before:!bg-gold-400/30 after:!bg-gold-400/30">
                        Get in Touch
                    </span>
                    <h1 className="mb-6 font-serif text-5xl font-medium text-white sm:text-6xl tracking-tight">
                        We&apos;re Here to Help
                    </h1>
                    <p className="max-w-2xl text-lg text-stone-300 font-light leading-relaxed">
                        Have a question about an upcoming trip or want to tailor a bespoke itinerary? Contact our travel experts today.
                    </p>
                </div>
            </section>

            {/* ──────────────────────────────────────────────────────────
          SECTION 2: CONTACT GRID
          ────────────────────────────────────────────────────────── */}
            <section className="container-inner -mt-12 relative z-20">
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
                                        <a href={`mailto:${email}`} className="text-lg font-medium hover:text-brand-700 transition-colors">{email}</a>
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

                        {/* Quick Support */}
                        <div className="rounded-[2rem] bg-brand-900 border border-brand-800 p-8 sm:p-10 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 -m-8 h-32 w-32 rounded-full bg-gold-500/10 blur-xl" />
                            <div className="relative z-10">
                                <h3 className="mb-2 font-serif text-2xl font-medium">Need immediate assistance?</h3>
                                <p className="mb-8 text-sm text-stone-300 font-light leading-relaxed">
                                    Message us on WhatsApp for quick answers to your travel queries.
                                </p>
                                <a
                                    href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-gold w-full text-brand-950 flex items-center justify-center gap-2"
                                >
                                    <WhatsAppIcon className="h-5 w-5" />
                                    Chat on WhatsApp
                                </a>
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
