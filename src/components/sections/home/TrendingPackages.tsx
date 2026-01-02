import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";
import directus, { getAssetUrl } from "@/lib/directus/client";
import { readItems } from "@directus/sdk";
import ScrollAnimation from "@/components/ui/ScrollAnimation";

export default async function TrendingPackages() {
  let uniqueDestinations: any[] = [];

  try {
    // Fetch directly from Destinations collection
    // Using the fields visible in your screenshot: name, slug, featured_image, is_featured
    const result = await directus.request(
      readItems("Destinations", {
        fields: ["*", "featured_image.*", "country"], // Fetch all fields + nested image
        filter: {
          is_featured: { _eq: true },
        },
        limit: 4,
      })
    );

    uniqueDestinations = result || [];

  } catch (error: any) {
    console.error("Error fetching trending destinations:", error);
    if (error.errors) {
      console.error("Directus Errors:", JSON.stringify(error.errors, null, 2));
    }
  }

  // Fallback if no specific featured destinations to show, maybe fetch any?
  // For now, let's stick to returning null or empty if nothing found.
  if (uniqueDestinations.length === 0) {
    // Optional: Fallback fetch if no featured ones found?
    // let's keep it simple first.
  }

  if (uniqueDestinations.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* HEADER */}
        <ScrollAnimation>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-14 gap-4">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-2">
                Top Trending Destinations
              </h2>
              <p className="text-slate-500 text-lg">
                Explore our most popular locations this month
              </p>
            </div>

            <Link
              href="/packages"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-brand-blue transition"
            >
              View All Destinations
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </ScrollAnimation>

        {/* CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {uniqueDestinations.map((dest: any) => {
            const locName = dest.name || "Unknown Destination";
            const imgId = typeof dest.featured_image === "object" ? dest.featured_image?.id : dest.featured_image;
            const imgUrl = imgId
              ? getAssetUrl(imgId)
              : "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80";

            return (
              <ScrollAnimation key={dest.id}>
                <Link
                  href={`/packages?country=${encodeURIComponent(locName)}`}
                  className="group block"
                >
                  <div className="relative overflow-hidden rounded-3xl bg-slate-100 shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-xl">
                    {/* IMAGE */}
                    <div className="relative h-[420px] w-full">
                      <Image
                        src={imgUrl}
                        alt={locName}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />

                      {/* SOFT GRADIENT */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    </div>

                    {/* CONTENT */}
                    <div className="absolute inset-x-0 bottom-0 p-8 text-center">
                      <h3 className="text-2xl font-bold text-white tracking-wide mb-1">
                        {locName}
                      </h3>
                      <span className="inline-flex items-center gap-1 text-slate-300 text-sm font-medium opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                        Explore Packages <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              </ScrollAnimation>
            );
          })}
        </div>
      </div>
    </section>
  );
}
