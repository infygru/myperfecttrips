import { NextRequest, NextResponse } from 'next/server';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';

export async function POST(req: NextRequest) {
    const token = req.cookies.get('directus_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const formData = await req.formData();
        const file = formData.get('avatar') as File | null;
        if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

        // Check type and size
        if (!file.type.startsWith('image/')) {
            return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
        }
        if (file.size > 2 * 1024 * 1024) {
            return NextResponse.json({ error: 'Image must be under 2 MB' }, { status: 400 });
        }

        // Upload file to Directus
        const upload = new FormData();
        upload.append('file', file, file.name);

        const uploadRes = await fetch(`${DIRECTUS_URL}/files`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: upload,
        });
        if (!uploadRes.ok) {
            const err = await uploadRes.json();
            throw new Error(err?.errors?.[0]?.message || 'Upload failed');
        }
        const uploadData = await uploadRes.json();
        const fileId = uploadData.data?.id;
        if (!fileId) throw new Error('Upload returned no file ID');

        // Update user's avatar field
        const patchRes = await fetch(`${DIRECTUS_URL}/users/me`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
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
