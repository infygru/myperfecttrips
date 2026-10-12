import { getActiveNotificationBar } from '@/lib/notification-bar';
import NotificationBarClient from '@/components/NotificationBarClient';

export default async function NotificationBar() {
  const bar = await getActiveNotificationBar();
  if (!bar) return null;
  return <NotificationBarClient bar={bar} />;
}
