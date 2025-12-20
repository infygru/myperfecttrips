"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

export default function DownloadPdfButton({ 
  targetId, 
  fileName = "package-details.pdf",
  label = "Download as PDF" 
}: { 
  targetId: string; 
  fileName?: string;
  label?: string;
}) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    const element = document.getElementById(targetId);
    
    if (!element) {
      alert("Error: Content to print not found.");
      return;
    }

    try {
      setIsGenerating(true);

      // 1. Generate Image from DOM
      const dataUrl = await toPng(element, { 
        quality: 0.95,
        cacheBust: false, // FIXED: Set to false to prevent CORS errors on Unsplash/Directus
        skipFonts: true,  // FIXED: Prevents font loading errors
        filter: (node) => {
          // Filter out elements marked to be ignored
          if (node instanceof HTMLElement && node.dataset.html2canvasIgnore) {
            return false;
          }
          return true;
        },
        backgroundColor: "#ffffff",
      });

      // 2. Generate PDF
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(dataUrl);
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(fileName);

    } catch (error) {
      // Improved Error Logging
      console.error("PDF Generation Failed. Details:", error);
      alert("Could not generate PDF. This is usually due to image security settings.");
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
          <Loader2 className="w-4 h-4 animate-spin" /> Generating...
        </>
      ) : (
        <>
          <Download className="w-4 h-4" /> {label}
        </>
      )}
    </button>
  );
}