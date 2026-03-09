import { NextRequest, NextResponse } from "next/server";
import { directus } from "@/lib/directus";
import { createItem } from "@directus/sdk";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, email, phone, message } = body;

        if (!name || !email || !message) {
            return NextResponse.json({ error: "Name, email and message are required." }, { status: 400 });
        }

        await directus.request(createItem("enquiries", {
            name,
            email,
            phone: phone || null,
            message,
            status: "Pending",
        }));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Enquiry submission error:", error);
        return NextResponse.json({ error: "Failed to submit enquiry." }, { status: 500 });
    }
}
