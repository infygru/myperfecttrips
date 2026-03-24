import { NextRequest, NextResponse } from 'next/server';

function getBaseUrl(req: NextRequest): string {
    // Explicit env var always wins
    if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
    // Behind Coolify / any reverse proxy — use forwarded headers
    const host  = req.headers.get('x-forwarded-host') || req.headers.get('host') || 'myperfecttrips.com';
    const proto = req.headers.get('x-forwarded-proto') || 'https';
    return `${proto}://${host}`;
}

export async function GET(req: NextRequest) {
    const redirectTo = req.nextUrl.searchParams.get('redirect') || '/dashboard';
    const clientId   = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const base       = getBaseUrl(req);

    if (!clientId || clientId === 'YOUR_GOOGLE_CLIENT_ID_HERE') {
        return NextResponse.redirect(`${base}/auth/login?error=google_not_configured`);
    }

    const params = new URLSearchParams({
        client_id:     clientId,
        redirect_uri:  `${base}/api/auth/google/callback`,
        response_type: 'code',
        scope:         'openid email profile',
        state:         encodeURIComponent(redirectTo),
        access_type:   'online',
        prompt:        'select_account',
    });

    return NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
}
