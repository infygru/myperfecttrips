import { Star } from 'lucide-react';
import directus from '@/lib/directus/client';
import { readItems } from '@directus/sdk';

export default async function ClientStories() {
  let stories: any[] = [];
  
  try {
    // 1. Fetch from 'Testimonials' (Capital T)
    // REMOVED 'sort' to prevent permission errors on system fields
    stories = await directus.request(readItems('Testimonials', {
      fields: ['*'],
      limit: 3,
    }));
  } catch (err) {
    try {
      // 2. Fallback to lowercase 'testimonials'
      stories = await directus.request(readItems('testimonials', {
        fields: ['*'],
        limit: 3,
      }));
    } catch (e) {
      console.error("Testimonials Fetch Error:", e);
    }
  }

  // If no data found, return nothing
  if (!stories || stories.length === 0) return null;

  // Helper to get initials
  const getInitials = (name: string) => {
    if (!name) return "CL";
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        
        {/* SECTION TITLE */}
        <h2 className="text-4xl font-bold text-center text-slate-900 mb-16">
          Client Stories
        </h2>

        {/* CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stories.map((story: any) => {
            // Handle Rating: Cap at 5 stars max
            const rawRating = story.rating || story.Rating || 5;
            const displayRating = Math.min(Math.max(rawRating, 1), 5);
            
            // Handle Field Names (Directus might use client_name or Client_Name)
            const name = story.client_name || story.Client_Name || story.ClientName || "Happy Client";
            const loc = story.location || story.Location || "Global";
            const text = story.quote || story.Quote || "Great service!";

            return (
              <div 
                key={story.id} 
                className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow duration-300 flex flex-col h-full"
              >
                {/* STARS */}
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${i < displayRating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} 
                    />
                  ))}
                </div>

                {/* QUOTE */}
                <blockquote className="text-slate-600 text-lg leading-relaxed italic mb-8 flex-1">
                  "{text}"
                </blockquote>

                {/* AUTHOR INFO */}
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg shrink-0">
                    {getInitials(name)}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{name}</div>
                    <div className="text-sm text-slate-500">{loc}</div>
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