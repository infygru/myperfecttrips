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

/** Split text into wrapped lines, preserving paragraph breaks */
function wrapText(doc: jsPDF, text: string, maxWidth: number): string[] {
  const result: string[] = [];
  for (const para of text.split("\n")) {
    if (para.trim() === "") { result.push(""); continue; }
    result.push(...doc.splitTextToSize(para.trim(), maxWidth));
  }
  return result;
}

// ── CONSTANTS ────────────────────────────────────────────────────────────────
const BRAND_DARK = [24, 24, 27]   as const;
const GOLD       = [212, 175, 55] as const;
const PAGE_W     = 210;
const PAGE_H     = 297;
const MARGIN     = 18;
const CONTENT_W  = PAGE_W - MARGIN * 2;   // 174 mm

// Line heights (mm) per font size
const LH9  = 5.2;   // 9 pt body
const LH85 = 5.0;   // 8.5 pt small
const LH8  = 4.8;   // 8 pt tiny

function addFooter(doc: jsPDF, pageNum: number, totalPages: number) {
  const disclaimerY = PAGE_H - 18;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(7);
  doc.setTextColor(150, 150, 150);
  doc.text(
    "This is a proposed itinerary, not a confirmed booking. Prices & availability are subject to final confirmation.",
    PAGE_W / 2, disclaimerY, { align: "center" }
  );

  // Footer bar
  doc.setFillColor(...BRAND_DARK);
  doc.rect(0, PAGE_H - 13, PAGE_W, 13, "F");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(180, 180, 180);
  doc.text("IG Holidays — A Brand of Infygru Private Limited", PAGE_W / 2, PAGE_H - 4.5, { align: "center" });
  doc.setTextColor(...GOLD);
  doc.text(`${pageNum} / ${totalPages}`, PAGE_W - MARGIN, PAGE_H - 4.5, { align: "right" });
}

