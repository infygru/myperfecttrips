export interface NotificationBarData {
  id: number;
  text: string;
  url: string | null;
  url_label: string | null;
  bg_color: 'gold' | 'brand' | 'green' | 'red' | 'blue';
  is_dismissible: boolean;
}

export async function getActiveNotificationBar(): Promise<NotificationBarData | null> {
  const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
  try {
    const res = await fetch(
      `${DIRECTUS_URL}/items/notification_bar?filter[is_active][_eq]=true&limit=1&fields=id,text,url,url_label,bg_color,is_dismissible`,
      { next: { revalidate: 60 } } // fresh within 1 min
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data?.[0] ?? null;
  } catch {
    return null;
  }
}
