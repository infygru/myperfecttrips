"use client";

import { Download, Loader2 } from "lucide-react";
import { useState } from "react";
import jsPDF from "jspdf";
import { getAssetUrl } from "@/lib/directus/client";

export default function DownloadPdfButton({
  pkg,
  label = "Download as PDF",
  logoUrl
}: {
  pkg: any;
  fileName?: string;
  label?: string;
  logoUrl?: string | null;
}) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    try {
      setLoading(true);

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 15;
      const contentWidth = pageWidth - (margin * 2);

      // Colors
      const colorTitle = [20, 20, 20];
      const colorBody = [70, 70, 70];
      const colorAccent = [37, 99, 235]; // Blue

      // Helper
      const loadImage = (url: string): Promise<string | null> => {
        return new Promise((resolve) => {
          const img = new Image();
          img.crossOrigin = "Anonymous";
          const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(url)}`;
          img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            if (!ctx) { resolve(null); return; }
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL("image/png"));
          };
          img.onerror = () => {
            const fb = new Image();
            fb.crossOrigin = "Anonymous";
            fb.onload = () => {
              const c = document.createElement("canvas");
              c.width = fb.width;
              c.height = fb.height;
              const ctx = c.getContext("2d");
              if (!ctx) { resolve(null); return; }
              ctx.drawImage(fb, 0, 0);
              resolve(c.toDataURL("image/png"));
            };
            fb.onerror = () => resolve(null);
            fb.src = url;
          };
          img.src = proxyUrl;
        });
      };

      // Load Assets
      let logoData: string | null = null;
      if (logoUrl) logoData = await loadImage(logoUrl);

      const bannerId = typeof pkg.banner_image === 'object' ? pkg.banner_image?.id : pkg.banner_image;
      const mainImageId = typeof pkg.image === 'object' ? pkg.image?.id : pkg.image;
      const heroUrl = bannerId ? getAssetUrl(bannerId) : (mainImageId ? getAssetUrl(mainImageId) : null);
      let heroData: string | null = null;
      if (heroUrl) heroData = await loadImage(heroUrl);

      const itinerary = Array.isArray(pkg.itinerary_json) ? pkg.itinerary_json : [];
      const itineraryImages: (string | null)[] = await Promise.all(
        itinerary.map(async (day: any) => {
          const url = day.image ? getAssetUrl(day.image) : day.image_url;
          if (url) return await loadImage(url);
          return null;
        })
      );

      // State
      let cursorY = 20;
      let pageNum = 1;

      // Header
      const drawHeader = () => {
        if (logoData) {
          // Adjusted Y for header
          doc.addImage(logoData, "PNG", margin, 10, 40, 12, undefined, 'FAST');
        } else {
          doc.setFontSize(16);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(0);
          doc.text("MYPERFECTTRIPS", margin, 20);
        }

        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100);
        doc.text("www.myperfecttrips.com", pageWidth - margin, 18, { align: "right" });

        doc.setDrawColor(230);
        doc.line(margin, 25, pageWidth - margin, 25);
      };

      const checkPage = (heightNeeded: number) => {
        // Limit at pageHeight - 12 to maximize space (Footer at -8)
        if (cursorY + heightNeeded > pageHeight - 12) {
          doc.setFontSize(8);
          doc.setTextColor(150);
          doc.text(`Page ${pageNum}`, pageWidth - margin, pageHeight - 8, { align: "right" });

          doc.addPage();
          pageNum++;
          cursorY = 20; // Header height approx
          drawHeader();
          cursorY = 32; // Reset content Y
        }
      };

      // --- START ---
      drawHeader();
      cursorY = 40; // Increased spacing to avoid clash with header

      // 1. TITLE
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold"); // Sans-serif
      doc.setTextColor(colorTitle[0], colorTitle[1], colorTitle[2]);
      const titleLines = doc.splitTextToSize(pkg.title || "Tour Package", contentWidth - 10);
      doc.text(titleLines, margin, cursorY);
      cursorY += (titleLines.length * 8) + 4;

      // Meta
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(colorAccent[0], colorAccent[1], colorAccent[2]);
      const meta = `${pkg.duration || 5} Days  |  ${pkg.destination?.name || "International"}  |  ${pkg.destination?.country || "Tour"}`;
      doc.text(meta, margin, cursorY);
      cursorY += 10;

      // 2. HERO IMAGE
      if (heroData) {
        doc.addImage(heroData, "PNG", margin, cursorY, contentWidth, 42, undefined, 'FAST');
        cursorY += 48;
      }

      // 3. OVERVIEW
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0);
      doc.text("Overview", margin, cursorY);
      cursorY += 6;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(colorBody[0], colorBody[1], colorBody[2]);

      const cleanOverview = (pkg.overview || pkg.description || "")
        .replace(/<[^>]*>?/gm, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 800);

      const overviewLines = doc.splitTextToSize(cleanOverview, contentWidth);
      doc.text(overviewLines, margin, cursorY);
      cursorY += (overviewLines.length * 4.5) + 8;

      // 4. ITINERARY
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0);
      doc.text("Itinerary", margin, cursorY);
      cursorY += 8;

      for (let i = 0; i < itinerary.length; i++) {
        const day = itinerary[i];
        const dImg = itineraryImages[i];

        const dayTitle = `Day ${i + 1}: ${day.title || 'Sightseeing'}`;
        const dayDesc = (day.description || "")
          .replace(/<[^>]*>?/gm, ' ')
          .replace(/\s+/g, ' ')
          .trim();

        let neededH = 15;
        const hasImg = !!dImg;
        const indentVal = hasImg ? 45 : 8;
        const textWidth = contentWidth - indentVal;

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        const descLines = doc.splitTextToSize(dayDesc, textWidth);
        const textH = descLines.length * 4.5;

        neededH += textH;
        if (hasImg) neededH = Math.max(neededH, 26);

        if (cursorY + neededH > pageHeight - 12) {
          doc.setFontSize(9);
          doc.setTextColor(150);
          doc.text(`Page ${pageNum}`, pageWidth - margin, pageHeight - 8, { align: "right" });
          doc.addPage();
          pageNum++;
          cursorY = 20;
          drawHeader();
          cursorY = 32;
        }

        // Marker
        doc.setFillColor(colorAccent[0], colorAccent[1], colorAccent[2]);
        doc.circle(margin + 2, cursorY - 1.5, 2, "F");

        // Title
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0);
        doc.text(dayTitle, margin + 8, cursorY);

        const contentY = cursorY + 4;

        if (dImg) {
          doc.addImage(dImg, "PNG", margin + 8, contentY, 35, 23, undefined, 'FAST');

          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(colorBody[0], colorBody[1], colorBody[2]);
          doc.text(descLines, margin + 46, contentY + 3);

          const imgH = 23;
          cursorY += Math.max(imgH, textH) + 10;
        } else {
          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(colorBody[0], colorBody[1], colorBody[2]);
          doc.text(descLines, margin + 8, contentY);
          cursorY += textH + 8;
        }

        cursorY += 4;
      }

      // 5. DETAILS
      checkPage(30);

      const colW = (contentWidth / 2) - 5;
      const startY = cursorY;

      // Inclusions
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(22, 163, 74);
      doc.text("Inclusions", margin, cursorY);
      cursorY += 5;

      doc.setFontSize(9); // slightly readable
      doc.setFont("helvetica", "normal");
      doc.setTextColor(50);
      (pkg.inclusions || []).forEach((item: string) => {
        const lines = doc.splitTextToSize(`• ${item}`, colW);
        if (cursorY + (lines.length * 4) > pageHeight - 12) return;
        doc.text(lines, margin, cursorY);
        cursorY += (lines.length * 4);
      });

      // Exclusions
      let rightY = startY;
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(220, 38, 38);
      doc.text("Exclusions", margin + colW + 10, rightY);
      rightY += 5;

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(50);
      (pkg.exclusions || []).forEach((item: string) => {
        const lines = doc.splitTextToSize(`• ${item}`, colW);
        if (rightY + (lines.length * 4) > pageHeight - 12) return;
        doc.text(lines, margin + colW + 10, rightY);
        rightY += (lines.length * 4);
      });

      // Footer
      const lastFooterY = pageHeight - 8;
      doc.setFontSize(8);
      doc.setTextColor(120);
      doc.setFont("helvetica", "italic");
      const disclaimer = "This is a proposed itinerary, not a confirmed booking. Exact prices and availability are subject to final confirmation.";
      doc.text(disclaimer, margin, lastFooterY);
      doc.setFont("helvetica", "normal");
      doc.text(`Page ${pageNum}`, pageWidth - margin, lastFooterY, { align: "right" });

      doc.save(`${pkg.slug || 'itinerary'}.pdf`);

    } catch (e) {
      console.error(e);
      alert("Error generating PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="w-full bg-white border border-slate-200 hover:bg-slate-50 hover:border-blue-300 hover:text-blue-600 text-slate-700 font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm text-sm"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" /> Preparing...
        </>
      ) : (
        <>
          <Download className="w-4 h-4" /> {label}
        </>
      )}
    </button>
  );
}
