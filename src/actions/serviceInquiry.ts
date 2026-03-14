"use server";

import { directus } from "@/lib/directus";
import { createItem } from "@directus/sdk";

export async function submitServiceInquiryAction(formData: FormData) {
    try {
        const rawData: Record<string, any> = {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            phone: formData.get("phone") as string,
            service_type: formData.get("service_type") as string,
            company_name: (formData.get("company_name") as string) || null,
            num_people: Number(formData.get("num_people")) || null,
            preferred_date: formData.get("preferred_date") ? new Date(formData.get("preferred_date") as string).toISOString() : null,
            message: (formData.get("message") as string) || null,
            status: "New",
        };

        if (!rawData.name || !rawData.email) {
            return { success: false, error: "Name and email are required." };
        }

        await directus.request(createItem("service_inquiries" as any, rawData));
        return { success: true };
    } catch (error: unknown) {
        console.error("Service Inquiry Submission Error:", error);
        const err = error as Error;
        return { success: false, error: err.message || "Something went wrong. Please try again." };
    }
}
