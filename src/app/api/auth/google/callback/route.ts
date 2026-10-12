import { NextRequest, NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/email';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
const ADMIN_TOKEN  = process.env.DIRECTUS_ADMIN_TOKEN || '';

function generateToken(): string {
    return `${crypto.randomUUID()}${crypto.randomUUID()}`.replace(/-/g, '');
}

function getBaseUrl(req: NextRequest): string {
    if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
    const host  = req.headers.get('x-forwarded-host') || req.headers.get('host') || 'myperfecttrips.com';
    const proto = req.headers.get('x-forwarded-proto') || 'https';
    return `${proto}://${host}`;
}

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;
    const code       = searchParams.get('code');
    const state      = searchParams.get('state');
    const base       = getBaseUrl(req);
    const redirectTo = state ? decodeURIComponent(state) : '/dashboard';

    if (!code) return NextResponse.redirect(`${base}/auth/login?error=google_failed`);

    try {
        // Exchange code for tokens
        const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code,
                client_id:     process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
                client_secret: process.env.GOOGLE_CLIENT_SECRET!,
                redirect_uri:  `${base}/api/auth/google/callback`,
                grant_type:    'authorization_code',
            }),
        });

        const tokenData = await tokenRes.json();
        if (!tokenRes.ok) throw new Error('Token exchange failed');

        // Decode ID token to get user info
        const payload = JSON.parse(
            Buffer.from(tokenData.id_token.split('.')[1], 'base64url').toString()
        );
        const { email, given_name, family_name } = payload;
        if (!email) throw new Error('No email from Google');

        // Always generate a fresh token — never reuse the one stored in Directus
        // because Directus returns the hashed value via API, not the original
        const userToken = generateToken();

        // Find or create Directus user
        const searchRes = await fetch(
            `${DIRECTUS_URL}/users?filter[email][_eq]=${encodeURIComponent(email)}&fields=id&limit=1`,
            { headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }, cache: 'no-store' }
        );
        const existing = (await searchRes.json()).data?.[0];

        if (existing) {
            // Update user with fresh token (and fill in name if missing)
            await fetch(`${DIRECTUS_URL}/users/${existing.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${ADMIN_TOKEN}` },
                body: JSON.stringify({
                    token: userToken,
                    ...(given_name  ? { first_name: given_name  } : {}),
                    ...(family_name ? { last_name:  family_name } : {}),
                }),
            });
        } else {
            // Create new user
            const createRes = await fetch(`${DIRECTUS_URL}/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${ADMIN_TOKEN}` },
                body: JSON.stringify({
                    email,
                    first_name: given_name  || '',
                    last_name:  family_name || '',
                    token:      userToken,
                    password:   generateToken(), // random password — user can't log in with it
                    role:       null,
                }),
            });
            if (!createRes.ok) {
                const d = await createRes.json();
                throw new Error(d?.errors?.[0]?.message || 'Failed to create user');
            }
            // Welcome email for new Google sign-ups (non-blocking)
            const fullName = [given_name, family_name].filter(Boolean).join(' ');
            sendWelcomeEmail(fullName || email, email).catch(() => {});
        }

        const response = NextResponse.redirect(`${base}${redirectTo}`);
        response.cookies.set('directus_token', userToken, {
            httpOnly: true,
            secure:   true,
            sameSite: 'lax',
            maxAge:   60 * 60 * 24 * 30, // 30 days
            path:     '/',
        });
        return response;
    } catch (err) {
        console.error('Google OAuth error:', err);
        return NextResponse.redirect(`${base}/auth/login?error=google_failed`);
    }
}
