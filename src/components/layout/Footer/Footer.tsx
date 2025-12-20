import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, Globe } from 'lucide-react';
import directus, { getAssetUrl } from '@/lib/directus/client';
import { readSingleton } from '@directus/sdk';

export async function Footer() {
  let logoUrl = null;

  try {
    // 1. Fetch from 'Global_Settings' (Matching your specific name)
    // Note: We use readSingleton because it's a single settings page
    const settings: any = await directus.request(readSingleton('Global_Settings')).catch(() => null);
    
    // 2. Extract Logo URL
    if (settings?.logo) {
      // Directus might return an object (if eager loaded) or just the ID string
      const logoId = typeof settings.logo === 'object' ? settings.logo.id : settings.logo;
      logoUrl = getAssetUrl(logoId);
    } else {
      console.warn("Found 'Global_Settings' but 'logo' field is empty.");
    }
  } catch (error) {
    // Debugging: This helps you see if the name is still wrong
    console.error("Footer Error: Could not find collection 'Global_Settings'. Check the Key in Directus Data Model.");
  }

  return (
    <footer className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-blue-200 py-16 font-sans border-t border-white/5">
      <div className="container mx-auto px-4">
        
        {/* MAIN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* COLUMN 1: LOGO */}
          <div>
            {/* White Box Container */}
            <div className="bg-white px-5 py-3 rounded-2xl inline-block mb-6 shadow-xl">
              
              {logoUrl ? (
                // DYNAMIC LOGO FROM DIRECTUS
                <div className="relative w-[180px] h-[50px]">
                  <Image 
                    src={logoUrl} 
                    alt="MyPerfectTrips" 
                    fill
                    className="object-contain"
                    priority // Loads fast since it's in the footer
                  />
                </div>
              ) : (
                // FALLBACK LOGO (If fetch fails)
                <div className="flex items-center gap-2">
                   <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-md">
                     <Globe className="w-5 h-5 text-green-300" />
                   </div>
                   <div className="text-xl font-extrabold tracking-tighter leading-none">
                     <span className="text-blue-900">MYPERFECT</span>
                     <span className="text-red-600">TRIPS</span>
                   </div>
                </div>
              )}

            </div>

            <p className="text-slate-400 text-sm leading-relaxed pr-4">
              Your trusted travel partner in Manchester. We specialize in bespoke holidays, visa assistance, and corporate travel solutions.
            </p>
          </div>

          {/* COLUMN 2: COMPANY */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Company</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="hover:text-white hover:underline transition-all decoration-blue-400 underline-offset-4">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white hover:underline transition-all decoration-blue-400 underline-offset-4">Contact</Link></li>
              <li><Link href="/blog" className="hover:text-white hover:underline transition-all decoration-blue-400 underline-offset-4">Blog</Link></li>
            </ul>
          </div>

          {/* COLUMN 3: SERVICES */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Services</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/services/visa" className="hover:text-white hover:underline transition-all decoration-blue-400 underline-offset-4">Schengen Visa</Link></li>
              <li><Link href="/services/flights" className="hover:text-white hover:underline transition-all decoration-blue-400 underline-offset-4">Flights</Link></li>
              <li><Link href="/services/corporate" className="hover:text-white hover:underline transition-all decoration-blue-400 underline-offset-4">Corporate Travel</Link></li>
            </ul>
          </div>

          {/* COLUMN 4: CONTACT */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Contact</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3 group">
                <MapPin className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5 group-hover:text-white transition-colors" />
                <span className="text-slate-300">Altrincham, Manchester, UK</span>
              </li>
              <li className="flex items-center gap-3 group">
                <Phone className="w-5 h-5 text-cyan-400 shrink-0 group-hover:text-white transition-colors" />
                <a href="tel:+441611234567" className="text-slate-300 hover:text-white transition-colors">+44 161 123 4567</a>
              </li>
              <li className="flex items-center gap-3 group">
                <Mail className="w-5 h-5 text-cyan-400 shrink-0 group-hover:text-white transition-colors" />
                <a href="mailto:hello@myperfecttrips.co.uk" className="text-slate-300 hover:text-white transition-colors">hello@myperfecttrips.co.uk</a>
              </li>
            </ul>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>© 2024 MyPerfectTrips. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}