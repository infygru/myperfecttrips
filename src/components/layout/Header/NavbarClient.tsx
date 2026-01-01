"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Phone, ArrowRight } from "lucide-react";
import NavLinks from "./NavLinks";

export default function NavbarClient({ logoUrl, contactNumber, contactEmail }: { logoUrl: string | null, contactNumber: string, contactEmail: string }) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const [servicesOpen, setServicesOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Packages", href: "/packages" },
    {
      name: "Services",
      href: "/services",
      dropdown: [
        { name: "Schengen Visa", href: "/schengen-visa" },
        { name: "Corporate Travel", href: "/corporate-travel" },
        { name: "MICE", href: "/mice" },
        { name: "Event Management", href: "/event-management" },
      ]
    },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" }
  ];

  return (
    <nav
      className={`fixed w-full z-[100] transition-all duration-500 ease-in-out bg-white border-b ${scrolled
        ? "py-3 shadow-md border-slate-100"
        : "py-4 lg:py-5 border-transparent"
        }`}
    >
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">

        {/* LOGO */}
        <div className="flex-shrink-0 relative z-50">
          <Link href="/">
            {logoUrl ? (
              <div className={`relative transition-all duration-500 ${scrolled ? 'h-10 w-32' : 'h-11 w-40'}`}>
                <img src={logoUrl} alt="MyPerfectTrips" className="h-full w-full object-contain object-left" />
              </div>
            ) : (
              <span className="text-2xl font-black uppercase tracking-tighter text-brand-blue">
                MYPERFECT<span className="text-brand-red">TRIPS</span>
              </span>
            )}
          </Link>
        </div>

        {/* DESKTOP NAV & CONTACT */}
        <div className="hidden lg:flex items-center gap-10">
          <div className="flex items-center gap-8">
            {navItems.map((item) => (
              <div
                key={item.name}
                className="relative group h-full flex items-center"
                onMouseEnter={() => item.dropdown && setServicesOpen(true)}
                onMouseLeave={() => item.dropdown && setServicesOpen(false)}
              >
                <Link
                  href={item.href}
                  className={`flex items-center gap-1 text-[13px] font-bold uppercase tracking-widest transition-colors py-2 
                    ${pathname === item.href
                      ? "text-brand-blue"
                      : "text-slate-600 hover:text-brand-blue"}`}
                >
                  {item.name}
                  {item.dropdown && <ChevronDown className="w-3 h-3 mb-0.5 opacity-50 group-hover:opacity-100 transition-opacity" />}
                </Link>

                {/* DROPDOWN MENU */}
                {item.dropdown && (
                  <div className={`absolute top-full -right-4 w-60 pt-4 transition-all duration-300 transform origin-top ${servicesOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 translate-y-2 invisible"}`}>
                    <div className="bg-white rounded-2xl shadow-xl ring-1 ring-black/5 overflow-hidden p-2 border border-slate-100">
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="block px-4 py-3 text-sm font-semibold text-slate-600 hover:text-brand-blue hover:bg-brand-light rounded-xl transition-colors"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CONTACT */}
          <a href={`tel:${contactNumber}`} className="flex items-center gap-2 font-bold text-sm transition-colors text-slate-800 hover:text-brand-blue border-l border-slate-200 pl-8 h-8">
            <Phone className="w-4 h-4 text-brand-blue" />
            <span>{contactNumber}</span>
          </a>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <div className="lg:hidden relative z-50">
          <NavLinks contactNumber={contactNumber} contactEmail={contactEmail} scrolled={scrolled} />
        </div>
      </div>
    </nav>
  );
}