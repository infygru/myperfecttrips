import type { Metadata } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://igholidays.com";

export const metadata: Metadata = {
    title: "Cookie Policy | IG Holidays",
    description: "Understand how IG Holidays uses cookies and similar tracking technologies to improve your browsing experience on our website.",
    alternates: { canonical: `${BASE}/cookie-policy` },
    robots: { index: true, follow: false },
    openGraph: { title: "Cookie Policy | IG Holidays", url: `${BASE}/cookie-policy`, siteName: "IG Holidays", type: "website" },
};

export default function CookiePolicyPage() {
    return (
        <main className="min-h-screen bg-stone-50 pb-24">
            <section className="relative bg-brand-950 px-4 pt-20 pb-24 sm:px-6 lg:px-8">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-800 via-brand-950 to-brand-950 opacity-80" />
                <div className="container-inner relative z-10 flex flex-col items-center text-center">
                    <span className="section-label !text-gold-400 before:!bg-gold-400/30 after:!bg-gold-400/30">Legal</span>
                    <h1 className="mb-4 font-serif text-5xl font-medium text-white sm:text-6xl tracking-tight">Cookie Policy</h1>
                    <p className="max-w-xl text-stone-400 font-light">Last updated: March 2025</p>
                </div>
            </section>

            <section className="container-inner -mt-12 relative z-20">
                <div className="rounded-[2.5rem] bg-white p-8 sm:p-16 shadow-2xl border border-stone-100 prose prose-stone max-w-none prose-headings:font-serif prose-headings:font-medium prose-headings:text-brand-950 prose-a:text-brand-700">
                    <p className="lead">This Cookie Policy explains what cookies are, how <strong>IG Holidays</strong> (Infygru Private Limited) uses them, and how you can manage your cookie preferences.</p>

                    <h2>1. What are Cookies?</h2>
                    <p>Cookies are small text files placed on your device when you visit a website. They help websites remember your preferences, understand how you use the site, and improve your experience.</p>

                    <h2>2. Types of Cookies We Use</h2>
                    <ul>
                        <li><strong>Strictly Necessary Cookies:</strong> Essential for the website to function. They cannot be disabled. These include session management and security cookies.</li>
                        <li><strong>Functional Cookies:</strong> Remember your preferences and settings (e.g., language, currency) to improve your experience.</li>
                        <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website by collecting anonymous data on page visits, time spent, and navigation paths.</li>
                        <li><strong>Marketing Cookies:</strong> Used to track visitors across websites to display relevant advertising. We only use these with your explicit consent.</li>
                    </ul>

                    <h2>3. Third-Party Cookies</h2>
                    <p>We may use third-party services such as Google Analytics, Razorpay (payment gateway), and social media platforms that set their own cookies. These third parties have their own privacy policies governing their cookie use.</p>

                    <h2>4. Managing Cookies</h2>
                    <p>You can control or delete cookies at any time through your browser settings. Please note that disabling certain cookies may affect the functionality of our website. You can also opt out of analytics cookies via our cookie consent banner when you first visit our site.</p>

                    <h2>5. Cookie Consent</h2>
                    <p>On your first visit, we will ask for your consent to place non-essential cookies. You can change your preferences at any time by clearing your browser cookies and revisiting our site.</p>

                    <h2>6. Contact Us</h2>
                    <p>For questions about our cookie use, contact us at <a href="mailto:info@igholidays.com">info@igholidays.com</a>.</p>

                    <hr />
                    <p className="text-sm text-stone-500">IG Holidays is an official brand of <strong>Infygru Private Limited</strong>. Registered in India.</p>
                </div>
            </section>
        </main>
    );
}
