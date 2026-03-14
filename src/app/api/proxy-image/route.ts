import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) return new NextResponse("Missing url", { status: 400 });

  try {
    const resp = await fetch(url, { cache: "no-store" });
    if (!resp.ok) return new NextResponse("Upstream error", { status: 502 });

    const buf         = await resp.arrayBuffer();
    const contentType = resp.headers.get("content-type") || "image/png";

    return new NextResponse(buf, {
      status: 200,
      headers: {
        "Content-Type":  contentType,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return new NextResponse("Fetch failed", { status: 502 });
  }
}
