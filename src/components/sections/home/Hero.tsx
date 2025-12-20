import directus from "@/lib/directus/client";
import { readSingleton, readItems } from "@directus/sdk";
import HeroClient from "./HeroClient";

export default async function Hero() {
  let heroData = null;

  try {
    // 1. Try fetching as Singleton (Server Side - No CORS issues here)
    try {
      heroData = await directus.request(readSingleton("hero", {
        fields: ['*', 'background_image.*', 'background_video.*'],
      }));
    } catch (e) {
      // 2. If Singleton fails, try as List
      const listData = await directus.request(readItems("hero", {
        fields: ['*', 'background_image.*', 'background_video.*'],
        limit: 1
      }));
      if (listData && listData.length > 0) {
        heroData = listData[0];
      }
    }
  } catch (error) {
    console.error("Server Fetch Error:", error);
    // Fallback data if server fails completely
    heroData = {
      title: "Discover the World",
      description: "Experience premium travel with us.",
      ratings_text: "4.9/5",
      background_image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80"
    };
  }

  // Pass the data to the Client Component
  return <HeroClient data={heroData} />;
}