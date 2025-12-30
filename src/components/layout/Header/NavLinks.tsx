"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, ChevronRight, Phone, Mail, MapPin } from "lucide-react";

export default function NavLinks({ contactNumber, contactEmail }: { contactNumber: string, contactEmail: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const pathname = usePathname();

  // Lock body scroll when menu is open
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

  const handleLinkClick = () => {
    setIsOpen(false);
    setExpanded(null);
  };

  const toggleExpand = (name: string) => {
    setExpanded(expanded === name ? null : name);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 -mr-2 text-slate-900 bg-slate-50 rounded-full hover:bg-slate-100 transition-colors"
        aria-label="Open Menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* OVERLAY & DRAWER */}
      <div
        className={`fixed inset-0 z-[200] flex justify-end transition-opacity duration-500 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
          }`}
      >
        {/* BACKDROP */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500"
          onClick={() => setIsOpen(false)}
        />

        {/* DRAWER CONTENT */}
        <div
          className={`relative w-full max-w-[320px] bg-white h-full shadow-2xl flex flex-col transition-transform duration-500 ease-out ${isOpen ? "translate-x-0" : "translate-x-100"
            }`}
        >
          {/* HEADER */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <span className="text-lg font-black uppercase tracking-tight text-slate-900">
              Menu
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 -mr-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* SCROLLABLE LINKS */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="flex flex-col">
              {menuItems.map((item) => (
                <div key={item.name} className="border-b border-slate-50 last:border-0">
                  {item.subItems ? (
                    // EXPANDABLE ITEM
                    <div>
                      <button
                        onClick={() => toggleExpand(item.name)}
                        className={`w-full flex items-center justify-between px-6 py-5 text-left font-bold transition-colors ${expanded === item.name ? "text-blue-600 bg-blue-50/50" : "text-slate-800"
                          }`}
                      >
                        <span className="uppercase tracking-widest text-sm">{item.name}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${expanded === item.name ? "rotate-180" : ""}`} />
                      </button>

                      {/* SUBMENU */}
                      <div className={`overflow-hidden transition-all duration-300 ease-in-out bg-slate-50/50 ${expanded === item.name ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                        {item.subItems.map(sub => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            onClick={handleLinkClick}
                            className="flex items-center gap-3 px-8 py-3 text-sm font-semibold text-slate-500 hover:text-blue-600 border-l-4 border-transparent hover:border-blue-600 transition-all"
                          >
                            <ChevronRight className="w-3 h-3" />
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    // REGULAR LINK
                    <Link
                      href={item.href}
                      onClick={handleLinkClick}
                      className={`block px-6 py-5 uppercase tracking-widest text-sm font-bold transition-colors ${pathname === item.href ? "text-blue-600 bg-blue-50/30" : "text-slate-800 hover:text-blue-600"
                        }`}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* FOOTER ACTIONS */}
          <div className="p-6 bg-slate-50 border-t border-slate-100">
            <div className="space-y-4 mb-6">
              <a href={`tel:${contactNumber}`} className="flex items-center gap-3 text-sm font-semibold text-slate-600">
                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-blue-600">
                  <Phone className="w-4 h-4" />
                </div>
                {contactNumber}
              </a>
              <a href={`mailto:${contactEmail}`} className="flex items-center gap-3 text-sm font-semibold text-slate-600">
                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-blue-600">
                  <Mail className="w-4 h-4" />
                </div>
                {contactEmail}
              </a>
            </div>

            <Link
              href="/contact"
              onClick={handleLinkClick}
              className="block w-full py-4 rounded-xl bg-blue-600 text-white font-bold text-center shadow-lg shadow-blue-600/20 active:scale-95 transition-all text-sm uppercase tracking-widest"
            >
              Enquire Now
            </Link>
          </div>

        </div>
      </div>
    </>
  );
}