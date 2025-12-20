import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "About Us | MyPerfectTrips",
  description: "Learn more about Manchester's premier travel consultancy and our mission to create perfect escapes.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <span className="text-blue-600 text-[10px] font-bold uppercase tracking-[0.3em] block mb-4">Our Story</span>
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight leading-tight mb-8">
              We define travel <br/>
              <span className="text-blue-600 font-serif italic">differently.</span>
            </h1>
            <p className="text-slate-500 text-lg md:text-xl leading-relaxed">
              Based in Manchester, MyPerfectTrips was born from a passion for discovery and a commitment to seamless luxury. We don't just book trips; we craft experiences.
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative h-[600px] rounded-3xl overflow-hidden border border-slate-100">
              <Image 
                src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=2070&auto=format&fit=crop" 
                alt="Travel Planning" 
                fill 
                className="object-cover"
              />
            </div>
            
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-slate-900">Why choose us?</h2>
              <p className="text-slate-500 leading-relaxed">
                Our approach is deeply personal. We understand that every traveler is unique, which is why we spend time understanding your preferences before recommending a single destination.
              </p>
              
              <ul className="space-y-4">
                {[
                  "Tailor-made itineraries built around your schedule",
                  "Exclusive access to luxury partners worldwide",
                  "24/7 support while you are on your journey",
                  "Expert knowledge of hidden gems and local favorites"
                ].map((item, i) => (
                  <li key={i} className="flex gap-4 items-start">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <span className="text-slate-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-6">
                <div className="p-8 bg-blue-600 rounded-2xl text-white">
                  <h3 className="text-xl font-bold mb-2">Our Mission</h3>
                  <p className="opacity-90 leading-relaxed text-sm">
                    To make high-end travel accessible, stress-free, and profoundly memorable for every client who trusts us with their time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}