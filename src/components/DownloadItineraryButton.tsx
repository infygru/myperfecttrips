'use client';

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { generateItineraryPdf, type ItineraryDay } from "@/lib/generateItineraryPdf";

interface Props {
  pkg: {
    title?: string;
    slug?: string;
    category?: string;
    duration_days?: number;
    duration_nights?: number;
    destinations?: string[];
    destination?: string;
    itinerary?: string;
    inclusions?: string;
    exclusions?: string;
  };
  logoUrl: string | null;
  itineraryDays?: ItineraryDay[];
  variant?: "sidebar" | "breadcrumb";
}

export default function DownloadItineraryButton({ pkg, logoUrl, itineraryDays, variant = "sidebar" }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function handleDownload() {
    if (loading) return;
    setLoading(true);
    setError(false);
    try {
      await generateItineraryPdf(pkg, logoUrl, itineraryDays);
    } catch (err) {
      console.error("PDF generation failed:", err);
      setError(true);
      setTimeout(() => setError(false), 3000);
    } finally {
      setLoading(false);
    }
  }

  if (variant === "breadcrumb") {
    return (
      <button
        onClick={handleDownload}
        disabled={loading}
        className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="Download Itinerary PDF"
      >
        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
        {loading ? "Generating…" : error ? "Failed — retry" : "Download PDF"}
      </button>
    );
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white py-3.5 text-sm font-semibold text-stone-700 hover:bg-brand-50 hover:border-brand-300 hover:text-brand-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
      {loading ? "Generating PDF…" : error ? "Failed — try again" : "Download Itinerary PDF"}
    </button>
  );
}
