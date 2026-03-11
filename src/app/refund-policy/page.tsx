import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Refund & Cancellation Policy | IG Holidays",
    description: "Understand the cancellation and refund policy for bookings made through IG Holidays – an official brand of Infygru Private Limited.",
};

export default function RefundPolicyPage() {
    return (
        <main className="min-h-screen bg-stone-50 pb-24">
            <section className="relative bg-brand-950 px-4 pt-20 pb-24 sm:px-6 lg:px-8">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-800 via-brand-950 to-brand-950 opacity-80" />
                <div className="container-inner relative z-10 flex flex-col items-center text-center">
                    <span className="section-label !text-gold-400 before:!bg-gold-400/30 after:!bg-gold-400/30">Legal</span>
                    <h1 className="mb-4 font-serif text-5xl font-medium text-white sm:text-6xl tracking-tight">Refund &amp; Cancellation</h1>
                    <p className="max-w-xl text-stone-400 font-light">Last updated: March 2025</p>
                </div>
            </section>

            <section className="container-inner -mt-12 relative z-20">
                <div className="rounded-[2.5rem] bg-white p-8 sm:p-16 shadow-2xl border border-stone-100 prose prose-stone max-w-none prose-headings:font-serif prose-headings:font-medium prose-headings:text-brand-950 prose-a:text-brand-700">
                    <p className="lead">At <strong>IG Holidays</strong> (Infygru Private Limited), we understand that plans change. This policy outlines our cancellation and refund procedures for bookings made through us.</p>

                    <h2>1. Cancellation by the Client</h2>
                    <p>Cancellation charges are calculated from the date we receive your written cancellation notice at <a href="mailto:info@igholidays.com">info@igholidays.com</a>, and are as follows:</p>
                    <ul>
                        <li><strong>60+ days before departure:</strong> Loss of deposit only.</li>
                        <li><strong>45–59 days before departure:</strong> 25% of total package cost.</li>
                        <li><strong>30–44 days before departure:</strong> 50% of total package cost.</li>
                        <li><strong>15–29 days before departure:</strong> 75% of total package cost.</li>
                        <li><strong>0–14 days before departure:</strong> 100% of total package cost (no refund).</li>
                    </ul>
                    <p>Please note that airline cancellation fees, visa fees, and insurance premiums are generally non-refundable and may apply in addition to the above.</p>

                    <h2>2. Non-Refundable Items</h2>
                    <p>The following are strictly non-refundable regardless of cancellation timing:</p>
                    <ul>
                        <li>Airline tickets (unless the airline explicitly allows refunds).</li>
                        <li>Visa application fees and travel insurance premiums.</li>
                        <li>Booking deposits as communicated at the time of booking.</li>
                        <li>Payments to third-party suppliers who have their own non-refundable policies.</li>
                    </ul>

                    <h2>3. Cancellation by IG Holidays</h2>
                    <p>In rare circumstances, we may need to cancel a booking (e.g., due to insufficient bookings, natural disasters, or events beyond our control). In such cases, we will:</p>
                    <ul>
                        <li>Notify you at the earliest opportunity.</li>
                        <li>Offer an alternative package of equivalent value, or</li>
                        <li>Provide a full refund of all monies paid to us, less any unrecoverable third-party costs.</li>
                    </ul>

                    <h2>4. Refund Process</h2>
                    <p>Approved refunds will be processed within <strong>10–15 business days</strong> of the cancellation confirmation to the original payment method. Processing time may vary depending on your bank or payment provider.</p>

                    <h2>5. Amendments</h2>
                    <p>Changes to bookings (dates, destinations, accommodation) may incur amendment fees from airlines and hotels on top of our administrative fee of ₹1,500 per person per change.</p>

                    <h2>6. Travel Insurance</h2>
                    <p>We strongly recommend purchasing comprehensive travel insurance which may cover cancellation costs in certain circumstances. Please consult your insurance provider for details.</p>

                    <h2>7. Contact Us</h2>
                    <p>To request a cancellation or discuss a refund, please contact us at <a href="mailto:info@igholidays.com">info@igholidays.com</a> with your booking reference number.</p>

                    <hr />
                    <p className="text-sm text-stone-500">IG Holidays is an official brand of <strong>Infygru Private Limited</strong>. Registered in India.</p>
                </div>
            </section>
        </main>
    );
}
