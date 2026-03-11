import { unstable_noStore as noStore } from "next/cache";
import { directus, getSiteSettings } from "@/lib/directus";
import { readItems } from "@directus/sdk";
import HeroSearchTabs from "@/components/HeroSearchTabs";
import Image from "next/image";
import Link from "next/link";
import {
  Mountain,
  TreePine,
  Ship,
  Sun,
  Castle,
  Building2,
  MapPin,
  Clock,
  ArrowRight,
  ChevronRight,
  Shield,
  Star,
  Award,
  Headphones,
  Globe,
  Compass,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Home() {
  noStore();
  let settings: any = null;
  let featuredPackages: any[] = [];
  let latestBlogs: any[] = [];

  try {
    settings = await getSiteSettings();
  } catch (err) {
    console.error("Failed to fetch site_settings:", err);
  }
  let allPackages: any[] = [];
  try {
    allPackages = (await directus.request(
      readItems("packages" as any, { limit: 100 })
    )) as any[];
  } catch (err) {
    console.error("Failed to fetch packages:", err);
  }

  featuredPackages = allPackages.slice(0, 6);

  // Compute Themes dynamically based on unique categories
  const themePackages: any[] = [];
  const seenCategories = new Set<string>();
  for (const pkg of allPackages) {
    if (pkg.category && !seenCategories.has(pkg.category) && pkg.image) {
      seenCategories.add(pkg.category);
      themePackages.push(pkg);
      if (themePackages.length === 4) break;
    }
  }

  // Compute Budget Friendly by sorting cheapest
  const budgetPackages = [...allPackages]
    .filter(p => p.price > 0 && p.image)
    .sort((a, b) => Number(a.price) - Number(b.price))
    .slice(0, 3);
  try {
    latestBlogs = (await directus.request(
      readItems("blog_posts" as any, {
        limit: 4,
        sort: ["-id"] as any,
      })
    )) as any[];
  } catch (err) {
    console.error("Failed to fetch blog_posts:", err);
  }

  const dUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://localhost:8055";

  // Check for hero media from Directus
  const heroVideoUrl = settings?.hero_video
    ? `${dUrl}/assets/${settings.hero_video}`
    : null;
  const heroImgUrl = settings?.hero_image
    ? `${dUrl}/assets/${settings.hero_image}`
    : null;

  // Extract unique destinations from existing packages instead of hardcoding
  const uniqueDestinations = new Map();
  featuredPackages.forEach((pkg) => {
    if (pkg.destinations && Array.isArray(pkg.destinations)) {
      pkg.destinations.forEach((dest: string) => {
        if (!uniqueDestinations.has(dest)) {
          uniqueDestinations.set(dest, { name: dest, count: 1 });
        } else {
          uniqueDestinations.get(dest).count++;
        }
      });
    }
  });
  const destinationsArray = Array.from(uniqueDestinations.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const getDestIcon = (name: string) => {
    const l = name.toLowerCase();
    if (l.includes("mountain") || l.includes("himalaya") || l.includes("kashmir") || l.includes("swiss")) return Mountain;
    if (l.includes("kerala") || l.includes("bali") || l.includes("forest") || l.includes("jungle")) return TreePine;
    if (l.includes("maldives") || l.includes("beach") || l.includes("goa") || l.includes("island")) return Sun;
    if (l.includes("cruise") || l.includes("boat") || l.includes("river")) return Ship;
    if (l.includes("europe") || l.includes("fort") || l.includes("rajasthan") || l.includes("palace") || l.includes("london")) return Castle;
    if (l.includes("dubai") || l.includes("singapore") || l.includes("city") || l.includes("york")) return Building2;
    return MapPin;
  };

  return (
    <main className="flex min-h-screen flex-col bg-stone-50">
      {/* ──────────────────────────────────────────────────────────
          SECTION 1: HERO
          ────────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[90svh] items-center justify-center bg-stone-950 z-30">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {heroVideoUrl ? (
            <video
              src={heroVideoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 h-full w-full object-cover opacity-60"
            />
          ) : heroImgUrl ? (
            <Image
              src={heroImgUrl}
              alt="Premium Travel Agency Hero Background"
              fill
              className="object-cover opacity-60"
              priority
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 bg-stone-950 opacity-80" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/50 to-stone-950/20" />
        </div>

        <div className="container-inner relative z-10 flex flex-col items-center text-center">
          <div className="mb-6 inline-flex items-center gap-4 text-xs font-bold tracking-widest text-[#fbbf24] uppercase">
            <span className="h-px w-8 bg-[#fbbf24]/50" />
            Voted Best Travel Agency in India
            <span className="h-px w-8 bg-[#fbbf24]/50" />
          </div>

          <h1 className="mb-6 max-w-5xl font-serif text-4xl font-medium leading-[1.1] text-white sm:text-5xl md:text-6xl lg:text-7xl tracking-tight">
            Premium Holiday Packages & <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-yellow-100 via-yellow-400 to-amber-600 bg-clip-text text-transparent italic font-semibold">Bespoke Travel.</span>
          </h1>

          <h2 className="mb-12 max-w-2xl text-lg text-stone-300 font-light leading-relaxed sm:text-xl">
            {settings?.tagline ||
              "Expertly crafting domestic and international tours. From Maldives honeymoons to European group vacations, IGHolidays is your trusted luxury travel partner in India."}
          </h2>

          {/* Dual Search Tabs */}
          <div className="w-full mt-4 relative z-20">
            <HeroSearchTabs />
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          SECTION 2: POPULAR DESTINATIONS (Dynamic from Packages)
          ────────────────────────────────────────────────────────── */}
      {destinationsArray.length > 0 && (
        <section className="py-16 lg:py-20 bg-white" id="destinations">
          <div className="container-inner">
            <div className="mb-10 flex flex-col items-center justify-between gap-4 text-center md:flex-row md:items-end md:text-left">
              <div>
                <span className="section-label">Where to next</span>
                <h2 className="text-4xl text-brand-950 md:text-5xl font-medium tracking-tight">
                  Trending Destinations
                </h2>
              </div>
              <Link
                href="/packages"
                className="group flex items-center gap-2 font-semibold text-stone-500 transition-colors hover:text-brand-950"
              >
                Browse All{" "}
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 sm:gap-6">
              {destinationsArray.map((dest) => {
                const IconComponent = getDestIcon(dest.name);
                return (
                  <Link
                    key={dest.name}
                    href={`/packages?category=${dest.name}`}
                    className="group relative flex aspect-[4/3] sm:aspect-square w-full flex-col items-center justify-center overflow-hidden rounded-3xl bg-stone-50 transition-all hover:-translate-y-1.5 hover:shadow-xl border border-stone-100"
                  >
                    <div className="absolute inset-0 bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    <div className="relative z-10 flex flex-col items-center justify-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-stone-100 text-stone-400 group-hover:bg-brand-950 group-hover:text-gold-400 transition-colors duration-500 shadow-sm">
                        <IconComponent className="h-7 w-7 transition-transform duration-500 group-hover:scale-110" />
                      </div>
                      <div className="text-center">
                        <h3 className="text-lg font-semibold text-brand-950 transition-colors">
                          {dest.name}
                        </h3>
                        <p className="mt-1 text-xs font-bold uppercase tracking-widest text-stone-400 group-hover:text-stone-500 transition-colors">
                          {dest.count} Package{dest.count > 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ──────────────────────────────────────────────────────────
          SECTION 3: FEATURED PACKAGES
          ────────────────────────────────────────────────────────── */}
      <section className="pb-20 lg:pb-32 bg-white">
        <div className="container-inner">
          <div className="mb-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <span className="section-label">Top Rated Packages</span>
              <h2 className="text-4xl text-stone-900 md:text-5xl">
                Bestselling Tours & Itineraries
              </h2>
            </div>
            <Link
              href="/packages"
              className="group flex items-center gap-2 font-semibold text-brand-700 transition-colors hover:text-brand-800"
            >
              See All Packages{" "}
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {featuredPackages.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {featuredPackages.map((pkg) => {
                const imgUrl = pkg.image
                  ? `${dUrl}/assets/${pkg.image}`
                  : null;

                return (
                  <Link
                    key={pkg.id}
                    href={`/packages/${pkg.slug || pkg.id}`}
                    className="group flex flex-col overflow-hidden rounded-[2rem] border border-stone-200 bg-white transition-all hover:-translate-y-1.5 hover:shadow-xl hover:border-stone-300"
                  >
                    <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-stone-100">
                      {imgUrl ? (
                        <Image
                          src={imgUrl}
                          alt={pkg.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          unoptimized
                        />
                      ) : (
                        <Compass className="h-16 w-16 text-stone-300" />
                      )}
                      {pkg.category && (
                        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-800 backdrop-blur-md shadow-sm">
                          {pkg.category}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-6 sm:p-8">
                      <div className="mb-4 flex flex-wrap items-center gap-4 text-xs font-medium text-stone-500">
                        {pkg.duration_nights && (
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4 text-brand-600" />
                            {pkg.duration_nights}N / {pkg.duration_days}D
                          </span>
                        )}
                        {pkg.destinations?.length > 0 && (
                          <span className="flex items-center gap-1.5">
                            <MapPin className="h-4 w-4 text-brand-600" />
                            {pkg.destinations.slice(0, 2).join(", ")}
                          </span>
                        )}
                      </div>

                      <h3 className="mb-6 font-serif text-2xl font-medium leading-tight text-stone-900 transition-colors group-hover:text-brand-700">
                        {pkg.title}
                      </h3>

                      <div className="mt-auto flex items-end justify-between border-t border-stone-100 pt-6">
                        <div>
                          <p className="text-xs font-medium text-stone-500">
                            Starting from
                          </p>
                          {pkg.price ? (
                            <p className="font-serif text-2xl font-bold text-brand-900">
                              ₹{Number(pkg.price).toLocaleString("en-IN")}
                            </p>
                          ) : (
                            <p className="font-serif text-xl font-bold text-stone-800">
                              On Request
                            </p>
                          )}
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-700 transition-colors group-hover:bg-brand-900 group-hover:text-white">
                          <ArrowRight className="h-5 w-5 -rotate-45 transition-transform group-hover:rotate-0" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="flex w-full flex-col items-center justify-center rounded-3xl border border-dashed border-stone-300 bg-stone-50 py-20 text-center">
              <Compass className="mb-4 h-12 w-12 text-stone-300" />
              <p className="text-lg font-medium text-stone-600">
                Packages coming soon
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          SECTION 3.5: THEME BASED PACKAGES
          ────────────────────────────────────────────────────────── */}
      {themePackages.length > 0 && (
        <section className="py-16 lg:py-24 bg-stone-50">
          <div className="container-inner">
            <div className="mb-14 text-center">
              <span className="section-label mx-auto">Travel Styles</span>
              <h2 className="text-4xl text-brand-950 md:text-5xl font-medium tracking-tight">Theme Based Holidays</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {themePackages.map((pkg, idx) => (
                <Link href={`/packages?category=${pkg.category}`} key={pkg.id || idx} className="group relative aspect-square sm:aspect-[4/5] lg:aspect-square overflow-hidden rounded-3xl bg-stone-900 shadow-sm transition-transform hover:-translate-y-1">
                  <Image src={`${dUrl}/assets/${pkg.image}`} alt={pkg.category} fill className="object-cover opacity-80 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-100" unoptimized />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent p-6 text-center">
                    <h3 className="font-serif text-2xl font-medium text-white">{pkg.category}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ──────────────────────────────────────────────────────────
          SECTION 3.6: BUDGET FRIENDLY DESTINATIONS
          ────────────────────────────────────────────────────────── */}
      {budgetPackages.length > 0 && (
        <section className="py-16 lg:py-20 bg-white">
          <div className="container-inner">
            <div className="mb-14 text-center">
              <span className="section-label mx-auto">Affordable Getaways</span>
              <h2 className="text-4xl text-stone-900 md:text-5xl tracking-tight">Budget Friendly Packages</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {budgetPackages.map((pkg, idx) => (
                <Link href={`/packages/${pkg.slug || pkg.id}`} key={pkg.id || idx} className="group relative h-64 overflow-hidden rounded-[2rem]">
                  <Image src={`${dUrl}/assets/${pkg.image}`} alt={pkg.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" unoptimized />
                  <div className="absolute inset-0 bg-stone-900/50 transition-colors duration-500 group-hover:bg-brand-950/80" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <h3 className="mb-2 font-serif text-2xl font-medium text-white shadow-sm transition-transform duration-500 group-hover:-translate-y-1">{pkg.title}</h3>
                    <div className="w-12 h-px bg-gold-400 mb-3 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <p className="text-sm font-bold uppercase tracking-widest text-gold-300 opacity-90">From ₹{Number(pkg.price).toLocaleString("en-IN")}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ──────────────────────────────────────────────────────────
          SECTION 3.7: TESTIMONIALS
          ────────────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-24 bg-stone-50 overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-stone-200/50 via-stone-50 to-stone-50 opacity-80" />
        <div className="container-inner relative z-10">
          <div className="mb-16 text-center">
            <span className="section-label mx-auto">Client Stories</span>
            <h2 className="text-4xl text-brand-950 md:text-5xl tracking-tight">What Our Travelers Say</h2>
          </div>
          <div className="grid gap-8 lg:grid-cols-3">
            {[
              { name: "Rahul & Priya", tour: "Maldives Honeymoon", text: "IGHolidays planned the most magical honeymoon for us. The water villa upgrade they secured was breathtaking. Truly the best luxury travel agency!" },
              { name: "Suresh Menon", tour: "Dubai Corporate MICE", text: "Handling our 150-person corporate summit in Dubai was no small feat. IGHolidays executed everything flawlessly from visas to gala dinners." },
              { name: "Anjali Sharma", tour: "Discover Europe", text: "The customized 14-day Europe itinerary was perfectly paced. The local guides were fantastic and every hotel exceeded our expectations." }
            ].map((review, i) => (
              <div key={i} className="rounded-3xl bg-white p-8 sm:p-10 shadow-lg shadow-stone-200/30 border border-stone-100 flex flex-col relative transition-all hover:-translate-y-1">
                <div className="flex items-center justify-between mb-8 text-gold-400">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, j) => <Star key={j} className="h-5 w-5 fill-current" />)}
                  </div>
                  <div className="h-10 w-10 opacity-30">
                    <svg className="h-full w-full fill-current" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
                  </div>
                </div>
                <p className="text-stone-600 leading-relaxed mb-8 flex-1 text-[15px]">&quot;{review.text}&quot;</p>
                <div className="border-t border-stone-100 pt-6 mt-auto">
                  <h4 className="font-bold text-brand-950 uppercase tracking-wide text-sm">{review.name}</h4>
                  <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 mt-1">{review.tour}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          SECTION 4: WHY CHOOSE US
          ────────────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-32 bg-brand-950 text-stone-400">
        <div className="container-inner">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="section-label !text-gold-400 before:!bg-gold-400/30 after:!bg-gold-400/30">
                Why Choose Us?
              </span>
              <h2 className="mb-6 font-serif text-4xl text-white md:text-5xl">
                Top Rated Travel Planners in India.
              </h2>
              <p className="mb-10 text-lg leading-relaxed text-stone-300">
                As one of the leading luxury tour operators in India, our extensive network connects you to deep global expertise. With over 15 years of curating bespoke domestic & international trips, we guarantee unparalleled service to make your dream holidays spectacular.
              </p>
              <div className="flex gap-4">
                <Link href="/contact" className="btn-gold">
                  Speak to an Expert
                </Link>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {[
                {
                  icon: Shield,
                  title: "100% Secure",
                  desc: "Fully verified partners and trusted secure payment gateways.",
                },
                {
                  icon: Globe,
                  title: "Global Reach",
                  desc: "Exclusive connections across 50+ countries worldwide.",
                },
                {
                  icon: Headphones,
                  title: "24/7 Concierge",
                  desc: "Dedicated support team available round the clock during your trip.",
                },
                {
                  icon: Award,
                  title: "Best Price",
                  desc: "Unbeatable value and exclusive upgrades you won't find anywhere else.",
                },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl border border-brand-800 bg-brand-900/50 p-8 transition-colors hover:bg-brand-900"
                >
                  <feature.icon className="mb-6 h-8 w-8 text-gold-400" />
                  <h3 className="mb-2 font-serif text-xl font-medium text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-stone-400">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          SECTION 5: BLOG (If present)
          ────────────────────────────────────────────────────────── */}
      {
        latestBlogs.length > 0 && (
          <section className="py-20 lg:py-32 bg-stone-50">
            <div className="container-inner">
              <div className="mb-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
                <div>
                  <span className="section-label">Travel Journal</span>
                  <h2 className="text-4xl text-stone-900 md:text-5xl">
                    Stories & Insights
                  </h2>
                </div>
                <Link
                  href="/blog"
                  className="group flex items-center gap-2 font-semibold text-brand-700 transition-colors hover:text-brand-800"
                >
                  Read All Articles{" "}
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {latestBlogs.map((post) => {
                  const imgUrl = post.featured_image
                    ? `${dUrl}/assets/${post.featured_image}`
                    : null;

                  return (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug || post.id}`}
                      className="group flex flex-col overflow-hidden rounded-[1.5rem] bg-white border border-stone-200 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100 flex items-center justify-center">
                        {imgUrl ? (
                          <Image
                            src={imgUrl}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            unoptimized
                          />
                        ) : (
                          <Globe className="h-10 w-10 text-stone-300" />
                        )}
                      </div>
                      <div className="p-6">
                        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-brand-700">
                          {post.published_date
                            ? new Date(post.published_date).toLocaleDateString(
                              "en-IN",
                              { month: "short", day: "numeric", year: "numeric" }
                            )
                            : "Journal"}
                        </p>
                        <h3 className="mb-3 font-serif text-xl font-medium leading-tight text-stone-900 transition-colors group-hover:text-brand-700">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="text-sm text-stone-500 line-clamp-2">
                            {post.excerpt}
                          </p>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )
      }

      {/* ──────────────────────────────────────────────────────────
          SECTION 6: CTA BANNER
          ────────────────────────────────────────────────────────── */}
      <section className="bg-stone-50 px-4 py-20 lg:py-32 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-[3rem] bg-brand-950 border border-brand-800 p-10 text-center shadow-2xl sm:p-20 relative">
          <div className="absolute top-0 left-1/4 -m-32 h-64 w-64 rounded-full bg-emerald-500/30 blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 -m-32 h-64 w-64 rounded-full bg-amber-500/20 blur-[100px]" />

          <div className="relative z-10">
            <h2 className="mb-6 font-serif text-4xl font-medium text-white md:text-5xl">
              Start Planning Your Next Holiday
            </h2>
            <p className="mb-10 text-lg text-brand-200 mx-auto max-w-2xl">
              Contact our tourism experts today. We'll craft a customized local or international itinerary perfectly tailored to your budget and travel style.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/packages" className="btn-gold">
                Browse Packages
              </Link>
              <Link href="/contact" className="btn-outline !bg-transparent !text-white !border-white/30 hover:!bg-white/10 hover:!border-white/50">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main >
  );
}
