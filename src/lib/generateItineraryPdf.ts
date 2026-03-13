import jsPDF from "jspdf";

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<\/h[1-6]>/gi, "\n")
    .replace(/<li[^>]*>/gi, "• ")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function splitText(doc: jsPDF, text: string, maxWidth: number): string[] {
  const paragraphs = text.split("\n");
  const result: string[] = [];
  for (const para of paragraphs) {
    if (para.trim() === "") { result.push(""); continue; }
    result.push(...doc.splitTextToSize(para, maxWidth));
  }
  return result;
}

const BRAND_DARK  = [24, 24, 27]   as const;
const GOLD        = [212, 175, 55] as const;
const PAGE_W      = 210;
const PAGE_H      = 297;
const MARGIN      = 18;
const CONTENT_W   = PAGE_W - MARGIN * 2;

function addFooter(doc: jsPDF, pageNum: number, totalPages: number) {
  const y = PAGE_H - 16;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(7);
  doc.setTextColor(130, 130, 130);
  doc.text(
    "This is a proposed itinerary, not a confirmed booking. Prices & availability subject to final confirmation.",
    PAGE_W / 2, y - 5, { align: "center" }
  );
  doc.setFillColor(...BRAND_DARK);
  doc.rect(0, PAGE_H - 14, PAGE_W, 14, "F");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(180, 180, 180);
  doc.text("IG Holidays — A Brand of Infygru Private Limited", PAGE_W / 2, PAGE_H - 5, { align: "center" });
  doc.text(`Page ${pageNum} of ${totalPages}`, PAGE_W - MARGIN, PAGE_H - 5, { align: "right" });
}

