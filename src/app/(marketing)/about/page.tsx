import Image from "next/image";
import { 
  Users, ShieldCheck, Heart, 
  Plane, Globe, Check,
  MoveRight, Briefcase, Star, Clock
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "About Us | MyPerfectTrips Manchester",
  description: "We are a dedicated travel team in Manchester. We handle the stress of visas, flights, and business travel so you don't have to.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      
      {/* --- SECTION 1: THE REAL HERO --- 
          Direct and honest. No fluff.
      */}
      <section className="relative pt-48 pb-24 bg-slate-900 overflow-hidden">
        {/* Themed Azure Accent */}
        <div className="absolute top-0 right-0 w-1/4 h-full bg-blue-600/10 skew-x-[-15deg] translate-x-1/2 pointer-events-none" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] mb-6">
              Manchester Grown • Supporting You Globally
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-tight uppercase mb-8">
              Less paperwork. <br/>
              <span className="text-blue-500">More travel.</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl leading-relaxed font-medium">
              We started MyPerfectTrips because we saw too many people getting stuck with complicated visa rules and non-existent customer support. We’re here to fix that by providing real, human help.
            </p>
          </div>
        </div>
      </section>

      {/* --- SECTION 2: WHY WE DO THIS --- 
          Focusing on empathy and local Manchester service.
      */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl">
              <Image 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071" 
                alt="Our Team" 
                fill 
                className="object-cover"
              />
            </div>

            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                Real help from <br/> <span className="text-blue-600">Real people.</span>
              </h2>
              <div className="space-y-6 text-slate-600 text-lg font-medium leading-relaxed">
                <p>
                  At <strong>MyPerfectTrips</strong>, we know that every trip is important. Whether you are trying to get a <strong>Schengen Visa</strong> for a family holiday or managing <strong>Corporate MICE</strong> for your company, you shouldn't have to do it alone.
                </p>
                <p>
                  We are a Manchester-based team that actually answers the phone. We use our direct connections with airlines and hotels to get you the best support and prices—things you just won't find on a standard booking site.
                </p>
                <p className="flex items-center gap-3 text-slate-900 font-bold">
                  <Heart className="text-blue-600" size={20} /> We treat your trip like it’s our own.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 3: WHAT WE ACTUALLY HELP WITH --- 
          High-value SEO keywords used in a natural way.
      */}
      <section className="py-32 bg-slate-50 border-y border-slate-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase mb-4">How we make it <span className="text-blue-600">Easy.</span></h2>
            <p className="text-slate-500 font-medium italic">Practical solutions for Manchester travelers.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                title: "Visa Support", 
                icon: <Globe />, 
                desc: "We take the headache out of Schengen and global visas. With a 98% success rate, we make sure your application is done right the first time." 
              },
              { 
                title: "Business Travel", 
                icon: <Briefcase />, 
                desc: "Managing corporate trips and events is a full-time job. We handle the flights, hotels, and logistics so you can focus on your business." 
              },
              { 
                title: "Flights & Perks", 
                icon: <Plane />, 
                desc: "We find better routes and use our hotel partnerships to get you exclusive benefits that aren't available to the general public." 
              }
            ].map((service, i) => (
              <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-slate-200 hover:border-blue-600 transition-all group">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  {service.icon}
                </div>
                <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-4">{service.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SECTION 4: QUICK TRUST NUMBERS --- */}
      <section className="py-24 bg-slate-900">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center lg:text-left">
            {[
              { label: "Visa Success", value: "98%", icon: <ShieldCheck className="text-blue-500" /> },
              { label: "Elite Partners", value: "500+", icon: <Users className="text-blue-500" /> },
              { label: "Direct Support", value: "24/7", icon: <Clock className="text-blue-500" /> },
              { label: "Service Rating", value: "4.9/5", icon: <Star className="text-blue-500" /> },
            ].map((stat, i) => (
              <div key={i} className="space-y-2 border-r border-white/10 last:border-0">
                <div className="flex justify-center lg:justify-start mb-4">{stat.icon}</div>
                <p className="text-4xl font-black text-white tracking-tighter">{stat.value}</p>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SECTION 5: HUMANE CTA --- */}
      <section className="py-32 container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto p-12 md:p-24 rounded-[4rem] bg-blue-600 relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none mb-10">
              Ready to talk <br/> <span className="text-slate-900">about your trip?</span>
            </h2>
            <p className="text-blue-100 text-lg md:text-xl font-medium max-w-xl mx-auto mb-16">
              Skip the bots and the long hold music. Just real travel experts in Manchester ready to help.
            </p>
            <Link 
              href="/contact" 
              className="inline-flex items-center gap-6 bg-slate-900 text-white px-12 py-5 rounded-full text-xs font-black uppercase tracking-[0.3em] transition-all hover:bg-white hover:text-blue-600"
            >
              Contact Us Now <MoveRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}