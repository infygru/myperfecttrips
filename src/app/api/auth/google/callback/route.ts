import { NextRequest, NextResponse } from 'next/server';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
const ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN || '';

function generateToken(): string {
  return `${crypto.randomUUID()}${crypto.randomUUID()}`.replace(/-/g, '');
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const redirectTo = state ? decodeURIComponent(state) : '/dashboard';

  if (!code) {
    return NextResponse.redirect(`${base}/auth/login?error=google_failed`);
  }

  try {
    // Exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${base}/api/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok) throw new Error('Token exchange failed');

    // Decode ID token payload (base64url)
    const payload = JSON.parse(
      Buffer.from(tokenData.id_token.split('.')[1], 'base64url').toString()
    );
    const { email, given_name, family_name } = payload;
    if (!email) throw new Error('No email from Google');

    // Find existing Directus user by email
    const searchRes = await fetch(
      `${DIRECTUS_URL}/users?filter[email][_eq]=${encodeURIComponent(email)}&fields=id,token`,
      { headers: { Authorization: `Bearer ${ADMIN_TOKEN}` } }
    );
    const searchData = await searchRes.json();
    const existing = searchData.data?.[0];

    let userToken: string;

    if (existing) {
      if (existing.token) {
        userToken = existing.token;
      } else {
        userToken = generateToken();
        await fetch(`${DIRECTUS_URL}/users/${existing.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${ADMIN_TOKEN}` },
          body: JSON.stringify({ token: userToken }),
        });
      }
    } else {
      userToken = generateToken();
      const createRes = await fetch(`${DIRECTUS_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${ADMIN_TOKEN}` },
        body: JSON.stringify({
          email,
          first_name: given_name || '',
          last_name: family_name || '',
          token: userToken,
          password: generateToken(),
          role: null,
        }),
      });
      if (!createRes.ok) {
        const d = await createRes.json();
        throw new Error(d?.errors?.[0]?.message || 'Failed to create user');
      }
    }

    const response = NextResponse.redirect(`${base}${redirectTo}`);
    response.cookies.set('directus_token', userToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });
    return response;
  } catch (err) {
    console.error('Google OAuth callback error:', err);
    return NextResponse.redirect(`${base}/auth/login?error=google_failed`);
  }
}
