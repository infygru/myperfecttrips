import Navbar from "@/components/layout/Header/Navbar";


export default function PrivacyPolicy() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            <div className="pt-32 pb-20 container mx-auto px-4 max-w-4xl">
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-10 tracking-tight">Privacy Policy</h1>

                <div className="space-y-8 text-slate-600 leading-relaxed md:text-lg">
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Introduction</h2>
                        <p>
                            Welcome to My Perfect Trips ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice or our practices with regard to your personal information, please contact us.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Information We Collect</h2>
                        <p className="mb-4">
                            We collect personal information that you voluntarily provide to us when you express an interest in obtaining information about us or our products and services, when you participate in activities on the Website, or otherwise when you contact us.
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Names</li>
                            <li>Phone numbers</li>
                            <li>Email addresses</li>
                            <li>Mailing addresses</li>
                            <li>Billing addresses</li>
                            <li>Debit/credit card numbers</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">3. How We Use Your Information</h2>
                        <p>
                            We use personal information collected via our Website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Sharing Your Information</h2>
                        <p>
                            We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Data Retention</h2>
                        <p>
                            We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy notice, unless a longer retention period is required or permitted by law.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Contact Us</h2>
                        <p>
                            If you have questions or comments about this notice, you may email us at hello@myperfecttrips.co.uk or by post to:
                            <br /><br />
                            My Perfect Trips<br />
                            Altrincham, Manchester<br />
                            United Kingdom
                        </p>
                    </section>
                </div>
            </div>

        </main>
    );
}
