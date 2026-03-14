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

// ── CONSTANTS ──────────────────────────────────────────────────────────────────
const PW  = 210;          // page width mm
const PH  = 297;          // page height mm
const ML  = 16;           // left margin
const MR  = 16;           // right margin
const CW  = PW - ML - MR; // content width
const HDR = 46;           // header bar height
const FOT = 16;           // footer bar height
const TOP = HDR + 12;     // body start Y

// ── PALETTE ───────────────────────────────────────────────────────────────────
type RGB = [number, number, number];
const C_DARK  : RGB = [18, 18, 24];    // near-black
const C_BODY  : RGB = [60, 60, 72];    // body text
const C_MID   : RGB = [110, 110, 120]; // secondary text
const C_LIGHT : RGB = [160, 160, 168]; // captions
const C_GOLD  : RGB = [193, 152, 36];  // brand gold
const C_GOLD2 : RGB = [245, 220, 130]; // light gold (text on dark)
const C_GREEN : RGB = [22, 163, 74];
const C_RED   : RGB = [220, 38, 38];
const C_BG    : RGB = [250, 249, 246]; // off-white bg
const C_LINE  : RGB = [226, 224, 220]; // separator

// ── HELPERS ───────────────────────────────────────────────────────────────────
function fc(d: jsPDF, c: RGB) { d.setFillColor(c[0], c[1], c[2]); }
function tc(d: jsPDF, c: RGB) { d.setTextColor(c[0], c[1], c[2]); }
function dc(d: jsPDF, c: RGB) { d.setDrawColor(c[0], c[1], c[2]); }

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
    .replace(/\n{3,}/g, "\n\n").trim();
}

function parseMeals(m: string[] | string | undefined): string[] {
  if (!m) return [];
  if (Array.isArray(m)) return m.filter(Boolean);
  try { const p = JSON.parse(m); if (Array.isArray(p)) return p.filter(Boolean); } catch { }
  return m.split(",").map(s => s.trim()).filter(Boolean);
}

// ── CURSOR / PAGE MANAGER ─────────────────────────────────────────────────────
class Doc {
  d: jsPDF;
  y = TOP;

  constructor() {
    this.d = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  }

  // add new page, reset cursor
  newPage() { this.d.addPage(); this.y = TOP; }

  // ensure `need` mm fit on this page, else new page
  need(n: number) {
    if (this.y + n > PH - FOT - 8) this.newPage();
  }

  // move down
  down(n: number) { this.y += n; }

  // ── horizontal rule ──────────────────────────────────────────────────────────
  rule(color: RGB = C_LINE, weight = 0.25) {
    dc(this.d, color);
    this.d.setLineWidth(weight);
    this.d.line(ML, this.y, ML + CW, this.y);
    this.d.setLineWidth(0.2);
  }

  // ── section heading (white text on dark band) ────────────────────────────────
  section(title: string) {
    this.need(16);
    this.down(6);
    fc(this.d, C_DARK);
    this.d.roundedRect(ML, this.y, CW, 9, 1.5, 1.5, "F");
    // gold left accent
    fc(this.d, C_GOLD);
    this.d.roundedRect(ML, this.y, 3, 9, 1, 1, "F");
    this.d.setFont("helvetica", "bold");
    this.d.setFontSize(8);
    tc(this.d, C_GOLD2);
    this.d.text(title.toUpperCase(), ML + 8, this.y + 6);
    this.down(14);
  }

  // ── body text ────────────────────────────────────────────────────────────────
  body(text: string, indent = 0, lineH = 5.2) {
    this.d.setFont("helvetica", "normal");
    this.d.setFontSize(9);
    tc(this.d, C_BODY);
    const maxW = CW - indent;
    for (const raw of text.split("\n")) {
      const t = raw.trim();
      if (!t) { this.down(2); continue; }
      const lines = this.d.splitTextToSize(t, maxW);
      this.need(lines.length * lineH + 2);
      for (let i = 0; i < lines.length; i++) {
        this.d.text(lines[i], ML + indent, this.y + i * lineH);
      }
      this.down(lines.length * lineH);
    }
  }

  // ── small label ──────────────────────────────────────────────────────────────
  label(text: string, color: RGB = C_LIGHT) {
    this.d.setFont("helvetica", "bold");
    this.d.setFontSize(7);
    tc(this.d, color);
    this.d.text(text.toUpperCase(), ML, this.y);
    this.down(4.5);
  }

