import type { Metadata } from "next";
import Link from "next/link";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://igholidays.com";

export const metadata: Metadata = {
    title: "Terms & Conditions | IG Holidays",
    description: "Read the Terms & Conditions for using IG Holidays – an official brand of Infygru Private Limited. Governs bookings, payments, cancellations, and use of our services.",
    alternates: { canonical: `${BASE}/terms` },
    robots: { index: true, follow: false },
    openGraph: { title: "Terms & Conditions | IG Holidays", url: `${BASE}/terms`, siteName: "IG Holidays", type: "website" },
};

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-stone-50 pb-24">
            <section className="relative bg-brand-950 px-4 pt-20 pb-24 sm:px-6 lg:px-8">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-800 via-brand-950 to-brand-950 opacity-80" />
                <div className="container-inner relative z-10 flex flex-col items-center text-center">
                    <span className="section-label !text-gold-400 before:!bg-gold-400/30 after:!bg-gold-400/30">Legal</span>
                    <h1 className="mb-4 font-serif text-5xl font-medium text-white sm:text-6xl tracking-tight">Terms &amp; Conditions</h1>
                    <p className="max-w-xl text-stone-400 font-light">Last updated: March 2025</p>
                </div>
            </section>

            <section className="container-inner -mt-12 relative z-20">
                <div className="rounded-[2.5rem] bg-white p-8 sm:p-16 shadow-2xl border border-stone-100 prose prose-stone max-w-none prose-headings:font-serif prose-headings:font-medium prose-headings:text-brand-950 prose-a:text-brand-700">
                    <p className="lead">Welcome to <strong>IG Holidays</strong>, an official brand of <strong>Infygru Private Limited</strong>. By accessing or using our website and services, you agree to the following Terms &amp; Conditions. Please read them carefully.</p>

                    <h2>1. Acceptance of Terms</h2>
                    <p>By using igholidays.com, you confirm that you are at least 18 years old and legally capable of entering into binding agreements. If you are booking on behalf of others, you accept these terms on their behalf as well.</p>

                    <h2>2. Services Offered</h2>
                    <p>IG Holidays, operated by Infygru Private Limited, provides travel planning and booking services including but not limited to holiday packages, flight bookings, hotel bookings, visa assistance, and travel insurance referrals. We act as an intermediary between clients and travel service providers.</p>

                    <h2>3. Booking and Payments</h2>
                    <ul>
                        <li>All bookings are subject to availability and confirmation by IG Holidays.</li>
                        <li>A minimum non-refundable deposit is required at the time of booking, as communicated during the booking process.</li>
                        <li>Full payment is required at least 30 days prior to departure unless otherwise agreed in writing.</li>
                        <li>Prices are subject to change due to currency fluctuations, fuel surcharges, or actions by airlines, hotels, or other suppliers.</li>
                    </ul>

                    <h2>4. Cancellations and Refunds</h2>
                    <p>Cancellations must be communicated in writing to <a href="mailto:info@igholidays.com">info@igholidays.com</a>. Applicable cancellation charges depend on the timing of cancellation and the policies of airlines, hotels, and other suppliers involved. Please also refer to our <Link href="/refund-policy">Refund Policy</Link>.</p>

                    <h2>5. Passports, Visas, and Health Requirements</h2>
                    <p>It is the client's responsibility to ensure they hold valid travel documents for all destinations. IG Holidays will provide guidance but bears no liability for denied boarding, entry, or visa refusals.</p>

                    <h2>6. Travel Insurance</h2>
                    <p>We strongly recommend all clients obtain comprehensive travel insurance prior to departure. IG Holidays is not liable for any losses, medical expenses, or other costs that travel insurance would typically cover.</p>

                    <h2>7. Liability</h2>
                    <p>IG Holidays acts as an agent for airlines, hotels, and tour operators. We are not liable for failure to perform, delays, changes, or cancellations caused by or arising out of events beyond our reasonable control, including natural disasters, pandemics, government actions, or supplier insolvencies.</p>

                    <h2>8. Intellectual Property</h2>
                    <p>All content on this website, including text, images, logos, and designs, is the intellectual property of Infygru Private Limited or its licensors and may not be reproduced without written consent.</p>

                    <h2>9. Governing Law</h2>
                    <p>These Terms &amp; Conditions are governed by the laws of India. Any disputes will be subject to the exclusive jurisdiction of the courts in Tamil Nadu, India.</p>

                    <h2>10. Contact Us</h2>
                    <p>For any queries regarding these Terms &amp; Conditions, please contact us at <a href="mailto:info@igholidays.com">info@igholidays.com</a>.</p>

                    <hr />
                    <p className="text-sm text-stone-500">IG Holidays is an official brand of <strong>Infygru Private Limited</strong>. Registered in India.</p>
                </div>
            </section>
        </main>
    );
}
