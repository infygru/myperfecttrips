import Navbar from "@/components/layout/Header/Navbar";


export default function CookiePolicy() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            <div className="pt-32 pb-20 container mx-auto px-4 max-w-4xl">
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-10 tracking-tight">Cookie Policy</h1>

                <div className="space-y-8 text-slate-600 leading-relaxed md:text-lg">
                    <section>
                        <p>
                            This Cookie Policy explains how My Perfect Trips uses cookies and similar technologies to recognize you when you visit our website. It explains what these technologies are and why we use them, as well as your rights to control our use of them.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">What use are cookies?</h2>
                        <p>
                            Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
                        </p>
                        <p className="mt-4">
                            Cookies set by the website owner (in this case, My Perfect Trips) are called "first-party cookies". Cookies set by parties other than the website owner are called "third-party cookies". Third-party cookies enable third-party features or functionality to be provided on or through the website (e.g., advertising, interactive content, and analytics).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Why do we use cookies?</h2>
                        <p>
                            We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our Website to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our Online Properties. Third parties serve cookies through our Website for advertising, analytics, and other purposes.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Types of Cookies We Use</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Essential Cookies:</strong> These are cookies that are strictly necessary to provide you with services available through our Website.</li>
                            <li><strong>Performance and Functionality Cookies:</strong> These are used to enhance the performance and functionality of our Website but are non-essential to their use.</li>
                            <li><strong>Analytics and Customization Cookies:</strong> These collect information that is used either in aggregate form to help us understand how our Website is being used or to help us customize our Website for you.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Controling Cookies</h2>
                        <p>
                            You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in the Cookie Consent Manager. The Cookie Consent Manager allows you to select which categories of cookies you accept or reject.
                        </p>
                    </section>
                </div>
            </div>

        </main>
    );
}
