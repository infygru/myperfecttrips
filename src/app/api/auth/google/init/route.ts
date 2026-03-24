import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const redirectTo = req.nextUrl.searchParams.get('redirect') || '/dashboard';
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  // Use NEXT_PUBLIC_SITE_URL if set, otherwise derive from the incoming request origin
  const base = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;

  if (!clientId || clientId === 'YOUR_GOOGLE_CLIENT_ID_HERE') {
    return NextResponse.redirect(`${base}/auth/login?error=google_not_configured`);
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${base}/api/auth/google/callback`,
    response_type: 'code',
    scope: 'openid email profile',
    state: encodeURIComponent(redirectTo),
    access_type: 'online',
    prompt: 'select_account',
  });

  return NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
}
