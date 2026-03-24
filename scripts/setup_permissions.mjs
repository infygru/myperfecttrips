async function setPermissions() {
    const url = 'https://admin.myperfecttrips.com';
    const email = 'hosting@infygru.com';
    const password = 'Naren@123info';

    const authRes = await fetch(`${url}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const authData = await authRes.json();
    const token = authData.data.access_token;

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    // Directus v11 uses policies instead of roles for permissions
    // Find the public policy
    const policiesRes = await fetch(`${url}/policies`, { headers });
    const policiesData = await policiesRes.json();
    const publicPolicy = policiesData.data?.find(p => p.name === '$t:public_label' || p.name === 'Public');

    if (!publicPolicy) {
        console.error("Could not find public policy. Available policies:", policiesData.data?.map(p => p.name));
        return;
    }

    console.log("Found public policy:", publicPolicy.id);

    // Collections that need public READ access for the frontend
    const collections = ['destinations', 'itinerary_days'];

    for (const collection of collections) {
        const permRes = await fetch(`${url}/permissions`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                policy: publicPolicy.id,
                collection,
                action: 'read',
                permissions: null,
                validation: null,
                fields: ['*']
            })
        });
        const permData = await permRes.json();
        if (permData.errors) {
            console.log(`Error setting public READ for ${collection}:`, permData.errors[0].message);
        } else {
            console.log(`Public READ permission set for ${collection} (id: ${permData.data?.id})`);
        }
    }

    console.log("Done!");
}

setPermissions().catch(console.error);
