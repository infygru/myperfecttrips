"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Phone, Mail, ArrowRight } from "lucide-react";

export default function NavLinks({ logoUrl, contactNumber, contactEmail, scrolled }: { logoUrl: string | null, contactNumber: string, contactEmail: string, scrolled: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const pathname = usePathname();

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Holiday Packages", href: "/packages" },
    {
      name: "Services",
      href: "/services",
      subItems: [
        { name: "Schengen Visa", href: "/schengen-visa" },
        { name: "Corporate Travel", href: "/corporate-travel" },
        { name: "MICE", href: "/mice" },
        { name: "Event Management", href: "/event-management" },
        { name: "Flight Bookings", href: "/contact?service=flights" },
      ]
    },
    { name: "Blog", href: "/blog" },
    { name: "Contact Us", href: "/contact" }
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`p-2 rounded-lg transition-colors ${scrolled ? "text-slate-900 hover:bg-slate-100" : "text-slate-900 bg-white shadow-md hover:bg-slate-50"}`}
        aria-label="Open Menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* FULL SCREEN OVERLAY */}
      <div
        className={`fixed inset-0 z-[200] bg-white transition-all duration-500 ease-in-out flex flex-col ${isOpen ? "opacity-100 translate-x-0 visible" : "opacity-0 translate-x-full invisible"}`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-slate-100">
          {logoUrl ? (
            <div className="relative h-9 w-32">
              <img src={logoUrl} alt="MyPerfectTrips" className="h-full w-full object-contain object-left" />
            </div>
          ) : (
            <span className="text-xl font-black uppercase tracking-tighter text-brand-blue">
              MYPERFECT<span className="text-brand-red">TRIPS</span>
            </span>
          )}
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 -mr-2 text-slate-500 hover:text-slate-900 bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-6">
          <nav className="space-y-1">
            {menuItems.map((item, i) => (
              <div key={item.name} className="overflow-hidden border-b border-slate-50 last:border-0">
                {item.subItems ? (
                  <div className="flex flex-col">
                    <button
                      onClick={() => setExpanded(expanded === item.name ? null : item.name)}
                      className="flex items-center justify-between text-lg font-bold text-slate-900 py-4 w-full text-left"
                    >
                      {item.name}
                      <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${expanded === item.name ? "rotate-180 text-brand-blue" : "text-slate-300"}`} />
                    </button>

                    <div className={`space-y-2 overflow-hidden transition-all duration-300 bg-slate-50 rounded-xl ${expanded === item.name ? "max-h-96 opacity-100 p-4 mb-4" : "max-h-0 opacity-0"}`}>
                      {item.subItems.map(sub => (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          onClick={() => setIsOpen(false)}
                          className="block text-sm font-semibold text-slate-600 hover:text-brand-blue transition-colors py-1"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`block text-lg font-bold py-4 transition-colors ${pathname === item.href ? "text-brand-blue" : "text-slate-900 hover:text-brand-blue"}`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>


        </div>
      </div>
    </>
  );
}