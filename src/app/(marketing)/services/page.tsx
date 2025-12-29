import { 
  Plane, Building2, Globe, Briefcase, PartyPopper, 
  CalendarCheck, ArrowRight, ShieldCheck, BarChart3, 
  Headphones, Fingerprint, CheckCircle2 
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Professional Travel Services | MyPerfectTrips",
  description: "Premium travel services including Schengen Visa assistance, Corporate Travel, and MICE.",
};

const serviceList = [
  { title: "Schengen Visa", desc: "Expert guidance for hassle-free European travel applications.", icon: <Globe size={24} /> },
  { title: "Flight Bookings", desc: "Global inventory with optimized routes and competitive pricing.", icon: <Plane size={24} /> },
  { title: "Hotel Bookings", desc: "Curated selection of luxury hotels with exclusive benefits.", icon: <Building2 size={24} /> },
  { title: "Corporate Travel", desc: "Dedicated account management for your business needs.", icon: <Briefcase size={24} /> },
  { title: "MICE", desc: "Meetings and Conferences executed with absolute precision.", icon: <CalendarCheck size={24} /> },
  { title: "Events", desc: "Full-scale event planning for corporate and private gatherings.", icon: <PartyPopper size={24} /> }
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      
      {/* --- HERO SECTION WITH BACKGROUND IMAGE --- */}
      <section className="relative bg-[#020617] h-[60vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1436491865332-7a61a109c0f2?q=80&w=2070" 
            alt="Services Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-slate-900/70" /> {/* Dark Overlay to make text pop */}
        </div>

        <div className="container mx-auto px-6 relative z-10 pt-20">
          <div className="max-w-3xl">
            <span className="text-blue-500 text-[10px] font-black uppercase tracking-[0.4em] block mb-4">Our Expertise</span>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none mb-6">
              Seamless <br/> <span className="text-blue-500">Solutions.</span>
            </h1>
            <p className="text-slate-300 text-lg font-medium max-w-xl">
              Comprehensive travel management designed for the modern traveler and corporate entity.
            </p>
          </div>
        </div>
      </section>

      {/* --- SERVICES GRID --- */}
      <section className="py-24 container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {serviceList.map((service, index) => (
            <div key={index} className="group p-10 rounded-[2rem] border border-slate-100 bg-white hover:shadow-2xl transition-all duration-500">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all">
                {service.icon}
              </div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-4">{service.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium">{service.desc}</p>
              <Link href="/contact" className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-blue-600 group-hover:translate-x-2 transition-transform">
                Enquire Now <ArrowRight size={14} className="ml-2" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* --- NEW SECTION: WHY CHOOSE US --- */}
      <section className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-8">
                The Industry <br/> <span className="text-blue-600">Standard.</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {[
                  { title: "24/7 Support", icon: <Headphones size={20} />, text: "Round-the-clock global assistance." },
                  { title: "Visa Success", icon: <ShieldCheck size={20} />, text: "98% successful filing rate." },
                  { title: "Best Fares", icon: <BarChart3 size={20} />, text: "Optimized routes and pricing." },
                  { title: "Custom Policy", icon: <Fingerprint size={20} />, text: "Tailored corporate frameworks." }
                ].map((item, i) => (
                  <div key={i} className="space-y-2">
                    <div className="text-blue-600">{item.icon}</div>
                    <h4 className="font-bold text-slate-900 uppercase text-xs tracking-widest">{item.title}</h4>
                    <p className="text-slate-500 text-xs font-medium">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 relative aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl">
              <Image 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069" 
                alt="Corporate Office" 
                fill 
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* --- FINAL CALL TO ACTION --- */}
      <section className="py-24 container mx-auto px-6 text-center">
        <div className="bg-slate-900 rounded-[3rem] p-12 md:p-24 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase mb-6">Ready to Partner?</h2>
            <p className="text-slate-400 mb-10 max-w-xl mx-auto font-medium">Connect with our consultants to build your custom travel solution.</p>
            <Link href="/contact" className="inline-block bg-blue-600 hover:bg-white hover:text-slate-900 text-white px-12 py-5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all">
              Start Enquiry
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}