  // ── inline pill ──────────────────────────────────────────────────────────────
  pill(text: string, fill: RGB, textColor: RGB, stroke?: RGB) {
    this.need(9);
    this.d.setFont("helvetica", "bold");
    this.d.setFontSize(7.5);
    const tw = this.d.getTextWidth(text);
    const pw = Math.min(tw + 11, CW);
    fc(this.d, fill);
    if (stroke) dc(this.d, stroke);
    this.d.roundedRect(ML, this.y, pw, 6.5, 1.5, 1.5, stroke ? "FD" : "F");
    tc(this.d, textColor);
    this.d.text(text, ML + 5.5, this.y + 4.6);
    dc(this.d, C_LINE);
    this.down(9);
  }

  // ── two-column bullet list (for inclusions/exclusions) ───────────────────────
  twoColBullets(items: string[], dotColor: RGB) {
    const colW = CW / 2 - 4;
    const xs = [ML, ML + CW / 2 + 2];
    const LH = 5.2;

    let col = 0, rowY = this.y;

    for (const item of items) {
      this.d.setFont("helvetica", "normal");
      this.d.setFontSize(8.5);
      const lines = this.d.splitTextToSize(item, colW - 8);
      const blockH = lines.length * LH + 2;

      if (col === 0) {
        // start new row if needed
        this.need(blockH);
        rowY = this.y;
      }

      const x = xs[col];
      // dot
      fc(this.d, dotColor);
      this.d.circle(x + 2.5, rowY + 2.5, 1.3, "F");
      // text
      tc(this.d, C_BODY);
      for (let i = 0; i < lines.length; i++) {
        this.d.text(lines[i], x + 7, rowY + 1 + i * LH);
      }

      if (col === 0) {
        col = 1;
      } else {
        // advance row
        this.y = rowY + blockH;
        rowY = this.y;
        col = 0;
      }
    }
    // if we ended on col 1, advance row
    if (col === 1) this.y = rowY + 7;
    this.down(3);
  }

