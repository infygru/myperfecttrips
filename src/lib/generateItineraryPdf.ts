import jsPDF from "jspdf";

// ── helpers ──────────────────────────────────────────────────────────────────

/** Strip HTML tags and decode common entities */
function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<\/h[1-6]>/gi, "\n")
    .replace(/<li[^>]*>/gi, "  • ")
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

/** Split long text into lines that fit page width */
function splitText(doc: jsPDF, text: string, maxWidth: number): string[] {
  const paragraphs = text.split("\n");
  const result: string[] = [];
  for (const para of paragraphs) {
    if (para.trim() === "") {
      result.push("");
      continue;
    }
    const lines = doc.splitTextToSize(para, maxWidth);
    result.push(...lines);
  }
  return result;
}

// ── brand constants ───────────────────────────────────────────────────────────
const BRAND_GREEN = [22, 101, 52] as const;   // emerald-800 approx
const BRAND_DARK  = [15, 53, 31]  as const;   // brand-950
const GOLD        = [180, 130, 40] as const;  // amber-600 approx
const PAGE_W      = 210;
const PAGE_H      = 297;
const MARGIN      = 18;
const CONTENT_W   = PAGE_W - MARGIN * 2;

// ── footer ────────────────────────────────────────────────────────────────────
function addFooter(doc: jsPDF, pageNum: number, totalPages: number) {
  const y = PAGE_H - 12;
  doc.setFillColor(...BRAND_DARK);
  doc.rect(0, PAGE_H - 18, PAGE_W, 18, "F");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(180, 180, 180);
  doc.text("igholidays.com  ·  Infygru Private Limited  ·  Crafted for premium travel", MARGIN, y);
  doc.text(`Page ${pageNum} of ${totalPages}`, PAGE_W - MARGIN, y, { align: "right" });
}

