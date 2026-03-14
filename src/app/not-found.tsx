import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Page Not Found | IG Holidays",
    description: "The page you are looking for does not exist. Browse our holiday packages or return home.",
    robots: { index: false, follow: false },
};

export default function NotFound() {
    return (
        <main className="min-h-screen bg-[#F8F7F4] flex items-center justify-center px-4">
            <div className="text-center max-w-lg">
                <p className="text-gold-500 text-xs font-bold uppercase tracking-[0.3em] mb-4">404 — Page Not Found</p>
                <h1 className="font-serif text-5xl sm:text-6xl font-medium text-brand-950 mb-4">
                    Lost in Transit
                </h1>
                <p className="text-stone-500 text-base mb-8 leading-relaxed">
                    The page you&apos;re looking for doesn&apos;t exist or may have moved. Let us guide you back to your next adventure.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link href="/" className="btn-gold px-8 py-3 text-sm">
                        Back to Home
                    </Link>
                    <Link href="/packages" className="btn-outline px-8 py-3 text-sm">
                        Browse Packages
                    </Link>
                </div>
            </div>
        </main>
    );
}
