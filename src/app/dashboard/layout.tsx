import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import DashboardNav from '@/components/dashboard/DashboardNav';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const user = await getCurrentUser();
    if (!user) redirect('/auth/login?redirect=/dashboard');

    return (
        <div className="min-h-screen bg-stone-50/80">
            {/* Top bar */}
            <div className="border-b border-stone-200 bg-white sticky top-[72px] z-30">
                <div className="container-inner py-3 flex items-center gap-2 text-xs text-stone-500">
                    <span>Dashboard</span>
                </div>
            </div>

            <div className="container-inner py-7 px-4">
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
