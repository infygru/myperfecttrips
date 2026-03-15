import { unstable_noStore as noStore } from "next/cache";
import { directus, getSiteSettings } from "@/lib/directus";
import { readItems } from "@directus/sdk";
import HeroSearchTabs from "@/components/HeroSearchTabs";
import VisaDestinationTabs from "@/components/VisaDestinationTabs";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin, Clock, ArrowRight, ChevronRight,
  Shield, Star, Award, Headphones, Globe,
  Compass, Users, CheckCircle2,
} from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  let title = "IG Holidays – Official Site | Best Holiday Packages & Flights from India | igholidays.com";
  let description = "IG Holidays (igholidays.com) — India's trusted travel agency. Book premium international & domestic holiday packages, honeymoon tours, family trips, and corporate MICE. Get a free quote today.";
  let ogImage = undefined;
  try {
    const settings = await getSiteSettings();
    if (settings?.tagline) description = settings.tagline;
    if (settings?.hero_image) {
      const dUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://localhost:8055";
      ogImage = `${dUrl}/assets/${settings.hero_image}`;
    }
  } catch { }
  return {
    title,
    description,
    keywords: "holiday packages India, international tour packages, domestic tour packages, honeymoon packages, IG Holidays, travel agency India",
    openGraph: { title, description, url: baseUrl, images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: "IGHolidays" }] : [], type: "website" },
    twitter: { card: "summary_large_image", title, description, images: ogImage ? [ogImage] : [] },
    alternates: { canonical: baseUrl },
  };
}

