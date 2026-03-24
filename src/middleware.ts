import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_ROUTES = ['/dashboard', '/checkout'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Forward pathname to server components via request header
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-pathname', pathname);

    const isProtected = PROTECTED_ROUTES.some(route => pathname.startsWith(route));

    if (!isProtected) {
        return NextResponse.next({ request: { headers: requestHeaders } });
    }

    const token = request.cookies.get('directus_token')?.value;
    if (!token) {
        const loginUrl = new URL('/auth/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
