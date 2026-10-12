import { Star, ExternalLink } from 'lucide-react';

interface Review {
  author_name: string;
  profile_photo_url: string;
  rating: number;
  relative_time_description: string;
  text: string;
  author_url: string;
}

interface PlaceData {
  name: string;
  rating: number;
  user_ratings_total: number;
  reviews: Review[];
  mapsUrl: string;
}

function StarRow({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'lg' }) {
  const cls = size === 'lg' ? 'h-5 w-5' : 'h-3.5 w-3.5';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`${cls} ${i <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-stone-200 text-stone-200'}`}
        />
      ))}
    </div>
  );
}

function GoogleLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-label="Google">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

async function fetchReviews(): Promise<PlaceData | null> {
  const apiKey  = process.env.GOOGLE_MAPS_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!apiKey || !placeId) return null;

  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,user_ratings_total,reviews,url&reviews_sort=newest&key=${apiKey}`,
      { next: { revalidate: 3600 } }
    );
    const json = await res.json();
    if (json.status !== 'OK') return null;
    const { name, rating, user_ratings_total, reviews = [], url: mapsUrl } = json.result;
    return { name, rating, user_ratings_total, reviews, mapsUrl };
  } catch {
    return null;
  }
}

export default async function GoogleReviewsSection() {
  const data = await fetchReviews();
  if (!data || !data.reviews.length) return null;

  const writeReviewUrl = `https://search.google.com/local/writereview?placeid=${process.env.GOOGLE_PLACE_ID}`;
  const positiveReviews = data.reviews.filter((r) => r.rating >= 4).slice(0, 6);
  if (!positiveReviews.length) return null;

  return (
    <section className="py-12 lg:py-16 bg-white">
      <div className="container-inner">

        {/* Header */}
        <div className="mb-10 text-center" data-aos="fade-up">
          <div className="inline-flex items-center gap-2 mb-4 rounded-full border border-stone-200 bg-stone-50 px-4 py-1.5">
            <GoogleLogo />
            <span className="text-xs font-semibold text-stone-600">Google Reviews</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl text-brand-950 font-medium tracking-tight mb-4">
            Trusted by Thousands of Travellers
          </h2>
          {/* Overall rating */}
          <div className="inline-flex flex-col items-center gap-2 rounded-2xl border border-stone-200 bg-stone-50 px-8 py-4">
            <span className="font-serif text-5xl font-semibold text-brand-950 leading-none">{data.rating.toFixed(1)}</span>
            <StarRow rating={data.rating} size="lg" />
            <span className="text-sm text-stone-500">
              Based on <span className="font-semibold text-stone-700">{data.user_ratings_total.toLocaleString('en-IN')}</span> Google reviews
            </span>
          </div>
        </div>

        {/* Review cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {positiveReviews.map((review, i) => (
            <a
              key={i}
              href={review.author_url}
              target="_blank"
              rel="noopener noreferrer"
              data-aos="fade-up"
              data-aos-delay={String((i % 3) * 80)}
              className="group flex flex-col rounded-2xl border border-stone-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-stone-300 transition-all"
            >
              {/* Top row: avatar + name + Google icon */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  {review.profile_photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={review.profile_photo_url}
                      alt={review.author_name}
                      className="h-9 w-9 rounded-full object-cover flex-shrink-0 border border-stone-100"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-brand-950 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-white">
                        {review.author_name.split(' ').map((w) => w[0]).slice(0, 2).join('')}
                      </span>
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-stone-900 leading-tight truncate">{review.author_name}</p>
                    <p className="text-[11px] text-stone-400 mt-0.5">{review.relative_time_description}</p>
                  </div>
                </div>
                <GoogleLogo />
              </div>

              {/* Stars */}
              <StarRow rating={review.rating} />

              {/* Review text */}
              <p className="mt-3 text-sm text-stone-600 leading-relaxed line-clamp-4 flex-1">
                {review.text}
              </p>

              <div className="mt-3 pt-3 border-t border-stone-100 flex items-center gap-1 text-[11px] text-stone-400 group-hover:text-brand-600 transition-colors">
                <ExternalLink className="h-3 w-3" />
                View on Google
              </div>
            </a>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={data.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-5 py-2.5 text-sm font-semibold text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <GoogleLogo />
            See all reviews on Google
          </a>
          <a
            href={writeReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-800 transition-colors"
          >
            <Star className="h-4 w-4 fill-gold-400 text-gold-400" />
            Write a Review
          </a>
        </div>

      </div>
    </section>
  );
}
