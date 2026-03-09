"use server";

import { directus } from "@/lib/directus";
import { createItem } from "@directus/sdk";

export async function submitLeadAction(formData: FormData) {
    try {
        const rawData = {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            phone: formData.get("phone") as string,
            package_interest: formData.get("package_interest") as string,
            budget: formData.get("budget") as string,
            notes: formData.get("notes") as string,
            status: "New" as const,
        };

        // Basic validation
        if (!rawData.name || !rawData.email) {
            return { success: false, error: "Name and email are required fields." };
        }

        // Submit to Directus
        await directus.request(createItem("leads", rawData));

        return { success: true };
    } catch (error: unknown) {
        console.error("Directus Lead Submission Error:", error);
        const err = error as Error;
        return { success: false, error: err.message || "Something went wrong. Please try again." };
    }
}
