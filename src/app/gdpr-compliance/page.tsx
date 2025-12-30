import Navbar from "@/components/layout/Header/Navbar";

export default function GDPRCompliance() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            <div className="pt-32 pb-20 container mx-auto px-4 max-w-4xl">
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-10 tracking-tight">GDPR Compliance</h1>

                <div className="space-y-8 text-slate-600 leading-relaxed md:text-lg">
                    <section>
                        <p>
                            My Perfect Trips is committed to ensuring the security and protection of the personal information that we process, and to provide a compliant and consistent approach to data protection. We have always had a robust and effective data protection program in place which complies with existing law and abides by the data protection principles. However, we recognize our obligations in updating and expanding this program to meet the demands of the GDPR.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Your Rights Under GDPR</h2>
                        <p className="mb-4">
                            Under the General Data Protection Regulation (GDPR), you possess a number of rights in relation to your Personal Data. These include:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>The Right to Access:</strong> You have the right to request a copy of the information that we hold about you.</li>
                            <li><strong>The Right to Rectification:</strong> You have the right to request that we correct any information you believe is inaccurate or complete information you believe is incomplete.</li>
                            <li><strong>The Right to Erasure:</strong> You have the right to request that we erase your personal data, under certain conditions (also known as the "right to be forgotten").</li>
                            <li><strong>The Right to Restrict Processing:</strong> You have the right to request that we restrict the processing of your personal data, under certain conditions.</li>
                            <li><strong>The Right to Data Portability:</strong> You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Data Protection Measures</h2>
                        <p>
                            We take the privacy and security of individuals and their personal information very seriously and take every reasonable measure and precaution to protect and secure the personal data that we process. We have dedicated information security policies and procedures in place to protect personal information from unauthorized access, alteration, disclosure, or destruction.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Contacting Our DPO</h2>
                        <p>
                            We have appointed a Data Protection Officer (DPO) to oversee compliance with this policy. If you have any questions about this policy or how we handle your personal information, please contact our DPO at privacy@myperfecttrips.co.uk.
                        </p>
                    </section>
                </div>
            </div>

        </main>
    );
}
