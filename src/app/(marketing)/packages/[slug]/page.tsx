import Image from "next/image";
import { notFound } from "next/navigation";
import directus, { getAssetUrl } from "@/lib/directus/client";
import { readItems } from "@directus/sdk";
import { MapPin, Clock, Calendar, Check, X, Share2, Info, AlertCircle } from "lucide-react";
import DownloadPdfButton from "@/components/packages/DownloadPdfButton";
import EnquiryForm from "@/components/packages/EnquiryForm";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params; 
  const pkg = await getPackage(slug);
  return { title: pkg ? `${pkg.title} | MyPerfectTrips` : "Package Not Found" };
}

async function getPackage(slug: string) {
  try {
    const result: any[] = await directus.request(readItems("Packages", {
      filter: { slug: { _eq: slug } },
      fields: ["*.*"],
      limit: 1,
    }));
    return result[0];
  } catch (e) { return null; }
}

export default async function PackageDetailsPage({ params }: Props) {
  const { slug } = await params;
  const pkg = await getPackage(slug);
  if (!pkg) notFound();

  // --- SAFETY FIX FOR HERO IMAGE ---
  const bannerId = typeof pkg.banner_image === 'object' ? pkg.banner_image?.id : pkg.banner_image;
  const mainImageId = typeof pkg.image === 'object' ? pkg.image?.id : pkg.image;
  
  // If no image at all, we use a reliable Unsplash link so src is never empty
  const heroImage = bannerId 
    ? getAssetUrl(bannerId) 
    : (mainImageId ? getAssetUrl(mainImageId) : "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80");

  const itinerary = Array.isArray(pkg.itinerary_json) && pkg.itinerary_json.length > 0 ? pkg.itinerary_json : [];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-600">
      <div id="printable-area"> 
        {/* --- HERO (40vh) --- */}
        <div className="relative h-[40vh] min-h-[400px] w-full bg-slate-900">
          <Image 
            src={heroImage} 
            alt={pkg.title || "Package Image"} 
            fill 
            className="object-cover opacity-90" 
            priority 
            unoptimized 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full pb-8 pt-20 px-4">
            <div className="container mx-auto max-w-7xl">
              <div className="max-w-4xl">
                <div className="flex gap-2 mb-3">
                  {pkg.tags?.map((tag: string, i: number) => (
                    <span key={i} className="bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">{tag}</span>
                  ))}
                </div>
                <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3">{pkg.title}</h1>
                <div className="flex items-center gap-6 text-slate-200 text-sm">
                  <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-red-400" /> {pkg.location || "International"}</span>
                  <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-red-400" /> {pkg.duration || 5} Days</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- CONTENT --- */}
        <div className="container mx-auto max-w-7xl px-4 py-10">
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="flex-1 space-y-10">
              
              <section className="bg-[#f0f7ff] p-8 rounded-2xl border border-blue-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                   <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#1e3a8a] shadow-sm border border-blue-100">
                      <Info className="w-5 h-5" />
                   </div>
                   <h2 className="text-2xl font-bold text-[#1e3a8a]">Trip Overview</h2>
                </div>
                <div className="prose prose-slate max-w-none text-[#334155] leading-relaxed text-lg">
                  {pkg.description || "Curated itinerary designed for a perfect blend of sightseeing and relaxation."}
                </div>
              </section>

              {/* Itinerary */}
              <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                 <div className="flex items-center gap-3 mb-8">
                   <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600"><Calendar className="w-5 h-5" /></div>
                   <h2 className="text-xl font-bold text-slate-900">Daily Itinerary</h2>
                 </div>
                 <div className="relative border-l-2 border-slate-100 ml-5 space-y-12">
                    {itinerary.length > 0 ? itinerary.map((day: any, index: number) => {
                      // --- SAFETY FIX FOR ITINERARY IMAGES ---
                      const dayImg = day.image ? getAssetUrl(day.image) : (day.image_url || null);
                      
                      return (
                        <div key={index} className="relative pl-10">
                          <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-blue-600 shadow-sm z-10"></div>
                          <div className="group">
                            <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded mb-3 uppercase">Day {index + 1}</span>
                            <h3 className="text-lg font-bold text-slate-900 mb-3">{day.title || "Sightseeing"}</h3>
                            <div className="flex flex-col md:flex-row gap-6">
                              {/* Only render Image if dayImg is NOT null/empty */}
                              {dayImg && (
                                <div className="w-full md:w-48 h-32 shrink-0 relative rounded-xl overflow-hidden shadow-sm bg-slate-200">
                                  <Image src={dayImg} alt={`Day ${index + 1}`} fill className="object-cover" unoptimized />
                                </div>
                              )}
                              <p className="text-sm text-slate-500 leading-relaxed">{day.description}</p>
                            </div>
                          </div>
                        </div>
                      );
                    }) : (
                        <p className="text-slate-400 italic pl-10">Itinerary details coming soon...</p>
                    )}
                 </div>
              </section>

              {/* Inclusions */}
              <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                  <h2 className="text-xl font-bold text-slate-900 mb-6">Package Details</h2>
                  <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="flex items-center gap-2 font-bold text-green-700 mb-4 border-b pb-2 text-sm uppercase"><Check className="w-4 h-4" /> Inclusions</h4>
                        <ul className="space-y-3">{(pkg.inclusions || ["4-Star Hotel", "Breakfast", "Guide"]).map((item: string, i: number) => <li key={i} className="flex items-start gap-3 text-sm font-medium text-slate-700"><div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" /> {item}</li>)}</ul>
                      </div>
                      <div>
                        <h4 className="flex items-center gap-2 font-bold text-red-600 mb-4 border-b pb-2 text-sm uppercase"><X className="w-4 h-4" /> Exclusions</h4>
                        <ul className="space-y-3">{(pkg.exclusions || ["Flights", "Visa"]).map((item: string, i: number) => <li key={i} className="flex items-start gap-3 text-sm text-slate-500 font-medium"><div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 shrink-0" /> {item}</li>)}</ul>
                      </div>
                  </div>
              </section>

              <section className="bg-amber-50 p-6 rounded-2xl border border-amber-100 flex gap-4">
                <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
                <div className="text-sm text-amber-900 leading-relaxed">
                  <h4 className="font-bold mb-1">Important Notes</h4>
                  <p>Prices are dynamic and subject to availability at the time of booking. Itinerary may change slightly based on local conditions.</p>
                </div>
              </section>
            </div>

            <aside className="w-full lg:w-[380px] shrink-0" data-html2canvas-ignore="true">
               <div className="sticky top-24 space-y-6">
                  <EnquiryForm packageTitle={pkg.title} price={pkg.price} />
                  <div className="grid grid-cols-2 gap-3">
                    <DownloadPdfButton targetId="printable-area" fileName={`${pkg.slug}-details.pdf`} label="Download as PDF" />
                    <button className="flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-blue-300 text-slate-600 font-bold py-3 rounded-xl transition-all text-sm shadow-sm"><Share2 className="w-4 h-4" /> Share Trip</button>
                  </div>
               </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}