import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Linkedin, MapPin, Mail, Smartphone, Compass } from "lucide-react";
import { unstable_noStore as noStore } from "next/cache";
import { directus } from "@/lib/directus";
import { readSingleton } from "@directus/sdk";

export default async function Footer() {
    noStore();
    let s: any = null;
    try {
        s = await directus.request(readSingleton("site_settings" as any));
    } catch { }

    const dUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://localhost:8055";
    const logoUrl = s?.logo ? `${dUrl}/assets/${s.logo}` : null;
    const email = s?.contact_email || "hello@igholidays.com";
    const phone = s?.contact_phone || "+91 98765 43210";
    const address = s?.office_address || "Tamil Nadu, India";
    const fbUrl = s?.facebook_url || "#";
    const igUrl = s?.instagram_url || "#";
    const liUrl = s?.linkedin_url || "#";
    const siteName = s?.site_name || "IGHolidays";

    const columns = [
        {
            title: "Destinations",
            links: [
                { name: "Kerala", href: "#" },
                { name: "Rajasthan", href: "#" },
                { name: "Maldives", href: "#" },
                { name: "Europe", href: "#" },
                { name: "Japan", href: "#" },
            ],
        },
        {
            title: "Services",
            links: [
                { name: "All Services", href: "/services" },
                { name: "Holiday Packages", href: "/packages" },
                { name: "Corporate MICE", href: "/services" },
                { name: "Visa Assistance", href: "/services" },
            ],
        },
        {
            title: "Company",
            links: [
                { name: "About Us", href: "/about" },
                { name: "Blog", href: "/blog" },
                { name: "Contact", href: "/contact" },
                { name: "Careers", href: "#" },
                { name: "Privacy Policy", href: "#" },
            ],
        },
    ];

    return (
        <footer className="bg-brand-950 text-stone-400">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-5 xl:gap-16">
                    {/* Brand Info */}
                    <div className="lg:col-span-2 space-y-8">
                        <Link href="/" className="inline-flex items-center gap-3">
                            {logoUrl ? (
                                <Image
                                    src={logoUrl}
                                    alt={siteName}
                                    width={160}
                                    height={44}
                                    className="h-10 w-auto object-contain"
                                    unoptimized
                                />
                            ) : (
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-400">
                                        <Compass className="h-6 w-6 text-brand-950" />
                                    </div>
                                    <span className="font-serif text-2xl font-semibold tracking-tight text-white">
                                        {siteName}
                                    </span>
                                </div>
                            )}
                        </Link>

                        <p className="text-sm leading-7 text-stone-400 max-w-md">
                            The leading premium travel agency in India. We craft bespoke international holiday packages, corporate MICE, and luxury domestic tours designed to exceed your expectations.
                        </p>

                        {/* Contact details */}
                        <ul className="space-y-4 text-sm font-medium text-stone-300">
                            <li>
                                <a href={`tel:${phone}`} className="flex items-center gap-3 transition-colors hover:text-gold-300">
                                    <Smartphone className="h-4 w-4 text-brand-500" />
                                    {phone}
                                </a>
                            </li>
                            <li>
                                <a href={`mailto:${email}`} className="flex items-center gap-3 transition-colors hover:text-gold-300">
                                    <Mail className="h-4 w-4 text-brand-500" />
                                    {email}
                                </a>
                            </li>
                            <li className="flex items-start gap-3">
                                <MapPin className="h-4 w-4 shrink-0 text-brand-500 mt-0.5" />
                                <span className="leading-snug">{address}</span>
                            </li>
                        </ul>

                        {/* Social Icons */}
                        <div className="flex items-center gap-3 pt-2">
                            {[
                                { href: fbUrl, Icon: Facebook, label: "Facebook" },
                                { href: igUrl, Icon: Instagram, label: "Instagram" },
                                { href: liUrl, Icon: Linkedin, label: "LinkedIn" },
                            ].map(({ href, Icon, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-900 border border-brand-800 text-stone-300 transition-all hover:bg-gold-500 hover:text-brand-950 hover:border-gold-500"
                                >
                                    <Icon className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns */}
                    {columns.map((col) => (
                        <div key={col.title}>
                            <h4 className="mb-6 text-xs font-bold uppercase tracking-wider text-white">
                                {col.title}
                            </h4>
                            <ul className="space-y-4 text-sm">
                                {col.links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="transition-colors text-stone-400 hover:text-gold-300"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-brand-900 bg-brand-950">
                <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:px-6 md:flex-row lg:px-8 text-xs text-stone-500">
                    <p>&copy; {new Date().getFullYear()} {siteName}. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <Link href="#" className="transition-colors hover:text-stone-300">Privacy Policy</Link>
                        <Link href="#" className="transition-colors hover:text-stone-300">Terms of Service</Link>
                        <Link href="#" className="transition-colors hover:text-stone-300">Cookie Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
