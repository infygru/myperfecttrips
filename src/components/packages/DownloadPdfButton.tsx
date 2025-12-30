"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { createRoot } from "react-dom/client";
import PdfTemplate from "./PdfTemplate";

export default function DownloadPdfButton({
  pkg,
  fileName = "package-details.pdf",
  label = "Download as PDF"
}: {
  pkg: any;
  fileName?: string;
  label?: string;
}) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    try {
      setIsGenerating(true);

      // 1. Create a container for our template
      const container = document.createElement("div");
      // Use fixed positioning off-screen/invisible but ensuring it's "rendered" by browser
      container.style.position = "fixed";
      container.style.top = "0";
      container.style.left = "0";
      container.style.zIndex = "-9999";
      container.style.opacity = "0.01"; // Invisible but rendered
      container.style.pointerEvents = "none";
      document.body.appendChild(container);

      // 2. Mount the React component
      const root = createRoot(container);

      // Wrap in promise to ensure mounting matches React lifecycle
      await new Promise<void>((resolve) => {
        // We use flushSync if available, or just standard timeout wait
        root.render(<PdfTemplate pkg={pkg} />);
        // Small delay to allow React to mount
        setTimeout(resolve, 100);
      });

      // 3. Wait for content and images
      // Find the specific content div we rendered
      const templateRoot = document.getElementById("pdf-template-root");
      if (!templateRoot) throw new Error("Template failed to mount");

      // Proxy images logic
      const images = templateRoot.getElementsByTagName("img");
      const loadedPromises: Promise<void>[] = [];

      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        const originalSrc = img.src;

        if (originalSrc.startsWith("http")) {
          const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(originalSrc)}`;

          const p = new Promise<void>((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve();
            img.src = proxyUrl;
            img.crossOrigin = "anonymous";
          });
          loadedPromises.push(p);
        }
      }

      await Promise.all(loadedPromises);
      // Extra buffer for layout
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 4. Generate Images for EACH Page
      const pageElements = templateRoot.querySelectorAll(".pdf-page");
      if (pageElements.length === 0) throw new Error("No pages found");

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < pageElements.length; i++) {
        const pageEl = pageElements[i] as HTMLElement;

        // Convert page to PNG
        const dataUrl = await toPng(pageEl, {
          quality: 0.98,
          cacheBust: true,
          skipFonts: true,
          pixelRatio: 2,
          backgroundColor: "#ffffff",
          width: 794, // Force A4 width in px
          height: 1123, // Force A4 height in px
        });

        // Add to PDF
        if (i > 0) pdf.addPage();
        pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);

        // Small buffer between pages to prevent browser hiccups
        await new Promise(r => setTimeout(r, 100));
      }

      const finalName = fileName || `${pkg.slug}-itinerary.pdf`;
      pdf.save(finalName);

      // Cleanup
      setTimeout(() => {
        root.unmount();
        document.body.removeChild(container);
      }, 100);

    } catch (error) {
      console.error("PDF Generation Failed", error);
      alert("Could not generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isGenerating}
      className="w-full bg-white border border-slate-200 hover:bg-slate-50 hover:border-blue-300 hover:text-blue-600 text-slate-700 font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm text-sm"
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" /> Creating Document...
        </>
      ) : (
        <>
          <Download className="w-4 h-4" /> {label}
        </>
      )}
    </button>
  );
}