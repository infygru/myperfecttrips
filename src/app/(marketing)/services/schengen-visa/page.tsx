import Image from "next/image";
import { Check } from "lucide-react";
import VisaForm from "@/components/services/VisaForm";

export const metadata = {
  title: "Schengen Visa for Spain, France & Italy | MyPerfectTrips",
  description: "Dedicated visa appointment slots for UK residents with full documentation support.",
};

export default function SchengenVisaPage() {
  return (
    <div className="min-h-screen bg-[#1e3a8a] pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          
          {/* --- LEFT CONTENT --- */}
          <div className="w-full lg:w-1/2 text-white">
            <span className="inline-block bg-[#facc15] text-[#1e3a8a] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-6">
              Daily Appointments Available!
            </span>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight tracking-tight">
              Schengen Visa for Spain, France & Italy
            </h1>
            
            <p className="text-blue-100 text-lg md:text-xl mb-12 max-w-xl leading-relaxed">
              Struggling to find an appointment? We have dedicated slots for UK residents. High success rate and full documentation support.
            </p>

            <ul className="space-y-5">
              {[
                "Appointment Booking",
                "Flight & Hotel Dummies",
                "Cover Letter Drafting"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-lg font-medium">
                  <div className="bg-white/10 rounded-full p-1">
                    <Check className="w-5 h-5 text-[#4ade80]" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* --- RIGHT FORM CARD --- */}
          <div className="w-full lg:w-[500px]">
            <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-2xl">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Check Visa Availability</h2>
                <p className="text-slate-500 text-sm">Fill this form to get a callback about appointment slots.</p>
              </div>

              <VisaForm />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}