// ── section heading ───────────────────────────────────────────────────────────
function addSectionHeading(
  doc: jsPDF,
  title: string,
  yRef: { y: number },
  checkNewPage: (h: number) => void,
) {
  checkNewPage(18);
  yRef.y += 4;
  doc.setFillColor(...BRAND_GREEN);
  doc.roundedRect(MARGIN, yRef.y, CONTENT_W, 10, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text(title.toUpperCase(), MARGIN + 5, yRef.y + 6.8);
  yRef.y += 16;
}

// ── main export ───────────────────────────────────────────────────────────────

export async function generateItineraryPdf(
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
  },
  logoUrl: string | null,
) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });

  // We'll collect pages as we go; patch footer counts after
  let pageIndex = 1;
  const pages: number[] = [];

  // ── HEADER (page 1) ────────────────────────────────────────────────────────
  // Dark green banner
  doc.setFillColor(...BRAND_DARK);
  doc.rect(0, 0, PAGE_W, 38, "F");

  // Gold accent line
  doc.setFillColor(...GOLD);
  doc.rect(0, 38, PAGE_W, 1.2, "F");

  // Logo or text brand
  let logoLoaded = false;
  if (logoUrl) {
    try {
      const resp = await fetch(logoUrl);
      const blob = await resp.blob();
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
      const ext = logoUrl.split(".").pop()?.toUpperCase() as "PNG" | "JPEG" | "JPG";
      doc.addImage(dataUrl, ext?.startsWith("J") ? "JPEG" : "PNG", MARGIN, 7, 40, 24);
      logoLoaded = true;
    } catch {
      logoLoaded = false;
    }
  }

  if (!logoLoaded) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255);
    doc.text("IG Holidays", MARGIN, 24);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...GOLD);
    doc.text("Premium Luxury Travel", MARGIN, 30);
  }

  // "Itinerary" label top-right
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...GOLD);
  doc.text("ITINERARY DOCUMENT", PAGE_W - MARGIN, 14, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(200, 200, 200);
  doc.text(`igholidays.com`, PAGE_W - MARGIN, 20, { align: "right" });

  // ── TITLE BLOCK ───────────────────────────────────────────────────────────
  let y = 48;

  // Package title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...BRAND_DARK);
  const titleLines = doc.splitTextToSize(pkg.title || "Travel Package", CONTENT_W);
  doc.text(titleLines, MARGIN, y);
  y += titleLines.length * 9 + 2;

  // Meta chips in a row
  const chips: string[] = [];
  if (pkg.category) chips.push(pkg.category);
  if (pkg.duration_nights && pkg.duration_days)
    chips.push(`${pkg.duration_nights} Nights / ${pkg.duration_days} Days`);
  if (pkg.destinations?.length)
    chips.push(pkg.destinations.join("  ·  "));

  if (chips.length) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(80, 80, 80);
    let chipX = MARGIN;
    for (const chip of chips) {
      const tw = doc.getTextWidth(chip) + 6;
      doc.setFillColor(240, 245, 240);
      doc.setDrawColor(...BRAND_GREEN);
      doc.roundedRect(chipX, y, tw, 6.5, 1.5, 1.5, "FD");
      doc.setTextColor(...BRAND_GREEN);
      doc.text(chip, chipX + 3, y + 4.3);
      chipX += tw + 3;
      if (chipX > PAGE_W - MARGIN - 40) {
        y += 9;
        chipX = MARGIN;
      }
    }
    y += 11;
  }

  // ── BODY CONTENT ─────────────────────────────────────────────────────────
  pages.push(pageIndex);

  const yRef = { y };

  function checkNewPage(neededHeight: number) {
    if (yRef.y + neededHeight > PAGE_H - 24) {
      doc.addPage();
      pageIndex++;
      pages.push(pageIndex);
      yRef.y = 16;
    }
  }

  function addBodyText(text: string, bullet = false) {
    const prefix = bullet ? "" : "";
    const lines = splitText(doc, (prefix + text).trim(), bullet ? CONTENT_W - 6 : CONTENT_W);
    for (const line of lines) {
      checkNewPage(5.5);
      if (line === "") {
        yRef.y += 3;
      } else {
        if (bullet && line === lines[0]) {
          doc.text("•", MARGIN + 1, yRef.y);
          doc.text(line, MARGIN + 6, yRef.y);
        } else {
          doc.text(line, bullet ? MARGIN + 6 : MARGIN, yRef.y);
        }
        yRef.y += 5.2;
      }
    }
  }

  // ── ITINERARY ─────────────────────────────────────────────────────────────
  addSectionHeading(doc, "Day-by-Day Itinerary", yRef, checkNewPage);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(50, 50, 50);

  if (pkg.itinerary) {
    const itinerary = stripHtml(pkg.itinerary);
    const lines = itinerary.split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) { yRef.y += 3; continue; }

      // Detect "Day N" headings
      const isDayHeading = /^Day\s+\d+/i.test(trimmed);
      if (isDayHeading) {
        checkNewPage(12);
        yRef.y += 2;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(...BRAND_GREEN);
        const dayLines = doc.splitTextToSize(trimmed, CONTENT_W);
        doc.text(dayLines, MARGIN, yRef.y);
        yRef.y += dayLines.length * 5.5 + 2;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(50, 50, 50);
      } else if (trimmed.startsWith("•")) {
        checkNewPage(5.5);
        const bLines = doc.splitTextToSize(trimmed.replace(/^•\s*/, ""), CONTENT_W - 6);
        doc.text("•", MARGIN + 1, yRef.y);
        doc.text(bLines, MARGIN + 6, yRef.y);
        yRef.y += bLines.length * 5.2 + 1;
      } else {
        checkNewPage(5.5);
        const tLines = doc.splitTextToSize(trimmed, CONTENT_W);
        doc.text(tLines, MARGIN, yRef.y);
        yRef.y += tLines.length * 5.2 + 1;
      }
    }
  } else {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(130, 130, 130);
    doc.text("Detailed itinerary available on request. Contact our travel experts for the full day-by-day plan.", MARGIN, yRef.y);
    yRef.y += 8;
  }

  yRef.y += 6;

  // ── INCLUSIONS ────────────────────────────────────────────────────────────
  addSectionHeading(doc, "What's Included", yRef, checkNewPage);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(50, 50, 50);

  const defaultInclusions = [
    "Handpicked Premium Accommodation",
    "Daily Breakfast & Select Meals",
    "All Airport & Hotel Transfers",
    "Expert Local Guides",
    "All Entry Permits & Tickets",
    "24/7 On-Trip Concierge Support",
  ];

  if (pkg.inclusions) {
    const text = stripHtml(pkg.inclusions);
    const lines = text.split("\n").filter(l => l.trim());
    for (const line of lines) {
      const trimmed = line.replace(/^•\s*/, "").trim();
      if (!trimmed) continue;
      checkNewPage(6);
      doc.setTextColor(22, 101, 52);
      doc.text("✓", MARGIN + 1, yRef.y);
      doc.setTextColor(50, 50, 50);
      const ls = doc.splitTextToSize(trimmed, CONTENT_W - 8);
      doc.text(ls, MARGIN + 7, yRef.y);
      yRef.y += ls.length * 5.2 + 1.5;
    }
  } else {
    for (const item of defaultInclusions) {
      checkNewPage(6);
      doc.setTextColor(22, 101, 52);
      doc.text("✓", MARGIN + 1, yRef.y);
      doc.setTextColor(50, 50, 50);
      doc.text(item, MARGIN + 7, yRef.y);
      yRef.y += 6;
    }
  }

  yRef.y += 6;

  // ── EXCLUSIONS ────────────────────────────────────────────────────────────
  addSectionHeading(doc, "Not Included", yRef, checkNewPage);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(50, 50, 50);

  const defaultExclusions = [
    "International / Domestic Flights",
    "Visa Fees & Documentation",
    "Personal & Shopping Expenses",
    "Travel Insurance",
    "Optional Activities & Tips",
    "Anything not mentioned in inclusions",
  ];

  if (pkg.exclusions) {
    const text = stripHtml(pkg.exclusions);
    const lines = text.split("\n").filter(l => l.trim());
    for (const line of lines) {
      const trimmed = line.replace(/^•\s*/, "").trim();
      if (!trimmed) continue;
      checkNewPage(6);
      doc.setTextColor(160, 60, 60);
      doc.text("✗", MARGIN + 1, yRef.y);
      doc.setTextColor(90, 90, 90);
      const ls = doc.splitTextToSize(trimmed, CONTENT_W - 8);
      doc.text(ls, MARGIN + 7, yRef.y);
      yRef.y += ls.length * 5.2 + 1.5;
    }
  } else {
    for (const item of defaultExclusions) {
      checkNewPage(6);
      doc.setTextColor(160, 60, 60);
      doc.text("✗", MARGIN + 1, yRef.y);
      doc.setTextColor(90, 90, 90);
      doc.text(item, MARGIN + 7, yRef.y);
      yRef.y += 6;
    }
  }

  // ── CONTACT FOOTER BLOCK ─────────────────────────────────────────────────
  yRef.y += 8;
  checkNewPage(28);

  doc.setFillColor(240, 248, 244);
  doc.setDrawColor(...BRAND_GREEN);
  doc.roundedRect(MARGIN, yRef.y, CONTENT_W, 24, 3, 3, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...BRAND_DARK);
  doc.text("Ready to book? Contact our travel experts:", MARGIN + 6, yRef.y + 8);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(50, 50, 50);
  doc.text("📧  info@igholidays.com", MARGIN + 6, yRef.y + 15);
  doc.text("🌐  www.igholidays.com", PAGE_W / 2 + 2, yRef.y + 15);

  // ── PATCH FOOTERS ─────────────────────────────────────────────────────────
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter(doc, i, totalPages);
  }

  const filename = `${pkg.slug || "itinerary"}-igholidays.pdf`;
  doc.save(filename);
}
