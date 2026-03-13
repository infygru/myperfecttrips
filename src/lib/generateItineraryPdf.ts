import jsPDF from "jspdf";

// ── TYPES ─────────────────────────────────────────────────────────────────────
export interface ItineraryDay {
  id?: number;
  day_number?: number;
  title?: string;
  description?: string;
  accommodation?: string;
  meals?: string[] | string;
}

// ── CONSTANTS ─────────────────────────────────────────────────────────────────
const W        = 210;          // page width mm
const H        = 297;          // page height mm
const M        = 15;           // margin mm
const CW       = W - M * 2;   // content width mm
const FOOT     = 18;           // footer height reserved
const LH       = 5.4;          // line height 9pt

type RGB = readonly [number, number, number];
const BRAND : RGB = [24, 24, 27];
const GOLD  : RGB = [194, 154, 37];
const DARK  : RGB = [30, 30, 40];
const MID   : RGB = [80, 80, 90];
const LIGHT : RGB = [150, 150, 155];
const GREEN : RGB = [34, 197, 94];
const RED   : RGB = [220, 50, 50];

// ── HELPERS ───────────────────────────────────────────────────────────────────
function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<\/h[1-6]>/gi, "\n")
    .replace(/<li[^>]*>/gi, "• ")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ").replace(/&apos;|&#39;/g, "'").replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function parseMeals(meals: string[] | string | undefined): string[] {
  if (!meals) return [];
  if (Array.isArray(meals)) return meals.filter(Boolean);
  if (typeof meals === "string") {
    // Try to parse JSON string from Directus
    try {
      const parsed = JSON.parse(meals);
      if (Array.isArray(parsed)) return parsed.filter(Boolean);
    } catch { /* ignore */ }
    // Comma-separated fallback
    return meals.split(",").map(s => s.trim()).filter(Boolean);
  }
  return [];
}

function rgb(doc: jsPDF, fn: "fill" | "text" | "draw", c: RGB) {
  if (fn === "fill") doc.setFillColor(c[0], c[1], c[2]);
  else if (fn === "text") doc.setTextColor(c[0], c[1], c[2]);
  else doc.setDrawColor(c[0], c[1], c[2]);
}

// ── STATE MACHINE ─────────────────────────────────────────────────────────────
// All drawing goes through this class so font/color state never leaks
class PdfState {
  doc: jsPDF;
  y: number = 0;

  constructor() {
    this.doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  }

  // Ensure `needed` mm fits on current page, else add a new page
  guard(needed: number) {
    if (this.y + needed > H - FOOT - 4) {
      this.doc.addPage();
      this.y = 20;
    }
  }

  // Move cursor down by `n` mm (with optional page guard)
  skip(n: number) { this.y += n; }

  // ── SECTION HEADING ────────────────────────────────────────────────────────
  drawSection(title: string) {
    this.guard(20);
    this.y += 5;
    rgb(this.doc, "fill", BRAND);
    this.doc.roundedRect(M, this.y, CW, 10, 2, 2, "F");
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(8.5);
    rgb(this.doc, "text", GOLD);
    this.doc.text(title.toUpperCase(), M + 5, this.y + 6.5);
    this.y += 15;
  }

  // ── BULLET ROW ─────────────────────────────────────────────────────────────
  drawBullet(text: string, dotColor: RGB) {
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(9);
    const lines = this.doc.splitTextToSize(text, CW - 9);
    this.guard(lines.length * LH + 2);
    // Dot
    rgb(this.doc, "fill", dotColor);
    this.doc.circle(M + 2.5, this.y - 1.2, 1.2, "F");
    // Text (always dark — reset after section which leaves GOLD)
    rgb(this.doc, "text", MID);
    this.doc.setFont("helvetica", "normal");
    for (let i = 0; i < lines.length; i++) {
      this.doc.text(lines[i], M + 7, this.y + i * LH);
    }
    this.y += lines.length * LH + 2;
  }

  // ── PILL BADGE ─────────────────────────────────────────────────────────────
  drawBadge(text: string, fill: RGB, stroke: RGB, textColor: RGB) {
    this.guard(10);
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(7.5);
    let label = text;
    while (this.doc.getTextWidth(label) + 12 > CW && label.length > 10) {
      label = label.slice(0, -4) + "…";
    }
    const bw = Math.min(this.doc.getTextWidth(label) + 12, CW);
    rgb(this.doc, "fill", fill);
    rgb(this.doc, "draw", stroke);
    this.doc.roundedRect(M, this.y, bw, 6.5, 1.5, 1.5, "FD");
    rgb(this.doc, "text", textColor);
    this.doc.text(label, M + 6, this.y + 4.5);
    // Reset draw color to neutral so it doesn't affect next rect
    this.doc.setDrawColor(200, 200, 200);
    this.y += 9;
  }

