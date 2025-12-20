"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { Plane, Globe, FileText, MapPin, Calendar, Search, CreditCard, ChevronDown } from "lucide-react";

export default function HeroClient({ data }: { data: any }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("packages"); 

  // State for inputs
  const [flightForm, setFlightForm] = useState({ from: "", to: "", date: "" });
  const [packageQuery, setPackageQuery] = useState("");

  // --- HANDLERS ---
  const handleFlightSearch = () => {
    const params = new URLSearchParams({ type: "flight", from: flightForm.from, to: flightForm.to, date: flightForm.date });
    router.push(`/contact?${params.toString()}`);
  };

  const handlePackageSearch = () => {
    router.push(`/packages?search=${packageQuery}`);
  };

  const handleVisaClick = () => {
    router.push("/services");
  };

  // --- MEDIA RENDERER ---
  const renderBackgroundMedia = () => {
    const videoObj = data?.background_video;
    const videoId = typeof videoObj === 'object' ? videoObj?.id : videoObj;
    const imageObj = data?.background_image;
    
    let imageUrl = '';
    if (typeof imageObj === 'object' && imageObj?.id) {
       imageUrl = `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${imageObj.id}`;
    } else if (typeof imageObj === 'string') {
       imageUrl = imageObj.startsWith('http') ? imageObj : `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${imageObj}`;
    }

    if (!imageUrl) imageUrl = "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80";
    const videoUrl = videoId ? `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${videoId}` : null;

    if (videoUrl) {
      return (
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src={videoUrl} type="video/mp4" />
        </video>
      );
    }
    return <Image src={imageUrl} alt="Hero Background" fill className="object-cover" priority />;
  };

  // Fallback Text
  const title = data?.title || "Discover the World,<br/>Your Way";
  const description = data?.description || "Manchester's premier travel consultancy. From seamless Schengen visas to luxury bespoke itineraries.";
  const ratingsText = data?.ratings_text || "Rated 4.9/5 by Travellers";

  return (
    // UPDATED: Added py-20 to ensure top/bottom spacing and min-h-[85vh] for flexibility
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden py-20">
      
      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0">
        {renderBackgroundMedia()}
        <div className="absolute inset-0 bg-black/30" /> 
      </div>

      <div className="container relative z-10 mx-auto px-4 flex flex-col items-center">
        
        {/* HERO TEXT */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 py-1.5 px-5 rounded-full bg-slate-800/60 border border-white/20 text-white text-sm font-medium mb-8 backdrop-blur-md">
            <span className="text-blue-400">★</span> 
            <span>{ratingsText}</span>
          </div>
          <h1 
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-2xl" 
            dangerouslySetInnerHTML={{ __html: title }} 
          />
          <div 
            className="text-lg md:text-xl text-slate-100 mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow-lg"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>

        {/* --- MAIN WIDGET CONTAINER --- */}
        <div className="w-full max-w-6xl">
          {/* UPDATED: Increased padding (p-6 md:p-10) for that clean, spacious look */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] p-6 md:p-10 shadow-2xl">
            
            <Tabs defaultValue="packages" className="w-full" onValueChange={setActiveTab}>
              
              {/* TABS (White Pills) - Added mb-8 for spacing between tabs and inputs */}
              <TabsList className="bg-transparent w-full justify-start h-auto p-0 gap-4 mb-8 flex-wrap">
                <TabsTrigger value="flights" className={`gap-2 rounded-full px-8 py-3 text-base font-bold transition-all duration-300 border border-transparent ${activeTab === 'flights' ? 'bg-white text-slate-900 shadow-xl scale-105' : 'bg-transparent text-white hover:bg-white/10'}`}>
                  <Plane size={18} className={activeTab === 'flights' ? 'text-blue-600' : 'text-white'} /> Flights
                </TabsTrigger>
                <TabsTrigger value="packages" className={`gap-2 rounded-full px-8 py-3 text-base font-bold transition-all duration-300 border border-transparent ${activeTab === 'packages' ? 'bg-white text-slate-900 shadow-xl scale-105' : 'bg-transparent text-white hover:bg-white/10'}`}>
                  <Globe size={18} className={activeTab === 'packages' ? 'text-blue-600' : 'text-white'} /> Holiday Packages
                </TabsTrigger>
                <TabsTrigger value="visas" className={`gap-2 rounded-full px-8 py-3 text-base font-bold transition-all duration-300 border border-transparent ${activeTab === 'visas' ? 'bg-white text-slate-900 shadow-xl scale-105' : 'bg-transparent text-white hover:bg-white/10'}`}>
                  <FileText size={18} className={activeTab === 'visas' ? 'text-blue-600' : 'text-white'} /> Visa Services
                </TabsTrigger>
              </TabsList>

              {/* --- FLIGHTS CONTENT --- */}
              <TabsContent value="flights" className="mt-0">
                <div className="bg-white rounded-3xl p-6 md:px-8 md:py-6 flex flex-col md:flex-row items-end gap-6 shadow-2xl">
                  
                  {/* From */}
                  <div className="flex-1 w-full">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">FROM (CODE)</label>
                    <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
                      <MapPin className="text-blue-500 w-5 h-5 mb-1" />
                      <input type="text" placeholder="MAN" value={flightForm.from} onChange={(e) => setFlightForm({...flightForm, from: e.target.value})} className="w-full text-lg font-bold text-slate-900 placeholder:text-slate-400 outline-none bg-transparent uppercase" />
                    </div>
                  </div>

                  {/* To */}
                  <div className="flex-1 w-full">
                     <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">TO (CODE)</label>
                     <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
                       <MapPin className="text-blue-500 w-5 h-5 mb-1" />
                       <input type="text" placeholder="DXB" value={flightForm.to} onChange={(e) => setFlightForm({...flightForm, to: e.target.value})} className="w-full text-lg font-bold text-slate-900 placeholder:text-slate-400 outline-none bg-transparent uppercase" />
                     </div>
                  </div>

                  {/* Depart */}
                  <div className="flex-1 w-full">
                     <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">DEPART</label>
                     <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
                       <Calendar className="text-blue-500 w-5 h-5 mb-1" />
                       <input type="date" value={flightForm.date} onChange={(e) => setFlightForm({...flightForm, date: e.target.value})} className="w-full text-lg font-bold text-slate-900 outline-none bg-transparent cursor-pointer" />
                     </div>
                  </div>

                   {/* Search Button */}
                  <div className="w-full md:w-auto">
                    <Button onClick={handleFlightSearch} className="w-full md:w-auto h-14 px-8 text-lg font-bold bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl shadow-lg transition-all">Search Flights</Button>
                  </div>
                </div>
              </TabsContent>

              {/* --- PACKAGES CONTENT --- */}
              <TabsContent value="packages" className="mt-0">
                <div className="bg-white rounded-3xl p-6 md:px-8 md:py-6 flex flex-col md:flex-row items-end gap-6 shadow-2xl">
                    
                    {/* Destination Input */}
                    <div className="flex-[1.5] w-full">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">DESTINATION</label>
                      <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
                        <Search className="text-blue-500 w-5 h-5 mb-1" />
                        <input type="text" placeholder="Where do you want to go?" value={packageQuery} onChange={(e) => setPackageQuery(e.target.value)} className="w-full text-lg font-medium text-slate-900 placeholder:text-slate-400 outline-none bg-transparent" />
                      </div>
                    </div>

                    {/* Budget Input */}
                    <div className="flex-1 w-full">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">BUDGET</label>
                      <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
                        <CreditCard className="text-blue-500 w-5 h-5 mb-1" />
                        <select className="w-full text-lg font-bold text-slate-900 outline-none bg-transparent cursor-pointer appearance-none">
                          <option>Any Budget</option>
                          <option>£500 - £1000</option>
                          <option>£1000 - £2000</option>
                          <option>£2000+</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 ml-auto" />
                      </div>
                    </div>

                    {/* Button */}
                    <div className="w-full md:w-auto">
                      <Button onClick={handlePackageSearch} className="w-full md:w-auto h-14 px-8 text-lg font-bold bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl shadow-lg">Explore Packages</Button>
                    </div>
                 </div>
              </TabsContent>

               {/* --- VISAS CONTENT --- */}
               <TabsContent value="visas" className="mt-0">
                 <div className="bg-white rounded-3xl p-6 md:px-8 md:py-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
                    <div className="text-center md:text-left">
                      <h3 className="text-xl font-bold text-slate-900 mb-1">Need a Visa?</h3>
                      <p className="text-slate-500">We handle Schengen, US, UK & Global visas.</p>
                    </div>
                    <div className="w-full md:w-auto">
                      <Button onClick={handleVisaClick} className="w-full md:w-auto h-14 px-10 text-lg font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-lg">Check Requirements</Button>
                    </div>
                 </div>
              </TabsContent>

            </Tabs>
          </div>
        </div>
      </div>
    </section>
  );
}