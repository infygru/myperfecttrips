import { cookies } from 'next/headers';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
const ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN || '';

export async function getAuthToken(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get('directus_token')?.value || null;
}

export async function getCurrentUser(): Promise<any | null> {
    const token = await getAuthToken();
    if (!token) return null;

    try {
        // Step 1: verify identity with user token — just need their ID
        const meRes = await fetch(`${DIRECTUS_URL}/users/me?fields=id`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store',
        });
        if (!meRes.ok) return null;
        const meData = await meRes.json();
        const userId = meData.data?.id;
        if (!userId) return null;

        // Step 2: fetch complete profile via admin token — always returns full data
        const [userRes, ssRes] = await Promise.all([
            fetch(`${DIRECTUS_URL}/users/${userId}?fields=id,first_name,last_name,email,phone,avatar`, {
                headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
                cache: 'no-store',
            }),
            fetch(`${DIRECTUS_URL}/items/site_settings?fields=default_avatar&limit=1`, {
                headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
                cache: 'no-store',
            }),
        ]);

        if (!userRes.ok) return null;
        const user = (await userRes.json()).data;
        if (!user) return null;

        // Attach default avatar
        try {
            const ss = await ssRes.json();
            const da = ss?.data?.[0]?.default_avatar || ss?.data?.default_avatar;
            if (da) user.default_avatar_url = `${DIRECTUS_URL}/assets/${da}`;
        } catch { /* optional */ }

        return user;
    } catch {
        return null;
    }
}

export async function loginUser(email: string, password: string) {
    const res = await fetch(`${DIRECTUS_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.errors?.[0]?.message || 'Login failed');
    return data.data; // { access_token, refresh_token, expires }
}

export async function registerUser(payload: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phone?: string;
}) {
    // Create user via admin token so registration is always allowed
    const res = await fetch(`${DIRECTUS_URL}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${ADMIN_TOKEN}`,
        },
        body: JSON.stringify({
            ...payload,
            role: null, // standard authenticated user
        }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.errors?.[0]?.message || 'Registration failed');
    return data.data;
}

export async function refreshAuthToken(refreshToken: string) {
    const res = await fetch(`${DIRECTUS_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
    });
    const data = await res.json();
    if (!res.ok) return null;
    return data.data;
}

export function adminFetch(path: string, options: RequestInit = {}) {
    return fetch(`${DIRECTUS_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${ADMIN_TOKEN}`,
            ...(options.headers || {}),
        },
    });
}

export async function userFetch(token: string, path: string, options: RequestInit = {}) {
    return fetch(`${DIRECTUS_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            ...(options.headers || {}),
        },
    });
}
