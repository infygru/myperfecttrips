import type { Metadata } from "next";
import Link from "next/link";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://myperfecttrips.com";

export const metadata: Metadata = {
    title: "Privacy Policy | My Perfect Trips",
    description: "Learn how My Perfect Trips collects, uses, and protects your personal information in compliance with applicable data protection laws.",
    alternates: { canonical: `${BASE}/privacy-policy` },
    robots: { index: true, follow: false },
    openGraph: { title: "Privacy Policy | My Perfect Trips", url: `${BASE}/privacy-policy`, siteName: "My Perfect Trips", type: "website" },
};

export default function PrivacyPolicyPage() {
    return (
        <main className="min-h-screen bg-stone-50 pb-24">
            <section className="relative bg-brand-950 px-4 pt-20 pb-24 sm:px-6 lg:px-8">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-800 via-brand-950 to-brand-950 opacity-80" />
                <div className="container-inner relative z-10 flex flex-col items-center text-center">
                    <span className="section-label !text-gold-400 before:!bg-gold-400/30 after:!bg-gold-400/30">Legal</span>
                    <h1 className="mb-4 font-serif text-5xl font-medium text-white sm:text-6xl tracking-tight">Privacy Policy</h1>
                    <p className="max-w-xl text-stone-400 font-light">Last updated: March 2025</p>
                </div>
            </section>

            <section className="container-inner -mt-12 relative z-20">
                <div className="rounded-[2.5rem] bg-white p-8 sm:p-16 shadow-2xl border border-stone-100 prose prose-stone max-w-none prose-headings:font-serif prose-headings:font-medium prose-headings:text-brand-950 prose-a:text-brand-700">
                    <p className="lead">Your privacy matters to us. This Privacy Policy explains how <strong>Infygru Private Limited</strong> (operating as <strong>My Perfect Trips</strong>) collects, uses, and safeguards your personal information.</p>

                    <h2>1. Information We Collect</h2>
                    <p>We may collect the following personal information:</p>
                    <ul>
                        <li><strong>Contact Information:</strong> Name, phone number, email address.</li>
                        <li><strong>Travel Details:</strong> Passport information, travel dates, destination preferences, dietary and health requirements shared voluntarily.</li>
                        <li><strong>Payment Information:</strong> Processed securely through certified payment gateways. We do not store full card details.</li>
                        <li><strong>Website Usage Data:</strong> IP address, browser type, pages visited, and cookies (see our <Link href="/cookie-policy">Cookie Policy</Link>).</li>
                    </ul>

                    <h2>2. How We Use Your Information</h2>
                    <ul>
                        <li>To process and confirm bookings and enquiries.</li>
                        <li>To communicate with you about your travel arrangements.</li>
                        <li>To comply with legal obligations and supplier requirements.</li>
                        <li>To send you marketing communications where you have given consent.</li>
                        <li>To improve our website and services.</li>
                    </ul>

                    <h2>3. Data Sharing</h2>
                    <p>We share your personal data only as necessary with:</p>
                    <ul>
                        <li>Airlines, hotels, and tour operators to fulfill your booking.</li>
                        <li>Payment processors for secure transaction handling.</li>
                        <li>Government authorities where required by law (e.g., visa applications).</li>
                    </ul>
                    <p>We do not sell your personal data to third parties.</p>

                    <h2>4. Data Retention</h2>
                    <p>We retain personal data for as long as necessary to provide our services and comply with legal obligations, generally up to 5 years for booking-related records.</p>

                    <h2>5. Your Rights</h2>
                    <p>You have the right to access, correct, or request deletion of your personal data at any time by contacting us at <a href="mailto:info@myperfecttrips.com">info@myperfecttrips.com</a>.</p>

                    <h2>6. Security</h2>
                    <p>We implement appropriate technical and organizational measures to protect your data against unauthorized access, alteration, disclosure, or destruction.</p>

                    <h2>7. Cookies</h2>
                    <p>We use cookies to enhance your browsing experience. See our <Link href="/cookie-policy">Cookie Policy</Link> for details.</p>

                    <h2>8. Changes to this Policy</h2>
                    <p>We may update this Privacy Policy from time to time. We will notify you of significant changes via our website or email.</p>

                    <h2>9. Contact Us</h2>
                    <p>For privacy-related queries: <a href="mailto:info@myperfecttrips.com">info@myperfecttrips.com</a></p>

                    <hr />
                    <p className="text-sm text-stone-500">My Perfect Trips is an official brand of <strong>Infygru Private Limited</strong>. Registered in India.</p>
                </div>
            </section>
        </main>
    );
}
