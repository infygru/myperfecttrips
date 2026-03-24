import jsPDF from "jspdf";

// ── TYPES ──────────────────────────────────────────────────────────────────────
export interface ItineraryDay {
  id?: number;
  day_number?: number;
  title?: string;
  description?: string;
  accommodation?: string;
  meals?: string[] | string;
}

// ── PAGE CONSTANTS ─────────────────────────────────────────────────────────────
const PW = 210;
const PH = 297;
const ML = 15;          // left margin
const MR = 15;          // right margin
const CW = PW - ML - MR; // 180mm content width

const HDR_H  = 46;      // header height (page 1 only)
const FOT_H  = 14;      // footer height (all pages)
const BODY_P1 = HDR_H + 8;   // body starts at 54mm on page 1
const BODY_PN = 12;           // body starts at 12mm on pages 2+
const BODY_END = PH - FOT_H - 8; // last usable Y (275mm)

// ── COLOUR PALETTE ────────────────────────────────────────────────────────────
type RGB = [number, number, number];
const DARK  : RGB = [20,  20,  28];
const BODY  : RGB = [55,  55,  65];
const MID   : RGB = [105, 105, 115];
const LIGHT : RGB = [155, 155, 163];
const GOLD  : RGB = [190, 150, 32];
const GOLD2 : RGB = [242, 215, 120];
const GREEN : RGB = [22,  163, 74];
const RED   : RGB = [210, 35,  35];
const BG    : RGB = [250, 249, 246];
const LINE  : RGB = [224, 221, 216];
const WHITE : RGB = [255, 255, 255];

// ── HELPERS ───────────────────────────────────────────────────────────────────
const f = (d: jsPDF, c: RGB) => d.setFillColor(c[0], c[1], c[2]);
const t = (d: jsPDF, c: RGB) => d.setTextColor(c[0], c[1], c[2]);
const k = (d: jsPDF, c: RGB) => d.setDrawColor(c[0], c[1], c[2]);

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<\/h[1-6]>/gi, "\n")
    .replace(/<li[^>]*>/gi, "- ")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ").replace(/&apos;|&#39;/g, "'").replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}


// Convert pt font size to approximate mm cap-height (for vertical centering)
function capH(pt: number) { return (pt / 2.835) * 0.72; }

// ── LOGO LOADER ───────────────────────────────────────────────────────────────
async function loadLogo(
  logoUrl: string,
): Promise<{ data: string; w: number; h: number } | null> {
  // Normalise localhost → production
  let url = logoUrl;
  if (url.includes("localhost")) {
    const id = url.split("/assets/")[1]?.split("?")[0];
    if (id) url = `https://api.myperfecttrips.com/assets/${id}`;
  }

  // Proxy route first (avoids CORS), then direct as fallback
  const srcs = [
    `/api/proxy-image?url=${encodeURIComponent(url)}`,
    url,
  ];

  for (const src of srcs) {
    try {
      const resp = await fetch(src);
      if (!resp.ok) continue;
      const blob = await resp.blob();

      const raw = await new Promise<string>((res, rej) => {
        const r = new FileReader();
        r.onload  = () => res(r.result as string);
        r.onerror = rej;
        r.readAsDataURL(blob);
      });

      const result = await new Promise<{ data: string; w: number; h: number } | null>(res => {
        const el = new Image();
        el.crossOrigin = "anonymous";
        el.onload = () => {
          // Display size in the PDF (mm) — max 44 × 22 mm
          let lw = 44, lh = 22;
          const asp = el.naturalWidth / (el.naturalHeight || 1);
          if (asp > lw / lh) lh = lw / asp;
          else lw = lh * asp;

          // Canvas at the image's NATURAL pixel size (min 600 wide for sharpness).
          // Never scale up beyond 1200px wide.
          const canvasW = Math.min(Math.max(el.naturalWidth, 600), 1200);
          const canvasH = Math.round(canvasW / asp);

          const cv = document.createElement("canvas");
          cv.width  = canvasW;
          cv.height = canvasH;
          const ctx = cv.getContext("2d")!;
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvasW, canvasH);
          ctx.drawImage(el, 0, 0, canvasW, canvasH);
          res({ data: cv.toDataURL("image/png"), w: lw, h: lh });
        };
        el.onerror = () => res(null);
        el.src = raw;
      });

      if (result) return result;
    } catch (e) { console.error("[PDF logo] fetch failed for", src, e); }
  }
  console.error("[PDF logo] all sources failed for", url);
  return null;
}

