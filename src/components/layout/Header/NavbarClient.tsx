"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NavLinks from "./NavLinks";

export default function NavbarClient({ logoUrl }: { logoUrl: string | null }) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Updated link list to include 'About'
  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" }, // New Link
    { name: "Packages", href: "/packages" },
    { name: "Services", href: "/services" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" }
  ];

  return (
    <nav className={`fixed w-full z-[100] transition-all duration-500 ease-in-out ${
      scrolled 
      ? "bg-white/95 backdrop-blur-md py-2 shadow-md border-b border-slate-100" 
      : "bg-white/80 backdrop-blur-sm py-5"
    }`}>
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        
        {/* LOGO AREA */}
        <div className="flex-shrink-0">
          <Link href="/">
            {logoUrl ? (
              <div className={`relative transition-all duration-500 ${scrolled ? 'h-10 w-40' : 'h-12 w-48'}`}>
                <img src={logoUrl} alt="MyPerfectTrips" className="h-full w-full object-contain object-left" />
              </div>
            ) : (
              <span className="text-xl font-black text-slate-900 uppercase">
                MYPERFECT<span className="text-blue-600">TRIPS</span>
              </span>
            )}
          </Link>
        </div>

        {/* DESKTOP NAV */}
        <div className="hidden lg:flex items-center gap-8">
          <div className="flex items-center gap-6">
            {navItems.map((item) => (
              <Link 
                key={item.name} 
                href={item.href}
                className={`text-[11px] font-bold uppercase tracking-[0.15em] transition-colors hover:text-blue-600 ${
                  pathname === item.href ? "text-blue-600" : "text-slate-800"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <Link 
            href="/contact" 
            className={`bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] text-white rounded-xl font-bold uppercase tracking-widest shadow-lg shadow-blue-500/20 transition-all duration-500 ${
              scrolled ? 'px-6 py-2.5 text-[10px]' : 'px-8 py-3 text-[11px]'
            }`}
          >
            Enquire Now
          </Link>
        </div>

        <div className="lg:hidden">
          <NavLinks />
        </div>
      </div>
    </nav>
  );
}