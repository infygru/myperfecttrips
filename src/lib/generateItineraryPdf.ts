import jsPDF from "jspdf";

// ── HELPERS ──────────────────────────────────────────────────────────────────

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

function wrapText(doc: jsPDF, text: string, maxWidth: number): string[] {
  const result: string[] = [];
  for (const para of text.split("\n")) {
    if (para.trim() === "") { result.push(""); continue; }
    result.push(...doc.splitTextToSize(para.trim(), maxWidth));
  }
  return result;
}

// ── CONSTANTS ─────────────────────────────────────────────────────────────────
const BRAND_DARK = [24, 24, 27]   as const;
const GOLD       = [212, 175, 55] as const;
const PAGE_W     = 210;
const PAGE_H     = 297;
const M          = 18;            // margin
const CW         = PAGE_W - M * 2; // content width = 174 mm
const LH9        = 5.4;           // line height for 9 pt
const LH8        = 5.0;           // line height for 8 pt
const FOOTER_H   = 16;            // reserved at page bottom

// ── FOOTER ────────────────────────────────────────────────────────────────────
function drawFooter(doc: jsPDF, pageNum: number, totalPages: number) {
  // Disclaimer line
  doc.setFont("helvetica", "italic");
  doc.setFontSize(6.5);
  doc.setTextColor(160, 160, 160);
  doc.text(
    "Proposed itinerary — not a confirmed booking. Prices & availability subject to final confirmation.",
    PAGE_W / 2, PAGE_H - FOOTER_H - 1, { align: "center" }
  );
  // Bar
  doc.setFillColor(...BRAND_DARK);
  doc.rect(0, PAGE_H - FOOTER_H, PAGE_W, FOOTER_H, "F");
  doc.setFillColor(...GOLD);
  doc.rect(0, PAGE_H - FOOTER_H, PAGE_W, 1, "F");
  // Brand
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(190, 190, 190);
  doc.text("IG Holidays — A Brand of Infygru Private Limited", PAGE_W / 2, PAGE_H - 5, { align: "center" });
  // Page number
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(...GOLD);
  doc.text(`${pageNum} / ${totalPages}`, PAGE_W - M, PAGE_H - 5, { align: "right" });
}

// ── SECTION HEADING ───────────────────────────────────────────────────────────
function drawSection(doc: jsPDF, title: string, yRef: { y: number }, guard: (h: number) => void) {
  guard(20);
  yRef.y += 6;
  doc.setFillColor(...BRAND_DARK);
  doc.roundedRect(M, yRef.y, CW, 10, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...GOLD);
  doc.text(title.toUpperCase(), M + 5, yRef.y + 6.6);
  yRef.y += 16;
}

// ── BULLET ROW ────────────────────────────────────────────────────────────────
function drawBullet(doc: jsPDF, text: string, yRef: { y: number }, guard: (h: number) => void, color: number[]) {
  doc.setFontSize(9);
  const lines = doc.splitTextToSize(text, CW - 8);
  guard(lines.length * LH9 + 2);
  doc.setFillColor(color[0], color[1], color[2]);
  doc.circle(M + 2, yRef.y - 1.5, 1.3, "F");
  doc.setFont("helvetica", "normal");
  for (let i = 0; i < lines.length; i++) {
    doc.text(lines[i], M + 6, yRef.y + i * LH9);
  }
  yRef.y += lines.length * LH9 + 2;
}

// ── BADGE (pill-shaped label row) ─────────────────────────────────────────────
function drawBadge(
  doc: jsPDF,
  text: string,
  yRef: { y: number },
  guard: (h: number) => void,
  fillRgb: number[],
  strokeRgb: number[],
  textRgb: number[],
) {
  guard(9);
  doc.setFontSize(7.5);
  // Truncate if needed so badge never exceeds content width
  let label = text;
  while (doc.getTextWidth(label) + 10 > CW && label.length > 10) {
    label = label.slice(0, -4) + "…";
  }
  const bw = Math.min(doc.getTextWidth(label) + 10, CW);
  doc.setFillColor(fillRgb[0], fillRgb[1], fillRgb[2]);
  doc.setDrawColor(strokeRgb[0], strokeRgb[1], strokeRgb[2]);
  doc.roundedRect(M, yRef.y, bw, 6.5, 1.5, 1.5, "FD");
  doc.setFont("helvetica", "bold");
  doc.setTextColor(textRgb[0], textRgb[1], textRgb[2]);
  doc.text(label, M + 5, yRef.y + 4.4);
  yRef.y += 9;
}

