import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ProfileForm from '@/components/dashboard/ProfileForm';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'My Profile | IG Holidays' };
export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
    const user = await getCurrentUser();
    if (!user) redirect('/auth/login?redirect=/dashboard/profile');

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-stone-900">My Profile</h1>
                <p className="text-stone-500 text-sm mt-1">Update your personal information, photo and password</p>
            </div>
            <ProfileForm user={user} />
        </div>
    );
}
