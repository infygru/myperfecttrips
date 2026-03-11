'use client';

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { generateItineraryPdf } from "@/lib/generateItineraryPdf";

interface Props {
  pkg: {
    title?: string;
    slug?: string;
    category?: string;
    duration_days?: number;
    duration_nights?: number;
    destinations?: string[];
    itinerary?: string;
    inclusions?: string;
    exclusions?: string;
  };
  logoUrl: string | null;
  variant?: "sidebar" | "breadcrumb";
}

export default function DownloadItineraryButton({ pkg, logoUrl, variant = "sidebar" }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    if (loading) return;
    setLoading(true);
    try {
      await generateItineraryPdf(pkg, logoUrl);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setLoading(false);
    }
  }

  if (variant === "breadcrumb") {
    return (
      <button
        onClick={handleDownload}
        disabled={loading}
        className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-brand-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        title="Download Itinerary PDF"
      >
        {loading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Download className="h-3.5 w-3.5" />
        )}
        {loading ? "Generating…" : "Download PDF"}
      </button>
    );
  }

  // sidebar variant – full button
  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-transparent py-3.5 text-sm font-semibold text-stone-600 hover:bg-stone-50 hover:border-brand-300 hover:text-brand-800 transition-all disabled:opacity-60 disabled:cursor-not-allowed group"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4 group-hover:-translate-y-0.5 transition-transform duration-200" />
      )}
      {loading ? "Generating PDF…" : "Download Itinerary"}
    </button>
  );
}
