"use server";

import { createDirectus, rest, staticToken, createItem } from "@directus/sdk";
import { z } from "zod";

// Initialize Directus Client
const directus = createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_URL!)
    .with(staticToken(process.env.DIRECTUS_API_TOKEN!))
    .with(rest());

// --- SCHEMAS ---

// 1. Package Enquiry Schema
const PackageEnquirySchema = z.object({
    name: z.string().min(2, "Name is too short"),
    phone: z.string().regex(/^\d{10,12}$/, "Please input valid mobile number"),
    travel_date: z.string().refine((date) => {
        const d = new Date(date);
        const minDate = new Date();
        minDate.setDate(minDate.getDate() + 15); // 15 Days Rule
        return d >= minDate;
    }, "Travel date must be at least 15 days in the future"),
    adults: z.number().int().min(1),
    kids: z.number().int().min(0),
    package_name: z.string().min(1),
    // Honeypot field (should be empty/undefined)
    website_url: z.string().optional(),
});

// 2. General Contact Schema
const ContactSchema = z.object({
    name: z.string().min(2, "Name is too short"),
    email: z.string().email("Invalid email address"),
    phone: z.string().regex(/^\d{10,12}$/, "Please input valid mobile number"),
    service_type: z.string().min(1, "Please select a service"),
    message: z.string().min(10, "Message is too short"),
    status: z.literal("new"),
    // Honeypot field
    website_url: z.string().optional(),
});

// --- ACTIONS ---

export async function submitPackageEnquiry(prevState: any, formData: FormData) {
    try {
        const rawData = {
            name: formData.get("name"),
            phone: formData.get("phone"),
            travel_date: formData.get("travel_date"),
            adults: Number(formData.get("adults")),
            kids: Number(formData.get("kids")),
            package_name: formData.get("package_name"),
            website_url: formData.get("website_url"), // Honeypot
        };

        // 1. Zod Validation
        const validation = PackageEnquirySchema.safeParse(rawData);

        if (!validation.success) {
            // Return first error message
            return { success: false, message: validation.error.issues[0].message };
        }

        // 2. Honeypot Check (Spam Filter)
        if (validation.data.website_url) {
            // Silently fail for bots (pretend success)
            return { success: true, message: "Enquiry submitted successfully!" };
        }

        // 3. Submit to Directus
        // Remove honeypot from payload
        const { website_url, ...payload } = validation.data;

        await directus.request(createItem("package_enquiries", payload));

        return { success: true, message: "Enquiry submitted successfully!" };
    } catch (error) {
        console.error("Package Enquiry Error:", error);
        return { success: false, message: "Failed to submit enquiry. Please try again." };
    }
}

export async function submitGeneralEnquiry(prevState: any, formData: FormData) {
    try {
        const firstName = formData.get("first_name") as string;
        const lastName = formData.get("last_name") as string;

        const rawData = {
            name: `${firstName} ${lastName}`.trim(),
            email: formData.get("email"),
            phone: formData.get("phone"),
            service_type: formData.get("service_type"),
            message: formData.get("message"),
            status: "new",
            website_url: formData.get("website_url"), // Honeypot
        };

        // 1. Zod Validation
        const validation = ContactSchema.safeParse(rawData);

        if (!validation.success) {
            return { success: false, message: validation.error.issues[0].message };
        }

        // 2. Honeypot Check
        if (validation.data.website_url) {
            return { success: true, message: "Message sent successfully!" };
        }

        // 3. Submit
        const { website_url, ...payload } = validation.data;

        await directus.request(createItem("Enquiries", payload));

        return { success: true, message: "Message sent successfully!" };
    } catch (error) {
        console.error("General Enquiry Error:", error);
        return { success: false, message: "Failed to send message. Please try again." };
    }
}