function addSectionHeading(
  doc: jsPDF,
  title: string,
  yRef: { y: number },
  checkNewPage: (h: number) => void
) {
  checkNewPage(20);
  yRef.y += 7;
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

  // ── HEADER BAR ───────────────────────────────────────────────────────────
  doc.setFillColor(...BRAND_DARK);
  doc.rect(0, 0, PAGE_W, 40, "F");
  doc.setFillColor(...GOLD);
  doc.rect(0, 40, PAGE_W, 1.5, "F");

  // Logo
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
        let lw = 42, lh = 22;
        await new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            const aspect = img.naturalWidth / img.naturalHeight;
            if (aspect > lw / lh) { lh = lw / aspect; }
            else { lw = lh * aspect; }
            resolve(true);
          };
          img.src = dataUrl;
        });
        const logoY = (40 - lh) / 2;
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(MARGIN - 2, logoY - 2, lw + 4, lh + 4, 1.5, 1.5, "F");
        doc.addImage(dataUrl, "PNG", MARGIN, logoY, lw, lh);
        logoLoaded = true;
      }
    } catch { /* fallback */ }
  }
  if (!logoLoaded) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255);
    doc.text("IG HOLIDAYS", MARGIN, 25);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...GOLD);
    doc.text("Your Trusted Travel Partner", MARGIN, 32);
  }

  // Date + website (top-right of header)
  const dateStr = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(...GOLD);
  doc.text(`DATE: ${dateStr.toUpperCase()}`, PAGE_W - MARGIN, 16, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(180, 180, 180);
  doc.text("igholidays.com", PAGE_W - MARGIN, 22, { align: "right" });
  doc.text("+91 8807709919", PAGE_W - MARGIN, 28, { align: "right" });

  // ── TITLE BLOCK ──────────────────────────────────────────────────────────
  let y = 52;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...BRAND_DARK);
  const titleLines = doc.splitTextToSize(pkg.title || "Travel Package", CONTENT_W);
  doc.text(titleLines, MARGIN, y);
  y += titleLines.length * 9 + 4;

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
      const tw = doc.getTextWidth(chip) + 8;
      if (chipX + tw > PAGE_W - MARGIN) { y += 9; chipX = MARGIN; }
      doc.setFillColor(244, 244, 245);
      doc.setDrawColor(210, 210, 215);
      doc.roundedRect(chipX, y - 0.5, tw, 7, 1.5, 1.5, "FD");
      doc.setTextColor(50, 50, 60);
      doc.text(chip, chipX + 4, y + 4.3);
      chipX += tw + 3;
    }
    y += 13;
  }

  // ── BODY ─────────────────────────────────────────────────────────────────
  const yRef = { y };

  function checkNewPage(neededHeight: number) {
    if (yRef.y + neededHeight > PAGE_H - 24) {
      doc.addPage();
      yRef.y = 18;
    }
  }

  // ── DAY-BY-DAY ITINERARY ─────────────────────────────────────────────────
  addSectionHeading(doc, "Day-by-Day Itinerary", yRef, checkNewPage);

  const hasDayByDay = Array.isArray(itineraryDays) && itineraryDays.length > 0;

  if (hasDayByDay) {
    for (const day of itineraryDays!) {
      const dayNum = day.day_number ?? 1;
      const dayTitle = (day.title || `Day ${dayNum}`).trim();

      checkNewPage(16);

      // Gold day-number pill (20 × 8 mm)
      const PILL_W = 20;
      const PILL_H = 8;
      doc.setFillColor(...GOLD);
      doc.roundedRect(MARGIN, yRef.y, PILL_W, PILL_H, 2, 2, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(...BRAND_DARK);
      doc.text(`DAY ${dayNum}`, MARGIN + PILL_W / 2, yRef.y + 5.2, { align: "center" });

      // Day title — sits to the right of the pill, vertically centered with pill
      const titleTextX = MARGIN + PILL_W + 4;
      const titleMaxW = CONTENT_W - PILL_W - 4;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...BRAND_DARK);
      const dtLines = doc.splitTextToSize(dayTitle, titleMaxW);
      // Center title text to pill: pill center = yRef.y + PILL_H/2, text baseline = center + capHeight/2 ≈ center + 1.7
      const titleBaselineY = yRef.y + PILL_H / 2 + 1.7;
      doc.text(dtLines[0], titleTextX, titleBaselineY);
      // If title wraps, render extra lines below
      for (let i = 1; i < dtLines.length; i++) {
        yRef.y += 5.5;
        doc.text(dtLines[i], titleTextX, titleBaselineY + i * 5.5);
      }
      yRef.y += PILL_H + 3;

      // Meals row
      if (Array.isArray(day.meals) && day.meals.length > 0) {
        checkNewPage(7);
        const mealsText = "Meals included: " + day.meals.join("  ·  ");
        doc.setFillColor(251, 248, 232);
        doc.setDrawColor(220, 200, 120);
        const mlW = Math.min(doc.getTextWidth(mealsText) + 8, CONTENT_W);
        doc.roundedRect(MARGIN, yRef.y, mlW, 6.5, 1.5, 1.5, "FD");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        doc.setTextColor(120, 90, 10);
        doc.text(mealsText, MARGIN + 4, yRef.y + 4.4);
        yRef.y += 9;
      }

      // Description
      if (day.description) {
        const desc = stripHtml(day.description);
        const lines = wrapText(doc, desc, CONTENT_W - 2);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(55, 55, 55);
        for (const line of lines) {
          checkNewPage(LH9 + 1);
          if (line === "") { yRef.y += 2.5; continue; }
          doc.text(line, MARGIN, yRef.y);
          yRef.y += LH9;
        }
        yRef.y += 2;
      }

      // Accommodation
      if (day.accommodation) {
        checkNewPage(8);
        doc.setFillColor(240, 245, 255);
        doc.setDrawColor(180, 200, 240);
        const accText = `Accommodation: ${day.accommodation}`;
        const accW = Math.min(doc.getTextWidth(accText) + 8, CONTENT_W);
        doc.roundedRect(MARGIN, yRef.y, accW, 6.5, 1.5, 1.5, "FD");
        doc.setFont("helvetica", "italic");
        doc.setFontSize(8);
        doc.setTextColor(40, 60, 120);
        doc.text(accText, MARGIN + 4, yRef.y + 4.4);
        yRef.y += 9;
      }

      yRef.y += 4; // gap between days
    }
  } else if (pkg.itinerary) {
    // Legacy WYSIWYG fallback
    const text = stripHtml(pkg.itinerary);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(55, 55, 55);
    for (const rawLine of text.split("\n")) {
      const t = rawLine.trim();
      if (!t) { yRef.y += 2.5; continue; }
      if (/^Day\s+\d+/i.test(t)) {
        checkNewPage(14);
        yRef.y += 3;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(...BRAND_DARK);
        const dl = doc.splitTextToSize(t, CONTENT_W);
        doc.text(dl, MARGIN, yRef.y);
        yRef.y += dl.length * 5.5 + 2;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(55, 55, 55);
      } else {
        checkNewPage(LH9 + 1);
        const tl = doc.splitTextToSize(t, CONTENT_W);
        doc.text(tl, MARGIN, yRef.y);
        yRef.y += tl.length * LH9 + 1;
      }
    }
  } else {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text("Detailed itinerary available on request.", MARGIN, yRef.y);
    yRef.y += 8;
  }

  yRef.y += 5;

  // ── INCLUSIONS ───────────────────────────────────────────────────────────
  addSectionHeading(doc, "What's Included", yRef, checkNewPage);

  const defaultInclusions = [
    "Handpicked Premium Accommodation",
    "Daily Breakfast & Select Meals",
    "All Airport & Hotel Transfers",
    "Expert Local Guides",
    "All Entry Permits & Tickets",
    "24/7 On-Trip Concierge Support",
  ];
  const inclusionItems = pkg.inclusions
    ? stripHtml(pkg.inclusions).split("\n").map(l => l.replace(/^[•\-]\s*/, "").trim()).filter(Boolean)
    : defaultInclusions;

  doc.setFontSize(9);
  for (const item of inclusionItems) {
    const lines = doc.splitTextToSize(item, CONTENT_W - 8);
    checkNewPage(lines.length * LH9 + 2);

    // Filled circle — vertically centered to first line's cap-height midpoint
    const circleY = yRef.y - 1.6;
    doc.setFillColor(34, 197, 94);
    doc.circle(MARGIN + 2, circleY, 1.3, "F");

    doc.setFont("helvetica", "normal");
    doc.setTextColor(50, 50, 50);
    for (let i = 0; i < lines.length; i++) {
      doc.text(lines[i], MARGIN + 6, yRef.y + i * LH9);
    }
    yRef.y += lines.length * LH9 + 2;
  }

  yRef.y += 5;

  // ── EXCLUSIONS ───────────────────────────────────────────────────────────
  addSectionHeading(doc, "Not Included", yRef, checkNewPage);

  const defaultExclusions = [
    "International / Domestic Flights",
    "Visa Fees & Documentation",
    "Personal & Shopping Expenses",
    "Travel Insurance",
    "Optional Activities & Tips",
    "Anything not listed in inclusions",
  ];
  const exclusionItems = pkg.exclusions
    ? stripHtml(pkg.exclusions).split("\n").map(l => l.replace(/^[•\-]\s*/, "").trim()).filter(Boolean)
    : defaultExclusions;

  doc.setFontSize(9);
  for (const item of exclusionItems) {
    const lines = doc.splitTextToSize(item, CONTENT_W - 8);
    checkNewPage(lines.length * LH9 + 2);

    const circleY = yRef.y - 1.6;
    doc.setFillColor(239, 68, 68);
    doc.circle(MARGIN + 2, circleY, 1.3, "F");

    doc.setFont("helvetica", "normal");
    doc.setTextColor(70, 70, 70);
    for (let i = 0; i < lines.length; i++) {
      doc.text(lines[i], MARGIN + 6, yRef.y + i * LH9);
    }
    yRef.y += lines.length * LH9 + 2;
  }

  // ── CONTACT BLOCK ────────────────────────────────────────────────────────
  yRef.y += 8;
  checkNewPage(32);
  doc.setFillColor(250, 249, 246);
  doc.setDrawColor(...GOLD);
  doc.roundedRect(MARGIN, yRef.y, CONTENT_W, 28, 3, 3, "FD");

  // Heading
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(...BRAND_DARK);
  doc.text("Ready to book? Contact our travel experts", MARGIN + 6, yRef.y + 9);

  // Divider
  doc.setDrawColor(220, 200, 120);
  doc.line(MARGIN + 6, yRef.y + 12, MARGIN + CONTENT_W - 6, yRef.y + 12);

  // Two-column contact details
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(55, 55, 55);

  const col1X = MARGIN + 6;
  const col2X = PAGE_W / 2 + 6;
  const row1Y = yRef.y + 18;
  const row2Y = yRef.y + 23.5;

  doc.setFont("helvetica", "bold");
  doc.setTextColor(...BRAND_DARK);
  doc.text("Phone:", col1X, row1Y);
  doc.text("Email:", col1X, row2Y);
  doc.text("Website:", col2X, row1Y);
  doc.text("WhatsApp:", col2X, row2Y);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(55, 55, 55);
  doc.text("+91 8807709919", col1X + 14, row1Y);
  doc.text("info@igholidays.com", col1X + 12, row2Y);
  doc.text("www.igholidays.com", col2X + 16, row1Y);
  doc.text("+91 8807709919", col2X + 18, row2Y);

  // ── PATCH FOOTERS ────────────────────────────────────────────────────────
  const total = doc.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    addFooter(doc, i, total);
  }

  const filename = (pkg.slug || pkg.title || "itinerary")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  doc.save(`${filename}-igholidays.pdf`);
}
