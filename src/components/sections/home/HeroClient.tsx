"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Plane,
  Globe,
  FileText,
  MapPin,
  Calendar,
  Search,
  CreditCard,
  ChevronDown,
} from "lucide-react";

export default function HeroClient({ data }: { data: any }) {
  const router = useRouter();
  const [activeTab, setActiveTab] =
    useState<"flights" | "packages" | "visas">("flights");

  const [flightForm, setFlightForm] = useState({
    from: "",
    to: "",
    date: "",
  });

  const [packageQuery, setPackageQuery] = useState("");

  /* ---------------- BACKGROUND MEDIA ---------------- */
  const renderBackgroundMedia = () => {
    const videoObj = data?.background_video;
    const videoId = typeof videoObj === "object" ? videoObj?.id : videoObj;

    const imageObj = data?.background_image;
    let imageUrl = "";

    if (typeof imageObj === "object" && imageObj?.id) {
      imageUrl = `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${imageObj.id}`;
    } else if (typeof imageObj === "string") {
      imageUrl = imageObj.startsWith("http")
        ? imageObj
        : `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${imageObj}`;
    }

    const videoUrl = videoId
      ? `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${videoId}`
      : null;

    if (videoUrl) {
      return (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      );
    }

    return (
      <Image
        src={imageUrl}
        alt="Hero Background"
        fill
        priority
        className="object-cover"
      />
    );
  };

  /* ---------------- ACTIONS ---------------- */
  const handleFlightSearch = () => {
    const params = new URLSearchParams(flightForm);
    router.push(`/contact?${params.toString()}`);
  };

  const handlePackageSearch = () => {
    router.push(`/packages?search=${packageQuery}`);
  };

  const handleVisaClick = () => {
    router.push("/services");
  };

  /* ---------------- CONTENT ---------------- */
  const title = data?.title || "Discover the World,<br/>Your Way";
  const description =
    data?.description ||
    "Manchester's premier travel consultancy. From seamless Schengen visas to luxury bespoke itineraries.";
  const ratingsText = data?.ratings_text || "Rated 4.9/5 by Travellers";

  return (
    <section className="relative h-[100vh] w-full overflow-hidden pt-24">
      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0">
        {renderBackgroundMedia()}
        <div className="absolute inset-0 bg-black/45" />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 w-full">

          {/* HERO TEXT */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/20 backdrop-blur text-white text-sm mb-4">
              ⭐ {ratingsText}
            </div>

            <h1
              className="text-4xl md:text-6xl font-bold text-white leading-tight max-w-3xl mx-auto mb-3"
              dangerouslySetInnerHTML={{ __html: title }}
            />

            {/* DESCRIPTION – FIXED (no visible <p>) */}
            <div
              className="text-base md:text-lg text-slate-200 max-w-xl mx-auto"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </div>

          {/* ================= SEARCH WIDGET ================= */}
          <div className="max-w-6xl mx-auto">
            <div className="rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl p-5">

              {/* TABS */}
              <div className="flex gap-5 mb-5">
                {[
                  { key: "flights", icon: Plane, label: "Flights" },
                  { key: "packages", icon: Globe, label: "Holiday Packages" },
                  { key: "visas", icon: FileText, label: "Visa Services" },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key as any)}
                      className={`flex items-center gap-2 px-6 py-2 rounded-full font-semibold transition
                        ${
                          isActive
                            ? "bg-white text-blue-600 shadow"
                            : "text-white/90"
                        }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* WHITE BAR */}
              <div className="bg-white rounded-xl px-6 py-4 shadow-lg">

                {/* FLIGHTS */}
                {activeTab === "flights" && (
                  <div className="flex flex-col md:flex-row gap-5 items-end">
                    {[
                      {
                        label: "FROM (CODE)",
                        value: flightForm.from,
                        onChange: (v: string) =>
                          setFlightForm({ ...flightForm, from: v }),
                        placeholder: "MAN",
                      },
                      {
                        label: "TO (CODE)",
                        value: flightForm.to,
                        onChange: (v: string) =>
                          setFlightForm({ ...flightForm, to: v }),
                        placeholder: "DXB",
                      },
                    ].map((field, i) => (
                      <div key={i} className="flex-1">
                        <label className="text-xs font-semibold text-slate-500 mb-1 block">
                          {field.label}
                        </label>
                        <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
                          <MapPin className="w-5 h-5 text-blue-600" />
                          <input
                            value={field.value}
                            onChange={(e) =>
                              field.onChange(e.target.value)
                            }
                            placeholder={field.placeholder}
                            className="w-full font-semibold outline-none bg-transparent uppercase"
                          />
                        </div>
                      </div>
                    ))}

                    <div className="flex-1">
                      <label className="text-xs font-semibold text-slate-500 mb-1 block">
                        DEPART
                      </label>
                      <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <input
                          type="date"
                          value={flightForm.date}
                          onChange={(e) =>
                            setFlightForm({
                              ...flightForm,
                              date: e.target.value,
                            })
                          }
                          className="w-full font-semibold outline-none bg-transparent"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleFlightSearch}
                      className="h-11 px-7 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500"
                    >
                      Search Flights
                    </button>
                  </div>
                )}

                {/* PACKAGES */}
                {activeTab === "packages" && (
                  <div className="flex flex-col md:flex-row gap-5 items-end">
                    <div className="flex-1">
                      <label className="text-xs font-semibold text-slate-500 mb-1 block">
                        DESTINATION
                      </label>
                      <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
                        <Search className="w-5 h-5 text-blue-600" />
                        <input
                          value={packageQuery}
                          onChange={(e) =>
                            setPackageQuery(e.target.value)
                          }
                          placeholder="Where do you want to go?"
                          className="w-full font-semibold outline-none bg-transparent"
                        />
                      </div>
                    </div>

                    <div className="flex-1">
                      <label className="text-xs font-semibold text-slate-500 mb-1 block">
                        BUDGET
                      </label>
                      <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                        <select className="w-full outline-none bg-transparent font-semibold appearance-none">
                          <option>Any Budget</option>
                          <option>£500 - £1000</option>
                          <option>£1000 - £2000</option>
                          <option>£2000+</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>

                    <button
                      onClick={handlePackageSearch}
                      className="h-11 px-7 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500"
                    >
                      Explore Packages
                    </button>
                  </div>
                )}

                {/* VISAS */}
                {activeTab === "visas" && (
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        Need a Visa?
                      </h3>
                      <div className="text-sm text-slate-500">
                        Schengen, UK, US & Global visas handled.
                      </div>
                    </div>
                    <button
                      onClick={handleVisaClick}
                      className="h-11 px-7 rounded-xl font-semibold text-white bg-slate-900"
                    >
                      Check Requirements
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* ================= END SEARCH WIDGET ================= */}

        </div>
      </div>
    </section>
  );
}
