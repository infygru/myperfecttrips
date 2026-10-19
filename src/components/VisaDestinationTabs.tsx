"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowRight, CheckCircle2, Stamp } from "lucide-react";

interface VisaPkg {
  id: string | number;
  slug?: string;
  title: string;
  image?: string;
  destination?: string;
  price?: number;
  duration_nights?: number;
  duration_days?: number;
}

interface Props {
  visaFree: VisaPkg[];
  visaOnArrival: VisaPkg[];
  dUrl: string;
}

export default function VisaDestinationTabs({ visaFree, visaOnArrival, dUrl }: Props) {
  const [active, setActive] = useState<"visa_free" | "visa_on_arrival">("visa_free");
  const packages = active === "visa_free" ? visaFree : visaOnArrival;
  const isVF = active === "visa_free";

  return (
    <section className="py-16 lg:py-24 bg-[#F7F5F0]">
      <div className="container-inner">

        {/* Header */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div data-aos="fade-up">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gold-600 mb-2">Hassle-Free Travel</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-medium tracking-tight">
              Visa-Friendly Destinations
            </h2>
          </div>
          <Link
            href="/packages"
            data-aos="fade-up"
            data-aos-delay="80"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-stone-500 hover:text-stone-900 transition-colors shrink-0"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex items-center gap-3" data-aos="fade-up" data-aos-delay="100">
          <button
            onClick={() => setActive("visa_free")}
            className={`inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold transition-all duration-200 ${
              active === "visa_free"
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200/60"
                : "bg-white text-stone-600 hover:bg-stone-50 border border-stone-200"
            }`}
          >
            <CheckCircle2 className={`h-3.5 w-3.5 ${active === "visa_free" ? "text-white" : "text-emerald-500"}`} />
            Visa Free
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
              active === "visa_free" ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-700"
            }`}>{visaFree.length}</span>
          </button>

          <button
            onClick={() => setActive("visa_on_arrival")}
            className={`inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold transition-all duration-200 ${
              active === "visa_on_arrival"
                ? "bg-sky-600 text-white shadow-lg shadow-sky-200/60"
                : "bg-white text-stone-600 hover:bg-stone-50 border border-stone-200"
            }`}
          >
            <Stamp className={`h-3.5 w-3.5 ${active === "visa_on_arrival" ? "text-white" : "text-sky-500"}`} />
            Visa on Arrival
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
              active === "visa_on_arrival" ? "bg-white/20 text-white" : "bg-sky-100 text-sky-700"
            }`}>{visaOnArrival.length}</span>
          </button>
        </div>

        {/* Cards — portrait-style destination tiles */}
        {packages.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
            {packages.map((pkg, idx) => {
              const imgUrl = pkg.image ? `${dUrl}/assets/${pkg.image}` : null;
              return (
                <Link
                  key={pkg.id}
                  href={`/packages/${pkg.slug || pkg.id}`}
                  data-aos="fade-up"
                  data-aos-delay={String((idx % 4) * 70)}
                  className="group relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden rounded-2xl lg:rounded-3xl bg-stone-900 block"
                >
                  {imgUrl ? (
                    <Image
                      src={imgUrl}
                      alt={pkg.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-800 to-brand-950" />
                  )}

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/5" />

                  {/* Visa badge */}
                  <div className={`absolute top-3 left-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold backdrop-blur-sm ${
                    isVF ? "bg-emerald-500/90 text-white" : "bg-sky-500/90 text-white"
                  }`}>
                    {isVF
                      ? <><CheckCircle2 className="h-3 w-3" /> Visa Free</>
                      : <><Stamp className="h-3 w-3" /> On Arrival</>
                    }
                  </div>

                  {/* Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    {pkg.destination && (
                      <p className="flex items-center gap-1 text-[10px] text-white/60 font-medium mb-1">
                        <MapPin className="h-2.5 w-2.5 shrink-0" />
                        {pkg.destination}
                      </p>
                    )}
                    <p className="font-serif text-[15px] font-medium text-white leading-snug line-clamp-2 mb-2.5">
                      {pkg.title}
                    </p>
                    <div className="flex items-center justify-between">
                      {pkg.price ? (
                        <p className="text-sm font-bold text-gold-400">£{Number(pkg.price).toLocaleString("en-GB")}</p>
                      ) : (
                        <p className="text-xs text-white/50 font-medium">On Request</p>
                      )}
                      {pkg.duration_nights && (
                        <span className="text-[10px] text-white/50 font-medium">{pkg.duration_nights}N · {pkg.duration_days}D</span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center rounded-3xl border border-dashed border-stone-200 bg-white py-16 text-center">
            <p className="text-sm text-stone-400">
              No {active === "visa_free" ? "visa-free" : "visa-on-arrival"} packages yet.
              <br />
              <span className="text-xs text-stone-300">
                Set <code>visa_status</code> on packages in Directus to feature them here.
              </span>
            </p>
          </div>
        )}

        {/* Mobile see-all */}
        <div className="mt-8 text-center sm:hidden">
          <Link href="/packages" className="btn-outline text-sm">
            See All Packages
          </Link>
        </div>
      </div>
    </section>
  );
}
