'use client';

import { usePathname } from 'next/navigation';

export default function LayoutShell({
    children,
    header,
    footer,
    cookieBanner,
    aosProvider,
    notificationBar,
}: {
    children: React.ReactNode;
    header: React.ReactNode;
    footer: React.ReactNode;
    cookieBanner: React.ReactNode;
    aosProvider: React.ReactNode;
    notificationBar?: React.ReactNode;
}) {
    const pathname = usePathname();
    const isAuthPage = pathname.startsWith('/auth');

    return (
        <>
            {!isAuthPage && notificationBar}
            {!isAuthPage && header}
            {!isAuthPage && aosProvider}
            <div className={isAuthPage ? 'min-h-screen' : 'flex-1 w-full'}>{children}</div>
            {!isAuthPage && footer}
            {!isAuthPage && cookieBanner}
        </>
    );
}
