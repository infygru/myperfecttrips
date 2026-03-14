import Link from "next/link";
import Image from "next/image";
import { unstable_noStore as noStore } from "next/cache";
import { directus, getSiteSettings } from "@/lib/directus";
import { Compass } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import MobileMenu from "@/components/MobileMenu";
import ServicesDropdown from "@/components/ServicesDropdown";

export default async function Header() {
    noStore();
    let s: any = null;
    try {
        s = await getSiteSettings();
    } catch { }

    const dUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://localhost:8055";
    const logoUrl = s?.logo ? `${dUrl}/assets/${s.logo}` : null;
    const phone = s?.contact_phone || "+91 8807709919";
    const siteName = s?.site_name || "IGHolidays";

    const otherNav = [
        { name: "Packages", path: "/packages" },
        { name: "About", path: "/about" },
        { name: "Blog", path: "/blog" },
        { name: "Contact", path: "/contact" },
    ];

    const mobileNav = [
        {
            name: "Services",
            path: "/services",
            children: [
                { name: "Corporate MICE", path: "/services/corporate-mice" },
                { name: "Corporate Travel", path: "/services/corporate-travel" },
                { name: "Group Travel", path: "/services/group-travel" },
                { name: "College Tours", path: "/services/college-tours" },
                { name: "Visa Assistance", path: "/services/visa-assistance" },
                { name: "Holiday Planning", path: "/services/holiday-planning" },
            ],
        },
        ...otherNav,
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b border-stone-200/50 bg-white/80 backdrop-blur-xl shadow-sm transition-all duration-300">
            <div className="mx-auto flex h-[72px] w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link href="/" className="group flex flex-shrink-0 items-center gap-3 transition-opacity hover:opacity-90">
                    {logoUrl ? (
                        <Image
                            src={logoUrl}
                            alt={siteName}
                            width={160}
                            height={44}
                            className="h-8 max-w-[140px] sm:max-w-none sm:h-10 w-auto object-contain"
                            priority
                            unoptimized
                        />
                    ) : (
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-900 shadow-md">
                                <Compass className="h-5 w-5 text-white" />
                            </div>
                            <span className="font-serif text-2xl font-semibold tracking-tight text-brand-950">
                                {siteName}
                            </span>
                        </div>
                    )}
                </Link>

                {/* Desktop Nav */}
                <div className="hidden items-center gap-6 lg:flex">
                    <nav className="flex items-center gap-1">
                        {/* Services dropdown */}
                        <ServicesDropdown />

                        {/* Other nav links */}
                        {otherNav.map((link) => (
                            <Link
                                key={link.name}
                                href={link.path}
                                className="rounded-full px-4 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100 hover:text-brand-950"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>
                    <div className="h-6 w-px bg-stone-300/50"></div>
                    <a
                        href={`https://wa.me/${phone.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-full border border-stone-200 bg-white px-5 py-2 text-sm font-semibold text-stone-700 shadow-sm transition-all hover:bg-[#25D366]/10 hover:text-[#25D366] hover:border-[#25D366]/30"
                    >
                        <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
                        {phone}
                    </a>
                </div>

                {/* Mobile toggle */}
                <MobileMenu nav={mobileNav} phone={phone} />
            </div>
        </header>
    );
}
