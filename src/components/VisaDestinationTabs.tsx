"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, ArrowRight, Stamp } from "lucide-react";

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

  return (
    <section className="py-12 lg:py-16 bg-white">
      <div className="container-inner">

        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div data-aos="fade-up">
            <span className="section-label">Hassle-Free Travel</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl text-brand-950 font-medium tracking-tight">
              Visa-Friendly Destinations
            </h2>
          </div>
          <Link
            href="/packages"
            data-aos="fade-up"
            data-aos-delay="80"
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-stone-500 hover:text-brand-950 transition-colors shrink-0"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Capsule Tabs */}
        <div className="mb-8 flex items-center gap-2" data-aos="fade-up" data-aos-delay="100">
          <button
            onClick={() => setActive("visa_free")}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-200 ${
              active === "visa_free"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
                : "bg-stone-100 text-stone-500 hover:bg-stone-200"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${active === "visa_free" ? "bg-white" : "bg-emerald-500"}`}
            />
            Visa Free
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                active === "visa_free" ? "bg-white/20 text-white" : "bg-stone-200 text-stone-500"
              }`}
            >
              {visaFree.length}
            </span>
          </button>

          <button
            onClick={() => setActive("visa_on_arrival")}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-200 ${
              active === "visa_on_arrival"
                ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                : "bg-stone-100 text-stone-500 hover:bg-stone-200"
            }`}
          >
            <Stamp
              className={`h-3.5 w-3.5 ${active === "visa_on_arrival" ? "text-white" : "text-blue-500"}`}
            />
            Visa on Arrival
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                active === "visa_on_arrival" ? "bg-white/20 text-white" : "bg-stone-200 text-stone-500"
              }`}
            >
              {visaOnArrival.length}
            </span>
          </button>
        </div>

        {/* Package Cards */}
        {packages.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 pb-3 scrollbar-hide">
            {packages.map((pkg) => {
              const imgUrl = pkg.image ? `${dUrl}/assets/${pkg.image}` : null;
              const isVF = active === "visa_free";
              return (
                <Link
                  key={pkg.id}
                  href={`/packages/${pkg.slug || pkg.id}`}
                  className="group flex flex-col shrink-0 w-[72vw] sm:w-auto snap-center overflow-hidden rounded-2xl bg-white border border-stone-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                    {imgUrl ? (
                      <Image
                        src={imgUrl}
                        alt={pkg.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        unoptimized
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-brand-800 to-brand-950" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                    {/* Visa badge */}
                    <span
                      className={`absolute top-3 left-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide shadow-sm ${
                        isVF
                          ? "bg-emerald-500 text-white"
                          : "bg-blue-500 text-white"
                      }`}
                    >
                      {isVF ? (
                        <>
                          <span className="h-1.5 w-1.5 rounded-full bg-white" />
                          Visa Free
                        </>
                      ) : (
                        <>
                          <Stamp className="h-3 w-3" />
                          Visa on Arrival
                        </>
                      )}
                    </span>

                    {/* Duration badge */}
                    {pkg.duration_nights && (
                      <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-lg bg-black/70 px-2 py-0.5 text-[10px] font-medium text-white">
                        <Clock className="h-2.5 w-2.5 text-gold-400" />
                        {pkg.duration_nights}N/{pkg.duration_days}D
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3.5 flex flex-col flex-1">
                    <p className="text-sm font-semibold text-stone-900 group-hover:text-brand-700 transition-colors line-clamp-1 mb-1">
                      {pkg.title}
                    </p>
                    {pkg.destination && (
                      <p className="text-[11px] text-stone-400 flex items-center gap-0.5 mb-2">
                        <MapPin className="h-2.5 w-2.5 shrink-0" />
                        {pkg.destination}
                      </p>
                    )}
                    <div className="mt-auto flex items-center justify-between">
                      <p className="text-sm font-bold text-brand-700">
                        {pkg.price ? `£${Number(pkg.price).toLocaleString("en-GB")}` : "On Request"}
                      </p>
                      <div className="h-7 w-7 flex items-center justify-center rounded-full bg-brand-50 text-brand-700 group-hover:bg-brand-950 group-hover:text-white transition-colors">
                        <ArrowRight className="h-3.5 w-3.5 -rotate-45 group-hover:rotate-0 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center rounded-2xl border border-dashed border-stone-200 bg-stone-50 py-16 text-center">
            <p className="text-sm text-stone-400">
              No {active === "visa_free" ? "visa-free" : "visa-on-arrival"} packages yet.
              <br />
              <span className="text-xs text-stone-300">
                Set <code>visa_status</code> on packages in the Directus admin to feature them here.
              </span>
            </p>
          </div>
        )}

        {/* Mobile see-all */}
        <div className="mt-5 text-center sm:hidden">
          <Link href="/packages" className="btn-outline text-sm">
            See All Packages
          </Link>
        </div>
      </div>
    </section>
  );
}
