"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function NavLinks() {
  const [isOpen, setIsOpen] = useState(false);

  const mobileLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Packages", href: "/packages" },
    { name: "Services", href: "/services" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" }
  ];

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-slate-900">
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-t border-slate-100 p-8 flex flex-col gap-6 text-center shadow-2xl animate-in fade-in slide-in-from-top-2">
          {mobileLinks.map((item) => (
            <Link 
              key={item.name} 
              href={item.href} 
              onClick={() => setIsOpen(false)}
              className="text-sm font-bold uppercase tracking-widest text-slate-900"
            >
              {item.name}
            </Link>
          ))}
          <Link 
            href="/contact" 
            onClick={() => setIsOpen(false)}
            className="bg-blue-600 text-white py-4 rounded-xl font-bold uppercase tracking-widest"
          >
            Enquire Now
          </Link>
        </div>
      )}
    </>
  );
}