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

// 3. Flight Enquiry Schema
const FlightEnquirySchema = z.object({
    name: z.string().min(2, "Name is too short"),
    phone: z.string().regex(/^\d{10,12}$/, "Please input valid mobile number"),
    from: z.string().min(1, "Origin is required"),
    to: z.string().min(1, "Destination is required"),
    date: z.string().min(1, "Travel date is required"),
    return_date: z.string().optional(),
    adults: z.number().min(1),
    children: z.number().min(0),
    website_url: z.string().optional(), // Honeypot
});

export async function submitFlightEnquiry(prevState: any, formData: FormData) {
    console.log("--- Server Action: submitFlightEnquiry initiated ---");
    try {
        const rawData = {
            name: formData.get("name"),
            phone: formData.get("phone"),
            from: formData.get("from"),
            to: formData.get("to"),
            date: formData.get("date"),
            return_date: formData.get("return_date") || undefined,
            adults: Number(formData.get("adults")),
            children: Number(formData.get("children")),
            tripType: formData.get("tripType"),
            website_url: formData.get("website_url") || undefined,
        };
        console.log("Raw Data Received:", JSON.stringify(rawData, null, 2));

        // 1. Zod Validation
        const validation = FlightEnquirySchema.safeParse(rawData);

        if (!validation.success) {
            console.error("Validation Failed:", validation.error.issues);
            return { success: false, message: validation.error.issues[0].message };
        }

        // 2. Honeypot Check
        if (validation.data.website_url) {
            console.log("Honeypot hit");
            return { success: true, message: "Enquiry submitted successfully!" };
        }

        // 3. Submit to Directus (Flight_Enquiries Collection)
        const { website_url, ...data } = validation.data;

        // Map to Directus Fields
        const payload = {
            trip_type: rawData.tripType || "OneWay",
            origin: data.from,
            destination: data.to,
            departure_date: data.date,
            return_date: data.return_date || null,
            adults: data.adults,
            children: data.children,
            travellers_total: data.adults + data.children,
            name: data.name,
            phone: data.phone,
            status: "new",
        };
        console.log("Directus Payload:", JSON.stringify(payload, null, 2));

        try {
            await directus.request(createItem("Flight_Enquiries", payload));
            console.log("Directus Submission Success");
        } catch (directusError: any) {
            console.error("Directus API Error:", JSON.stringify(directusError, null, 2));
            if (directusError?.errors) {
                console.error("Directus Details:", directusError.errors);
            }
            throw directusError;
        }

        return { success: true, message: "We've received your flight details. Our team will contact you shortly!" };
    } catch (error) {
        console.error("Flight Enquiry Error (General):", error);
        return { success: false, message: "Failed to submit enquiry. Please try again." };
    }
}
