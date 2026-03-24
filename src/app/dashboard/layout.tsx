import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import DashboardNav from '@/components/dashboard/DashboardNav';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const user = await getCurrentUser();
    if (!user) redirect('/auth/login?redirect=/dashboard');

    return (
        <div className="bg-[#f4f5f7] min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                <div className="flex flex-col lg:flex-row gap-6">
                    <aside className="w-full lg:w-60 xl:w-64 flex-shrink-0">
                        <DashboardNav user={user} />
                    </aside>
                    <main className="flex-1 min-w-0">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
