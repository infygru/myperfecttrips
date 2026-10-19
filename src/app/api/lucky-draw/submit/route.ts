import { NextRequest, NextResponse } from 'next/server';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://admin.myperfecttrips.com';
const ADMIN_TOKEN  = process.env.DIRECTUS_ADMIN_TOKEN || '';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();

        const name                 = (formData.get('name') as string)?.trim();
        const email                = (formData.get('email') as string)?.trim();
        const phone                = (formData.get('phone') as string)?.trim();
        const instagram_handle     = (formData.get('instagram_handle') as string)?.trim();
        const preferred_destination = formData.get('preferred_destination') as string;
        const screenshot           = formData.get('screenshot') as File | null;

        if (!name || !email || !instagram_handle || !preferred_destination) {
            return NextResponse.json(
                { error: 'Name, email, Instagram handle, and preferred destination are required.' },
                { status: 400 }
            );
        }

        // Upload screenshot to Directus files if provided
        let screenshotFileId: string | null = null;
        if (screenshot && screenshot.size > 0) {
            if (screenshot.size > 10 * 1024 * 1024) {
                return NextResponse.json({ error: 'Screenshot must be under 10 MB.' }, { status: 400 });
            }
            const upload = new FormData();
            upload.append('file', screenshot, screenshot.name);
            upload.append('title', `Lucky Draw Screenshot – ${name}`);

            const uploadRes = await fetch(`${DIRECTUS_URL}/files`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
                body: upload,
            });
            if (!uploadRes.ok) {
                const err = await uploadRes.json();
                throw new Error(err?.errors?.[0]?.message || 'Screenshot upload failed');
            }
            screenshotFileId = (await uploadRes.json()).data?.id ?? null;
        }

        // Create entry in lucky_draw_entries collection
        const entryRes = await fetch(`${DIRECTUS_URL}/items/lucky_draw_entries`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${ADMIN_TOKEN}`,
            },
            body: JSON.stringify({
                name,
                email,
                phone: phone || null,
                instagram_handle,
                preferred_destination,
                screenshot: screenshotFileId,
                status: 'pending',
            }),
        });

        if (!entryRes.ok) {
            const err = await entryRes.json();
            throw new Error(err?.errors?.[0]?.message || 'Failed to save entry');
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error('[LuckyDraw submit]', err);
        return NextResponse.json({ error: err.message || 'Submission failed.' }, { status: 500 });
    }
}
