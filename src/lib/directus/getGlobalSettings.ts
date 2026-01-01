import directus from '@/lib/directus/client';
import { readSingleton } from '@directus/sdk';

export interface GlobalSettings {
    phone: string;
    email: string;
    address: string;
    logo?: string | { id: string };
    // Add other fields as needed
}

export async function getGlobalSettings(): Promise<GlobalSettings | null> {
    try {
        const settings = await directus.request(readSingleton('Global_Settings')).catch(() => null);
        return settings as GlobalSettings;
    } catch (error) {
        console.error("Failed to fetch Global Settings:", error);
        return null;
    }
}
