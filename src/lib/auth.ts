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
        const res = await fetch(`${DIRECTUS_URL}/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store',
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data.data || null;
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
