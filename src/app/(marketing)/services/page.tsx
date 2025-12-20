import { 
  Plane, Building2, Globe, Briefcase, PartyPopper, 
  CalendarCheck, ArrowRight, ShieldCheck, Zap, 
  Headphones, Globe2, BarChart3, Fingerprint 
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Professional Travel Services | MyPerfectTrips",
  description: "From Schengen Visa assistance to Corporate Travel and MICE, discover our full suite of premium travel services.",
};

const serviceList = [
  {
    title: "Schengen Visa Assistance",
    desc: "Expert guidance through the complex visa application process for hassle-free European travel.",
    icon: <Globe className="w-6 h-6" />,
  },
  {
    title: "Flight Bookings",
    desc: "Access to global inventory with optimized routes and competitive pricing for all classes.",
    icon: <Plane className="w-6 h-6" />,
  },
  {
    title: "Hotel Bookings",
    desc: "Curated selection of luxury hotels and boutique stays with exclusive member benefits.",
    icon: <Building2 className="w-6 h-6" />,
  },
  {
    title: "Corporate Travel",
    desc: "Dedicated account management and travel policy compliance for your business needs.",
    icon: <Briefcase className="w-6 h-6" />,
  },
  {
    title: "MICE",
    desc: "Meetings, Incentives, Conferences, and Exhibitions executed with surgical precision.",
    icon: <CalendarCheck className="w-6 h-6" />,
  },
  {
    title: "Event Management",
    desc: "Full-scale event planning from concept to execution for corporate and private gatherings.",
    icon: <PartyPopper className="w-6 h-6" />,
  }
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* --- PREMIUM HERO --- */}
      <section className="pt-32 pb-24 bg-slate-50 border-b border-slate-100">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <span className="text-blue-600 text-[10px] font-bold uppercase tracking-[0.3em] block mb-4">Our Expertise</span>
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight mb-8">
              Seamless <span className="text-blue-600">Solutions</span> <br/>
              for Global Travel.
            </h1>
            <p className="text-slate-500 text-lg md:text-xl leading-relaxed">
              Beyond simple bookings, we provide a comprehensive suite of travel services designed for the modern traveler and corporate entity.
            </p>
          </div>
        </div>
      </section>

      {/* --- SERVICES GRID --- */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviceList.map((service, index) => (
              <div 
                key={index}
                className="group p-10 rounded-3xl border border-slate-100 bg-white hover:border-blue-100 hover:bg-blue-50/30 transition-all duration-500"
              >
                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-blue-600 mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{service.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-8">
                  {service.desc}
                </p>
                <Link 
                  href="/contact" 
                  className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-blue-600"
                >
                  Enquire Now <ArrowRight className="w-3 h-3 ml-2 group-hover:ml-4 transition-all" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- NEW SECTION: WHY PARTNER WITH US --- */}
      <section className="py-24 bg-[#020617] text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600 rounded-full blur-[120px]" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Why Industry Leaders <br/> Choose Us</h2>
            <p className="text-slate-400">We don't just provide services; we provide peace of mind through a meticulous approach to travel.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "24/7 Support", icon: <Headphones className="w-5 h-5" />, desc: "Real-time assistance for any disruption, anywhere in the world." },
              { title: "Best Fare Guarantee", icon: <BarChart3 className="w-5 h-5" />, desc: "Proprietary tools to ensure the most cost-effective travel routes." },
              { title: "Visa Experts", icon: <ShieldCheck className="w-5 h-5" />, desc: "98% success rate in Schengen and high-priority visa filings." },
              { title: "Tailored Policy", icon: <Fingerprint className="w-5 h-5" />, desc: "Custom travel frameworks built specifically for your business." }
            ].map((item, i) => (
              <div key={i} className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-500 mb-6">
                  {item.icon}
                </div>
                <h4 className="font-bold mb-3">{item.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- NEW SECTION: THE PROCESS --- */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-xl">
              <span className="text-blue-600 text-[10px] font-bold uppercase tracking-[0.3em] block mb-4">Our Workflow</span>
              <h2 className="text-4xl font-bold text-slate-900">How we deliver excellence.</h2>
            </div>
            <p className="text-slate-500 max-w-xs text-sm">A streamlined four-step process to ensure your requirements are met with absolute precision.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-12 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden lg:block absolute top-10 left-0 w-full h-[1px] bg-slate-100 -z-10" />
            
            {[
              { step: "01", title: "Consultation", desc: "Understanding your specific needs and travel goals." },
              { step: "02", title: "Strategy", desc: "Designing a custom itinerary or service framework." },
              { step: "03", title: "Execution", desc: "Seamless booking and documentation management." },
              { step: "04", title: "Support", desc: "Constant monitoring and post-travel reporting." }
            ].map((item, i) => (
              <div key={i} className="space-y-4">
                <div className="w-20 h-20 rounded-full bg-white border border-slate-100 flex items-center justify-center text-2xl font-black text-blue-600 shadow-sm">
                  {item.step}
                </div>
                <h4 className="text-lg font-bold text-slate-900">{item.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-20 container mx-auto px-4">
        <div className="bg-blue-600 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">Ready to streamline <br/> your global travel?</h2>
            <p className="text-white/80 max-w-xl mx-auto mb-10 text-lg">
              Partner with Manchester’s leading travel experts for a tailored service experience.
            </p>
            <Link 
              href="/contact" 
              className="inline-block bg-white text-blue-600 px-12 py-5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-slate-100 transition-all shadow-xl"
            >
              Start Your Enquiry
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}