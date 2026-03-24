import Link from 'next/link';
import { Compass, ArrowLeft, Mail } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Reset Password | My Perfect Trips' };

export default function ForgotPasswordPage() {
    return (
        <main className="min-h-screen bg-stone-50 flex items-center justify-center px-4 py-16">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2.5 group">
                        <div className="h-10 w-10 rounded-xl bg-brand-900 flex items-center justify-center group-hover:bg-brand-800 transition-colors">
                            <Compass className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-serif text-xl font-semibold text-brand-950">My Perfect Trips</span>
                    </Link>
                </div>

                <div className="rounded-2xl border border-stone-200 bg-white p-8 shadow-sm text-center">
                    <div className="h-14 w-14 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-5">
                        <Mail className="h-7 w-7 text-brand-700" />
                    </div>
                    <h1 className="text-xl font-bold text-stone-900 mb-2">Reset your password</h1>
                    <p className="text-stone-500 text-sm mb-6 leading-relaxed">
                        To reset your password, please contact our support team directly — we&apos;ll help you regain access within minutes.
                    </p>

                    <div className="space-y-3">
                        <a href="tel:+918807709919"
                            className="flex w-full items-center justify-center gap-2 h-11 rounded-xl bg-brand-900 text-white text-sm font-semibold hover:bg-brand-800 transition-colors">
                            Call +91 8807709919
                        </a>
                        <a href="https://wa.me/918807709919" target="_blank" rel="noopener noreferrer"
                            className="flex w-full items-center justify-center gap-2 h-11 rounded-xl border-2 border-stone-200 text-sm font-semibold text-stone-700 hover:bg-stone-50 transition-colors">
                            WhatsApp Support
                        </a>
                    </div>
                </div>

                <div className="text-center mt-6">
                    <Link href="/auth/login" className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-brand-700 transition-colors">
                        <ArrowLeft className="h-4 w-4" /> Back to sign in
                    </Link>
                </div>
            </div>
        </main>
    );
}
