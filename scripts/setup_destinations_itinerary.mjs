async function setup() {
    const url = 'https://admin.myperfecttrips.com';
    const email = 'hosting@infygru.com';
    const password = 'Naren@123info';

    try {
        console.log("Logging in...");
        const authRes = await fetch(`${url}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        if (!authRes.ok) throw new Error(`Login failed: ${authRes.statusText}`);
        const authData = await authRes.json();
        const token = authData.data.access_token;
        console.log("Logged in successfully. Setting up new collections...");

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        // 1. Create destinations collection
        try {
            const destColRes = await fetch(`${url}/collections`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    collection: 'destinations',
                    meta: {
                        icon: 'map',
                        note: 'Destinations for holiday packages',
                    },
                    schema: { name: 'destinations' },
                    fields: [
                        { field: 'id', type: 'uuid', meta: { interface: 'input', hidden: true }, schema: { is_primary_key: true, has_auto_increment: false } },
                        { field: 'status', type: 'string', meta: { interface: 'select-dropdown', options: { choices: [{ text: 'Published', value: 'published' }, { text: 'Draft', value: 'draft' }] } }, schema: { default_value: 'published' } },
                        { field: 'name', type: 'string', meta: { interface: 'input' } },
                        { field: 'slug', type: 'string', meta: { interface: 'input' } },
                        { field: 'image', type: 'uuid', meta: { interface: 'file-image' }, schema: { foreign_key_table: 'directus_files', foreign_key_column: 'id' } },
                        { field: 'description', type: 'text', meta: { interface: 'input-multiline' } },
                        { field: 'featured', type: 'boolean', meta: { interface: 'boolean' }, schema: { default_value: false } }
                    ]
                })
            });
            const destResData = await destColRes.json();
            if (destResData.errors) {
               console.log("destinations error (or already exists):", destResData.errors[0].message);
            } else {
               console.log("Created destinations collection with fields.");
            }
        } catch (e) {
            console.log("destinations throw error:", e.message);
        }

        // 2. Create itinerary_days collection
        try {
            const itinColRes = await fetch(`${url}/collections`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    collection: 'itinerary_days',
                    meta: {
                        icon: 'calendar_today',
                        note: 'Day-by-day itinerary details for packages',
                    },
                    schema: { name: 'itinerary_days' },
                    fields: [
                        { field: 'id', type: 'integer', meta: { interface: 'input', hidden: true }, schema: { is_primary_key: true, has_auto_increment: true } },
                        { field: 'package_id', type: 'integer', meta: { interface: 'select-dropdown-m2o' } },
                        { field: 'day_number', type: 'integer', meta: { interface: 'input' } },
                        { field: 'title', type: 'string', meta: { interface: 'input' } },
                        { field: 'description', type: 'text', meta: { interface: 'input-rich-text-html' } },
                        { field: 'accommodation', type: 'string', meta: { interface: 'input' } },
                        { field: 'meals', type: 'json', meta: { interface: 'tags' } }
                    ]
                })
            });
            const itinResData = await itinColRes.json();
            if (itinResData.errors) {
               console.log("itinerary_days error (or already exists):", itinResData.errors[0].message);
            } else {
               console.log("Created itinerary_days collection with fields.");
            }

            // Create relation for package_id to packages collection
            const relRes = await fetch(`${url}/relations`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    collection: 'itinerary_days',
                    field: 'package_id',
                    related_collection: 'packages',
                    schema: {
                        on_delete: 'CASCADE'
                    }
                })
            });
            const relResData = await relRes.json();
             if (relResData.errors) {
               console.log("Relation error (or already exists):", relResData.errors[0].message);
            } else {
               console.log("Created M2O relation between itinerary_days and packages.");
            }
        } catch (e) {
            console.log("itinerary_days throw error:", e.message);
        }

        console.log("Setup complete!");

    } catch (error) {
        console.error("Setup failed:");
        console.dir(error, { depth: null });
    }
}

setup();
