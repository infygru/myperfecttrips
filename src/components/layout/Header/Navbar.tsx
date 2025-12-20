import directus, { getAssetUrl } from '@/lib/directus/client';
import { readSingleton } from '@directus/sdk';
import NavbarClient from './NavbarClient';

export default async function Navbar() {
  let logoUrl = null;

  try {
    // 1. Fetch with explicit fields to be 100% sure
    const settings: any = await directus.request(
      readSingleton('Global_Settings', {
        fields: ['logo', 'logo.*'] // Fetching both ID and Object metadata
      })
    ).catch(() => null);
    
    // 2. Exact same extraction logic as your Footer
    if (settings?.logo) {
      const logoId = typeof settings.logo === 'object' ? settings.logo.id : settings.logo;
      logoUrl = getAssetUrl(logoId);
    }
  } catch (error) {
    console.error("Navbar Fetch Error");
  }

  // Pass it to the Client Component for that 'Whiter' animated background
  return <NavbarClient logoUrl={logoUrl} />;
}