"use server";

import { directus } from "@/lib/directus";
import { createItem } from "@directus/sdk";

export async function submitFlightEnquiry(formData: FormData) {
    try {
        const rawData = {
            from_airport: formData.get("from_airport") as string,
            to_airport: formData.get("to_airport") as string,
            depart_date: formData.get("depart_date") as string,
            return_date: formData.get("return_date") as string,
            pax: parseInt(formData.get("pax") as string) || 1,
            status: "new"
        };

        if (!rawData.from_airport || !rawData.to_airport || !rawData.depart_date) {
            return { success: false, error: "Missing required flight details." };
        }

        // Use any assertion since the schema might not be strictly typed yet
        await directus.request(createItem("flight_enquiries" as any, rawData));

        return { success: true };
    } catch (error: any) {
        console.error("Flight Sub Error:", error);
        return { success: false, error: error.message || "Failed to submit flight search." };
    }
}

export async function submitHolidayEnquiry(formData: FormData) {
    try {
        const rawData = {
            destination: formData.get("destination") as string,
            budget: formData.get("budget") as string,
            pax: parseInt(formData.get("pax") as string) || 2,
            status: "new"
        };

        if (!rawData.destination || !rawData.budget) {
            return { success: false, error: "Missing required holiday details." };
        }

        await directus.request(createItem("holiday_enquiries" as any, rawData));

        return { success: true };
    } catch (error: any) {
        console.error("Holiday Sub Error:", error);
        return { success: false, error: error.message || "Failed to submit holiday search." };
    }
}
