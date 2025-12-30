import Navbar from "@/components/layout/Header/Navbar";

export default function TermsAndConditions() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            <div className="pt-32 pb-20 container mx-auto px-4 max-w-4xl">
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-10 tracking-tight">Terms and Conditions</h1>

                <div className="space-y-8 text-slate-600 leading-relaxed md:text-lg">
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Agreement to Terms</h2>
                        <p>
                            These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and My Perfect Trips ("we," "us" or "our"), concerning your access to and use of the My Perfect Trips website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the "Site").
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Intellectual Property Rights</h2>
                        <p>
                            Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">3. User Representations</h2>
                        <p>
                            By using the Site, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information and promptly update such registration information as necessary; (3) you represent and warrant that you have the legal capacity and you agree to comply with these Terms and Conditions.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Bookings and Payments</h2>
                        <p>
                            All bookings are subject to availability and acceptance by us. We reserve the right to refuse any booking at our sole discretion. Prices are subject to change without notice. Full payment or a deposit may be required at the time of booking, as specified during the booking process.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Cancellation and Refund Policy</h2>
                        <p>
                            Cancellation and refund policies vary depending on the specific travel arrangements booked. Please refer to the specific terms and conditions provided at the time of your booking. We strongly recommend purchasing travel insurance to cover any potential cancellations.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Limitation of Liability</h2>
                        <p>
                            In no event will we or our directors, employees, or agents be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages, including lost profit, lost revenue, loss of data, or other damages arising from your use of the site.
                        </p>
                    </section>
                </div>
            </div>

        </main>
    );
}