// ── DOCUMENT CURSOR ───────────────────────────────────────────────────────────
class Cursor {
  d: jsPDF;
  y: number;
  private pg = 1;

  constructor() {
    this.d = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
    this.y = BODY_P1;
  }

  // Add page — body starts at BODY_PN on page 2+
  newPage() {
    this.d.addPage();
    this.pg++;
    this.y = BODY_PN;
  }

  // Ensure `need` mm fit; add page if not
  need(n: number) {
    if (this.y + n > BODY_END) this.newPage();
  }

  move(n: number) { this.y += n; }

  // Horizontal rule
  rule(color: RGB = LINE, lw = 0.25) {
    k(this.d, color);
    this.d.setLineWidth(lw);
    this.d.line(ML, this.y, ML + CW, this.y);
    this.d.setLineWidth(0.2);
    k(this.d, LINE);
  }

  // Dark section band with gold left accent
  sectionHead(label: string) {
    this.need(20);
    this.move(6);
    const H = 10;
    f(this.d, DARK);
    this.d.roundedRect(ML, this.y, CW, H, 1.5, 1.5, "F");
    f(this.d, GOLD);
    this.d.roundedRect(ML, this.y, 4, H, 1, 1, "F");
    this.d.setFont("helvetica", "bold");
    this.d.setFontSize(8);
    t(this.d, GOLD2);
    // Baseline centred in band: y + H/2 + capH(8)/2
    this.d.text(label.toUpperCase(), ML + 10, this.y + H / 2 + capH(8) / 2);
    this.move(H + 6);
  }

  // Wrapped body text
  para(text: string, x = ML, w = CW, ptSize = 9, lh = 5.2) {
    this.d.setFont("helvetica", "normal");
    this.d.setFontSize(ptSize);
    t(this.d, BODY);
    for (const raw of text.split("\n")) {
      const s = raw.trim();
      if (!s) { this.move(2.5); continue; }
      const lines = this.d.splitTextToSize(s, w);
      this.need(lines.length * lh + 1);
      for (const line of lines) {
        this.d.text(line, x, this.y);
        this.move(lh);
      }
    }
  }

  // Coloured pill/badge — NO emoji (jsPDF Helvetica can't render them)
  pill(text: string, bg: RGB, fg: RGB, border?: RGB) {
    this.need(10);
    this.d.setFont("helvetica", "bold");
    this.d.setFontSize(7.5);
    const tw = this.d.getTextWidth(text);
    const pw = Math.min(tw + 12, CW);
    const ph = 7;
    f(this.d, bg);
    if (border) { k(this.d, border); this.d.setLineWidth(0.3); }
    this.d.roundedRect(ML, this.y, pw, ph, 1.5, 1.5, border ? "FD" : "F");
    if (border) { this.d.setLineWidth(0.2); k(this.d, LINE); }
    t(this.d, fg);
    // Baseline centred in pill
    this.d.text(text, ML + 6, this.y + ph / 2 + capH(7.5) / 2);
    this.move(ph + 3);
  }

  // Footer drawn on each page (absolute positioning — doesn't touch this.y)
  footer(page: number, total: number) {
    const d = this.d;
    // Disclaimer
    d.setFont("helvetica", "italic");
    d.setFontSize(6);
    t(d, LIGHT);
    d.text(
      "Proposed itinerary — subject to final confirmation. Prices & availability may change.",
      PW / 2, PH - FOT_H - 3,
      { align: "center" },
    );
    // Dark bar
    f(d, DARK);
    d.rect(0, PH - FOT_H, PW, FOT_H, "F");
    f(d, GOLD);
    d.rect(0, PH - FOT_H, PW, 0.7, "F");
    // Company text
    d.setFont("helvetica", "normal");
    d.setFontSize(7);
    d.setTextColor(170, 170, 178);
    d.text(
      "My Perfect Trips  |  A Brand of Infygru Private Limited",
      PW / 2, PH - FOT_H + FOT_H / 2 + capH(7) / 2,
      { align: "center" },
    );
    // Page number
    d.setFont("helvetica", "bold");
    t(d, GOLD);
    d.text(
      `${page} / ${total}`,
      PW - MR, PH - FOT_H + FOT_H / 2 + capH(7) / 2,
      { align: "right" },
    );
  }
}