  // ── FOOTER (called retroactively on all pages) ─────────────────────────────
  drawFooter(pageNum: number, total: number) {
    const d = this.doc;
    d.setFont("helvetica", "italic");
    d.setFontSize(6.5);
    rgb(d, "text", LIGHT);
    d.text(
      "Proposed itinerary — not a confirmed booking. Prices & availability subject to final confirmation.",
      W / 2, H - FOOT - 1.5, { align: "center" }
    );
    rgb(d, "fill", BRAND);
    d.rect(0, H - FOOT, W, FOOT, "F");
    rgb(d, "fill", GOLD);
    d.rect(0, H - FOOT, W, 0.8, "F");
    d.setFont("helvetica", "normal");
    d.setFontSize(7);
    d.setTextColor(180, 180, 180);
    d.text("IG Holidays — A Brand of Infygru Private Limited", W / 2, H - 5.5, { align: "center" });
    d.setFont("helvetica", "bold");
    d.setFontSize(7);
    rgb(d, "text", GOLD);
    d.text(`${pageNum} / ${total}`, W - M, H - 5.5, { align: "right" });
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
    inclusions?: string;
    exclusions?: string;
    price?: number | string;
  },
  logoUrl: string | null,
  itineraryDays?: ItineraryDay[],
) {
  const s = new PdfState();
  const d = s.doc;
  const HDR = 44;

  // ── HEADER BAR ─────────────────────────────────────────────────────────────
  rgb(d, "fill", BRAND);
  d.rect(0, 0, W, HDR, "F");
  rgb(d, "fill", GOLD);
  d.rect(0, HDR, W, 1.2, "F");

  // Logo
  let logoLoaded = false;
  if (logoUrl) {
    try {
      let url = logoUrl;
      if (url.includes("localhost")) {
        const id = url.split("/assets/")[1]?.split("?")[0];
        if (id) url = `https://api.igholidays.com/assets/${id}`;
      }

      const resp = await fetch(`/_next/image?url=${encodeURIComponent(url)}&w=256&q=80`);
      if (resp.ok) {
        const blob = await resp.blob();
        const raw = await new Promise<string>((res, rej) => {
          const r = new FileReader();
          r.onload = () => res(r.result as string);
          r.onerror = rej;
          r.readAsDataURL(blob);
        });

        const jpegUrl = await new Promise<{ data: string; lw: number; lh: number }>((res, rej) => {
          const img = new Image();
          img.onload = () => {
            // Max size: 40×20 mm
            let lw = 40, lh = 20;
            const asp = img.naturalWidth / img.naturalHeight;
            if (asp > lw / lh) lh = lw / asp; else lw = lh * asp;
            // 3× canvas for crisp rendering
            const px = 3;
            const canvas = document.createElement("canvas");
            canvas.width  = Math.round(lw * px);
            canvas.height = Math.round(lh * px);
            const ctx = canvas.getContext("2d");
            if (!ctx) { rej(new Error("no ctx")); return; }
            ctx.fillStyle = "#fff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            res({ data: canvas.toDataURL("image/jpeg", 0.92), lw, lh });
          };
          img.onerror = rej;
          img.src = raw;
        });

        const ly = (HDR - jpegUrl.lh) / 2;
        rgb(d, "fill", [255, 255, 255] as unknown as RGB);
        d.roundedRect(M - 2, ly - 2, jpegUrl.lw + 4, jpegUrl.lh + 4, 2, 2, "F");
        d.addImage(jpegUrl.data, "JPEG", M, ly, jpegUrl.lw, jpegUrl.lh);
        logoLoaded = true;
      }
    } catch { /* fall through to text logo */ }
  }

  if (!logoLoaded) {
    d.setFont("helvetica", "bold");
    d.setFontSize(18);
    d.setTextColor(255, 255, 255);
    d.text("IG HOLIDAYS", M, 21);
    d.setFont("helvetica", "normal");
    d.setFontSize(7);
    rgb(d, "text", GOLD);
    d.text("Your Trusted Travel Partner", M, 29);
  }

  // Top-right contact strip
  const dateStr = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  d.setFont("helvetica", "bold");
  d.setFontSize(7.5);
  rgb(d, "text", GOLD);
  d.text(`DATE: ${dateStr.toUpperCase()}`, W - M, 13, { align: "right" });
  d.setFont("helvetica", "normal");
  d.setFontSize(7);
  d.setTextColor(200, 200, 200);
  d.text("igholidays.com", W - M, 20, { align: "right" });
  d.text("+91 8807709919", W - M, 27, { align: "right" });
  d.text("info@igholidays.com", W - M, 34, { align: "right" });

  // ── TITLE BLOCK ────────────────────────────────────────────────────────────
  s.y = HDR + 13;
  d.setFont("helvetica", "bold");
  d.setFontSize(20);
  rgb(d, "text", DARK);
  const titleLines = d.splitTextToSize(pkg.title || "Travel Package", CW);
  d.text(titleLines, M, s.y);
  s.y += titleLines.length * 9 + 4;

  // Meta chips (category, duration, destination)
  const chips: string[] = [];
  if (pkg.category) chips.push(pkg.category);
  if (pkg.duration_nights && pkg.duration_days) chips.push(`${pkg.duration_nights}N / ${pkg.duration_days}D`);
  if (pkg.price) chips.push(`From ₹${Number(pkg.price).toLocaleString("en-IN")}`);
  const destStr = pkg.destination || pkg.destinations?.join(" · ");
  if (destStr) chips.push(destStr);

  if (chips.length) {
    d.setFont("helvetica", "normal");
    d.setFontSize(8);
    let cx = M;
    for (const chip of chips) {
      const cw = d.getTextWidth(chip) + 8;
      if (cx + cw > W - M) { s.y += 9; cx = M; }
      d.setFillColor(243, 243, 244);
      d.setDrawColor(210, 210, 215);
      d.roundedRect(cx, s.y - 1, cw, 7, 1.5, 1.5, "FD");
      rgb(d, "text", DARK);
      d.text(chip, cx + 4, s.y + 4.3);
      cx += cw + 3;
    }
    s.y += 12;
  }

  // ── ITINERARY SECTION ──────────────────────────────────────────────────────
  s.drawSection("Day-by-Day Itinerary");

  const days = Array.isArray(itineraryDays) && itineraryDays.length > 0
    ? [...itineraryDays].sort((a, b) => (a.day_number ?? 0) - (b.day_number ?? 0))
    : null;

  if (days) {
    for (const day of days) {
      const dayNum = day.day_number ?? 1;
      const dayTitle = (day.title || `Day ${dayNum}`).trim();
      const meals = parseMeals(day.meals);

      const PW = 22, PH = 8; // pill dimensions

      // Estimate block height for pre-guard
      d.setFontSize(10);
      const dtLines = d.splitTextToSize(dayTitle, CW - PW - 6);
      const extraH = Math.max(0, (dtLines.length - 1) * 5.5);
      const blockEst = PH + extraH + 6 + (meals.length ? 10 : 0) + (day.description ? 20 : 0) + (day.accommodation ? 10 : 0);
      s.guard(Math.max(blockEst, 22));

      const rowY = s.y;

      // Gold day pill
      rgb(d, "fill", GOLD);
      d.roundedRect(M, rowY, PW, PH, 2, 2, "F");
      d.setFont("helvetica", "bold");
      d.setFontSize(7.5);
      rgb(d, "text", BRAND);
      d.text(`DAY ${dayNum}`, M + PW / 2, rowY + 5.3, { align: "center" });

      // Day title — vertically centred to pill
      d.setFont("helvetica", "bold");
      d.setFontSize(10);
      rgb(d, "text", DARK);
      const titleY = rowY + PH / 2 + 1.8;
      d.text(dtLines[0], M + PW + 4, titleY);
      for (let i = 1; i < dtLines.length; i++) {
        d.text(dtLines[i], M + PW + 4, titleY + i * 5.5);
      }

      s.y = rowY + PH + extraH + 4;

      // Meals badge
      if (meals.length > 0) {
        s.drawBadge(
          "Meals: " + meals.join(" · "),
          [252, 248, 228] as unknown as RGB,
          [215, 185, 80] as unknown as RGB,
          [100, 70, 5] as unknown as RGB,
        );
      }

      // Description
      if (day.description) {
        const text = stripHtml(day.description);
        d.setFont("helvetica", "normal");
        d.setFontSize(9);
        rgb(d, "text", MID);
        for (const para of text.split("\n")) {
          const t = para.trim();
          if (!t) { s.y += 2; continue; }
          const ls = d.splitTextToSize(t, CW);
          s.guard(ls.length * LH + 1);
          d.text(ls, M, s.y);
          s.y += ls.length * LH;
        }
        s.y += 3;
      }

      // Stay badge
      if (day.accommodation) {
        s.drawBadge(
          "Stay: " + day.accommodation,
          [235, 242, 255] as unknown as RGB,
          [170, 195, 240] as unknown as RGB,
          [30, 55, 130] as unknown as RGB,
        );
      }

      s.y += 5; // inter-day gap
    }

  } else if (pkg.itinerary) {
    // Legacy rich-text fallback
    const text = stripHtml(pkg.itinerary);
    d.setFont("helvetica", "normal");
    d.setFontSize(9);
    rgb(d, "text", MID);
    for (const raw of text.split("\n")) {
      const t = raw.trim();
      if (!t) { s.y += 2.5; continue; }
      if (/^Day\s+\d+/i.test(t)) {
        s.guard(14);
        s.y += 3;
        d.setFont("helvetica", "bold");
        d.setFontSize(9.5);
        rgb(d, "text", DARK);
        const ls = d.splitTextToSize(t, CW);
        d.text(ls, M, s.y);
        s.y += ls.length * 5.5 + 2;
        d.setFont("helvetica", "normal");
        d.setFontSize(9);
        rgb(d, "text", MID);
      } else {
        const ls = d.splitTextToSize(t, CW);
        s.guard(ls.length * LH + 1);
        d.text(ls, M, s.y);
        s.y += ls.length * LH + 1;
      }
    }
  } else {
    d.setFont("helvetica", "italic");
    d.setFontSize(9);
    rgb(d, "text", LIGHT);
    d.text("Detailed itinerary available on request.", M, s.y);
    s.y += 8;
  }

  // ── INCLUSIONS ─────────────────────────────────────────────────────────────
  s.y += 4;
  s.drawSection("What's Included");

  const defaultInc = [
    "Handpicked Premium Accommodation",
    "Daily Breakfast & Select Meals",
    "All Airport & Hotel Transfers",
    "Expert Local Guides",
    "All Entry Permits & Tickets",
    "24/7 On-Trip Concierge Support",
  ];
  const inclusions = pkg.inclusions
    ? stripHtml(pkg.inclusions).split("\n").map(l => l.replace(/^[•\-]\s*/, "").trim()).filter(Boolean)
    : defaultInc;

  for (const item of inclusions) s.drawBullet(item, GREEN);

  // ── EXCLUSIONS ─────────────────────────────────────────────────────────────
  s.y += 4;
  s.drawSection("Not Included");

  const defaultExc = [
    "International / Domestic Flights",
    "Visa Fees & Documentation",
    "Personal & Shopping Expenses",
    "Travel Insurance",
    "Optional Activities & Tips",
    "Anything not listed in inclusions",
  ];
  const exclusions = pkg.exclusions
    ? stripHtml(pkg.exclusions).split("\n").map(l => l.replace(/^[•\-]\s*/, "").trim()).filter(Boolean)
    : defaultExc;

  for (const item of exclusions) s.drawBullet(item, RED);

  // ── CONTACT BLOCK ──────────────────────────────────────────────────────────
  s.y += 8;
  s.guard(36);

  d.setFillColor(250, 249, 246);
  rgb(d, "draw", GOLD);
  d.roundedRect(M, s.y, CW, 32, 3, 3, "FD");
  d.setFont("helvetica", "bold");
  d.setFontSize(9.5);
  rgb(d, "text", DARK);
  d.text("Ready to book? Contact our travel experts", M + 6, s.y + 9);
  d.setDrawColor(210, 180, 70);
  d.line(M + 6, s.y + 13, M + CW - 6, s.y + 13);

  const ctacts = [
    ["Phone",    "+91 8807709919"],
    ["Email",    "info@igholidays.com"],
    ["Website",  "www.igholidays.com"],
    ["WhatsApp", "+91 8807709919"],
  ];
  d.setFontSize(8.5);
  const rowYs = [s.y + 21, s.y + 28];
  const pairs = [[ctacts[0], ctacts[1]], [ctacts[2], ctacts[3]]];
  const colXs = [M + 6, W / 2 + 4];

  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 2; col++) {
      const [lbl, val] = pairs[row][col];
      const x = colXs[col];
      d.setFont("helvetica", "bold");
      rgb(d, "text", DARK);
      d.text(`${lbl}:`, x, rowYs[row]);
      const lw = d.getTextWidth(`${lbl}:`) + 2;
      d.setFont("helvetica", "normal");
      rgb(d, "text", MID);
      d.text(val, x + lw, rowYs[row]);
    }
  }

  // ── RETROACTIVE FOOTERS ────────────────────────────────────────────────────
  const totalPages = d.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    d.setPage(i);
    s.drawFooter(i, totalPages);
  }

  // ── SAVE ──────────────────────────────────────────────────────────────────
  const fname = (pkg.slug || pkg.title || "itinerary")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "itinerary";
  d.save(`${fname}-igholidays.pdf`);
}
