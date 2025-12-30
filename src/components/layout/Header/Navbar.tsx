import directus, { getAssetUrl } from '@/lib/directus/client';
import { readSingleton } from '@directus/sdk';
import NavbarClient from './NavbarClient';

export default async function Navbar() {
  let logoUrl = null;
  let contactNumber = "+44 161 768 0990"; // Default fallback
  let contactEmail = "hello@myperfecttrips.co.uk"; // Default fallback

  try {
    // 1. Fetch Global Settings (Simple fetch like Footer)
    const settings: any = await directus.request(
      readSingleton('Global_Settings')
    ).catch((e) => {
      console.error("Navbar Directus Fetch Failed:", e);
      return null;
    });

    // 2. Exact same extraction logic as your Footer
    if (settings?.logo) {
      const logoId = typeof settings.logo === 'object' ? settings.logo.id : settings.logo;
      logoUrl = getAssetUrl(logoId);
    }

    // 3. Extract Contact Details
    if (settings?.phone) contactNumber = settings.phone;
    if (settings?.email) contactEmail = settings.email;

  } catch (error) {
    console.error("Navbar Fetch Error");
  }

  // Pass it to the Client Component
  return <NavbarClient logoUrl={logoUrl} contactNumber={contactNumber} contactEmail={contactEmail} />;
}