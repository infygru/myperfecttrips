import { NextRequest, NextResponse } from 'next/server';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
const ADMIN_TOKEN  = process.env.DIRECTUS_ADMIN_TOKEN || '';

export async function POST(req: NextRequest) {
    const token = req.cookies.get('directus_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        // Verify identity
        const meRes = await fetch(`${DIRECTUS_URL}/users/me?fields=id`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!meRes.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const { data: me } = await meRes.json();

        const formData = await req.formData();
        const file = formData.get('avatar') as File | null;
        if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

        if (!file.type.startsWith('image/'))
            return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
        if (file.size > 2 * 1024 * 1024)
            return NextResponse.json({ error: 'Image must be under 2 MB' }, { status: 400 });

        // Upload via admin token
        const upload = new FormData();
        upload.append('file', file, file.name);
        const uploadRes = await fetch(`${DIRECTUS_URL}/files`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
            body: upload,
        });
        if (!uploadRes.ok) {
            const err = await uploadRes.json();
            throw new Error(err?.errors?.[0]?.message || 'Upload failed');
        }
        const fileId = (await uploadRes.json()).data?.id;
        if (!fileId) throw new Error('Upload returned no file ID');

        // Update user avatar via admin token
        const patchRes = await fetch(`${DIRECTUS_URL}/users/${me.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${ADMIN_TOKEN}` },
            body: JSON.stringify({ avatar: fileId }),
        });
        if (!patchRes.ok) throw new Error('Failed to update avatar');

        return NextResponse.json({
            avatar: fileId,
            avatar_url: `${DIRECTUS_URL}/assets/${fileId}`,
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
