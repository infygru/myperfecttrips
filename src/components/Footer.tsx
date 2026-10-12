import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Linkedin, MapPin, Mail, Phone, Youtube } from "lucide-react";
import { unstable_noStore as noStore } from "next/cache";
import { directus, getSiteSettings } from "@/lib/directus";
import { readItems } from "@directus/sdk";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { Compass } from "lucide-react";

export default async function Footer() {
    noStore();
    let s: any = null;
    let domesticPkgs: { name: string; slug: string }[] = [];
    let intlPkgs: { name: string; slug: string }[] = [];
    let popularDests: { name: string }[] = [];

    try { s = await getSiteSettings(); } catch { }

    try {
        const pkgs = (await directus.request(
            readItems("packages" as any, {
                limit: 100,
                fields: ["title", "slug", "package_type", "destination"] as any,
            })
        )) as any[];

        // Domestic — pick up to 6
        domesticPkgs = pkgs
            .filter((p) => p.package_type === "domestic" && p.title && p.slug)
            .slice(0, 6)
            .map((p) => ({ name: p.title, slug: p.slug }));

        // International — pick up to 6
        intlPkgs = pkgs
            .filter((p) => p.package_type === "international" && p.title && p.slug)
            .slice(0, 6)
            .map((p) => ({ name: p.title, slug: p.slug }));

        // Popular destinations — unique destination strings from all packages
        const destSet = new Map<string, number>();
        for (const p of pkgs) {
            const d = p.destination?.split(/[·,]/)[0]?.trim();
            if (d) destSet.set(d, (destSet.get(d) || 0) + 1);
        }
        popularDests = Array.from(destSet.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8)
            .map(([name]) => ({ name }));
    } catch { }

    const dUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://localhost:8055";
    const logoUrl  = s?.logo            ? `${dUrl}/assets/${s.logo}` : null;
    const email    = s?.contact_email   || "info@myperfecttrips.com";
    const phone    = s?.contact_phone   || "+91 8807709919";
    const address  = s?.office_address  || "Bartle House, 9 Oxford Court, Manchester, M2 3WQ";
    const fbUrl    = s?.facebook_url    || "#";
    const igUrl    = s?.instagram_url   || "#";
    const liUrl    = s?.linkedin_url    || "#";
    const ytUrl    = s?.youtube_url     || "#";
    const siteName = s?.site_name       || "My Perfect Trips";

    const year = new Date().getFullYear();

    return (
        <footer className="bg-brand-950 text-stone-400">

            {/* ── MAIN GRID ── */}
            <div className="container-inner py-14 lg:py-20">
                <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-5 xl:gap-x-10">

                    {/* ── BRAND ── (spans 2 cols on all sizes) */}
                    <div className="col-span-2 sm:col-span-3 lg:col-span-2 space-y-6 pr-0 lg:pr-6">

                        {/* Logo / name */}
                        <Link href="/" className="inline-flex items-center gap-3">
                            {logoUrl ? (
                                <div className="inline-flex rounded-xl bg-white p-2">
                                    <Image src={logoUrl} alt={siteName} width={140} height={40}
                                        className="h-9 w-auto object-contain" />
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-400">
                                        <Compass className="h-5 w-5 text-brand-950" />
                                    </div>
                                    <span className="font-serif text-xl font-semibold text-white">{siteName}</span>
                                </div>
                            )}
                        </Link>

                        <p className="text-sm leading-relaxed text-stone-400 max-w-sm">
                            India's premium travel agency crafting bespoke domestic &amp; international holidays,
                            honeymoon tours, family packages, corporate MICE, and luxury retreats since 2009.
                        </p>

                        {/* Trust badges */}
                        <div className="flex flex-wrap gap-2">
                            {["15+ Yrs Experience", "10,000+ Happy Travellers", "24/7 Support"].map((b) => (
                                <span key={b} className="rounded-full border border-brand-800 bg-brand-900/60 px-3 py-1 text-[10px] font-semibold text-stone-400">
                                    {b}
                                </span>
                            ))}
                        </div>

                        {/* Contact */}
                        <ul className="space-y-3 text-sm font-medium text-stone-300">
                            <li>
                                <a href={`https://wa.me/${phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-3 transition-colors hover:text-[#25D366]">
                                    <WhatsAppIcon className="h-4 w-4 shrink-0 text-[#25D366]" />
                                    {phone}
                                </a>
                            </li>
                            <li>
                                <a href={`tel:${phone.replace(/\D/g, "")}`}
                                    className="flex items-center gap-3 transition-colors hover:text-gold-300">
                                    <Phone className="h-4 w-4 shrink-0 text-brand-500" />
                                    {phone}
                                </a>
                            </li>
                            <li>
                                <a href={`mailto:${email}`}
                                    className="flex items-center gap-3 transition-colors hover:text-gold-300">
                                    <Mail className="h-4 w-4 shrink-0 text-brand-500" />
                                    {email}
                                </a>
                            </li>
                            <li className="flex items-start gap-3 text-stone-400">
                                <MapPin className="h-4 w-4 shrink-0 text-brand-500 mt-0.5" />
                                <span className="leading-snug">{address}</span>
                            </li>
                        </ul>

                        {/* Social */}
                        <div className="flex items-center gap-2.5 pt-1">
                            {[
                                { href: fbUrl, Icon: Facebook,  label: "Facebook"  },
                                { href: igUrl, Icon: Instagram, label: "Instagram" },
                                { href: liUrl, Icon: Linkedin,  label: "LinkedIn"  },
                                { href: ytUrl, Icon: Youtube,   label: "YouTube"   },
                            ].map(({ href, Icon, label }) => (
                                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                                    aria-label={label}
                                    className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-800 bg-brand-900 text-stone-400 transition-all hover:border-gold-400 hover:bg-gold-400 hover:text-brand-950">
                                    <Icon className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* ── DOMESTIC TOURS ── */}
                    <div>
                        <h3 className="mb-5 text-xs font-black uppercase tracking-widest text-white">
                            Domestic Tours
                        </h3>
                        <ul className="space-y-3 text-sm">
                            {domesticPkgs.length > 0 ? (
                                domesticPkgs.map((p) => (
                                    <li key={p.slug}>
                                        <Link href={`/packages/${p.slug}`}
                                            className="leading-snug text-stone-400 transition-colors hover:text-gold-300 line-clamp-2">
                                            {p.name}
                                        </Link>
                                    </li>
                                ))
                            ) : (
                                [
                                    { name: "Kerala Backwaters Tour",    href: "/packages?package_type=domestic" },
                                    { name: "Rajasthan Heritage Circuit", href: "/packages?package_type=domestic" },
                                    { name: "Goa Beach Holiday",          href: "/packages?package_type=domestic" },
                                    { name: "Himachal Pradesh Escape",    href: "/packages?package_type=domestic" },
                                    { name: "Andaman Island Package",     href: "/packages?package_type=domestic" },
                                    { name: "Kashmir Paradise Tour",      href: "/packages?package_type=domestic" },
                                ].map((l) => (
                                    <li key={l.name}>
                                        <Link href={l.href} className="text-stone-400 transition-colors hover:text-gold-300">
                                            {l.name}
                                        </Link>
                                    </li>
                                ))
                            )}
                            <li className="pt-1">
                                <Link href="/packages?package_type=domestic"
                                    className="text-xs font-bold text-brand-400 hover:text-gold-300 transition-colors">
                                    View All Domestic →
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* ── INTERNATIONAL TOURS ── */}
                    <div>
                        <h3 className="mb-5 text-xs font-black uppercase tracking-widest text-white">
                            International Tours
                        </h3>
                        <ul className="space-y-3 text-sm">
                            {intlPkgs.length > 0 ? (
                                intlPkgs.map((p) => (
                                    <li key={p.slug}>
                                        <Link href={`/packages/${p.slug}`}
                                            className="leading-snug text-stone-400 transition-colors hover:text-gold-300 line-clamp-2">
                                            {p.name}
                                        </Link>
                                    </li>
                                ))
                            ) : (
                                [
                                    { name: "Maldives Luxury Package",  href: "/packages" },
                                    { name: "Dubai & Abu Dhabi Tour",   href: "/packages" },
                                    { name: "Thailand Beach Getaway",   href: "/packages" },
                                    { name: "Bali Honeymoon Package",   href: "/packages" },
                                    { name: "Singapore Family Tour",    href: "/packages" },
                                    { name: "Europe Grand Tour",        href: "/packages" },
                                ].map((l) => (
                                    <li key={l.name}>
                                        <Link href={l.href} className="text-stone-400 transition-colors hover:text-gold-300">
                                            {l.name}
                                        </Link>
                                    </li>
                                ))
                            )}
                            <li className="pt-1">
                                <Link href="/packages?package_type=international"
                                    className="text-xs font-bold text-brand-400 hover:text-gold-300 transition-colors">
                                    View All International →
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* ── QUICK LINKS + LEGAL ── */}
                    <div className="space-y-8">
                        <div>
                            <h3 className="mb-5 text-xs font-black uppercase tracking-widest text-white">
                                Quick Links
                            </h3>
                            <ul className="space-y-3 text-sm">
                                {[
                                    { name: "Home",               href: "/"         },
                                    { name: "Holiday Packages",   href: "/packages" },
                                    { name: "Our Services",       href: "/services" },
                                    { name: "About My Perfect Trips",  href: "/about"    },
                                    { name: "Travel Blog",        href: "/blog"     },
                                    { name: "Contact Us",         href: "/contact"  },
                                ].map((l) => (
                                    <li key={l.name}>
                                        <Link href={l.href} className="text-stone-400 transition-colors hover:text-gold-300">
                                            {l.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="mb-4 text-xs font-black uppercase tracking-widest text-white">
                                Legal &amp; Support
                            </h3>
                            <ul className="space-y-3 text-sm">
                                {[
                                    { name: "Privacy Policy",    href: "/privacy-policy" },
                                    { name: "Terms & Conditions",href: "/terms"          },
                                    { name: "Refund Policy",     href: "/refund-policy"  },
                                    { name: "Cookie Policy",     href: "/cookie-policy"  },
                                    { name: "Sitemap",           href: "/sitemap.xml"    },
                                ].map((l) => (
                                    <li key={l.name}>
                                        <Link href={l.href} className="text-stone-400 transition-colors hover:text-gold-300">
                                            {l.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* ── POPULAR DESTINATIONS (SEO row) ── */}
                {popularDests.length > 0 && (
                    <div className="mt-12 border-t border-brand-900 pt-10">
                        <p className="mb-4 text-xs font-black uppercase tracking-widest text-stone-500">
                            Popular Destinations
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {popularDests.map(({ name }) => (
                                <Link
                                    key={name}
                                    href={`/packages?destination=${encodeURIComponent(name)}`}
                                    className="rounded-full border border-brand-800 bg-brand-900/50 px-3.5 py-1 text-xs text-stone-400 transition-all hover:border-gold-400/50 hover:text-gold-300"
                                >
                                    {name}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── SEO PARAGRAPH ── */}
                <div className="mt-10 border-t border-brand-900 pt-10">
                    <p className="text-xs leading-relaxed text-stone-600 max-w-4xl">
                        <strong className="text-stone-500">My Perfect Trips</strong> is a leading travel agency in India offering premium{" "}
                        <Link href="/packages?package_type=domestic" className="hover:text-stone-400 transition-colors">domestic tour packages</Link> across
                        Kerala, Rajasthan, Goa, Himachal Pradesh, Uttarakhand, Andaman, and Kashmir — and handcrafted{" "}
                        <Link href="/packages?package_type=international" className="hover:text-stone-400 transition-colors">international holiday packages</Link>{" "}
                        to the Maldives, Dubai, Thailand, Bali, Singapore, Europe, and beyond. We specialise in
                        honeymoon packages, family holidays, corporate MICE, group tours, and visa assistance.
                        Book with confidence — our expert team handles every detail.
                    </p>
                </div>
            </div>

            {/* ── BOTTOM BAR ── */}
            <div className="border-t border-brand-900">
                <div className="container-inner flex flex-col items-center justify-between gap-4 py-6 sm:flex-row text-xs text-stone-500">
                    <div className="flex flex-col items-center gap-2 sm:items-start">
                        <p>
                            &copy; {year} {siteName} &mdash; A brand of{" "}
                            <span className="text-stone-400">Infygru Private Limited</span>. All rights reserved.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 sm:justify-start">
                            <Link href="/privacy-policy"  className="hover:text-stone-300 transition-colors">Privacy</Link>
                            <Link href="/terms"           className="hover:text-stone-300 transition-colors">Terms</Link>
                            <Link href="/refund-policy"   className="hover:text-stone-300 transition-colors">Refund</Link>
                            <Link href="/cookie-policy"   className="hover:text-stone-300 transition-colors">Cookies</Link>
                            <Link href="/sitemap.xml"     className="hover:text-stone-300 transition-colors">Sitemap</Link>
                        </div>
                    </div>

                    {/* Payment icons */}
                    <div className="flex flex-col items-center gap-2 sm:items-end">
                        <p className="text-[10px] uppercase tracking-widest text-stone-600">Secure Payments</p>
                        <div className="flex items-center gap-2">
                            {/* Visa */}
                            <div className="flex h-7 w-12 items-center justify-center rounded bg-white px-1.5">
                                <svg viewBox="0 0 780 500" className="h-4 w-auto" aria-label="Visa">
                                    <path d="M293.2 348.7l33.4-195.7h53.4l-33.4 195.7h-53.4zm246.9-191.3c-10.6-4-27.1-8.3-47.7-8.3-52.6 0-89.6 26.5-89.9 64.5-.3 28.1 26.5 43.7 46.7 53.1 20.7 9.5 27.7 15.6 27.6 24.1-.1 13-16.6 19-31.9 19-21.3 0-32.6-3-50.1-10.3l-6.9-3.1-7.4 43.8c12.4 5.4 35.3 10.1 59.1 10.4 55.8 0 91.9-26.2 92.3-66.8.2-22.2-14-39.1-44.6-53-18.6-9-30-15-29.9-24.1 0-8.1 9.6-16.7 30.5-16.7 17.4-.3 30.1 3.5 39.8 7.5l4.8 2.3 7.6-44.4zm136.8-4.4h-41.1c-12.7 0-22.3 3.5-27.9 16.1l-79.2 179.6h56l11.2-29.2 68.2.1c1.6 6.8 6.5 29.1 6.5 29.1h49.4l-43.1-195.7zm-65.3 124.5l21.1-54.2c-.3.5 4.3-11.2 7-18.4l3.5 16.6 12 55.9-43.6.1zM240.8 153l-52.1 133.5-5.6-27.2c-9.7-31.5-40-65.6-73.8-82.7l47.7 171.8.3.3h55.9l83.2-195.7h-55.6z" fill="#1434CB"/>
                                    <path d="M140.2 153H55.5l-.7 4c66.2 16.1 110 55 128.2 101.7l-18.5-89.2c-3.2-12.3-12.5-16-24.3-16.5z" fill="#F9A51A"/>
                                </svg>
                            </div>

                            {/* Mastercard */}
                            <div className="flex h-7 w-12 items-center justify-center rounded bg-[#1a1a1a] px-1.5">
                                <svg viewBox="0 0 131.39 86.9" className="h-5 w-auto" aria-label="Mastercard">
                                    <rect width="131.39" height="86.9" rx="8" fill="#252525"/>
                                    <circle cx="49.02" cy="43.45" r="28.25" fill="#EB001B"/>
                                    <circle cx="82.37" cy="43.45" r="28.25" fill="#F79E1B"/>
                                    <path d="M65.7 19.73a28.24 28.24 0 0 1 0 47.44 28.24 28.24 0 0 1 0-47.44z" fill="#FF5F00"/>
                                </svg>
                            </div>

                            {/* UPI */}
                            <div className="flex h-7 w-12 items-center justify-center rounded bg-white px-1.5">
                                <svg viewBox="0 0 200 80" className="h-4 w-auto" aria-label="UPI">
                                    <text x="50%" y="58%" dominantBaseline="middle" textAnchor="middle"
                                        fontFamily="Arial, sans-serif" fontWeight="900" fontSize="38" fill="#097939">
                                        UPI
                                    </text>
                                </svg>
                            </div>

                            {/* RuPay */}
                            <div className="flex h-7 w-14 items-center justify-center rounded bg-white px-1.5">
                                <svg viewBox="0 0 220 80" className="h-4 w-auto" aria-label="RuPay">
                                    <text x="50%" y="58%" dominantBaseline="middle" textAnchor="middle"
                                        fontFamily="Arial, sans-serif" fontWeight="900" fontSize="30" fill="#1a4f99">
                                        RuPay
                                    </text>
                                </svg>
                            </div>

                            {/* Razorpay */}
                            <div className="flex h-7 w-14 items-center justify-center rounded bg-[#072654] px-1.5">
                                <svg viewBox="0 0 200 70" className="h-4 w-auto" aria-label="Razorpay">
                                    <text x="50%" y="58%" dominantBaseline="middle" textAnchor="middle"
                                        fontFamily="Arial, sans-serif" fontWeight="700" fontSize="22" fill="#3395FF">
                                        razorpay
                                    </text>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
