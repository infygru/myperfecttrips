
import { createDirectus, rest, readSingleton, readItems } from "@directus/sdk";

const directus = createDirectus("https://api.igholidays.com").with(rest());

async function check() {
    console.log("Testing Singleton Read...");
    try {
        const s = await directus.request(readSingleton("site_settings"));
        console.log("✅ Singleton SUCCESS:", s);
        return;
    } catch (err) {
        console.log("❌ Singleton FAILED:", err.message);
    }
    
    console.log("\nTesting Array Read...");
    try {
        const arr = await directus.request(readItems("site_settings", { limit: 1 }));
        console.log("✅ Array SUCCESS:", arr);
    } catch (err) {
        console.log("❌ Array FAILED:", err.message);
    }
}
check();
