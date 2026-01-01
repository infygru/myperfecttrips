"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Phone, Mail, ArrowRight } from "lucide-react";

export default function NavLinks({ contactNumber, contactEmail, scrolled }: { contactNumber: string, contactEmail: string, scrolled: boolean }) {
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
        className={`p-2.5 rounded-full transition-all active:scale-95 ${scrolled || isOpen ? "bg-slate-100 text-slate-900" : "bg-white/10 text-white backdrop-blur-md border border-white/20"}`}
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
          <span className="text-xl font-black uppercase tracking-tighter text-brand-blue">
            MYPERFECT<span className="text-brand-red">TRIPS</span>
          </span>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 -mr-2 text-slate-500 hover:text-slate-900 bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-center">
          <nav className="space-y-2">
            {menuItems.map((item, i) => (
              <div key={item.name} className="overflow-hidden">
                {item.subItems ? (
                  <div className="flex flex-col">
                    <button
                      onClick={() => setExpanded(expanded === item.name ? null : item.name)}
                      className="flex items-center justify-between text-3xl font-bold text-slate-900 py-3 w-full text-left"
                    >
                      {item.name}
                      <ChevronDown className={`w-6 h-6 transition-transform duration-300 ${expanded === item.name ? "rotate-180 text-brand-blue" : "text-slate-300"}`} />
                    </button>

                    <div className={`space-y-3 overflow-hidden transition-all duration-300 ${expanded === item.name ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                      {item.subItems.map(sub => (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          onClick={() => setIsOpen(false)}
                          className="block text-lg font-medium text-slate-500 pl-4 border-l-2 border-slate-200 hover:border-brand-blue hover:text-brand-blue transition-colors"
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
                    className={`block text-3xl font-bold py-3 transition-colors ${pathname === item.href ? "text-brand-blue" : "text-slate-900 hover:text-brand-blue"}`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          <div className="mt-12 space-y-6 border-t border-slate-100 pt-8">
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-brand-blue text-white font-bold text-lg shadow-xl shadow-blue-600/30 active:scale-95 transition-transform"
            >
              Start Your Journey <ArrowRight className="w-5 h-5" />
            </Link>

            <div className="flex justify-around">
              <a href={`tel:${contactNumber}`} className="flex flex-col items-center gap-2 text-slate-600">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-brand-blue">
                  <Phone className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest">Call</span>
              </a>
              <a href={`mailto:${contactEmail}`} className="flex flex-col items-center gap-2 text-slate-600">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-brand-blue">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest">Email</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}