  // ── footer on every page ─────────────────────────────────────────────────────
  drawFooter(page: number, total: number) {
    const d = this.d;
    d.setFont("helvetica", "italic");
    d.setFontSize(6);
    tc(d, C_LIGHT);
    d.text(
      "Proposed itinerary — subject to final confirmation. Prices & availability may change.",
      PW / 2, PH - FOT - 2, { align: "center" }
    );
    fc(d, C_DARK);
    d.rect(0, PH - FOT, PW, FOT, "F");
    fc(d, C_GOLD);
    d.rect(0, PH - FOT, PW, 0.7, "F");
    d.setFont("helvetica", "normal");
    d.setFontSize(7);
    d.setTextColor(180, 180, 185);
    d.text("IG Holidays  ·  A Brand of Infygru Private Limited", PW / 2, PH - 5, { align: "center" });
    d.setFont("helvetica", "bold");
    tc(d, C_GOLD);
    d.text(`${page} / ${total}`, PW - MR, PH - 5, { align: "right" });
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
  const doc = new Doc();
  const d = doc.d;

  // ── HEADER BAR ─────────────────────────────────────────────────────────────
  fc(d, C_DARK);
  d.rect(0, 0, PW, HDR, "F");
  // Gold accent line at bottom of header
  fc(d, C_GOLD);
  d.rect(0, HDR - 1, PW, 1, "F");

  // Attempt logo load
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
        const img = await new Promise<{ data: string; lw: number; lh: number }>((res, rej) => {
          const el = new Image();
          el.onload = () => {
            let lw = 36, lh = 18;
            const asp = el.naturalWidth / el.naturalHeight;
            if (asp > lw / lh) lh = lw / asp; else lw = lh * asp;
            const px = 3, canvas = document.createElement("canvas");
            canvas.width = Math.round(lw * px);
            canvas.height = Math.round(lh * px);
            const ctx = canvas.getContext("2d")!;
            ctx.fillStyle = "#121218";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(el, 0, 0, canvas.width, canvas.height);
            res({ data: canvas.toDataURL("image/jpeg", 0.92), lw, lh });
          };
          el.onerror = rej;
          el.src = raw;
        });
        const ly = (HDR - img.lh) / 2;
        d.addImage(img.data, "JPEG", ML, ly, img.lw, img.lh);
        logoLoaded = true;
      }
    } catch { /* fall through */ }
  }
  if (!logoLoaded) {
    d.setFont("helvetica", "bold");
    d.setFontSize(16);
    d.setTextColor(255, 255, 255);
    d.text("IG HOLIDAYS", ML, 20);
    d.setFont("helvetica", "normal");
    d.setFontSize(7);
    tc(d, C_GOLD);
    d.text("Your Trusted Travel Partner", ML, 28);
  }

  // Header right: date + contacts
  const dateStr = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  d.setFont("helvetica", "bold");
  d.setFontSize(7);
  tc(d, C_GOLD);
  d.text(dateStr.toUpperCase(), PW - MR, 13, { align: "right" });
  d.setFont("helvetica", "normal");
  d.setFontSize(6.5);
  d.setTextColor(190, 190, 195);
  d.text("igholidays.com", PW - MR, 20.5, { align: "right" });
  d.text("+91 8807709919", PW - MR, 27.5, { align: "right" });
  d.text("info@igholidays.com", PW - MR, 34, { align: "right" });

  // ── TITLE BLOCK ────────────────────────────────────────────────────────────
  doc.y = HDR + 13;

  // Package type / category badge
  const badgeText = pkg.category || "Holiday Package";
  d.setFont("helvetica", "bold");
  d.setFontSize(7.5);
  tc(d, C_GOLD);
  d.text("✦  " + badgeText.toUpperCase(), ML, doc.y);
  doc.down(6);

  // Title
  d.setFont("helvetica", "bold");
  d.setFontSize(17);
  tc(d, C_DARK);
  const titleLines = d.splitTextToSize(pkg.title || "Travel Package", CW);
  for (let i = 0; i < titleLines.length; i++) {
    d.text(titleLines[i], ML, doc.y + i * 9);
  }
  doc.down(titleLines.length * 9 + 1);

  // Thin gold underline below title
  dc(d, C_GOLD);
  d.setLineWidth(0.5);
  d.line(ML, doc.y, ML + 55, doc.y);
  d.setLineWidth(0.2);
  doc.down(7);

  // Meta info row: duration · destination · price
  const metaParts: string[] = [];
  if (pkg.duration_nights && pkg.duration_days) metaParts.push(`${pkg.duration_nights} Nights / ${pkg.duration_days} Days`);
  const destStr = pkg.destination || pkg.destinations?.join(" · ");
  if (destStr) metaParts.push(destStr);
  if (pkg.price) metaParts.push(`From ₹${Number(pkg.price).toLocaleString("en-IN")}`);

  if (metaParts.length) {
    d.setFont("helvetica", "normal");
    d.setFontSize(8.5);
    tc(d, C_MID);
    d.text(metaParts.join("   ·   "), ML, doc.y);
    doc.down(8);
  }

  // Subtle divider before itinerary
  doc.down(2);
  doc.rule(C_LINE, 0.3);
  doc.down(4);

  // ── ITINERARY ──────────────────────────────────────────────────────────────
  doc.section("Day-by-Day Itinerary");

  // Resolve itinerary source: itineraryDays param → pkg.itinerary_days → pkg.itinerary
  let days: ItineraryDay[] | null = null;

  if (Array.isArray(itineraryDays) && itineraryDays.length > 0) {
    days = [...itineraryDays].sort((a, b) => (a.day_number ?? 0) - (b.day_number ?? 0));
  } else if (pkg.itinerary_days) {
    let raw = pkg.itinerary_days;
    if (typeof raw === "string") {
      try { raw = JSON.parse(raw); } catch { raw = []; }
    }
    if (Array.isArray(raw) && raw.length > 0) {
      days = [...raw].sort((a, b) => (a.day_number ?? 0) - (b.day_number ?? 0));
    }
  }

  if (days && days.length > 0) {
    for (const day of days) {
      const num = day.day_number ?? 1;
      const title = (day.title || `Day ${num}`).trim();
      const meals = parseMeals(day.meals);
      const desc = day.description ? stripHtml(day.description) : "";

      // Estimate total height for this day block
      d.setFont("helvetica", "bold");
      d.setFontSize(10.5);
      const titleW = CW - 28;
      const titleLns = d.splitTextToSize(title, titleW);
      d.setFont("helvetica", "normal");
      d.setFontSize(9);
      let descH = 0;
      for (const para of desc.split("\n")) {
        const t = para.trim();
        if (t) descH += d.splitTextToSize(t, CW).length * 5.2;
        else descH += 2;
      }
      const blockH = 10 + titleLns.length * 5.8 + (meals.length ? 10 : 0) + (desc ? descH + 6 : 0) + (day.accommodation ? 10 : 0) + 8;
      doc.need(blockH);

      const rowY = doc.y;

      // ── Left gold bar + day number ──────────────────────────────────────────
      fc(d, C_GOLD);
      d.roundedRect(ML, rowY, 20, 9, 2, 2, "F");
      d.setFont("helvetica", "bold");
      d.setFontSize(7.5);
      tc(d, C_DARK);
      d.text(`DAY ${num}`, ML + 10, rowY + 6, { align: "center" });

      // ── Day title ───────────────────────────────────────────────────────────
      d.setFont("helvetica", "bold");
      d.setFontSize(10.5);
      tc(d, C_DARK);
      const titleStartY = rowY + 9 / 2 + 2 - ((titleLns.length - 1) * 5.8) / 2;
      for (let i = 0; i < titleLns.length; i++) {
        d.text(titleLns[i], ML + 25, titleStartY + i * 5.8);
      }
      doc.y = rowY + Math.max(9, titleLns.length * 5.8) + 5;

      // ── Meals ────────────────────────────────────────────────────────────────
      if (meals.length > 0) {
        doc.pill(
          "🍽  Meals: " + meals.join("  ·  "),
          [251, 244, 220] as unknown as RGB,
          [110, 75, 10] as unknown as RGB,
          [215, 180, 70] as unknown as RGB,
        );
      }

      // ── Description (plain text — no HTML) ───────────────────────────────────
      if (desc) {
        d.setFont("helvetica", "normal");
        d.setFontSize(9);
        tc(d, C_BODY);
        for (const para of desc.split("\n")) {
          const t = para.trim();
          if (!t) { doc.down(2); continue; }
          const lines = d.splitTextToSize(t, CW);
          doc.need(lines.length * 5.2 + 1);
          for (let i = 0; i < lines.length; i++) {
            d.text(lines[i], ML, doc.y + i * 5.2);
          }
          doc.down(lines.length * 5.2);
        }
        doc.down(4);
      }

      // ── Accommodation ────────────────────────────────────────────────────────
      if (day.accommodation) {
        doc.pill(
          "🏨  Stay: " + day.accommodation,
          [232, 241, 255] as unknown as RGB,
          [35, 65, 140] as unknown as RGB,
          [165, 195, 240] as unknown as RGB,
        );
      }

      // ── Separator between days ───────────────────────────────────────────────
      doc.need(6);
      doc.rule([234, 230, 225], 0.25);
      doc.down(7);
    }

  } else if (pkg.itinerary) {
    // Legacy rich-text fallback
    const text = stripHtml(pkg.itinerary);
    d.setFont("helvetica", "normal");
    d.setFontSize(9);
    tc(d, C_BODY);

    for (const raw of text.split("\n")) {
      const t = raw.trim();
      if (!t) { doc.down(2.5); continue; }
      if (/^Day\s+\d+/i.test(t)) {
        doc.need(14);
        doc.down(3);
        d.setFont("helvetica", "bold");
        d.setFontSize(10);
        tc(d, C_DARK);
        const ls = d.splitTextToSize(t, CW);
        for (let i = 0; i < ls.length; i++) d.text(ls[i], ML, doc.y + i * 5.5);
        doc.down(ls.length * 5.5 + 2);
        d.setFont("helvetica", "normal");
        d.setFontSize(9);
        tc(d, C_BODY);
      } else {
        const ls = d.splitTextToSize(t, CW);
        doc.need(ls.length * 5.2 + 1);
        for (let i = 0; i < ls.length; i++) d.text(ls[i], ML, doc.y + i * 5.2);
        doc.down(ls.length * 5.2 + 1);
      }
    }
  } else {
    d.setFont("helvetica", "italic");
    d.setFontSize(9);
    tc(d, C_LIGHT);
    d.text("Detailed itinerary will be shared on confirmation.", ML, doc.y);
    doc.down(8);
  }

  // ── INCLUSIONS & EXCLUSIONS (2-col side by side) ────────────────────────────
  doc.down(4);

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

  const inclusions = pkg.inclusions
    ? stripHtml(pkg.inclusions).split("\n").map(l => l.replace(/^[•\-*]\s*/, "").trim()).filter(Boolean)
    : defaultInc;
  const exclusions = pkg.exclusions
    ? stripHtml(pkg.exclusions).split("\n").map(l => l.replace(/^[•\-*]\s*/, "").trim()).filter(Boolean)
    : defaultExc;

  // ── Two-column layout for Inc/Exc ──────────────────────────────────────────
  doc.need(20);
  const halfW = (CW - 6) / 2;
  const leftX = ML, rightX = ML + halfW + 6;

  // Inc header
  fc(d, C_GREEN);
  d.roundedRect(leftX, doc.y, halfW, 8, 1.5, 1.5, "F");
  d.setFont("helvetica", "bold");
  d.setFontSize(7.5);
  tc(d, [255, 255, 255]);
  d.text("WHAT'S INCLUDED", leftX + halfW / 2, doc.y + 5.5, { align: "center" });

  // Exc header
  fc(d, C_RED);
  d.roundedRect(rightX, doc.y, halfW, 8, 1.5, 1.5, "F");
  d.setFont("helvetica", "bold");
  d.setFontSize(7.5);
  tc(d, [255, 255, 255]);
  d.text("NOT INCLUDED", rightX + halfW / 2, doc.y + 5.5, { align: "center" });

  doc.down(12);

  // Draw both lists side by side
  const LH = 5.2;
  function drawList(items: string[], x: number, dotColor: RGB) {
    let y = doc.y;
    d.setFont("helvetica", "normal");
    d.setFontSize(8.5);
    for (const item of items) {
      const lines = d.splitTextToSize(item, halfW - 10);
      const bh = lines.length * LH + 2;
      // page guard (only advance if left col — right col follows left)
      fc(d, dotColor);
      d.circle(x + 3, y + 2.5, 1.3, "F");
      tc(d, C_BODY);
      for (let i = 0; i < lines.length; i++) {
        d.text(lines[i], x + 8, y + 1 + i * LH);
      }
      y += bh;
    }
    return y;
  }

  const savedY = doc.y;
  const endLeft  = drawList(inclusions, leftX, C_GREEN);
  const endRight = drawList(exclusions, rightX, C_RED);
  doc.y = Math.max(endLeft, endRight, savedY) + 4;

  // ── CONTACT CTA BLOCK ──────────────────────────────────────────────────────
  doc.need(38);
  doc.down(8);

  fc(d, C_BG);
  dc(d, C_GOLD);
  d.setLineWidth(0.5);
  d.roundedRect(ML, doc.y, CW, 34, 3, 3, "FD");
  d.setLineWidth(0.2);

  // Gold left accent
  fc(d, C_GOLD);
  d.roundedRect(ML, doc.y, 4, 34, 1.5, 1.5, "F");

  d.setFont("helvetica", "bold");
  d.setFontSize(10.5);
  tc(d, C_DARK);
  d.text("Ready to book? Contact our travel experts", ML + 9, doc.y + 11);

  dc(d, C_GOLD);
  d.setLineWidth(0.4);
  d.line(ML + 9, doc.y + 15, ML + CW - 8, doc.y + 15);
  d.setLineWidth(0.2);

  const contacts: [string, string][] = [
    ["Phone", "+91 8807709919"],
    ["Email", "info@igholidays.com"],
    ["WhatsApp", "+91 8807709919"],
    ["Web", "www.igholidays.com"],
  ];
  d.setFontSize(8.5);
  const rows = [[contacts[0], contacts[1]], [contacts[2], contacts[3]]];
  const colXs = [ML + 9, ML + CW / 2 + 4];
  const rowYs = [doc.y + 23, doc.y + 30];

  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 2; col++) {
      const [lbl, val] = rows[row][col];
      d.setFont("helvetica", "bold");
      tc(d, C_DARK);
      d.text(`${lbl}: `, colXs[col], rowYs[row]);
      const lw = d.getTextWidth(`${lbl}: `) + 0.5;
      d.setFont("helvetica", "normal");
      tc(d, C_MID);
      d.text(val, colXs[col] + lw, rowYs[row]);
    }
  }

  doc.down(40);

  // ── RETROACTIVE FOOTERS ────────────────────────────────────────────────────
  const totalPages = d.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    d.setPage(i);
    doc.drawFooter(i, totalPages);
  }

  // ── SAVE ──────────────────────────────────────────────────────────────────
  const fname = (pkg.slug || pkg.title || "itinerary")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "itinerary";
  d.save(`${fname}-igholidays.pdf`);
}
