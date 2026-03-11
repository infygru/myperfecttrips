import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Linkedin, MapPin, Mail, Compass } from "lucide-react";
import { unstable_noStore as noStore } from "next/cache";
import { directus, getSiteSettings } from "@/lib/directus";
import { readItems } from "@directus/sdk";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";

export default async function Footer() {
    noStore();
    let s: any = null;
    let dynamicDestinations: { name: string; href: string }[] = [];
    try {
        s = await getSiteSettings();
    } catch { }

    try {
        const pkgs = (await directus.request(readItems("packages" as any, { limit: 100, fields: ["destinations"] as any }))) as any[];
        const allDests: string[] = pkgs.flatMap((p: any) => Array.isArray(p.destinations) ? p.destinations : []);
        const unique = Array.from(new Set(allDests)).slice(0, 5);
        dynamicDestinations = unique.map((d) => ({ name: d, href: `/packages?destination=${encodeURIComponent(d)}` }));
    } catch { }

    if (dynamicDestinations.length === 0) {
        dynamicDestinations = [
            { name: "Kerala", href: "/packages" },
            { name: "Rajasthan", href: "/packages" },
            { name: "Maldives", href: "/packages" },
            { name: "Europe", href: "/packages" },
            { name: "Japan", href: "/packages" },
        ];
    }

    const dUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://localhost:8055";
    const logoUrl = s?.logo ? `${dUrl}/assets/${s.logo}` : null;
    const email = s?.contact_email || "info@igholidays.com";
    const phone = s?.contact_phone || "+91 98765 43210";
    const address = s?.office_address || "Tamil Nadu, India";
    const fbUrl = s?.facebook_url || "#";
    const igUrl = s?.instagram_url || "#";
    const liUrl = s?.linkedin_url || "#";
    const siteName = s?.site_name || "IGHolidays";

    const columns = [
        {
            title: "Destinations",
            links: dynamicDestinations,
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
                { name: "Terms & Conditions", href: "/terms" },
                { name: "Privacy Policy", href: "/privacy-policy" },
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
                                <div className="bg-white rounded-xl p-2 inline-flex">
                                <Image
                                    src={logoUrl}
                                    alt={siteName}
                                    width={160}
                                    height={44}
                                    className="h-10 w-auto object-contain"
                                    unoptimized
                                />
                                </div>
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
                        <p className="text-xs text-stone-500 italic">{siteName} is an official brand of Infygru Private Limited.</p>

                        {/* Contact details */}
                        <ul className="space-y-4 text-sm font-medium text-stone-300">
                            <li>
                                <a href={`https://wa.me/${phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 transition-colors hover:text-[#25D366]">
                                    <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
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
                    <p>&copy; {new Date().getFullYear()} {siteName} &mdash; an official brand of Infygru Private Limited. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <Link href="/privacy-policy" className="transition-colors hover:text-stone-300">Privacy</Link>
                        <Link href="/terms" className="transition-colors hover:text-stone-300">Terms</Link>
                        <Link href="/cookie-policy" className="transition-colors hover:text-stone-300">Cookies</Link>
                        <Link href="/refund-policy" className="transition-colors hover:text-stone-300">Refund Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
