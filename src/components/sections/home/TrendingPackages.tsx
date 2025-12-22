import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";
import directus, { getAssetUrl } from "@/lib/directus/client";
import { readItems } from "@directus/sdk";

export default async function TrendingPackages() {
  let packages: any[] = [];

  try {
    packages = await directus.request(
      readItems("Packages", {
        fields: ["*", "image.*"],
        limit: 4, // ✅ 4 cards
      })
    );
  } catch (error: any) {
    console.error("❌ Error fetching Packages:", error.message || error);
  }

  if (!packages || packages.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-14 gap-4">
          <div>
            <h2 className="text-4xl font-bold text-slate-900 mb-2">
              Find Your Perfect Trip
            </h2>
            <p className="text-slate-500 text-lg">
              Trending destinations this month
            </p>
          </div>

          <Link
            href="/packages"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition"
          >
            View All
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {packages.map((pkg: any) => {
            const imgId =
              typeof pkg.image === "object" ? pkg.image?.id : pkg.image;
            const imgUrl = imgId
              ? getAssetUrl(imgId)
              : "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80";

            return (
              <Link
                key={pkg.id}
                href={`/packages/${pkg.slug}`}
                className="group block"
              >
                <div className="relative overflow-hidden rounded-3xl bg-slate-100 shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-xl">
                  {/* IMAGE */}
                  <div className="relative h-[420px] w-full">
                    <Image
                      src={imgUrl}
                      alt={pkg.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* SOFT GRADIENT */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  </div>

                  {/* CONTENT */}
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    {/* LOCATION */}
                    <div className="flex items-center gap-1 text-cyan-300 font-semibold mb-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-xs uppercase tracking-wide">
                        {pkg.location || "Destination"}
                      </span>
                    </div>

                    {/* TITLE */}
                    <h3 className="text-xl font-bold text-white leading-snug mb-4">
                      {pkg.title}
                    </h3>

                    {/* META */}
                    <div className="flex items-end justify-between">
                      <div className="flex gap-2">
                        <span className="px-3 py-1 rounded-md bg-white/20 backdrop-blur text-xs font-medium text-white border border-white/10">
                          {pkg.duration_days
                            ? `${pkg.duration_days} Days`
                            : "5 Days"}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="block text-[11px] text-slate-300 mb-0.5">
                          From
                        </span>
                        <span className="text-2xl font-bold text-cyan-300">
                          £{pkg.price}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