// ── EXPORTS ───────────────────────────────────────────────────────────────────
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

  // ── PAGE GUARD ───────────────────────────────────────────────────────────
  const yRef = { y: 0 };
  function guard(needed: number) {
    if (yRef.y + needed > PAGE_H - FOOTER_H - 4) {
      doc.addPage();
      yRef.y = 20;
    }
  }

  // ── HEADER ───────────────────────────────────────────────────────────────
  const HDR_H = 42;
  doc.setFillColor(...BRAND_DARK);
  doc.rect(0, 0, PAGE_W, HDR_H, "F");
  doc.setFillColor(...GOLD);
  doc.rect(0, HDR_H, PAGE_W, 1.5, "F");

  // Logo
  let finalLogoUrl = logoUrl;
  if (finalLogoUrl?.includes("localhost")) {
    const id = finalLogoUrl.split("/assets/")[1]?.split("?")[0];
    if (id) finalLogoUrl = `https://api.igholidays.com/assets/${id}`;
  }

  let logoLoaded = false;
  if (finalLogoUrl) {
    try {
      const resp = await fetch(`/_next/image?url=${encodeURIComponent(finalLogoUrl)}&w=256&q=80`);
      if (resp.ok) {
        const blob = await resp.blob();
        const dataUrl = await new Promise<string>((res) => {
          const r = new FileReader();
          r.onload = () => res(r.result as string);
          r.readAsDataURL(blob);
        });
        let lw = 44, lh = 22;
        await new Promise<void>((res) => {
          const img = new Image();
          img.onload = () => {
            const asp = img.naturalWidth / img.naturalHeight;
            if (asp > lw / lh) lh = lw / asp; else lw = lh * asp;
            res();
          };
          img.src = dataUrl;
        });
        const ly = (HDR_H - lh) / 2;
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(M - 2, ly - 2, lw + 4, lh + 4, 1.5, 1.5, "F");
        doc.addImage(dataUrl, "PNG", M, ly, lw, lh);
        logoLoaded = true;
      }
    } catch { /* fallback */ }
  }
  if (!logoLoaded) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(19);
    doc.setTextColor(255, 255, 255);
    doc.text("IG HOLIDAYS", M, 22);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...GOLD);
    doc.text("Your Trusted Travel Partner", M, 30);
  }

  // Top-right: date + contact
  const dateStr = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(...GOLD);
  doc.text(`DATE: ${dateStr.toUpperCase()}`, PAGE_W - M, 14, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(200, 200, 200);
  doc.text("igholidays.com", PAGE_W - M, 21, { align: "right" });
  doc.text("+91 8807709919", PAGE_W - M, 28, { align: "right" });
  doc.text("info@igholidays.com", PAGE_W - M, 35, { align: "right" });

  // ── TITLE BLOCK ──────────────────────────────────────────────────────────
  yRef.y = HDR_H + 12;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(19);
  doc.setTextColor(...BRAND_DARK);
  const titleLines = doc.splitTextToSize(pkg.title || "Travel Package", CW);
  doc.text(titleLines, M, yRef.y);
  yRef.y += titleLines.length * 8.5 + 5;

  // Meta chips
  const chips: string[] = [];
  if (pkg.category) chips.push(pkg.category);
  if (pkg.duration_nights && pkg.duration_days) chips.push(`${pkg.duration_nights}N / ${pkg.duration_days}D`);
  const dest = pkg.destination || pkg.destinations?.join(" · ");
  if (dest) chips.push(dest);

  if (chips.length) {
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    let cx = M;
    for (const chip of chips) {
      const cw = doc.getTextWidth(chip) + 8;
      if (cx + cw > PAGE_W - M) { yRef.y += 9; cx = M; }
      doc.setFillColor(244, 244, 245);
      doc.setDrawColor(210, 210, 215);
      doc.roundedRect(cx, yRef.y - 1, cw, 7, 1.5, 1.5, "FD");
      doc.setTextColor(50, 50, 60);
      doc.text(chip, cx + 4, yRef.y + 4.2);
      cx += cw + 3;
    }
    yRef.y += 12;
  }

  // ── ITINERARY ────────────────────────────────────────────────────────────
  drawSection(doc, "Day-by-Day Itinerary", yRef, guard);

  const hasDays = Array.isArray(itineraryDays) && itineraryDays.length > 0;

  if (hasDays) {
    const sorted = [...itineraryDays!].sort((a, b) => (a.day_number ?? 0) - (b.day_number ?? 0));

    for (const day of sorted) {
      const dayNum = day.day_number ?? 1;
      const dayTitle = (day.title || `Day ${dayNum}`).trim();

      const PILL_W = 20, PILL_H = 8;

      // Estimate total block height for page break check
      doc.setFontSize(10);
      const dtLines = doc.splitTextToSize(dayTitle, CW - PILL_W - 5);
      const extraTitleH = Math.max(0, (dtLines.length - 1) * 5.5);
      const hasMeals = Array.isArray(day.meals) && day.meals.length > 0;
      const hasDesc = !!day.description;
      const hasAccom = !!day.accommodation;
      const minH = PILL_H + 4 + (hasMeals ? 9 : 0) + (hasDesc ? 15 : 0) + (hasAccom ? 9 : 0);
      guard(Math.max(minH, 20));

      const rowY = yRef.y; // anchor y for this day row

      // Gold pill
      doc.setFillColor(...GOLD);
      doc.roundedRect(M, rowY, PILL_W, PILL_H, 2, 2, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(...BRAND_DARK);
      doc.text(`DAY ${dayNum}`, M + PILL_W / 2, rowY + 5.3, { align: "center" });

      // Day title (right of pill, centered vertically to pill)
      const titleX = M + PILL_W + 4;
      const titleMaxW = CW - PILL_W - 4;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...BRAND_DARK);
      // Baseline centered to pill: pill_center + half_cap_height
      const titleY = rowY + PILL_H / 2 + 1.8;
      doc.text(dtLines[0], titleX, titleY);
      // Wrapped lines below the pill
      for (let i = 1; i < dtLines.length; i++) {
        doc.text(dtLines[i], titleX, titleY + i * 5.5);
      }
      // Advance past the pill (and any extra title lines below it)
      yRef.y = rowY + PILL_H + extraTitleH + 4;

      // Meals badge
      if (hasMeals) {
        drawBadge(
          doc,
          "Meals: " + day.meals!.join(" · "),
          yRef, guard,
          [252, 248, 228], [215, 185, 80], [110, 80, 10],
        );
      }

      // Description
      if (day.description) {
        const lines = wrapText(doc, stripHtml(day.description), CW);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(60, 60, 60);
        for (const line of lines) {
          guard(LH9 + 1);
          if (line === "") { yRef.y += 2.5; continue; }
          doc.text(line, M, yRef.y);
          yRef.y += LH9;
        }
        yRef.y += 2;
      }

      // Accommodation badge
      if (day.accommodation) {
        drawBadge(
          doc,
          "Stay: " + day.accommodation,
          yRef, guard,
          [236, 242, 255], [170, 195, 240], [30, 55, 120],
        );
      }

      yRef.y += 4; // inter-day gap
    }
  } else if (pkg.itinerary) {
    // Legacy WYSIWYG
    const text = stripHtml(pkg.itinerary);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    for (const raw of text.split("\n")) {
      const t = raw.trim();
      if (!t) { yRef.y += 2.5; continue; }
      if (/^Day\s+\d+/i.test(t)) {
        guard(14);
        yRef.y += 3;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(...BRAND_DARK);
        const dl = doc.splitTextToSize(t, CW);
        doc.text(dl, M, yRef.y);
        yRef.y += dl.length * 5.5 + 2;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(60, 60, 60);
      } else {
        guard(LH9 + 1);
        const tl = doc.splitTextToSize(t, CW);
        doc.text(tl, M, yRef.y);
        yRef.y += tl.length * LH9 + 1;
      }
    }
  } else {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(160, 160, 160);
    doc.text("Detailed itinerary available on request.", M, yRef.y);
    yRef.y += 8;
  }

  yRef.y += 5;

  // ── INCLUSIONS ───────────────────────────────────────────────────────────
  drawSection(doc, "What's Included", yRef, guard);

  const defInclusions = [
    "Handpicked Premium Accommodation",
    "Daily Breakfast & Select Meals",
    "All Airport & Hotel Transfers",
    "Expert Local Guides",
    "All Entry Permits & Tickets",
    "24/7 On-Trip Concierge Support",
  ];
  const inclusions = pkg.inclusions
    ? stripHtml(pkg.inclusions).split("\n").map(l => l.replace(/^[•\-]\s*/, "").trim()).filter(Boolean)
    : defInclusions;

  for (const item of inclusions) {
    drawBullet(doc, item, yRef, guard, [34, 197, 94]);
  }

  yRef.y += 5;

  // ── EXCLUSIONS ───────────────────────────────────────────────────────────
  drawSection(doc, "Not Included", yRef, guard);

  const defExclusions = [
    "International / Domestic Flights",
    "Visa Fees & Documentation",
    "Personal & Shopping Expenses",
    "Travel Insurance",
    "Optional Activities & Tips",
    "Anything not listed in inclusions",
  ];
  const exclusions = pkg.exclusions
    ? stripHtml(pkg.exclusions).split("\n").map(l => l.replace(/^[•\-]\s*/, "").trim()).filter(Boolean)
    : defExclusions;

  for (const item of exclusions) {
    drawBullet(doc, item, yRef, guard, [239, 68, 68]);
  }

  // ── CONTACT BLOCK ────────────────────────────────────────────────────────
  yRef.y += 8;
  guard(34);

  doc.setFillColor(250, 249, 246);
  doc.setDrawColor(...GOLD);
  doc.roundedRect(M, yRef.y, CW, 30, 3, 3, "FD");

  // Heading
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(...BRAND_DARK);
  doc.text("Ready to book? Contact our travel experts", M + 6, yRef.y + 9);

  // Divider
  doc.setDrawColor(215, 185, 80);
  doc.line(M + 6, yRef.y + 12.5, M + CW - 6, yRef.y + 12.5);

  // Contact rows — measure each label to align values perfectly
  const contacts = [
    ["Phone",    "+91 8807709919"],
    ["Email",    "info@igholidays.com"],
    ["Website",  "www.igholidays.com"],
    ["WhatsApp", "+91 8807709919"],
  ];
  doc.setFontSize(8.5);
  const col1X = M + 6;
  const col2X = PAGE_W / 2 + 4;
  const rowYs = [yRef.y + 19, yRef.y + 25.5];
  const pairs = [[contacts[0], contacts[1]], [contacts[2], contacts[3]]];

  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 2; col++) {
      const [label, value] = pairs[row][col];
      const baseX = col === 0 ? col1X : col2X;
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...BRAND_DARK);
      doc.text(`${label}:`, baseX, rowYs[row]);
      const labelW = doc.getTextWidth(`${label}:`) + 2;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(60, 60, 60);
      doc.text(value, baseX + labelW, rowYs[row]);
    }
  }

  // ── PATCH FOOTERS ────────────────────────────────────────────────────────
  const total = doc.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    drawFooter(doc, i, total);
  }

  const fname = (pkg.slug || pkg.title || "itinerary")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  doc.save(`${fname}-igholidays.pdf`);
}