function addSectionHeading(doc: jsPDF, title: string, yRef: { y: number }, checkNewPage: (h: number) => void) {
  checkNewPage(18);
  yRef.y += 6;
  doc.setFillColor(...BRAND_DARK);
  doc.roundedRect(MARGIN, yRef.y, CONTENT_W, 10, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(...GOLD);
  doc.text(title.toUpperCase(), MARGIN + 5, yRef.y + 6.8);
  yRef.y += 16;
}

export interface ItineraryDay {
  id?: number;
  day_number?: number;
  title?: string;
  description?: string;
  accommodation?: string;
  meals?: string[];
}

export async function generateItineraryPdf(
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
  },
  logoUrl: string | null,
  itineraryDays?: ItineraryDay[],
) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  let pageIndex = 1;

  // ── HEADER ──────────────────────────────────────────────────────────────────
  doc.setFillColor(...BRAND_DARK);
  doc.rect(0, 0, PAGE_W, 38, "F");
  doc.setFillColor(...GOLD);
  doc.rect(0, 38, PAGE_W, 1.5, "F");

  let finalLogoUrl = logoUrl;
  if (finalLogoUrl?.includes("localhost")) {
    const assetId = finalLogoUrl.split("/assets/")[1]?.split("?")[0];
    if (assetId) finalLogoUrl = `https://api.igholidays.com/assets/${assetId}`;
  }

  let logoLoaded = false;
  if (finalLogoUrl) {
    try {
      const proxyUrl = `/_next/image?url=${encodeURIComponent(finalLogoUrl)}&w=256&q=75`;
      const resp = await fetch(proxyUrl);
      if (resp.ok) {
        const blob = await resp.blob();
        const dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
        let lw = 40, lh = 22;
        await new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            const aspect = img.naturalWidth / img.naturalHeight;
            if (aspect > 40 / 22) { lw = 40; lh = 40 / aspect; }
            else { lh = 22; lw = 22 * aspect; }
            resolve(true);
          };
          img.src = dataUrl;
        });
        const yOff = 8 + (22 - lh) / 2;
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(MARGIN - 2, yOff - 2, lw + 4, lh + 4, 1, 1, "F");
        doc.addImage(dataUrl, "PNG", MARGIN, yOff, lw, lh);
        logoLoaded = true;
      }
    } catch { /* fallback below */ }
  }
  if (!logoLoaded) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text("IG HOLIDAYS", MARGIN, 24);
  }

  const dateStr = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...GOLD);
  doc.text(`DATE: ${dateStr.toUpperCase()}`, PAGE_W - MARGIN, 14, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(200, 200, 200);
  doc.text("igholidays.com", PAGE_W - MARGIN, 20, { align: "right" });

  // ── TITLE BLOCK ────────────────────────────────────────────────────────────
  let y = 50;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...BRAND_DARK);
  const titleLines = doc.splitTextToSize(pkg.title || "Travel Package", CONTENT_W);
  doc.text(titleLines, MARGIN, y);
  y += titleLines.length * 9 + 3;

  // Meta chips
  const chips: string[] = [];
  if (pkg.category) chips.push(pkg.category);
  if (pkg.duration_nights && pkg.duration_days) chips.push(`${pkg.duration_nights}N / ${pkg.duration_days}D`);
  const destLabel = pkg.destination || pkg.destinations?.join(" · ");
  if (destLabel) chips.push(destLabel);

  if (chips.length) {
    let chipX = MARGIN;
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    for (const chip of chips) {
      const tw = doc.getTextWidth(chip) + 7;
      if (chipX + tw > PAGE_W - MARGIN) { y += 9; chipX = MARGIN; }
      doc.setFillColor(244, 244, 245);
      doc.setDrawColor(200, 200, 200);
      doc.roundedRect(chipX, y, tw, 6.5, 1.5, 1.5, "FD");
      doc.setTextColor(40, 40, 40);
      doc.text(chip, chipX + 3.5, y + 4.3);
      chipX += tw + 3;
    }
    y += 12;
  }

  // ── BODY ───────────────────────────────────────────────────────────────────
  const yRef = { y };

  function checkNewPage(neededHeight: number) {
    if (yRef.y + neededHeight > PAGE_H - 22) {
      doc.addPage();
      pageIndex++;
      yRef.y = 18;
    }
  }

  // ── ITINERARY ──────────────────────────────────────────────────────────────
  addSectionHeading(doc, "Day-by-Day Itinerary", yRef, checkNewPage);

  const hasDayByDay = itineraryDays && itineraryDays.length > 0;

  if (hasDayByDay) {
    // Render structured itinerary_days
    for (const day of itineraryDays!) {
      const dayNum = day.day_number ?? 1;
      const dayTitle = day.title || `Day ${dayNum}`;

      checkNewPage(14);
      // Day number pill
      doc.setFillColor(...GOLD);
      doc.roundedRect(MARGIN, yRef.y, 18, 7, 2, 2, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(...BRAND_DARK);
      doc.text(`DAY ${dayNum}`, MARGIN + 9, yRef.y + 4.8, { align: "center" });

      // Day title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...BRAND_DARK);
      const titleW = CONTENT_W - 22;
      const dtLines = doc.splitTextToSize(dayTitle, titleW);
      doc.text(dtLines, MARGIN + 21, yRef.y + 4.8);
      yRef.y += Math.max(10, dtLines.length * 5.5) + 2;

      // Meals badge
      if (Array.isArray(day.meals) && day.meals.length > 0) {
        const mealsText = "Meals: " + day.meals.join(", ");
        checkNewPage(6);
        doc.setFont("helvetica", "italic");
        doc.setFontSize(8);
        doc.setTextColor(80, 80, 80);
        doc.text(mealsText, MARGIN + 2, yRef.y);
        yRef.y += 5.5;
      }

      // Description
      if (day.description) {
        const desc = stripHtml(day.description);
        const descLines = splitText(doc, desc, CONTENT_W - 4);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(55, 55, 55);
        for (const line of descLines) {
          checkNewPage(5.5);
          if (line === "") { yRef.y += 2.5; continue; }
          doc.text(line, MARGIN + 2, yRef.y);
          yRef.y += 5.2;
        }
      }

      // Accommodation
      if (day.accommodation) {
        checkNewPage(7);
        doc.setFont("helvetica", "italic");
        doc.setFontSize(8.5);
        doc.setTextColor(80, 80, 80);
        doc.text(`Hotel: ${day.accommodation}`, MARGIN + 2, yRef.y);
        yRef.y += 5.5;
      }

      yRef.y += 5; // spacer between days
    }
  } else if (pkg.itinerary) {
    // Fallback: legacy WYSIWYG itinerary
    const text = stripHtml(pkg.itinerary);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(55, 55, 55);
    for (const line of text.split("\n")) {
      const t = line.trim();
      if (!t) { yRef.y += 2.5; continue; }
      if (/^Day\s+\d+/i.test(t)) {
        checkNewPage(12);
        yRef.y += 2;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(...BRAND_DARK);
        const dl = doc.splitTextToSize(t, CONTENT_W);
        doc.text(dl, MARGIN, yRef.y);
        yRef.y += dl.length * 5.5 + 1;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(55, 55, 55);
      } else {
        checkNewPage(5.5);
        const tl = doc.splitTextToSize(t, CONTENT_W);
        doc.text(tl, MARGIN, yRef.y);
        yRef.y += tl.length * 5.2 + 1;
      }
    }
  } else {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(130, 130, 130);
    doc.text("Detailed itinerary available on request. Contact our travel experts.", MARGIN, yRef.y);
    yRef.y += 8;
  }

  yRef.y += 6;

  // ── INCLUSIONS ────────────────────────────────────────────────────────────
  addSectionHeading(doc, "What's Included", yRef, checkNewPage);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(55, 55, 55);

  const defaultInclusions = [
    "Handpicked Premium Accommodation", "Daily Breakfast & Select Meals",
    "All Airport & Hotel Transfers", "Expert Local Guides",
    "All Entry Permits & Tickets", "24/7 On-Trip Concierge Support",
  ];
  const inclusionItems = pkg.inclusions
    ? stripHtml(pkg.inclusions).split("\n").map(l => l.replace(/^•\s*/, "").trim()).filter(Boolean)
    : defaultInclusions;

  for (const item of inclusionItems) {
    checkNewPage(6);
    doc.setFillColor(34, 197, 94);
    doc.circle(MARGIN + 2.5, yRef.y - 1, 1.2, "F");
    const ls = doc.splitTextToSize(item, CONTENT_W - 8);
    doc.text(ls, MARGIN + 6, yRef.y);
    yRef.y += ls.length * 5.2 + 1.5;
  }

  yRef.y += 6;

  // ── EXCLUSIONS ────────────────────────────────────────────────────────────
  addSectionHeading(doc, "Not Included", yRef, checkNewPage);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(90, 90, 90);

  const defaultExclusions = [
    "International / Domestic Flights", "Visa Fees & Documentation",
    "Personal & Shopping Expenses", "Travel Insurance",
    "Optional Activities & Tips", "Anything not in inclusions",
  ];
  const exclusionItems = pkg.exclusions
    ? stripHtml(pkg.exclusions).split("\n").map(l => l.replace(/^•\s*/, "").trim()).filter(Boolean)
    : defaultExclusions;

  for (const item of exclusionItems) {
    checkNewPage(6);
    doc.setFillColor(239, 68, 68);
    doc.circle(MARGIN + 2.5, yRef.y - 1, 1.2, "F");
    const ls = doc.splitTextToSize(item, CONTENT_W - 8);
    doc.text(ls, MARGIN + 6, yRef.y);
    yRef.y += ls.length * 5.2 + 1.5;
  }

  // ── CONTACT BLOCK ─────────────────────────────────────────────────────────
  yRef.y += 8;
  checkNewPage(28);
  doc.setFillColor(248, 248, 248);
  doc.setDrawColor(...GOLD);
  doc.roundedRect(MARGIN, yRef.y, CONTENT_W, 24, 3, 3, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...BRAND_DARK);
  doc.text("Ready to book? Contact our travel experts:", MARGIN + 6, yRef.y + 8);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(55, 55, 55);
  doc.text("Phone: +91 8807709919", MARGIN + 6, yRef.y + 14);
  doc.text("Email: info@igholidays.com", MARGIN + 6, yRef.y + 19);
  doc.text("Web: www.igholidays.com", PAGE_W / 2 + 4, yRef.y + 14);

  // ── PATCH FOOTERS ─────────────────────────────────────────────────────────
  const total = doc.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    addFooter(doc, i, total);
  }

  doc.save(`${(pkg.slug || pkg.title || "itinerary").toLowerCase().replace(/\s+/g, "-")}-igholidays.pdf`);
}
