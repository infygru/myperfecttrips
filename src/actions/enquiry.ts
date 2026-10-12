"use server";

import { adminFetch } from "@/lib/auth";
import {
    sendFlightEnquiryAlert,
    sendHolidayEnquiryAlert,
    sendContactEnquiryAlert,
} from "@/lib/email";

export async function submitFlightEnquiry(formData: FormData) {
    try {
        const rawData = {
            from_airport: formData.get("from_airport") as string,
            to_airport: formData.get("to_airport") as string,
            depart_date: formData.get("depart_date") as string,
            return_date: formData.get("return_date") as string,
            adults: parseInt(formData.get("adults") as string) || 1,
            children: parseInt(formData.get("children") as string) || 0,
            name: formData.get("name") as string,
            phone: formData.get("phone") as string,
            status: "new"
        };

        if (!rawData.from_airport || !rawData.to_airport || !rawData.depart_date) {
            return { success: false, error: "Missing required flight details." };
        }

        const res = await adminFetch("/items/flight_enquiries", {
            method: "POST",
            body: JSON.stringify(rawData),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err?.errors?.[0]?.message || `Directus error ${res.status}`);
        }

        sendFlightEnquiryAlert({
            name:         rawData.name,
            phone:        rawData.phone,
            from_airport: rawData.from_airport,
            to_airport:   rawData.to_airport,
            depart_date:  rawData.depart_date,
            return_date:  rawData.return_date || undefined,
            adults:       rawData.adults,
            children:     rawData.children,
        }).catch(err => console.error('[FlightEnquiry email]', err));

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
            adults: parseInt(formData.get("adults") as string) || 2,
            children: parseInt(formData.get("children") as string) || 0,
            name: formData.get("name") as string,
            phone: formData.get("phone") as string,
            status: "new"
        };

        if (!rawData.destination || !rawData.budget) {
            return { success: false, error: "Missing required holiday details." };
        }

        const res = await adminFetch("/items/holiday_enquiries", {
            method: "POST",
            body: JSON.stringify(rawData),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err?.errors?.[0]?.message || `Directus error ${res.status}`);
        }

        sendHolidayEnquiryAlert({
            name:        rawData.name,
            phone:       rawData.phone,
            destination: rawData.destination,
            budget:      rawData.budget,
            adults:      rawData.adults,
            children:    rawData.children,
        }).catch(err => console.error('[HolidayEnquiry email]', err));

        return { success: true };
    } catch (error: any) {
        console.error("Holiday Sub Error:", error);
        return { success: false, error: error.message || "Failed to submit holiday search." };
    }
}

export async function submitContactEnquiry(formData: FormData) {
    try {
        const rawData = {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            phone: formData.get("phone") as string,
            message: formData.get("message") as string,
            status: "Pending"
        };

        if (!rawData.name || !rawData.email || !rawData.message) {
            return { success: false, error: "Missing required contact details." };
        }

        const res = await adminFetch("/items/enquiries", {
            method: "POST",
            body: JSON.stringify(rawData),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err?.errors?.[0]?.message || `Directus error ${res.status}`);
        }

        sendContactEnquiryAlert({
            name:    rawData.name,
            email:   rawData.email,
            phone:   rawData.phone || undefined,
            message: rawData.message,
        }).catch(err => console.error('[ContactEnquiry email]', err));

        return { success: true };
    } catch (error: any) {
        console.error("Contact Sub Error:", error);
        return { success: false, error: error.message || "Failed to submit contact message." };
    }
}
