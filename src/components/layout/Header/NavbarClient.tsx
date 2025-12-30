"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Phone } from "lucide-react";
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
      className={`fixed w-full z-[100] transition-all duration-500 ease-in-out border-b ${scrolled
        ? "bg-white/95 backdrop-blur-xl py-3 shadow-[0_4px_30px_rgba(0,0,0,0.03)] border-slate-200/50"
        : "bg-white/80 backdrop-blur-md py-5 border-transparent"
        }`}
    >
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">

        {/* LOGO AREA */}
        <div className="flex-shrink-0 relative z-50">
          <Link href="/">
            {logoUrl ? (
              <div className={`relative transition-all duration-500 ${scrolled ? 'h-10 w-36' : 'h-11 w-44'}`}>
                <img src={logoUrl} alt="MyPerfectTrips" className="h-full w-full object-contain object-left" />
              </div>
            ) : (
              <span className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
                MYPERFECT<span className="text-blue-600">TRIPS</span>
              </span>
            )}
          </Link>
        </div>

        {/* DESKTOP NAV */}
        <div className="hidden lg:flex items-center gap-10">
          <div className="flex items-center gap-8">
            {navItems.map((item) => (
              <div
                key={item.name}
                className="relative group"
                onMouseEnter={() => item.dropdown && setServicesOpen(true)}
                onMouseLeave={() => item.dropdown && setServicesOpen(false)}
              >
                <Link
                  href={item.href}
                  className={`flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.15em] transition-colors hover:text-blue-600 py-4 ${pathname === item.href || (item.dropdown && item.dropdown.some(sub => sub.href === pathname))
                    ? "text-blue-600"
                    : "text-slate-800"
                    }`}
                >
                  {item.name}
                  {item.dropdown && <ChevronDown className="w-3 h-3 mb-0.5 opacity-50 group-hover:opacity-100 transition-opacity" />}
                </Link>

                {/* DROPDOWN MENU */}
                {item.dropdown && (
                  <div className={`absolute top-full -left-4 w-56 pt-2 transition-all duration-300 transform origin-top ${servicesOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 translate-y-2 invisible"}`}>
                    <div className="bg-white rounded-xl shadow-2xl ring-1 ring-black/5 overflow-hidden p-2">
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="block px-4 py-3 text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors"
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

          <div className="flex items-center gap-6 pl-6 border-l border-slate-200">
            <a href={`tel:${contactNumber}`} className="flex items-center gap-2 group cursor-pointer">
              <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                <Phone className="w-4 h-4 text-slate-900 group-hover:text-white transition-colors" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Call Us</span>
                <span className="text-sm font-bold text-slate-900 leading-none">{contactNumber}</span>
              </div>
            </a>
          </div>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <div className="lg:hidden relative z-50">
          <NavLinks contactNumber={contactNumber} contactEmail={contactEmail} />
        </div>
      </div>
    </nav>
  );
}