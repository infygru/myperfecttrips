"use client";

import Image from "next/image";
import UnifiedSearchWidget from "./UnifiedSearchWidget";

export default function HeroClient({ data }: { data: any }) {

  /* ---------------- BACKGROUND MEDIA ---------------- */
  const renderBackgroundMedia = () => {
    const videoObj = data?.background_video;
    const videoId = typeof videoObj === "object" ? videoObj?.id : videoObj;

    const imageObj = data?.background_image;
    let imageUrl = "";

    if (typeof imageObj === "object" && imageObj?.id) {
      imageUrl = `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${imageObj.id}`;
    } else if (typeof imageObj === "string") {
      imageUrl = imageObj.startsWith("http")
        ? imageObj
        : `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${imageObj}`;
    }

    const videoUrl = videoId
      ? `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${videoId}`
      : null;

    if (videoUrl) {
      return (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      );
    }

    return (
      <Image
        src={imageUrl}
        alt="Hero Background"
        fill
        priority
        className="object-cover"
      />
    );
  };

  /* ---------------- CONTENT ---------------- */
  const title = data?.title || "Discover the World,<br/>Your Way";
  const description =
    data?.description ||
    "Manchester's premier travel consultancy. From seamless Schengen visas to luxury bespoke itineraries.";
  const ratingsText = data?.ratings_text || "Rated 4.9/5 by Travellers";

  return (
    <section className="relative min-h-screen w-full flex flex-col justify-center pt-32 pb-20">
      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0">
        {renderBackgroundMedia()}
        {/* Lux gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-black/70" />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 w-full h-full flex flex-col justify-center">
        <div className="container mx-auto px-4">

          {/* HERO TEXT */}
          <div className="text-center mb-16 animate-in slide-in-from-bottom-8 duration-700 fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs md:text-sm font-medium mb-8 shadow-xl ring-1 ring-white/10">
              <span className="text-amber-400 drop-shadow-sm">★</span> {ratingsText}
            </div>

            <h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-6 drop-shadow-2xl"
              dangerouslySetInnerHTML={{ __html: title }}
            />

            <div
              className="text-lg md:text-xl text-slate-100 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-lg opacity-90"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </div>

          {/* ================= UNIVERSAL SEARCH WIDGET ================= */}
          <UnifiedSearchWidget />
          {/* ================= END SEARCH WIDGET ================= */}

        </div>
      </div>
    </section>
  );
}
