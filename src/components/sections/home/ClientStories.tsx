import { Star, Quote } from "lucide-react";
import directus from "@/lib/directus/client";
import { readItems } from "@directus/sdk";

export default async function ClientStories() {
  let stories: any[] = [];

  try {
    stories = await directus.request(
      readItems("Testimonials", {
        fields: ["*"],
        limit: 3,
      })
    );
  } catch (err) {
    try {
      stories = await directus.request(
        readItems("testimonials", {
          fields: ["*"],
          limit: 3,
        })
      );
    } catch (e) {
      console.error("Testimonials Fetch Error:", e);
    }
  }

  if (!stories || stories.length === 0) return null;

  const getInitials = (name: string) => {
    if (!name) return "CL";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <section className="pt-32 pb-28 bg-white">
      <div className="container mx-auto px-4">

        {/* HEADER */}
        <div className="max-w-2xl mx-auto text-center mb-20">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Client Stories
          </h2>
          <p className="text-slate-500 text-lg">
            Real experiences from travellers who trusted us with their journeys
          </p>
        </div>

        {/* TESTIMONIAL GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {stories.map((story: any, index: number) => {
            const rawRating = story.rating || story.Rating || 5;
            const displayRating = Math.min(Math.max(rawRating, 1), 5);

            const name =
              story.client_name ||
              story.Client_Name ||
              story.ClientName ||
              "Happy Client";

            const loc = story.location || story.Location || "United Kingdom";
            const text = story.quote || story.Quote || "Wonderful experience.";

            const isFeatured = index === 1; // 👈 middle card highlight

            return (
              <div
                key={story.id}
                className={`relative rounded-3xl p-8 transition-all duration-300 bg-white
                  ${
                    isFeatured
                      ? "shadow-2xl -translate-y-2"
                      : "shadow-md hover:shadow-2xl hover:-translate-y-1"
                  }`}
              >
                {/* QUOTE ICON */}
                <Quote className="absolute -top-5 -left-5 w-10 h-10 text-blue-100" />

                {/* STARS */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < displayRating
                          ? "text-amber-400 fill-amber-400"
                          : "text-slate-200"
                      }`}
                    />
                  ))}
                </div>

                {/* QUOTE TEXT – editorial tuning */}
                <p className="text-slate-600 text-[17px] leading-[1.6] mb-8">
                  “{text}”
                </p>

                {/* AUTHOR */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-semibold text-sm">
                    {getInitials(name)}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">
                      {name}
                    </div>
                    <div className="text-sm text-slate-500">
                      {loc}
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
