import { NextResponse } from 'next/server';

export const revalidate = 3600; // cache 1 hour

export async function GET() {
  const apiKey  = process.env.GOOGLE_MAPS_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,user_ratings_total,reviews,url&reviews_sort=newest&key=${apiKey}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    const json = await res.json();

    if (json.status !== 'OK') {
      console.error('[google-reviews] Places API error:', json.status, json.error_message);
      return NextResponse.json({ error: json.status }, { status: 502 });
    }

    const { name, rating, user_ratings_total, reviews = [], url: mapsUrl } = json.result;
    return NextResponse.json({ name, rating, user_ratings_total, reviews, mapsUrl });
  } catch (err) {
    console.error('[google-reviews] fetch error:', err);
    return NextResponse.json({ error: 'Fetch failed' }, { status: 500 });
  }
}
