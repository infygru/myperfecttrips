"use server";

import { directus } from "@/lib/directus";
import { createItem } from "@directus/sdk";
import { sendLeadNotification } from "@/lib/mailer";

export async function submitLeadAction(formData: FormData) {
    try {
        const rawData = {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            phone: formData.get("phone") as string,
            package_interest: formData.get("package_interest") as string,
            budget: formData.get("budget") as string,
            notes: formData.get("notes") as string,
            travel_date: formData.get("travel_date") ? new Date(formData.get("travel_date") as string).toISOString() : undefined,
            num_adults: Number(formData.get("num_adults")) || undefined,
            num_children: Number(formData.get("num_children")) || undefined,
            trip_type: formData.get("trip_type") as string,
            status: "New" as const,
        };

        // Basic validation
        if (!rawData.name || !rawData.email) {
            return { success: false, error: "Name and email are required fields." };
        }

        // Submit to Directus
        await directus.request(createItem("leads", rawData));

        // Send email notification — fire-and-forget (never block the user)
        sendLeadNotification({
            name:             rawData.name,
            email:            rawData.email,
            phone:            rawData.phone,
            package_interest: rawData.package_interest,
            travel_date:      rawData.travel_date,
            trip_type:        rawData.trip_type,
            num_adults:       rawData.num_adults,
            num_children:     rawData.num_children,
            budget:           rawData.budget,
            notes:            rawData.notes,
        }).catch(err => console.error("Lead email notification failed:", err));

        return { success: true };
    } catch (error: unknown) {
        console.error("Directus Lead Submission Error:", error);
        const err = error as Error;
        return { success: false, error: err.message || "Something went wrong. Please try again." };
    }
}
