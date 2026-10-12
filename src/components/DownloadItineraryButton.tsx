'use client';

import { useState } from "react";
import { Download, Loader2, FileText } from "lucide-react";
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
  variant?: "sidebar" | "breadcrumb" | "overview";
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
        className="hidden sm:flex items-center gap-1.5 rounded-lg bg-brand-50 border border-brand-200 px-3 py-1.5 text-xs font-bold text-brand-700 hover:bg-brand-100 hover:border-brand-300 hover:text-brand-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        title="Download Itinerary PDF"
      >
        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
        {loading ? "Generating…" : error ? "Failed — retry" : "Download PDF"}
      </button>
    );
  }

  if (variant === "overview") {
    return (
      <button
        onClick={handleDownload}
        disabled={loading}
        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-900 to-brand-800 px-4 py-2 text-xs font-bold text-white shadow-sm hover:from-brand-800 hover:to-brand-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        title="Download Itinerary PDF"
      >
        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileText className="h-3.5 w-3.5" />}
        {loading ? "Generating…" : error ? "Failed" : "Download PDF"}
      </button>
    );
  }

  // sidebar (default) — full-width, prominent gold button
  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 py-3.5 text-sm font-bold text-white shadow-md shadow-amber-200 hover:from-gold-600 hover:to-amber-600 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
      {loading ? "Generating PDF…" : error ? "Failed — try again" : "Download Itinerary PDF"}
    </button>
  );
}