export default async function Home() {
  noStore();
  let settings: any = null;
  let allPackages: any[] = [];
  let latestBlogs: any[] = [];
  let testimonials: any[] = [];

  try { settings = await getSiteSettings(); } catch { }
  try { allPackages = (await directus.request(readItems("packages" as any, { limit: 100 }))) as any[]; } catch { }
  try {
    latestBlogs = (await directus.request(
      readItems("blog_posts" as any, { limit: 3, sort: ["-id"] as any })
    )) as any[];
  } catch { }
  try {
    testimonials = (await directus.request(
      readItems("testimonials" as any, { filter: { status: { _eq: "published" } } as any, limit: 6, sort: ["-id"] as any })
    )) as any[];
  } catch { }

  const dUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://localhost:8055";
  const heroVideoUrl = settings?.hero_video ? `${dUrl}/assets/${settings.hero_video}` : null;
  const heroImgUrl   = settings?.hero_image  ? `${dUrl}/assets/${settings.hero_image}`  : null;

  // Split by package_type field
  const domesticPackages     = allPackages.filter(p => p.package_type === "domestic");
  const internationalPackages = allPackages.filter(p => p.package_type === "international");

  const featuredPackages = allPackages.slice(0, 6);

  // Trending destinations — derived from packages.destination + destination_image
  const destMap = new Map<string, { name: string; image: string | null; count: number }>();
  for (const pkg of allPackages) {
    const name: string = pkg.destination || (Array.isArray(pkg.destinations) && pkg.destinations[0]) || "";
    if (!name) continue;
    const key = name.toLowerCase();
    if (destMap.has(key)) {
      destMap.get(key)!.count++;
      if (!destMap.get(key)!.image && pkg.destination_image) destMap.get(key)!.image = pkg.destination_image;
    } else {
      destMap.set(key, { name, image: pkg.destination_image || null, count: 1 });
    }
  }
  const trendingDestinations = Array.from(destMap.values()).sort((a, b) => b.count - a.count).slice(0, 6);

  // Theme packages (unique categories with images)
  const seenCats = new Set<string>();
  const themePackages: any[] = [];
  for (const pkg of allPackages) {
    if (pkg.category && !seenCats.has(pkg.category) && pkg.image) {
      seenCats.add(pkg.category); themePackages.push(pkg);
      if (themePackages.length === 4) break;
    }
  }

  // Visa-friendly packages
  const visaFreePackages     = allPackages.filter((p: any) => p.visa_status === "visa_free" && p.image).slice(0, 8);
  const visaOnArrivalPackages = allPackages.filter((p: any) => p.visa_status === "visa_on_arrival" && p.image).slice(0, 8);
  const showVisaSection      = visaFreePackages.length > 0 || visaOnArrivalPackages.length > 0;

  // Budget packages: domestic < ₹10k, international < ₹50k
  const budgetDomestic      = domesticPackages.filter(p => p.price > 0 && p.price <= 10000 && p.image).sort((a, b) => a.price - b.price).slice(0, 3);
  const budgetInternational = internationalPackages.filter(p => p.price > 0 && p.price <= 50000 && p.image).sort((a, b) => a.price - b.price).slice(0, 3);
  const showBudgetSection   = budgetDomestic.length > 0 || budgetInternational.length > 0;

  return (
    <main className="flex min-h-screen flex-col bg-stone-50">

      {/* ── HERO ── */}
      <section className="relative flex min-h-[75svh] items-center justify-center bg-stone-950 z-30 pb-10 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {heroVideoUrl ? (
            <video src={heroVideoUrl} autoPlay loop muted playsInline className="absolute inset-0 h-full w-full object-cover opacity-60" />
          ) : heroImgUrl ? (
            <Image src={heroImgUrl} alt="IGHolidays" fill className="object-cover opacity-60 scale-105 animate-[heroZoomOut_12s_ease-out_forwards]" priority unoptimized />
          ) : (
            <div className="absolute inset-0 bg-stone-950" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/50 to-stone-950/20" />
          {/* Ambient floating orbs */}
          <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-gold-500/10 blur-[100px] animate-float pointer-events-none" />
          <div className="absolute bottom-1/3 right-1/4 h-48 w-48 rounded-full bg-brand-500/10 blur-[80px] animate-float-2 pointer-events-none" />
        </div>
        <div className="container-inner relative z-10 flex flex-col items-center text-center px-4">
          <div className="hero-anim-1 mb-5 mt-16 inline-flex items-center gap-3 text-[10px] sm:text-xs font-bold tracking-widest text-gold-400 uppercase">
            <span className="h-px w-6 sm:w-8 bg-gold-400/50" />
            Trusted by 10,000+ Happy Travellers
            <span className="h-px w-6 sm:w-8 bg-gold-400/50" />
          </div>
          <h1 className="hero-anim-2 mx-auto mt-3 max-w-3xl font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight text-white leading-tight">
            Best Holiday Packages &{" "}
            <span className="bg-gradient-to-r from-yellow-100 via-yellow-400 to-amber-600 bg-clip-text text-transparent italic font-semibold">
              Flight Bookings.
            </span>
          </h1>
          <p className="hero-anim-3 mb-6 mt-5 max-w-xl text-sm sm:text-lg text-stone-300 font-light leading-relaxed">
            {settings?.tagline || "Expertly crafting domestic and international tours. Your trusted travel partner in India."}
          </p>
          <div className="hero-anim-4 w-full mt-6 relative z-20">
            <HeroSearchTabs />
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="bg-brand-950">
        <div className="container-inner">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-brand-800">
            {[
              { value: "15+", label: "Years Experience" },
              { value: "10K+", label: "Happy Travellers" },
              { value: "50+", label: "Destinations" },
              { value: "24/7", label: "Expert Support" },
            ].map((s, idx) => (
              <div key={s.label}
                data-aos="fade-up"
                data-aos-delay={String(idx * 80)}
                className="flex flex-col items-center py-4 px-2 text-center">
                <span className="font-serif text-xl sm:text-2xl font-bold text-gold-400">{s.value}</span>
                <span className="text-[10px] sm:text-xs font-medium uppercase tracking-widest text-stone-400 mt-0.5">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRENDING DESTINATIONS ── */}
      {trendingDestinations.length > 0 && (
        <section className="py-12 lg:py-16 bg-white" id="destinations">
          <div className="container-inner">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div data-aos="fade-up">
                <span className="section-label">Trending Now</span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl text-brand-950 font-medium tracking-tight">Popular Destinations</h2>
              </div>
              <Link href="/packages" data-aos="fade-up" data-aos-delay="100" className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-stone-500 hover:text-brand-950 transition-colors shrink-0">
                View All <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4">
              {trendingDestinations.map((dest, idx) => {
                const imgUrl = dest.image ? `${dUrl}/assets/${dest.image}` : null;
                return (
                  <Link key={dest.name} href={`/packages?destination=${encodeURIComponent(dest.name)}`}
                    data-aos="scale-up"
                    data-aos-delay={String(idx * 70)}
                    className="group flex flex-col items-center gap-2">
                    <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-stone-200 ring-2 ring-transparent group-hover:ring-brand-400 transition-all">
                      {imgUrl ? (
                        <Image src={imgUrl} alt={dest.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" unoptimized />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-700 to-brand-950 flex items-center justify-center">
                          <MapPin className="h-6 w-6 text-white/40" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-stone-800 text-center group-hover:text-brand-700 transition-colors leading-tight">{dest.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── FEATURED PACKAGES ── */}
      <section className="py-12 lg:py-16 bg-stone-50">
        <div className="container-inner">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div data-aos="fade-up">
              <span className="section-label">Curated For You</span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl text-stone-900 font-medium tracking-tight">Handpicked Packages</h2>
            </div>
            <Link href="/packages" data-aos="fade-up" data-aos-delay="100" className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800 shrink-0">
              See All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {featuredPackages.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 pb-3 scrollbar-hide">
              {featuredPackages.map((pkg, idx) => {
                const imgUrl = pkg.image ? `${dUrl}/assets/${pkg.image}` : null;
                return (
                  <Link key={pkg.id} href={`/packages/${pkg.slug || pkg.id}`}
                    data-aos="fade-up"
                    data-aos-delay={String((idx % 3) * 100)}
                    className="group flex flex-col shrink-0 w-[75vw] sm:w-auto snap-center overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                      {imgUrl ? (
                        <Image src={imgUrl} alt={pkg.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" unoptimized />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-800 to-brand-950 flex items-center justify-center">
                          <Compass className="h-10 w-10 text-brand-700/40" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      {pkg.category && (
                        <span className="absolute top-3 left-3 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-brand-900 shadow-sm">
                          {pkg.category}
                        </span>
                      )}
                      {pkg.duration_nights && (
                        <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-lg bg-black/70 px-2.5 py-1 text-[11px] font-medium text-white">
                          <Clock className="h-3 w-3 text-gold-400" />{pkg.duration_nights}N / {pkg.duration_days}D
                        </span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-4 sm:p-5">
                      <h3 className="font-serif text-base sm:text-lg font-medium leading-snug text-stone-900 group-hover:text-brand-700 transition-colors line-clamp-2 mb-2">
                        {pkg.title}
                      </h3>
                      {(pkg.destination || pkg.destinations?.length > 0) && (
                        <p className="flex items-center gap-1 text-xs text-stone-400 mb-3">
                          <MapPin className="h-3 w-3 shrink-0" />
                          <span className="truncate">{pkg.destination || pkg.destinations?.slice(0, 2).join(", ")}</span>
                        </p>
                      )}
                      <div className="mt-auto flex items-center justify-between pt-3 border-t border-stone-100">
                        <div>
                          <p className="text-[10px] text-stone-400 font-medium uppercase tracking-wide">Starting from</p>
                          {pkg.price ? (
                            <p className="font-serif text-lg font-bold text-brand-900">₹{Number(pkg.price).toLocaleString("en-IN")}</p>
                          ) : (
                            <p className="font-serif text-base font-bold text-stone-700">On Request</p>
                          )}
                        </div>
                        <div className="h-8 w-8 flex items-center justify-center rounded-full bg-brand-50 text-brand-700 group-hover:bg-brand-950 group-hover:text-white transition-colors">
                          <ArrowRight className="h-4 w-4 -rotate-45 group-hover:rotate-0 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white py-20 text-center">
              <p className="text-stone-400 font-medium">Packages coming soon</p>
            </div>
          )}
          <div className="mt-5 text-center sm:hidden">
            <Link href="/packages" className="btn-outline text-sm">See All Packages</Link>
          </div>
        </div>
      </section>

      {/* ── VISA DESTINATIONS ── */}
      {showVisaSection && (
        <VisaDestinationTabs
          visaFree={visaFreePackages}
          visaOnArrival={visaOnArrivalPackages}
          dUrl={dUrl}
        />
      )}

      {/* ── DOMESTIC vs INTERNATIONAL ── */}
      {(domesticPackages.length > 0 || internationalPackages.length > 0) && (() => {
        const domesticBannerImg = domesticPackages.find((p: any) => p.image)?.image;
        const intlBannerImg = internationalPackages.find((p: any) => p.image)?.image;
        const domesticDests = [...new Set(domesticPackages.map((p: any) => p.destination).filter(Boolean))].slice(0, 4) as string[];
        const intlDests = [...new Set(internationalPackages.map((p: any) => p.destination).filter(Boolean))].slice(0, 4) as string[];
        return (
          <section className="py-12 lg:py-20 bg-stone-100">
            <div className="container-inner">
              <div className="mb-8 text-center" data-aos="fade-up">
                <span className="section-label mx-auto">Explore by Region</span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl text-brand-950 font-medium tracking-tight">Domestic & International Tours</h2>
                <p className="mt-2 text-sm text-stone-500 max-w-md mx-auto">Choose from our handpicked tours across India and around the world</p>
              </div>

              {/* Hero Banners */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">

                {/* Domestic Banner */}
                <Link href="/packages?package_type=domestic"
                  data-aos="fade-right"
                  data-aos-delay="100"
                  className="group relative h-72 sm:h-80 overflow-hidden rounded-3xl bg-brand-950 block">
                  {domesticBannerImg && (
                    <Image src={`${dUrl}/assets/${domesticBannerImg}`} alt="Domestic Tours" fill
                      className="object-cover opacity-55 transition-transform duration-700 group-hover:scale-110" unoptimized />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/80 via-brand-900/70 to-brand-900/40" />
                  <div className="absolute inset-0 flex flex-col justify-between p-7">
                    <div>
                      <span className="inline-flex items-center rounded-full bg-emerald-400/20 border border-emerald-400/40 px-3.5 py-1 text-xs font-bold text-emerald-300 uppercase tracking-widest">
                        Domestic
                      </span>
                    </div>
                    <div>
                      <h3 className="font-serif text-3xl sm:text-4xl font-medium text-white mb-3">Explore India</h3>
                      {domesticDests.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-5">
                          {domesticDests.map((d) => (
                            <span key={d} className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-white/75">{d}</span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-emerald-300">{domesticPackages.length} packages</span>
                        <span className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-bold text-brand-950 transition-all group-hover:bg-gold-400">
                          View All <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* International Banner */}
                <Link href="/packages?package_type=international"
                  data-aos="fade-left"
                  data-aos-delay="100"
                  className="group relative h-72 sm:h-80 overflow-hidden rounded-3xl bg-brand-950 block">
                  {intlBannerImg && (
                    <Image src={`${dUrl}/assets/${intlBannerImg}`} alt="International Tours" fill
                      className="object-cover opacity-55 transition-transform duration-700 group-hover:scale-110" unoptimized />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-brand-900/70 to-brand-900/40" />
                  <div className="absolute inset-0 flex flex-col justify-between p-7">
                    <div>
                      <span className="inline-flex items-center rounded-full bg-blue-400/20 border border-blue-400/40 px-3.5 py-1 text-xs font-bold text-blue-300 uppercase tracking-widest">
                        International
                      </span>
                    </div>
                    <div>
                      <h3 className="font-serif text-3xl sm:text-4xl font-medium text-white mb-3">Explore the World</h3>
                      {intlDests.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-5">
                          {intlDests.map((d) => (
                            <span key={d} className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-white/75">{d}</span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-blue-300">{internationalPackages.length} packages</span>
                        <span className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-bold text-brand-950 transition-all group-hover:bg-gold-400">
                          View All <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Package Cards — horizontal scroll on mobile, grid on desktop */}
              {domesticPackages.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4" data-aos="fade-up">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                      <h3 className="text-sm font-bold uppercase tracking-widest text-stone-500">Domestic Tours</h3>
                    </div>
                    <Link href="/packages?package_type=domestic" className="text-xs font-semibold text-brand-600 hover:text-brand-800 transition-colors">
                      See all {domesticPackages.length} →
                    </Link>
                  </div>
                  <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 pb-2 scrollbar-hide">
                    {domesticPackages.slice(0, 4).map((pkg: any, idx: number) => {
                      const imgUrl = pkg.image ? `${dUrl}/assets/${pkg.image}` : null;
                      return (
                        <Link key={pkg.id} href={`/packages/${pkg.slug || pkg.id}`}
                          data-aos="fade-up"
                          data-aos-delay={String(idx * 80)}
                          className="group flex flex-col shrink-0 w-[68vw] sm:w-auto snap-center overflow-hidden rounded-2xl bg-white border border-stone-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                          <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                            {imgUrl ? <Image src={imgUrl} alt={pkg.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" unoptimized /> : <div className="absolute inset-0 bg-gradient-to-br from-brand-800 to-brand-950" />}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                            {pkg.duration_nights && (
                              <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-lg bg-black/70 px-2 py-0.5 text-[10px] font-medium text-white">
                                <Clock className="h-2.5 w-2.5 text-gold-400" />{pkg.duration_nights}N/{pkg.duration_days}D
                              </span>
                            )}
                          </div>
                          <div className="p-3.5">
                            <p className="text-sm font-semibold text-stone-900 group-hover:text-brand-700 transition-colors line-clamp-1 mb-1">{pkg.title}</p>
                            {pkg.destination && <p className="text-[11px] text-stone-400 flex items-center gap-0.5 mb-2"><MapPin className="h-2.5 w-2.5 shrink-0" />{pkg.destination}</p>}
                            <p className="text-sm font-bold text-brand-700">{pkg.price ? `₹${Number(pkg.price).toLocaleString("en-IN")}` : "On Request"}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {internationalPackages.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4" data-aos="fade-up">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-blue-500"></span>
                      <h3 className="text-sm font-bold uppercase tracking-widest text-stone-500">International Tours</h3>
                    </div>
                    <Link href="/packages?package_type=international" className="text-xs font-semibold text-brand-600 hover:text-brand-800 transition-colors">
                      See all {internationalPackages.length} →
                    </Link>
                  </div>
                  <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 pb-2 scrollbar-hide">
                    {internationalPackages.slice(0, 4).map((pkg: any, idx: number) => {
                      const imgUrl = pkg.image ? `${dUrl}/assets/${pkg.image}` : null;
                      return (
                        <Link key={pkg.id} href={`/packages/${pkg.slug || pkg.id}`}
                          data-aos="fade-up"
                          data-aos-delay={String(idx * 80)}
                          className="group flex flex-col shrink-0 w-[68vw] sm:w-auto snap-center overflow-hidden rounded-2xl bg-white border border-stone-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                          <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                            {imgUrl ? <Image src={imgUrl} alt={pkg.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" unoptimized /> : <div className="absolute inset-0 bg-gradient-to-br from-brand-800 to-brand-950" />}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                            {pkg.duration_nights && (
                              <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-lg bg-black/70 px-2 py-0.5 text-[10px] font-medium text-white">
                                <Clock className="h-2.5 w-2.5 text-gold-400" />{pkg.duration_nights}N/{pkg.duration_days}D
                              </span>
                            )}
                          </div>
                          <div className="p-3.5">
                            <p className="text-sm font-semibold text-stone-900 group-hover:text-brand-700 transition-colors line-clamp-1 mb-1">{pkg.title}</p>
                            {pkg.destination && <p className="text-[11px] text-stone-400 flex items-center gap-0.5 mb-2"><MapPin className="h-2.5 w-2.5 shrink-0" />{pkg.destination}</p>}
                            <p className="text-sm font-bold text-brand-700">{pkg.price ? `₹${Number(pkg.price).toLocaleString("en-IN")}` : "On Request"}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </section>
        );
      })()}

      {/* ── EXPLORE BY THEME ── */}
      {themePackages.length > 0 && (
        <section className="py-12 lg:py-16 bg-stone-50">
          <div className="container-inner">
            <div className="mb-8 text-center" data-aos="fade-up">
              <span className="section-label mx-auto">Travel Styles</span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl text-brand-950 font-medium tracking-tight">Explore by Theme</h2>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {themePackages.map((pkg, idx) => (
                <Link href={`/packages?category=${encodeURIComponent(pkg.category)}`} key={pkg.id || idx}
                  data-aos="zoom-in"
                  data-aos-delay={String(idx * 100)}
                  className="group relative w-full aspect-[3/4] sm:aspect-square overflow-hidden rounded-2xl bg-stone-900">
                  <Image src={`${dUrl}/assets/${pkg.image}`} alt={pkg.category} fill
                    className="object-cover opacity-75 transition-transform duration-500 group-hover:scale-110 group-hover:opacity-90" unoptimized />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 text-center">
                    <h3 className="font-serif text-sm sm:text-xl font-medium text-white">{pkg.category}</h3>
                    <p className="mt-0.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gold-400">Explore →</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── BUDGET PACKAGES ── */}
      {showBudgetSection && (
        <section className="py-12 lg:py-16 bg-white">
          <div className="container-inner">
            <div className="mb-8" data-aos="fade-up">
              <span className="section-label">Affordable Getaways</span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl text-stone-900 font-medium tracking-tight">Budget-Friendly Deals</h2>
              <p className="mt-2 text-sm text-stone-400">Domestic under ₹10,000 · International under ₹50,000</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* Domestic Budget */}
              {budgetDomestic.length > 0 && (
                <div data-aos="fade-right">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-stone-500">Domestic · Under ₹10,000</h3>
                  </div>
                  <div className="grid gap-3">
                    {budgetDomestic.map((pkg, idx) => (
                      <Link key={pkg.id} href={`/packages/${pkg.slug || pkg.id}`}
                        data-aos="fade-up"
                        data-aos-delay={String(idx * 80)}
                        className="group relative overflow-hidden rounded-2xl h-36 bg-stone-900 flex items-end">
                        <Image src={`${dUrl}/assets/${pkg.image}`} alt={pkg.title} fill className="object-cover opacity-80 transition-transform duration-500 group-hover:scale-105" unoptimized />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                        <div className="relative z-10 p-4 flex items-end justify-between w-full">
                          <div>
                            <p className="font-serif text-base font-medium text-white line-clamp-1">{pkg.title}</p>
                            {pkg.destination && <p className="text-[11px] text-white/60 mt-0.5 flex items-center gap-1"><MapPin className="h-3 w-3" />{pkg.destination}</p>}
                          </div>
                          <div className="text-right shrink-0 ml-3">
                            <p className="text-xs text-white/60 font-medium">From</p>
                            <p className="font-serif text-lg font-bold text-gold-400">₹{Number(pkg.price).toLocaleString("en-IN")}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Link href="/packages?package_type=domestic&sort=price-asc" className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800">
                    More domestic deals <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              )}

              {/* International Budget */}
              {budgetInternational.length > 0 && (
                <div data-aos="fade-left">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-stone-500">International · Under ₹50,000</h3>
                  </div>
                  <div className="grid gap-3">
                    {budgetInternational.map((pkg, idx) => (
                      <Link key={pkg.id} href={`/packages/${pkg.slug || pkg.id}`}
                        data-aos="fade-up"
                        data-aos-delay={String(idx * 80)}
                        className="group relative overflow-hidden rounded-2xl h-36 bg-stone-900 flex items-end">
                        <Image src={`${dUrl}/assets/${pkg.image}`} alt={pkg.title} fill className="object-cover opacity-80 transition-transform duration-500 group-hover:scale-105" unoptimized />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                        <div className="relative z-10 p-4 flex items-end justify-between w-full">
                          <div>
                            <p className="font-serif text-base font-medium text-white line-clamp-1">{pkg.title}</p>
                            {pkg.destination && <p className="text-[11px] text-white/60 mt-0.5 flex items-center gap-1"><MapPin className="h-3 w-3" />{pkg.destination}</p>}
                          </div>
                          <div className="text-right shrink-0 ml-3">
                            <p className="text-xs text-white/60 font-medium">From</p>
                            <p className="font-serif text-lg font-bold text-gold-400">₹{Number(pkg.price).toLocaleString("en-IN")}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Link href="/packages?sort=price-asc" className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-800">
                    More international deals <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── TESTIMONIALS ── */}
      {(testimonials.length > 0) && (
        <section className="py-12 lg:py-16 bg-stone-50">
          <div className="container-inner">
            <div className="mb-8 text-center" data-aos="fade-up">
              <span className="section-label mx-auto">Client Stories</span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl text-brand-950 font-medium tracking-tight">What Travellers Say</h2>
            </div>
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 -mx-4 px-4 sm:mx-0 sm:px-0 lg:grid lg:grid-cols-3 pb-3 scrollbar-hide">
              {testimonials.map((r: any, i: number) => (
                <div key={r.id ?? i}
                  data-aos="fade-up"
                  data-aos-delay={String((i % 3) * 120)}
                  className="shrink-0 w-[82vw] sm:w-auto snap-center rounded-2xl bg-white border border-stone-100 shadow-sm p-6 sm:p-8 flex flex-col">
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(Math.min(r.rating ?? 5, 5))].map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-gold-400 text-gold-400" />
                    ))}
                  </div>
                  <p className="text-stone-600 text-sm sm:text-[15px] leading-relaxed flex-1 mb-6">&quot;{r.text}&quot;</p>
                  <div className="border-t border-stone-100 pt-4 flex items-center gap-3">
                    <div className="flex-shrink-0 h-9 w-9 rounded-full bg-brand-950 flex items-center justify-center text-white text-xs font-bold uppercase">
                      {(r.name || "?").split(" ").map((w: string) => w[0]).slice(0, 2).join("")}
                    </div>
                    <div>
                      <p className="font-bold text-brand-950 text-sm leading-snug">{r.name}</p>
                      <p className="text-xs text-stone-400 mt-0.5">{r.tour_name}{r.location ? ` · ${r.location}` : ""}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── WHY CHOOSE US ── */}
      <section className="py-12 lg:py-20 bg-brand-950">
        <div className="container-inner">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div data-aos="fade-right">
              <span className="section-label !text-gold-400 before:!bg-gold-400/30 after:!bg-gold-400/30">Why Choose Us?</span>
              <h2 className="mb-4 font-serif text-2xl sm:text-3xl lg:text-4xl text-white font-medium">Top Rated Travel Planners in India.</h2>
              <p className="mb-8 text-sm sm:text-base leading-relaxed text-stone-300">
                With over 15 years of curating bespoke domestic & international trips, our extensive global network guarantees unparalleled service to make your dream holidays spectacular.
              </p>
              <Link href="/contact" className="btn-gold text-sm px-6 py-3">Speak to an Expert</Link>
            </div>
            <div className="grid grid-cols-2 gap-4" data-aos="fade-left" data-aos-delay="100">
              {[
                { icon: Shield, title: "100% Secure", desc: "Fully verified partners and trusted secure payments." },
                { icon: Globe, title: "Global Reach", desc: "Exclusive connections across 50+ countries." },
                { icon: Headphones, title: "24/7 Support", desc: "Dedicated support throughout your journey." },
                { icon: Award, title: "Best Price", desc: "Unbeatable value and exclusive upgrades." },
              ].map((f, idx) => (
                <div key={idx}
                  data-aos="scale-up"
                  data-aos-delay={String(100 + idx * 80)}
                  className="rounded-2xl border border-brand-800 bg-brand-900/50 p-5 sm:p-6">
                  <f.icon className="mb-4 h-6 w-6 text-gold-400" />
                  <h3 className="mb-1 font-serif text-base sm:text-lg font-medium text-white">{f.title}</h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-stone-400">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="container-inner">
          <div className="mb-10 text-center" data-aos="fade-up">
            <span className="section-label mx-auto">Simple Process</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl text-brand-950 font-medium tracking-tight">How It Works</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
            {[
              { step: "01", icon: Compass, title: "Choose Destination", desc: "Browse our curated packages or tell us your dream destination." },
              { step: "02", icon: Users, title: "Share Your Details", desc: "Fill in travel dates, group size, and preferences." },
              { step: "03", icon: CheckCircle2, title: "Get Custom Quote", desc: "Our experts craft a personalised itinerary just for you." },
              { step: "04", icon: Star, title: "Travel & Enjoy", desc: "Sit back and enjoy a flawlessly planned holiday." },
            ].map((s, i) => (
              <div key={i}
                data-aos="fade-up"
                data-aos-delay={String(i * 100)}
                className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-brand-950 text-white">
                    <s.icon className="h-6 w-6 sm:h-7 sm:w-7" />
                  </div>
                  <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-gold-400 text-[10px] font-black text-stone-950">{s.step}</span>
                </div>
                <h3 className="font-serif text-sm sm:text-base font-medium text-brand-950 mb-1">{s.title}</h3>
                <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BLOG ── */}
      {latestBlogs.length > 0 && (
        <section className="py-12 lg:py-16 bg-stone-50">
          <div className="container-inner">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div data-aos="fade-up">
                <span className="section-label">Travel Journal</span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl text-stone-900 font-medium">Stories & Insights</h2>
              </div>
              <Link href="/blog" data-aos="fade-up" data-aos-delay="100" className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800 shrink-0">
                Read All <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 pb-3 scrollbar-hide">
              {latestBlogs.map((post, idx) => {
                const imgUrl = post.featured_image ? `${dUrl}/assets/${post.featured_image}` : null;
                return (
                  <Link key={post.id} href={`/blog/${post.slug || post.id}`}
                    data-aos="fade-up"
                    data-aos-delay={String(idx * 100)}
                    className="group shrink-0 w-[78vw] sm:w-auto snap-center flex flex-col overflow-hidden rounded-2xl bg-white border border-stone-200 hover:shadow-lg hover:-translate-y-1 transition-all">
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-stone-100">
                      {imgUrl ? (
                        <Image src={imgUrl} alt={post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" unoptimized />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-800 to-brand-950 flex items-center justify-center">
                          <Globe className="h-8 w-8 text-brand-700/40" />
                        </div>
                      )}
                      {post.category && (
                        <span className="absolute top-3 left-3 rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-800 shadow-sm">
                          {post.category}
                        </span>
                      )}
                    </div>
                    <div className="p-4 sm:p-5 flex flex-col flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-brand-600 mb-2">
                        {post.published_date ? new Date(post.published_date).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : "Journal"}
                      </p>
                      <h3 className="font-serif text-base font-medium leading-snug text-stone-900 group-hover:text-brand-700 transition-colors line-clamp-2 mb-auto">
                        {post.title}
                      </h3>
                      <div className="mt-3 pt-3 border-t border-stone-100 flex items-center gap-1.5 text-xs font-semibold text-brand-600">
                        Read More <ArrowRight className="h-3 w-3" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA BANNER ── */}
      <section className="bg-white px-4 py-12 lg:py-20">
        <div data-aos="zoom-in" className="mx-auto max-w-4xl overflow-hidden rounded-3xl bg-brand-950 border border-brand-800 p-8 sm:p-14 text-center shadow-2xl relative">
          <div className="absolute top-0 left-1/4 -m-24 h-48 w-48 rounded-full bg-emerald-500/20 blur-[80px]" />
          <div className="absolute bottom-0 right-1/4 -m-24 h-48 w-48 rounded-full bg-amber-500/20 blur-[80px]" />
          <div className="relative z-10">
            <h2 className="mb-4 font-serif text-2xl sm:text-3xl lg:text-4xl font-medium text-white">Start Planning Your Next Holiday</h2>
            <p className="mb-8 text-sm sm:text-base text-stone-300 mx-auto max-w-xl">
              Contact our tourism experts today. We'll craft a customized itinerary perfectly tailored to your budget and travel style.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/packages" className="btn-gold w-full sm:w-auto text-sm">Browse Packages</Link>
              <Link href="/contact" className="btn-outline w-full sm:w-auto !bg-transparent !text-white !border-white/30 hover:!bg-white/10 text-sm">Contact Us</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