// ── MAIN EXPORT ───────────────────────────────────────────────────────────────
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
    itinerary_days?: ItineraryDay[] | string;
    inclusions?: string;
    exclusions?: string;
    price?: number | string;
  },
  logoUrl: string | null,
  itineraryDays?: ItineraryDay[],
) {
  const doc = new Cursor();
  const d   = doc.d;

  // ── PAGE 1 HEADER ──────────────────────────────────────────────────────────
  f(d, DARK);
  d.rect(0, 0, PW, HDR_H, "F");
  f(d, GOLD);
  d.rect(0, HDR_H - 0.8, PW, 0.8, "F");

  // Logo
  const logo = logoUrl ? await loadLogo(logoUrl) : null;
  if (logo) {
    // White rounded card, then logo inside
    const pad = 3, cx = ML, cy = (HDR_H - logo.h - pad * 2) / 2;
    f(d, WHITE);
    d.roundedRect(cx, cy, logo.w + pad * 2, logo.h + pad * 2, 2, 2, "F");
    d.addImage(logo.data, "PNG", cx + pad, cy + pad, logo.w, logo.h);
  } else {
    d.setFont("helvetica", "bold");
    d.setFontSize(14);
    t(d, WHITE);
    d.text("IG HOLIDAYS", ML, HDR_H / 2 + capH(14) / 2);
    d.setFont("helvetica", "normal");
    d.setFontSize(7);
    t(d, GOLD);
    d.text("Your Trusted Travel Partner", ML, HDR_H / 2 + capH(14) / 2 + 6);
  }

  // Header right — date + contacts
  const dateStr = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  const contactLines = ["myperfecttrips.com", "+91 8807709919", "info@myperfecttrips.com"];
  d.setFont("helvetica", "bold");
  d.setFontSize(7);
  t(d, GOLD);
  d.text(dateStr.toUpperCase(), PW - MR, 12, { align: "right" });
  d.setFont("helvetica", "normal");
  d.setFontSize(6.5);
  d.setTextColor(185, 185, 192);
  contactLines.forEach((ln, i) => d.text(ln, PW - MR, 19 + i * 7, { align: "right" }));

  // ── TITLE BLOCK ────────────────────────────────────────────────────────────
  // Category
  d.setFont("helvetica", "bold");
  d.setFontSize(7.5);
  t(d, GOLD);
  d.text(("* " + (pkg.category || "Holiday Package")).toUpperCase(), ML, doc.y);
  doc.move(7);

  // Package title
  d.setFont("helvetica", "bold");
  d.setFontSize(20);
  t(d, DARK);
  const titleLines = d.splitTextToSize(pkg.title || "Travel Package", CW);
  for (const line of titleLines) {
    d.text(line, ML, doc.y);
    doc.move(10);
  }
  doc.move(-1);

  // Gold underline
  k(d, GOLD);
  d.setLineWidth(0.6);
  d.line(ML, doc.y, ML + 50, doc.y);
  d.setLineWidth(0.2);
  k(d, LINE);
  doc.move(7);

  // Meta: duration | destination | price
  const meta: string[] = [];
  if (pkg.duration_nights && pkg.duration_days)
    meta.push(`${pkg.duration_nights}N / ${pkg.duration_days}D`);
  const dest = pkg.destination || pkg.destinations?.join(" + ");
  if (dest) meta.push(dest);
  if (pkg.price) meta.push(`From Rs.${Number(pkg.price).toLocaleString("en-GB")}`);
  if (meta.length) {
    d.setFont("helvetica", "normal");
    d.setFontSize(8.5);
    t(d, MID);
    d.text(meta.join("   |   "), ML, doc.y);
    doc.move(9);
  }

  doc.move(3);
  doc.rule(LINE, 0.3);
  doc.move(5);

  // ── ITINERARY ──────────────────────────────────────────────────────────────
  doc.sectionHead("Day-by-Day Itinerary");

  // Resolve itinerary days
  let days: ItineraryDay[] | null = null;
  if (Array.isArray(itineraryDays) && itineraryDays.length > 0) {
    days = [...itineraryDays].sort((a, b) => (a.day_number ?? 0) - (b.day_number ?? 0));
  } else if (pkg.itinerary_days) {
    let raw = pkg.itinerary_days;
    if (typeof raw === "string") { try { raw = JSON.parse(raw); } catch { raw = []; } }
    if (Array.isArray(raw) && raw.length > 0)
      days = [...raw].sort((a, b) => (a.day_number ?? 0) - (b.day_number ?? 0));
  }

  if (days && days.length > 0) {
    for (const day of days) {
      const num   = day.day_number ?? 1;
      const title = (day.title || `Day ${num}`).trim();
      const desc  = day.description ? stripHtml(day.description) : "";

      // Measure title lines
      d.setFont("helvetica", "bold");
      d.setFontSize(11);
      const BADGE_W = 22, BADGE_H = 11;
      const TITLE_X = ML + BADGE_W + 5;
      const TITLE_W = CW - BADGE_W - 5;
      const tLines  = d.splitTextToSize(title, TITLE_W);
      const tBlock  = tLines.length * 6.2;

      // Rough height estimate for page-break guard
      d.setFont("helvetica", "normal");
      d.setFontSize(9);
      let descH = 0;
      for (const row of desc.split("\n")) {
        const s = row.trim();
        if (s) descH += d.splitTextToSize(s, CW).length * 5.2;
        else   descH += 2.5;
      }
      const blockH = Math.max(BADGE_H, tBlock) + 5
        + (desc ? descH + 8 : 0)
        + 12;
      doc.need(blockH);

      const startY = doc.y;

      // Gold day badge
      f(d, GOLD);
      d.roundedRect(ML, startY, BADGE_W, BADGE_H, 2, 2, "F");
      d.setFont("helvetica", "bold");
      d.setFontSize(7);
      t(d, DARK);
      d.text(`DAY ${num}`, ML + BADGE_W / 2, startY + BADGE_H / 2 + capH(7) / 2, { align: "center" });

      // Day title — vertically centred against badge
      d.setFont("helvetica", "bold");
      d.setFontSize(11);
      t(d, DARK);
      const tStartY = startY + Math.max(0, (BADGE_H - tBlock) / 2) + capH(11);
      for (let i = 0; i < tLines.length; i++) {
        d.text(tLines[i], TITLE_X, tStartY + i * 6.2);
      }

      // Advance past badge/title row
      doc.y = startY + Math.max(BADGE_H, tBlock) + 6;

      // Description
      if (desc) {
        doc.para(desc);
        doc.move(3);
      }

      // Separator
      doc.need(6);
      doc.rule([232, 228, 222], 0.22);
      doc.move(9);
    }

  } else if (pkg.itinerary) {
    // Legacy rich-text fallback
    const text = stripHtml(pkg.itinerary);
    for (const raw of text.split("\n")) {
      const s = raw.trim();
      if (!s) { doc.move(2.5); continue; }
      if (/^Day\s+\d+/i.test(s)) {
        doc.need(18);
        doc.move(3);
        d.setFont("helvetica", "bold");
        d.setFontSize(11);
        t(d, DARK);
        const ls = d.splitTextToSize(s, CW);
        for (const l of ls) { d.text(l, ML, doc.y); doc.move(6.2); }
        doc.move(2);
      } else {
        d.setFont("helvetica", "normal");
        d.setFontSize(9);
        t(d, BODY);
        const ls = d.splitTextToSize(s, CW);
        doc.need(ls.length * 5.2 + 2);
        for (const l of ls) { d.text(l, ML, doc.y); doc.move(5.2); }
        doc.move(1);
      }
    }
  } else {
    d.setFont("helvetica", "italic");
    d.setFontSize(9);
    t(d, LIGHT);
    d.text("Detailed itinerary will be shared on confirmation.", ML, doc.y);
    doc.move(10);
  }

  // ── INCLUSIONS & EXCLUSIONS ────────────────────────────────────────────────
  doc.move(5);

  const defaultInc = [
    "Handpicked premium accommodation",
    "Daily breakfast & select meals",
    "All airport & hotel transfers",
    "Expert local guides throughout",
    "All entry permits & tickets",
    "24/7 on-trip concierge support",
  ];
  const defaultExc = [
    "International / domestic flights",
    "Visa fees & documentation",
    "Personal & shopping expenses",
    "Travel insurance",
    "Optional activities & gratuities",
    "Anything not in inclusions",
  ];

  const parse = (s: string) =>
    stripHtml(s).split("\n").map(l => l.replace(/^[-•*]\s*/, "").trim()).filter(Boolean);

  const inc = pkg.inclusions ? parse(pkg.inclusions) : defaultInc;
  const exc = pkg.exclusions ? parse(pkg.exclusions) : defaultExc;

  doc.sectionHead("Inclusions & Exclusions");

  // Two-column headers
  const colW = (CW - 5) / 2;
  const lx   = ML;
  const rx   = ML + colW + 5;

  doc.need(24);
  const LH = 5.4;

  // Measure both columns to guard page break
  d.setFont("helvetica", "normal");
  d.setFontSize(8.5);
  const measure = (items: string[]) =>
    items.reduce((acc, item) => acc + d.splitTextToSize(item, colW - 10).length * LH + 2.5, 0);
  doc.need(10 + Math.max(measure(inc), measure(exc)) + 8);

  // Col headers
  f(d, GREEN);
  d.roundedRect(lx, doc.y, colW, 9, 1.5, 1.5, "F");
  d.setFont("helvetica", "bold");
  d.setFontSize(7.5);
  t(d, WHITE);
  d.text("WHAT'S INCLUDED", lx + colW / 2, doc.y + 9 / 2 + capH(7.5) / 2, { align: "center" });

  f(d, RED);
  d.roundedRect(rx, doc.y, colW, 9, 1.5, 1.5, "F");
  t(d, WHITE);
  d.text("NOT INCLUDED", rx + colW / 2, doc.y + 9 / 2 + capH(7.5) / 2, { align: "center" });

  doc.move(13);

  // Draw a column — returns final Y
  const drawCol = (items: string[], x: number, dotColor: RGB): number => {
    let cy = doc.y;
    d.setFont("helvetica", "normal");
    d.setFontSize(8.5);
    for (const item of items) {
      const lines = d.splitTextToSize(item, colW - 10);
      const bh    = lines.length * LH + 2.5;
      // Dot — vertically centred to first text line
      f(d, dotColor);
      d.circle(x + 3, cy + LH / 2, 1.2, "F");
      // Text — baseline of first line at cy + LH/2 + capH/2
      t(d, BODY);
      const textY0 = cy + LH / 2 + capH(8.5) / 2;
      for (let i = 0; i < lines.length; i++) {
        d.text(lines[i], x + 9, textY0 + i * LH);
      }
      cy += bh;
    }
    return cy;
  };

  const savedY = doc.y;
  const endL   = drawCol(inc, lx, GREEN);
  const endR   = drawCol(exc, rx, RED);
  doc.y        = Math.max(endL, endR, savedY) + 6;

  // ── CONTACT CTA ────────────────────────────────────────────────────────────
  doc.need(44);
  doc.move(8);

  const ctaH = 36;
  f(d, BG);
  k(d, GOLD);
  d.setLineWidth(0.5);
  d.roundedRect(ML, doc.y, CW, ctaH, 3, 3, "FD");
  d.setLineWidth(0.2);
  k(d, LINE);

  // Gold left accent
  f(d, GOLD);
  d.roundedRect(ML, doc.y, 4, ctaH, 1.5, 1.5, "F");

  const ctaTop = doc.y;

  d.setFont("helvetica", "bold");
  d.setFontSize(10.5);
  t(d, DARK);
  d.text("Ready to book? Contact our travel experts", ML + 8, ctaTop + 12);

  k(d, GOLD);
  d.setLineWidth(0.4);
  d.line(ML + 8, ctaTop + 16, ML + CW - 6, ctaTop + 16);
  d.setLineWidth(0.2);
  k(d, LINE);

  const contacts = [
    ["Phone",    "+91 8807709919"],
    ["Email",    "info@myperfecttrips.com"],
    ["WhatsApp", "+91 8807709919"],
    ["Website",  "www.myperfecttrips.com"],
  ];
  d.setFontSize(8.5);
  const ctaCols = [ML + 8, ML + CW / 2 + 4];
  const ctaRows = [ctaTop + 24, ctaTop + 32];
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 2; col++) {
      const [lbl, val] = contacts[row * 2 + col];
      d.setFont("helvetica", "bold");
      t(d, DARK);
      d.text(`${lbl}: `, ctaCols[col], ctaRows[row]);
      const lw = d.getTextWidth(`${lbl}: `) + 0.5;
      d.setFont("helvetica", "normal");
      t(d, MID);
      d.text(val, ctaCols[col] + lw, ctaRows[row]);
    }
  }

  doc.move(ctaH + 8);

  // ── RETROACTIVE FOOTERS ────────────────────────────────────────────────────
  const total = d.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    d.setPage(i);
    doc.footer(i, total);
  }

  // ── SAVE ──────────────────────────────────────────────────────────────────
  const fname =
    (pkg.slug || pkg.title || "itinerary")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "itinerary";
  d.save(`${fname}-myperfecttrips.pdf`);
}
