import ContactForm from "@/components/contact/ContactForm";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export const metadata = {
  title: "Contact Us | MyPerfectTrips",
  description: "Get in touch with Manchester's premier travel consultancy to plan your next escape.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Minimalist Header */}
      <section className="pt-32 pb-16 bg-[#020617] border-b border-slate-100">
        <div className="container mx-auto px-4">
          <span className="text-blue-400 text-[10px] font-bold uppercase tracking-[0.3em] block mb-4">Get In Touch</span>
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
            Let’s plan your <br/>
            <span className="text-blue-400">next adventure.</span>
          </h1>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-20">
            
            {/* Left: Contact Info */}
            <div className="space-y-12">
              <div className="max-w-md">
                <p className="text-slate-500 leading-relaxed text-lg">
                  Whether you have a specific destination in mind or need inspiration, our experts are here to craft your perfect itinerary.
                </p>
              </div>

              <div className="grid gap-8">
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-1">Email Us</h3>
                    <p className="text-slate-500">hello@myperfecttrips.com</p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-1">Our Office</h3>
                    <p className="text-slate-500">Manchester, United Kingdom</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: The Lead Form */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 md:p-10 shadow-sm">
              <ContactForm />
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}